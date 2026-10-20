// Weather relay for Flight Checklists.
// Fetches METAR and TAF from aviationweather.gov (NOAA) and lets the app read them.
const AWC = 'https://aviationweather.gov/api/data/';
const HEAD = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: HEAD });
    const url = new URL(request.url);
    const ids = (url.searchParams.get('ids') || '').toUpperCase().split(/[\s,]+/)
      .filter(x => /^[A-Z0-9]{4}$/.test(x)).slice(0, 12);
    if (!ids.length) return json({ ok: false, error: 'Add airports to the address, e.g. ?ids=OMDB,YBBN' }, 400);
    const q = 'ids=' + ids.join(',') + '&format=json';
    try {
      const [m, t] = await Promise.all([get(AWC + 'metar?' + q, 120), get(AWC + 'taf?' + q, 600)]);
      const out = { ok: true, at: Date.now(), metar: {}, taf: {} };
      for (const r of m) {
        const id = r.icaoId || r.stationId, raw = r.rawOb || r.rawText || r.raw_text;
        if (id && raw && !out.metar[id]) out.metar[id] = { raw, time: when(r.obsTime ?? r.reportTime), cat: r.fltCat || '' };
      }
      for (const r of t) {
        const id = r.icaoId || r.stationId, raw = r.rawTAF || r.rawText || r.raw_text;
        if (id && raw && !out.taf[id]) out.taf[id] = { raw, time: when(r.issueTime ?? r.bulletinTime) };
      }
      return json(out, 200);
    } catch (e) {
      return json({ ok: false, error: String((e && e.message) || e) }, 502);
    }
  }
};

async function get(u, ttl) {
  const r = await fetch(u, { headers: { 'User-Agent': 'FlightChecklists-weather-relay' }, cf: { cacheTtl: ttl, cacheEverything: true } });
  if (r.status === 204) return [];
  if (!r.ok) throw new Error('aviationweather.gov answered ' + r.status);
  const txt = await r.text();
  if (!txt.trim()) return [];
  const j = JSON.parse(txt);
  return Array.isArray(j) ? j : [];
}
function when(v) {
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v;
  if (typeof v !== 'string') return null;
  const s = /Z$|[+-]\d\d:?\d\d$/.test(v) ? v : v.replace(' ', 'T') + 'Z';
  const t = Date.parse(s);
  return isFinite(t) ? t : null;
}
function json(o, status) { return new Response(JSON.stringify(o), { status, headers: HEAD }); }
