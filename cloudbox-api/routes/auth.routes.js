// =========================================================
// Rutas de Auth — CloudBox
// Cognito maneja el login/registro, estas rutas son extras
// =========================================================

import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// ── Verificar token y devolver datos del usuario ──────────
// El frontend llama esto al cargar el dashboard
router.get("/me", verifyToken, (req, res) => {
  res.json({
    user: {
      id:    req.user.sub,
      email: req.user.email,
      name:  req.user.name,
    }
  });
});

// ── Verificar si el token es válido ──────────────────────
router.post("/verify", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;
