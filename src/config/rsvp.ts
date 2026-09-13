/**
 * Maximum party size per RSVP, responder included. Shared by the form
 * (src/components/Rsvp.tsx) and the API validation (src/app/api/rsvp/route.ts)
 * so the UI limit and the server clamp can't drift apart.
 */
export const MAX_PARTY = 5;
