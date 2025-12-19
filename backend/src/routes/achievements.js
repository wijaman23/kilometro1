const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");
const cloudinary = require("../utils/cloudinary");
const Achievement = require("../models/Achievement");

/**
 * GET /api/achievements
 * (Usuarios logueados lo verán en front igualmente; puedes dejarlo público o con auth)
 */
router.get("/", auth, async (req, res) => {
  const items = await Achievement.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();
  res.json(items);
});

/**
 * POST /api/achievements
 * Admin crea logro + sube imagen a Cloudinary
 */
router.post(
  "/",
  auth,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, athleteName, description } = req.body;

      if (!title || !athleteName) {
        return res.status(400).json({ msg: "Faltan campos obligatorios" });
      }
      if (!req.file) {
        return res.status(400).json({ msg: "Debes subir una imagen" });
      }

      // Subir a Cloudinary usando buffer
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "kilometro1/achievements",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const created = await Achievement.create({
        title,
        athleteName,
        description: description || "",
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
        createdBy: req.user.id,
        isPublished: true,
      });

      res.json(created);
    } catch (e) {
      console.error(e);
      res.status(500).json({ msg: "Error creando logro" });
    }
  }
);

/**
 * DELETE /api/achievements/:id
 * Admin elimina logro + borra imagen en Cloudinary
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "No existe" });

    // Borrar de Cloudinary
    try {
      await cloudinary.uploader.destroy(item.imagePublicId);
    } catch (e) {
      // si falla, no bloqueamos el borrado del documento
      console.warn("No se pudo borrar en cloudinary:", e?.message);
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ msg: "Logro eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error eliminando logro" });
  }
});

module.exports = router;
