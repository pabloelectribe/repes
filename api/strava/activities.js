const { configured, readSession, writeSession, clearSession, tokenRequest } = require('./_lib');

// Devuelve los trotes recientes con su trazado resumido (polyline codificada).
module.exports = async (req, res) => {
  const json = (code, body) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };
  if (!configured()) return json(503, { error: 'not_configured' });
  let s = readSession(req);
  if (!s || !s.r) return json(401, { error: 'no_session' });
  try {
    if (!s.a || s.e < Date.now() / 1000 + 60) s = writeSession(res, await tokenRequest({ grant_type: 'refresh_token', refresh_token: s.r }));
    const runs = [];
    for (let page = 1; page <= 2; page++) {
      const r = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=100&page=${page}`, { headers: { Authorization: 'Bearer ' + s.a } });
      if (r.status === 401) { clearSession(res); return json(401, { error: 'no_session' }); }
      if (!r.ok) return json(502, { error: 'strava_' + r.status });
      const list = await r.json();
      for (const a of list) {
        const type = a.sport_type || a.type;
        if ((type === 'Run' || type === 'TrailRun') && a.map && a.map.summary_polyline) {
          runs.push({ id: a.id, name: a.name, date: (a.start_date_local || '').slice(0, 10), dist: a.distance, poly: a.map.summary_polyline });
        }
      }
      if (list.length < 100) break;
    }
    json(200, { runs });
  } catch { json(502, { error: 'strava' }); }
};
