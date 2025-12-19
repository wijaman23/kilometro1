const express = require("express");
const Achievement = require("../models/Achievement");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/uploadAchievementImage");

const router = express.Router();

/**
 * 🌍 PÚBLICO – listar logros
 */
router.get("/", auth, async (req, res) => {
  const achievements = await Achievement.find({ isPublished: true })
    .sort({ createdAt: -1 });
  res.json(achievements);
});

/**
 * ➕ ADMIN – crear logro
 */
router.post(
  "/",
  auth,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { title, athleteName, description } = req.body;

    const achievement = await Achievement.create({
      title,
      athleteName,
      description,
      imageUrl: req.file.path,
      createdBy: req.user.id,
    });

    res.json(achievement);
  }
);

/**
 * 🗑️ ADMIN – borrar logro
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id);
  res.json({ msg: "Logro eliminado" });
});

module.exports = router;
