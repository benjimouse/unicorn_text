const { OAuth2Client } = require('google-auth-library');
const { CLIENT_ID, DEVICE_BEARER_TOKEN, ALLOWED_USERS } = require('config');

const client = new OAuth2Client(CLIENT_ID);

async function allowBearerOrOAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }

  if (token === DEVICE_BEARER_TOKEN) {
    console.log('[Auth] Device Bearer Token accepted');
    req.authenticatedAs = 'device';
    return next();
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('[Auth] Verified Google user:', payload.email);

    req.authenticatedAs = payload.email;
    return next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

async function requireOAuthAndCheckAllowlist(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('[Auth] Verified user:', payload.email);

    if (!ALLOWED_USERS.includes(payload.email)) {
      console.warn(`[Auth] Unauthorized email: ${payload.email}`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.authenticatedAs = payload.email;
    next();
  } catch (error) {
    console.error('[Auth] OAuth token invalid:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = {
  allowBearerOrOAuth,
  requireOAuthAndCheckAllowlist,
};
