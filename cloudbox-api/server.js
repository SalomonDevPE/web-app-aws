// =========================================================
// CloudBox API — server.js
// Express + S3 Presigned URLs + Cognito JWT
// =========================================================

import "dotenv/config";
import express        from "express";
import cors           from "cors";
import helmet         from "helmet";
import morgan         from "morgan";
import rateLimit      from "express-rate-limit";
import authMiddleware from "./middleware/auth.js";
import filesRouter    from "./routes/files.js";

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Seguridad básica ──────────────────────────────────────
app.use(helmet());

// ── CORS — solo permite tu frontend ──────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "*",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ],
  methods:     ["GET","POST","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ── Body parser ───────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ── Logs ──────────────────────────────────────────────────
app.use(morgan("combined"));

// ── Rate limiting global ──────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max:      100,             // 100 requests por IP
  message:  { error: "Demasiadas solicitudes. Intenta más tarde." },
}));

// ── Health check (público) ────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "CloudBox API", timestamp: new Date() });
});

// ── Rutas de archivos (requieren JWT de Cognito) ──────────
app.use("/api/files", authMiddleware, filesRouter);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor.",
  });
});

// ── Iniciar ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`CloudBox API corriendo en http://localhost:${PORT}`);
  console.log(`Bucket S3: ${process.env.S3_BUCKET}`);
  console.log(`Región: ${process.env.AWS_REGION}`);
});
