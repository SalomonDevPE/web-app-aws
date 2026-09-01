// =========================================================
// CloudBox — Middleware de autenticación con Cognito JWT
// =========================================================

import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifica el Access Token de Cognito
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId:   process.env.COGNITO_CLIENT_ID,
  tokenUse:   "access",
});

export default async function authMiddleware(req, res, next) {
  try {
    // Extraer token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization || "";
    const token      = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        error: "Token de autenticación requerido."
      });
    }

    // Verificar y decodificar el token con Cognito
    const payload = await verifier.verify(token);

    // Adjuntar datos del usuario a la request
    req.user = {
      sub:      payload.sub,           // ID único del usuario
      email:    payload.email || "",
      username: payload.username || payload["cognito:username"] || "",
    };

    next();

  } catch (err) {
    console.warn("Token inválido:", err.message);
    return res.status(401).json({
      error: "Token inválido o expirado. Inicia sesión de nuevo."
    });
  }
}
