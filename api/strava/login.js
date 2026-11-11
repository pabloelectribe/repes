const { CLIENT_ID, configured, setCookie, origin, newState } = require('./_lib');

module.exports = (req, res) => {
  if (!configured()) { res.statusCode = 503; return res.end('Falta configurar STRAVA_CLIENT_ID y STRAVA_CLIENT_SECRET en Vercel.'); }
  const state = newState();
  setCookie(res, 'strava_state', state, 600);
  const q = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: origin(req) + '/api/strava/callback',
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
    state,
  });
  res.statusCode = 302;
  res.setHeader('Location', 'https://www.strava.com/oauth/authorize?' + q);
  res.end();
};
