const { configured, cookies, setCookie, origin, writeSession, tokenRequest } = require('./_lib');

module.exports = async (req, res) => {
  const url = new URL(req.url, origin(req));
  const back = result => { res.statusCode = 302; res.setHeader('Location', '/?strava=' + result); res.end(); };
  const state = cookies(req).strava_state;
  setCookie(res, 'strava_state', '', 0);
  if (!configured()) return back('config');
  if (url.searchParams.get('error')) return back('denegado');
  if (!state || state !== url.searchParams.get('state')) return back('error');
  if (!(url.searchParams.get('scope') || '').includes('activity:read')) return back('permiso');
  try {
    writeSession(res, await tokenRequest({ code: url.searchParams.get('code'), grant_type: 'authorization_code' }));
    back('ok');
  } catch { back('error'); }
};
