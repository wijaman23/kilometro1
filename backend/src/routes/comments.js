const express = require("express");
const Comment = require("../models/Comment");
const auth = require("../middlewares/auth");

const router = express.Router();

// 💬 Listar comentarios de una noticia
router.get("/:newsId", async (req, res) => {
  const comments = await Comment.find({ news: req.params.newsId })
    .sort({ createdAt: -1 })
    .populate("user", "username");

  res.json(comments);
});

// 💬 Crear comentario
router.post("/:newsId", auth, async (req, res) => {
  const comment = await Comment.create({
    news: req.params.newsId,
    user: req.user.id,
    text: req.body.text,
  });

  res.json(comment);
});

// ❌ Borrar comentario (admin)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "No autorizado" });
  }

  await Comment.findByIdAndDelete(req.params.id);
  res.json({ msg: "Comentario eliminado" });
});

module.exports = router;
