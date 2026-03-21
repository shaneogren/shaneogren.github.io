// ── Sold status via Google Sheets ────────────────────────────────────────────
//
// Setup:
//   1. Create a Google Sheet with two columns:
//        id    | sold
//        ------+------
//        remember-we         | true
//        mercy-frequency     | false
//        bjorn               | true
//
//      The "id" is the image filename without extension:
//        images/painting/remember-we.webp  →  remember-we
//        images/paper/morning.webp         →  morning
//
//   2. File → Share → Publish to web → select "Comma-separated values (.csv)" → Publish
//   3. Paste the URL below.
//
const SOLD_SHEET_URL = "YOUR_GOOGLE_SHEET_CSV_URL_HERE";

const CACHE_KEY = "so_sold_v1";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Mock sold data — used when SOLD_SHEET_URL is not yet configured.
// Remove this once the real sheet is set up.
const MOCK_SOLD = new Map([
  ["bjorn",         true],
  ["able",          true],
  ["illusion",      true],
  ["pan",           true],
  ["halos",         true],
  ["spirit",        true],
  ["claire",        true],
]);

async function loadSoldStatus() {
  // Return mock data if sheet isn't configured yet
  if (SOLD_SHEET_URL === "YOUR_GOOGLE_SHEET_CSV_URL_HERE") {
    return MOCK_SOLD;
  }

  // Return from cache if fresh
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return new Map(Object.entries(cached.data));
    }
  } catch (e) {}

  // Fetch from Google Sheets
  try {
    const res = await fetch(SOLD_SHEET_URL);
    if (!res.ok) throw new Error(res.status);
    const text = await res.text();
    const data = {};
    text.trim().split("\n").slice(1).forEach(row => {
      const [id, sold] = row.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
      if (id) data[id] = sold === "true";
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    return new Map(Object.entries(data));
  } catch (e) {
    // Fail gracefully — treat everything as available
    console.warn("Could not load sold status:", e);
    return new Map();
  }
}
