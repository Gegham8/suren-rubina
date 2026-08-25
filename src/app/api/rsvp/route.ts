import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Apps Script web apps cold-start slowly; give the forward room beyond Hobby's 10s.
export const maxDuration = 15;

const MAX_PARTY = 3;
const FORWARD_TIMEOUT_MS = 8000;

type Rsvp = {
  name: string;
  attending: "yes" | "no";
  count: number;
  guests: string[];
};

type ParseResult = { ok: true; data: Rsvp } | { ok: false; error: string };

/** Validate untrusted client input into a well-formed RSVP (never trust the form). */
function parseRsvp(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid body" };
  const raw = body as Record<string, unknown>;

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) return { ok: false, error: "Name is required" };

  const attending = raw.attending === "no" ? "no" : "yes";
  if (attending === "no") return { ok: true, data: { name, attending, count: 0, guests: [] } };

  const rawCount = typeof raw.count === "number" ? raw.count : Number(raw.count);
  const count = Number.isFinite(rawCount)
    ? Math.min(MAX_PARTY, Math.max(1, Math.trunc(rawCount)))
    : 1;

  const guests = (Array.isArray(raw.guests) ? raw.guests : [])
    .filter((g): g is string => typeof g === "string")
    .map((g) => g.trim())
    .filter(Boolean)
    .slice(0, MAX_PARTY - 1);

  return { ok: true, data: { name, attending, count, guests } };
}

/** POST to the Apps Script once, aborting if it stalls. */
async function postOnce(url: string, payload: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "follow",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const parsed = parseRsvp(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { name, attending, count, guests } = parsed.data;
  const record = {
    secret: process.env.RSVP_WEBHOOK_SECRET ?? "",
    submittedAt: new Date().toISOString(),
    name,
    attending: attending === "yes" ? "Yes" : "No",
    count,
    // Responder is attendee #1; the sheet stores the whole party in one cell.
    guests: attending === "yes" ? [name, ...guests].join(", ") : "",
  };

  const url = process.env.RSVP_WEBHOOK_URL;
  if (!url) {
    // Keeps local dev working before the webhook exists (per docs/google-sheet-setup.md).
    console.info("[rsvp] RSVP_WEBHOOK_URL not set; submission:", record);
    return NextResponse.json({ ok: true });
  }

  const saved = (await postOnce(url, record)) || (await postOnce(url, record));
  if (!saved) return NextResponse.json({ error: "Could not save RSVP" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
