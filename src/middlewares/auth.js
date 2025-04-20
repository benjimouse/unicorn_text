// src/middlewares/auth.js
const { OAuth2Client } = require('google-auth-library');
const { API_TOKEN, GOOGLE_CLIENT_ID, ALLOWED_USERS } = require('config');

const oauthClient = new OAuth2Client();

// This middleware allows either API_TOKEN or Google OAuth2
const allowBearerOrOAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.error('[Auth] ❌ Missing Authorization token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Allow plain API token for read-only endpoints
    if (token === API_TOKEN) {
      console.log('[Auth] ✅ API token authenticated (read-only)');
      return next();
    }

    // Otherwise try verifying as OAuth2
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    console.log(`[Auth] ✅ OAuth user authenticated: ${userEmail}`);

    req.user = {
      email: userEmail,
      name: payload.name,
      picture: payload.picture,
    };

    next();
  } catch (err) {
    console.error('[Auth] ❌ Token verification failed:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// This middleware requires strict Google OAuth2 only (no API_TOKEN allowed)
const requireOAuthOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.error('[Auth] ❌ Missing Authorization token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Do not accept API_TOKEN here!
    if (token === API_TOKEN) {
      console.error('[Auth] ❌ API token not allowed for this endpoint');
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Must be a valid Google ID token
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    console.log(`[Auth] ✅ OAuth user authenticated: ${userEmail}`);

    if (!ALLOWED_USERS.includes(userEmail)) {
      console.error(`[Auth] ❌ Unauthorized user: ${userEmail}`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = {
      email: userEmail,
      name: payload.name,
      picture: payload.picture,
    };

    next();
  } catch (err) {
    console.error('[Auth] ❌ Token verification failed:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { allowBearerOrOAuth, requireOAuthOnly };
