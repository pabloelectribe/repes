const { clearSession } = require('./_lib');

module.exports = (req, res) => { clearSession(res); res.statusCode = 302; res.setHeader('Location', '/'); res.end(); };
