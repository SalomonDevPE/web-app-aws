// =========================================================
// Middleware — Verificar JWT de Cognito
// =========================================================

import jwt        from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache:   true,
  rateLimit: true,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, {
    algorithms: ["RS256"],
    issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
  }, (err, decoded) => {
    if (err) {
      console.error("JWT error:", err.message);
      return res.status(401).json({ error: "Token inválido o expirado." });
    }
    // Adjuntar datos del usuario al request
    req.user = {
      sub:   decoded.sub,
      email: decoded.email,
      name:  decoded.name || decoded["cognito:username"],
    };
    next();
  });
}
