// routes/news.js
const express = require("express");
const router = express.Router();

const News = require("../models/News");
const Comment = require("../models/Comment");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

/* =========================
   NOTICIAS
   ========================= */

/**
 * 📄 LISTAR NOTICIAS (USUARIOS + ADMIN)
 */
router.get("/", auth, async (req, res) => {
  const news = await News.find({ isPublished: true })
    .populate("author", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean(); // 👈 clave

  const newsWithCounts = await Promise.all(
    news.map(async (n) => {
      const count = await Comment.countDocuments({
        news: n._id,
        deletedAt: null,
        isDisabled: { $ne: true },
      });

      return {
        ...n,
        commentsCount: count,
      };
    })
  );

  res.json(newsWithCounts);
});

/**
 * ➕ CREAR NOTICIA (ADMIN)
 */
router.post("/", auth, isAdmin, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  const news = await News.create({
    title,
    content,
    imageUrl,
    author: req.user.id,
  });

  res.json(news);
});

/**
 * ✏️ EDITAR NOTICIA (ADMIN)
 */
router.put("/:id", auth, isAdmin, async (req, res) => {
  const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updated);
});

/**
 * 🗑️ BORRAR NOTICIA (ADMIN)
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ news: req.params.id });

  res.json({ msg: "Noticia eliminada" });
});

/* =========================
   COMENTARIOS
   ========================= */

/**
 * 📄 LISTAR COMENTARIOS DE UNA NOTICIA
 */
// routes/news.js
router.get("/:id/comments", auth, async (req, res) => {
  const filter = {
    news: req.params.id,
    deletedAt: null,
  };

  // 👤 Si NO es admin → ocultar desactivados
  if (req.user.role !== "admin") {
    filter.isDisabled = false;
  }

  const comments = await Comment.find(filter)
    .populate("user", "username")
    .sort({ createdAt: -1 });

  res.json(comments);
});


/**
 * 💬 CREAR COMENTARIO (USUARIO)
 */
router.post("/:id/comments", auth, async (req, res) => {
  const comment = await Comment.create({
    news: req.params.id,
    user: req.user.id,
    text: req.body.text,
  });

  res.json(comment);
});

/**
 * ✏️ EDITAR COMENTARIO (SOLO AUTOR)
 */
router.put("/comments/:commentId", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({ msg: "No autorizado" });
  }

  comment.text = req.body.text;
  comment.editedAt = new Date();
  await comment.save();

  res.json(comment);
});

/**
 * ❌ BORRAR COMENTARIO (SOLO AUTOR)
 */
router.delete("/comments/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({ msg: "No autorizado" });
  }

  comment.deletedAt = new Date();
  await comment.save();

  res.json({ msg: "Comentario eliminado" });
});

/**
 * 🚫 DESACTIVAR COMENTARIO (ADMIN)
 */
router.put("/comments/:id/disable", auth, isAdmin, async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.id, {
    isDisabled: true,
  });

  res.json({ msg: "Comentario desactivado" });
});

// ✅ REACTIVAR
router.put("/comments/:id/enable", auth, isAdmin, async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.id, {
    isDisabled: false,
  });

  res.json({ msg: "Comentario reactivado" });
});



/**
 * 👁️ PUBLICAR / OCULTAR NOTICIA (ADMIN)
 */
router.put("/:id/publish", auth, isAdmin, async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({ msg: "Noticia no encontrada" });
  }

  news.isPublished = !news.isPublished;
  await news.save();

  res.json(news);

});

module.exports = router;
