const express = require("express");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");
const cloudinary = require("../utils/cloudinary");
const Achievement = require("../models/Achievement");

const router = express.Router();

/**
 * ✅ LISTAR LOGROS
 * Lo dejo PÚBLICO para que los usuarios puedan ver /logros sin token en URL directa.
 * (Si lo quieres solo logueados, añade auth aquí.)
 */
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .sort({ createdAt: -1 })
      .select("-imagePublicId");
    res.json(achievements);
  } catch (e) {
    res.status(500).json({ msg: "Error cargando logros" });
  }
});

/**
 * ✅ CREAR LOGRO (ADMIN) + SUBIR IMAGEN A CLOUDINARY
 * Espera multipart/form-data con field: image
 */
router.post("/", auth, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, athleteName, description } = req.body;

    if (!title || !athleteName) {
      return res.status(400).json({ msg: "title y athleteName son obligatorios" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Debes enviar una imagen (field: image)" });
    }

    // Subir a cloudinary desde buffer
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
    });

    res.json({
      msg: "Logro creado",
      achievement: {
        _id: created._id,
        title: created.title,
        athleteName: created.athleteName,
        description: created.description,
        imageUrl: created.imageUrl,
        createdAt: created.createdAt,
      },
    });
  } catch (e) {
    console.error("ERROR CREATE ACHIEVEMENT:", e);
    res.status(500).json({ msg: "Error creando logro" });
  }
});

/**
 * ✅ BORRAR LOGRO (ADMIN) + BORRAR IMAGEN DE CLOUDINARY
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const ach = await Achievement.findById(req.params.id);
    if (!ach) return res.status(404).json({ msg: "Logro no encontrado" });

    // borrar imagen
    try {
      await cloudinary.uploader.destroy(ach.imagePublicId);
    } catch (e) {
      // si falla, no bloqueamos el borrado del doc
      console.warn("Cloudinary destroy failed:", e?.message || e);
    }

    await ach.deleteOne();
    res.json({ msg: "Logro eliminado" });
  } catch (e) {
    res.status(500).json({ msg: "Error eliminando logro" });
  }
});

module.exports = router;
