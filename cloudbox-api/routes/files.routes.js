// =========================================================
// Rutas de Archivos — CloudBox
// Presigned URLs para S3 + listado de archivos
// =========================================================

import { Router }                                    from "express";
import { S3Client, PutObjectCommand,
         GetObjectCommand, DeleteObjectCommand,
         ListObjectsV2Command }                      from "@aws-sdk/client-s3";
import { getSignedUrl }                              from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 }                              from "uuid";
import { verifyToken }                               from "../middleware/auth.middleware.js";

const router = Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET     = process.env.S3_BUCKET;
const MAX_SIZE   = parseInt(process.env.MAX_FILE_SIZE) || 104857600;
const URL_EXPIRY = 300; // 5 minutos

// ── Tipos de archivo permitidos ───────────────────────────
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg","image/png","image/gif","image/webp","image/svg+xml",
  "text/plain","text/csv",
  "application/zip","application/x-rar-compressed","application/octet-stream",
];

// =========================================================
// POST /api/files/upload
// Genera una Presigned URL para subir a S3
// =========================================================
router.post("/upload", verifyToken, async (req, res) => {
  try {
    const { fileName, contentType, size } = req.body;

    // ── Validaciones ──────────────────────────────────────
    if (!fileName || typeof fileName !== "string") {
      return res.status(400).json({ error: "fileName es requerido." });
    }
    if (!contentType) {
      return res.status(400).json({ error: "contentType es requerido." });
    }
    if (!size || size > MAX_SIZE) {
      return res.status(400).json({
        error: `Tamaño inválido. Máximo: ${MAX_SIZE / 1024 / 1024} MB.`
      });
    }

    // ── Sanitizar nombre ──────────────────────────────────
    const safeName = fileName
      .replace(/[^a-zA-Z0-9.\-_() ]/g, "_")
      .substring(0, 200);

    // ── Clave S3 organizada por usuario ───────────────────
    const s3Key = `users/${req.user.sub}/${uuidv4()}-${safeName}`;

    // ── Generar Presigned URL ─────────────────────────────
    const command = new PutObjectCommand({
      Bucket:        BUCKET,
      Key:           s3Key,
      ContentType:   contentType,
      ContentLength: size,
      Metadata: {
        "original-name": safeName,
        "user-id":        req.user.sub,
        "uploaded-at":    new Date().toISOString(),
      },
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRY });

    // ── Log en consola (CloudWatch lo captura) ────────────
    console.log(JSON.stringify({
      event:     "file.upload_requested",
      userId:    req.user.sub,
      email:     req.user.email,
      fileName:  safeName,
      s3Key,
      size,
      timestamp: new Date().toISOString(),
    }));

    res.json({
      uploadUrl,
      key:       s3Key,
      fileUrl:   `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
      expiresIn: URL_EXPIRY,
    });

  } catch (err) {
    console.error("Error generando presigned URL:", err);
    res.status(500).json({ error: "Error al generar la URL de subida." });
  }
});

// =========================================================
// GET /api/files
// Listar archivos del usuario autenticado desde S3
// =========================================================
router.get("/", verifyToken, async (req, res) => {
  try {
    const prefix  = `users/${req.user.sub}/`;
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    });

    const data  = await s3.send(command);
    const items = data.Contents || [];

    const files = await Promise.all(items.map(async (obj) => {
      // Generar URL de descarga firmada (válida 1 hora)
      const downloadUrl = await getSignedUrl(s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }),
        { expiresIn: 3600 }
      );

      const fileName = obj.Key.replace(prefix, "").replace(/^[^-]+-/, "");

      return {
        key:          obj.Key,
        name:         fileName,
        size:         obj.Size,
        lastModified: obj.LastModified,
        downloadUrl,
      };
    }));

    // Ordenar por fecha desc
    files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    res.json({ files, total: files.length });

  } catch (err) {
    console.error("Error listando archivos:", err);
    res.status(500).json({ error: "Error al obtener los archivos." });
  }
});

// =========================================================
// DELETE /api/files/:key
// Eliminar archivo del S3 del usuario
// =========================================================
router.delete("/:key(*)", verifyToken, async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key);

    // Verificar que el archivo pertenece al usuario
    if (!key.startsWith(`users/${req.user.sub}/`)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este archivo." });
    }

    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

    console.log(JSON.stringify({
      event:     "file.deleted",
      userId:    req.user.sub,
      key,
      timestamp: new Date().toISOString(),
    }));

    res.json({ message: "Archivo eliminado correctamente.", key });

  } catch (err) {
    console.error("Error eliminando archivo:", err);
    res.status(500).json({ error: "Error al eliminar el archivo." });
  }
});

// =========================================================
// GET /api/files/download/:key
// URL firmada para descargar un archivo
// =========================================================
router.get("/download/:key(*)", verifyToken, async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key);

    if (!key.startsWith(`users/${req.user.sub}/`)) {
      return res.status(403).json({ error: "Acceso denegado." });
    }

    const url = await getSignedUrl(s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 300 }
    );

    res.json({ downloadUrl: url });

  } catch (err) {
    console.error("Error generando URL de descarga:", err);
    res.status(500).json({ error: "Error al generar la URL de descarga." });
  }
});

export default router;
