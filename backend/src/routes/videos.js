const express = require("express");
const Video = require("../models/Video");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

/**
 * 📋 LISTAR VÍDEOS (PUBLICO)
 */
router.get("/", async (req, res) => {
  const videos = await Video.find().sort({ publishDate: -1 });
  res.json(videos);
});

/**
 * ➕ CREAR VÍDEO (ADMIN)
 */
router.post("/", auth, isAdmin, async (req, res) => {
  const { title, description, embedUrl, publishDate } = req.body;

  if (!title || !embedUrl) {
    return res.status(400).json({ msg: "Datos incompletos" });
  }

  const video = await Video.create({
    title,
    description,
    embedUrl,
    publishDate,
  });

  res.json(video);
});


/**
 * ✏️ EDITAR VÍDEO (ADMIN)
 */
router.put("/:id", auth, isAdmin, async (req, res) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(video);
});

/**
 * 🗑️ BORRAR VÍDEO (ADMIN)
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ msg: "Vídeo eliminado" });
});

module.exports = router;
