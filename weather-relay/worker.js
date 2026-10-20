// Weather relay for Flight Checklists (version 2).
// METAR and TAF from aviationweather.gov (NOAA), and D-ATIS for US airports from atis.info (FAA data).
const AWC = 'https://aviationweather.gov/api/data/';
const DATIS = 'https://atis.info/api/';
const UA = { 'User-Agent': 'FlightChecklists-weather-relay' };
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
    const us = ids.filter(x => /^[KP]/.test(x)); // D-ATIS exists for US airports only
    try {
      const [m, t, a] = await Promise.all([
        get(AWC + 'metar?' + q, 120),
        get(AWC + 'taf?' + q, 600),
        Promise.all(us.map(id => getAtis(id)))
      ]);
      const out = { ok: true, v: 2, at: Date.now(), metar: {}, taf: {}, atis: {} };
      for (const r of m) {
        const id = r.icaoId || r.stationId, raw = r.rawOb || r.rawText || r.raw_text;
        if (id && raw && !out.metar[id]) out.metar[id] = { raw, time: when(r.obsTime ?? r.reportTime), cat: r.fltCat || '' };
      }
      for (const r of t) {
        const id = r.icaoId || r.stationId, raw = r.rawTAF || r.rawText || r.raw_text;
        if (id && raw && !out.taf[id]) out.taf[id] = { raw, time: when(r.issueTime ?? r.bulletinTime) };
      }
      us.forEach((id, i) => { if (a[i].length) out.atis[id] = a[i]; });
      return json(out, 200);
    } catch (e) {
      return json({ ok: false, error: String((e && e.message) || e) }, 502);
    }
  }
};

async function get(u, ttl) {
  const r = await fetch(u, { headers: UA, cf: { cacheTtl: ttl, cacheEverything: true } });
  if (r.status === 204) return [];
  if (!r.ok) throw new Error('aviationweather.gov answered ' + r.status);
  const txt = await r.text();
  if (!txt.trim()) return [];
  const j = JSON.parse(txt);
  return Array.isArray(j) ? j : [];
}
async function getAtis(id) {
  // a missing or failed D-ATIS never stops the weather
  try {
    const r = await fetch(DATIS + id, { headers: UA, cf: { cacheTtl: 60, cacheEverything: true } });
    if (!r.ok) return [];
    const j = await r.json();
    if (!Array.isArray(j)) return [];
    return j.filter(x => x && x.datis).map(x => ({
      type: x.type || 'combined', code: String(x.code || ''), text: String(x.datis),
      time: String(x.time || ''), updated: when(x.updatedAt)
    }));
  } catch (e) { return []; }
}
function when(v) {
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v;
  if (typeof v !== 'string') return null;
  const s = /Z$|[+-]\d\d:?\d\d$/.test(v) ? v : v.replace(' ', 'T') + 'Z';
  const t = Date.parse(s);
  return isFinite(t) ? t : null;
}
function json(o, status) { return new Response(JSON.stringify(o), { status, headers: HEAD }); }
