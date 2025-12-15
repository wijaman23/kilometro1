const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// Solo usuarios logueados
router.get("/private", auth(), (req, res) => {
  res.json({
    msg: "Acceso permitido 🔐",
    user: req.user,
  });
});

// Solo admin
router.get("/admin", auth(["admin"]), (req, res) => {
  res.json({
    msg: "Solo admin 👑",
    user: req.user,
  });
});

module.exports = router;
