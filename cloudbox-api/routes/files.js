// =========================================================
// CloudBox — Rutas de archivos
// GET  /api/files          → listar archivos del usuario
// POST /api/files/upload   → generar presigned URL para subir
// DELETE /api/files/:key   → eliminar archivo de S3
// =========================================================

import express                          from "express";
import { S3Client, PutObjectCommand,
         ListObjectsV2Command,
         DeleteObjectCommand,
         HeadObjectCommand }            from "@aws-sdk/client-s3";
import { getSignedUrl }                 from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 }                 from "uuid";
import rateLimit                        from "express-rate-limit";

const router = express.Router();

// ── S3 Client ─────────────────────────────────────────────
const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

const BUCKET      = process.env.S3_BUCKET;
const MAX_SIZE    = parseInt(process.env.MAX_FILE_SIZE_MB || "100") * 1024 * 1024;
const URL_EXPIRY  = parseInt(process.env.PRESIGNED_URL_EXPIRY || "300");

// ── Rate limit específico para subidas ────────────────────
const uploadLimit = rateLimit({
  windowMs: 60 * 1000,  // 1 minuto
  max:      20,          // máx 20 subidas por minuto
  message:  { error: "Demasiadas subidas. Espera un momento." },
});

// ── Tipos permitidos ──────────────────────────────────────
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg","image/png","image/gif","image/webp","image/svg+xml",
  "text/plain","text/csv",
  "application/zip","application/x-rar-compressed",
  "application/octet-stream",
]);

// ─────────────────────────────────────────────────────────
// GET /api/files — listar archivos del usuario
// ─────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const prefix = `users/${req.user.sub}/`;

    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    });

    const data = await s3.send(command);

    const files = (data.Contents || []).map(obj => {
      const keyParts  = obj.Key.split("/");
      const fileName  = keyParts[keyParts.length - 1];
      // Quitar el UUID del inicio del nombre (uuid-nombreoriginal.ext)
      const cleanName = fileName.replace(/^[0-9a-f-]{36}-/, "");
      const extension = cleanName.split(".").pop().toLowerCase();

      return {
        key:        obj.Key,
        nombre:     cleanName,
        extension,
        tamaño:     formatBytes(obj.Size),
        tamañoBytes: obj.Size,
        modificado:  obj.LastModified,
        fechaTexto:  formatDate(obj.LastModified),
        tipo:        getMimeLabel(extension),
      };
    });

    // Ordenar por más reciente primero
    files.sort((a, b) => new Date(b.modificado) - new Date(a.modificado));

    res.json({ files, total: files.length });

  } catch (err) {
    console.error("Error listando archivos:", err);
    res.status(500).json({ error: "No se pudieron obtener los archivos." });
  }
});

// ─────────────────────────────────────────────────────────
// POST /api/files/upload — generar presigned URL
// ─────────────────────────────────────────────────────────
router.post("/upload", uploadLimit, async (req, res) => {
  try {
    const { fileName, contentType, size } = req.body;

    // ── Validaciones ──────────────────────────────────────
    if (!fileName || typeof fileName !== "string") {
      return res.status(400).json({ error: "fileName es requerido." });
    }
    if (!contentType) {
      return res.status(400).json({ error: "contentType es requerido." });
    }
    if (!size || typeof size !== "number" || size <= 0) {
      return res.status(400).json({ error: "size debe ser un número positivo." });
    }
    if (size > MAX_SIZE) {
      return res.status(400).json({
        error: `El archivo supera el límite de ${MAX_SIZE / 1024 / 1024} MB.`
      });
    }

    const type = contentType.split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(type) && type !== "application/octet-stream") {
      return res.status(400).json({ error: `Tipo de archivo no permitido: ${type}` });
    }

    // ── Sanitizar nombre ──────────────────────────────────
    const sanitized = fileName
      .replace(/[^a-zA-Z0-9.\-_() ]/g, "_")
      .substring(0, 200);

    // ── Clave S3: users/{userId}/{uuid}-{filename} ────────
    const s3Key = `users/${req.user.sub}/${uuidv4()}-${sanitized}`;

    // ── Generar Presigned URL ─────────────────────────────
    const command = new PutObjectCommand({
      Bucket:        BUCKET,
      Key:           s3Key,
      ContentType:   contentType,
      ContentLength: size,
      Metadata: {
        "original-name": sanitized,
        "user-id":        req.user.sub,
        "user-email":     req.user.email,
        "uploaded-at":    new Date().toISOString(),
      },
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRY });
    const fileUrl   = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // ── Log ───────────────────────────────────────────────
    console.log(JSON.stringify({
      event:     "file.presigned_url_generated",
      userId:    req.user.sub,
      userEmail: req.user.email,
      fileName:  sanitized,
      s3Key,
      size,
      contentType,
      timestamp: new Date().toISOString(),
    }));

    res.json({ uploadUrl, key: s3Key, fileUrl, expiresIn: URL_EXPIRY });

  } catch (err) {
    console.error("Error generando presigned URL:", err);
    res.status(500).json({ error: "No se pudo generar la URL de subida." });
  }
});

// ─────────────────────────────────────────────────────────
// DELETE /api/files/:key — eliminar archivo de S3
// key viene en base64 para evitar problemas con la URL
// ─────────────────────────────────────────────────────────
router.delete("/:encodedKey", async (req, res) => {
  try {
    const s3Key = Buffer.from(req.params.encodedKey, "base64").toString("utf-8");

    // Verificar que el archivo pertenece al usuario
    if (!s3Key.startsWith(`users/${req.user.sub}/`)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este archivo." });
    }

    // Verificar que existe
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    } catch {
      return res.status(404).json({ error: "Archivo no encontrado." });
    }

    // Eliminar
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }));

    // Log
    console.log(JSON.stringify({
      event:     "file.deleted",
      userId:    req.user.sub,
      userEmail: req.user.email,
      s3Key,
      timestamp: new Date().toISOString(),
    }));

    res.json({ success: true, message: "Archivo eliminado correctamente." });

  } catch (err) {
    console.error("Error eliminando archivo:", err);
    res.status(500).json({ error: "No se pudo eliminar el archivo." });
  }
});

// ── Helpers ───────────────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(date) {
  const d   = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000)  return `Hoy, ${d.toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit" })}`;
  if (diff < 172800000) return "Ayer";
  return d.toLocaleDateString("es", { day:"2-digit", month:"short", year:"numeric" });
}

function getMimeLabel(ext) {
  const labels = {
    pdf:"PDF", doc:"Word", docx:"Word", xls:"Excel", xlsx:"Excel",
    ppt:"PowerPoint", pptx:"PowerPoint", png:"Imagen PNG",
    jpg:"Imagen JPG", jpeg:"Imagen JPG", gif:"Imagen GIF",
    svg:"Imagen SVG", zip:"Archivo ZIP", rar:"Archivo RAR",
    txt:"Texto", csv:"CSV", sql:"SQL",
  };
  return labels[ext] || "Archivo";
}

export default router;
