# RSVP → Google Sheet (free, no server)

Every RSVP is posted to `/api/rsvp` (see `src/app/api/rsvp/route.ts`), which
validates it, attaches a shared secret, and forwards it to a Google Apps Script
web app that **upserts** a row into a spreadsheet (re-submitting the same name
overwrites that guest's row). The responder is attendee #1; the whole party is
stored in one cell.

## 1. Create the sheet

1. Create a new Google Sheet, e.g. **Suren & Rubina — RSVP**.
2. Headers in row 1:

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | # | Submitted at | Name | Attending | Count | Guests |

3. In a summary cell, e.g. **H1**: `Total attending:` and **H2**: `=SUM(E2:E)`.
4. Freeze row 1 (View → Freeze → 1 row).

## 2. Add the script

**Extensions → Apps Script**, replace everything with:

```js
const SECRET = PropertiesService.getScriptProperties().getProperty('RSVP_SECRET');

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  // Reject anything without the shared secret (blocks public spam).
  if (!SECRET || data.secret !== SECRET) {
    return json({ ok: false, error: 'unauthorized' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const key = String(data.name || '').trim().toLowerCase();
  if (!key) return json({ ok: false, error: 'no name' });

  const row = [
    null,                                   // A: # filled below
    new Date(data.submittedAt || Date.now()),
    data.name || '',
    data.attending || '',
    data.count || 0,
    data.guests || '',
  ];

  // Read the Name column (C) as the source of truth for data rows. Guard the
  // empty-sheet case: getRange needs at least 1 row, and getLastRow() can be
  // inflated by the H-column summary formula, so we place rows by the last
  // *named* row rather than appendRow to avoid a crash or a blank gap.
  const lastRow = sheet.getLastRow();
  const names = lastRow >= 2
    ? sheet.getRange(2, 3, lastRow - 1, 1).getValues().map(function (r) {
        return String(r[0]).trim().toLowerCase();
      })
    : [];

  let target = -1;
  let lastNamedRow = 1;                      // header row; first data row is 2
  for (let i = 0; i < names.length; i++) {
    if (names[i]) lastNamedRow = i + 2;
    if (names[i] === key) { target = i + 2; break; }
  }

  if (target === -1) {
    const nextRow = lastNamedRow + 1;
    row[0] = nextRow - 1;                    // sequential #: row 2 -> #1, row 3 -> #2, …
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  } else {
    row[0] = sheet.getRange(target, 1).getValue(); // keep existing #
    sheet.getRange(target, 1, 1, row.length).setValues([row]);
  }

  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Then set the secret: **Project Settings → Script Properties → Add** a property
named `RSVP_SECRET` with a long random value. Use the **same** value for
`RSVP_WEBHOOK_SECRET` below.

## 3. Deploy it

1. **Deploy → New deployment → Web app**
2. *Execute as*: **Me**
3. *Who has access*: **Anyone** (the secret, not obscurity, is the gate)
4. **Deploy**, authorise, copy the `/exec` URL.

## 4. Wire it up

Add both variables to `.env.local` (and to **Vercel → Project → Settings →
Environment Variables**):

```
RSVP_WEBHOOK_URL=<the /exec URL>
RSVP_WEBHOOK_SECRET=<same value as the RSVP_SECRET script property>
```

## Notes

- Until `RSVP_WEBHOOK_URL` is set the form still works — submissions are logged
  to the server console and the guest sees the thank-you, so local dev isn't blocked.
- The route waits for the script to confirm (≤8s) and **retries once**; only then
  does the guest see the thank-you, otherwise a retry prompt.
- Redeploying the script creates a new URL — use **Manage deployments → Edit →
  New version** to keep the same one.
- Known limitation: upsert is keyed on name only, so two guests with the same
  name overwrite each other.
