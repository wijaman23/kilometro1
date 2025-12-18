const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

/**
 * 📋 LISTAR USUARIOS
 */
router.get("/", auth, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/**
 * ➕ CREAR USUARIO
 */
router.post("/", auth, isAdmin, async (req, res) => {
  const { firstName, lastName, username, email, role } = req.body;

  const tempPassword =
    "Tmp" + Math.random().toString(36).slice(-5).toUpperCase() + "1";

  const hashed = await bcrypt.hash(tempPassword, 10);

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    role: role || "user",
    password: hashed,
    mustChangePassword: true,
  });

  await sendMail({
    to: email,
    subject: "Bienvenido a Kilómetro 1",
    html: `
      <div style="font-family:Arial; padding:20px">
        <h2>👋 Bienvenido a Kilómetro 1</h2>
        <p>Hola <b>${firstName}</b>,</p>

        <p>Tu cuenta ha sido creada.</p>

        <p><b>Usuario:</b> ${username}</p>
        <p><b>Contraseña provisional:</b> ${tempPassword}</p>

        <p>⚠️ Deberás cambiar la contraseña al iniciar sesión.</p>

        <a href="${process.env.FRONTEND_URL}/login"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#000;
             color:#fff;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;
           ">
           🚀 Entrar a Kilómetro 1
        </a>

        <p style="margin-top:20px; color:#666">
          Si no reconoces este email, ignóralo.
        </p>
      </div>
    `,
  });

  res.json({ msg: "Usuario creado y email enviado" });
});


/**
 * 🔒 BLOQUEAR USUARIO
 */
router.put("/:id/block", auth, isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: true,
  });
  res.json({ msg: "Usuario bloqueado" });
});

/**
 * 🔓 DESBLOQUEAR USUARIO
 */
router.put("/:id/unlock", auth, isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: false,
    failedLoginAttempts: 0,
  });
  res.json({ msg: "Usuario desbloqueado" });
});

/**
 * 🔁 RESET PASSWORD (ADMIN)
 */
router.put("/:id/reset-password", auth, isAdmin, async (req, res) => {
  const tempPassword =
    "Reset" + Math.random().toString(36).slice(-5).toUpperCase() + "1";

  const hashed = await bcrypt.hash(tempPassword, 10);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: hashed,
      mustChangePassword: true,
      failedLoginAttempts: 0,
      isBlocked: false,
    },
    { new: true }
  );

  await sendMail({
    to: user.email,
    subject: "Contraseña restablecida",
    html: `
      <p>Nueva contraseña provisional:</p>
      <p><b>${tempPassword}</b></p>
      <p>Debes cambiarla al iniciar sesión.</p>
    `,
  });

  res.json({ msg: "Contraseña restablecida" });
});

module.exports = router;
