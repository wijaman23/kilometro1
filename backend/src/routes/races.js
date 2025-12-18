const express = require("express");
const router = express.Router();
const Race = require("../models/Race");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const User = require("../models/User");


/* =========================
   LISTADOS
   ========================= */

// Próximas
router.get("/upcoming", auth, async (req, res) => {
  const today = new Date();
  const races = await Race.find({ date: { $gte: today } }).sort({ date: 1 });
  res.json(races);
});

// Antiguas
router.get("/past", auth, async (req, res) => {
  const today = new Date();
  const races = await Race.find({ date: { $lt: today } }).sort({ date: -1 });
  res.json(races);
});

// ⭐ Carreras favoritas del usuario
router.get("/favorites", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  res.json(user.favorites || []);
});


// ⭐ Marcar / desmarcar favorito
router.post("/:id/favorite", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const raceId = req.params.id;

  const exists = user.favorites.includes(raceId);

  if (exists) {
    user.favorites.pull(raceId);
  } else {
    user.favorites.push(raceId);
  }

  await user.save();

  res.json({
    favorite: !exists,
  });
});


// Todas (ADMIN)
router.get("/", auth, isAdmin, async (req, res) => {
  const races = await Race.find().sort({ date: 1 });
  res.json(races);
});

// Detalle
router.get("/:id", auth, async (req, res) => {
  const race = await Race.findById(req.params.id);
  if (!race) return res.status(404).json({ msg: "Carrera no encontrada" });
  res.json(race);
});

/* =========================
   ADMIN
   ========================= */

router.post("/", auth, isAdmin, async (req, res) => {
  const race = await Race.create(req.body);
  res.json(race);
});

router.put("/:id", auth, isAdmin, async (req, res) => {
  const updated = await Race.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Race.findByIdAndDelete(req.params.id);
  res.json({ msg: "Carrera eliminada" });
});

module.exports = router;
