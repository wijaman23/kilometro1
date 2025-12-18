//auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  // Usuario no existe
  if (!user) {
    return res.status(401).json({ msg: "Credenciales incorrectas" });
  }

  // Usuario bloqueado
  if (user.isBlocked) {
    return res.status(403).json({ msg: "Usuario bloqueado por demasiados intentos" });
  }

  const ok = await bcrypt.compare(password, user.password);

  // ❌ CONTRASEÑA INCORRECTA
  if (!ok) {
    user.failedLoginAttempts += 1;

    // 🔒 Bloquear tras 3 intentos
    if (user.failedLoginAttempts >= 3) {
      user.isBlocked = true;
    }

    await user.save();

    return res.status(401).json({
      msg: user.isBlocked
        ? "Usuario bloqueado por demasiados intentos"
        : "Credenciales incorrectas",
    });
  }

  // ✅ CONTRASEÑA CORRECTA → resetear intentos
  user.failedLoginAttempts = 0;
  await user.save();

  // 🔐 Obligado a cambiar contraseña
  if (user.mustChangePassword && user.role !== "admin") {
    return res.status(403).json({
      mustChangePassword: true,
      userId: user._id,
    });
  }

  // 🎟️ Generar token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});


/**
 * 🔐 CHANGE PASSWORD (PRIMER LOGIN)
 */
router.post("/change-password", async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password || password.length < 5) {
    return res.status(400).json({
      msg: "Contraseña inválida (mínimo 5 caracteres)",
    });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  user.password = await bcrypt.hash(password, 10);
  user.mustChangePassword = false;
  user.failedLoginAttempts = 0;
  user.isBlocked = false;

  await user.save();

  res.json({ msg: "Contraseña actualizada" });
});


/**
 * 📧 FORGOT PASSWORD
 */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: "Email enviado si existe" });

  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = Date.now() + 1000 * 60 * 60;
  await user.save();

  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendMail({
    to: email,
    subject: "🔐 Restablecer contraseña - Kilómetro 1",
    html: `
      <div style="font-family:Arial;text-align:center">
        <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" width="80"/>
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el botón para cambiar tu contraseña</p>
        <a href="${link}" style="
          display:inline-block;
          padding:12px 20px;
          background:#e63946;
          color:white;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
        ">
          Cambiar contraseña
        </a>
        <p style="margin-top:15px">Este enlace caduca en 1 hora</p>
      </div>
    `,
  });

  res.json({ msg: "Email enviado" });
});

/**
 * 🔁 RESET PASSWORD DESDE EMAIL
 */
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 5) {
    return res.status(400).json({ msg: "Contraseña demasiado corta" });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      msg: "Token inválido o expirado",
    });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.mustChangePassword = false;
  user.failedLoginAttempts = 0;
  user.isBlocked = false;

  await user.save();

  res.json({ msg: "Contraseña restablecida correctamente" });
});

module.exports = router;
