const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    // Usuario no existe
    if (!user) {
      return res.status(401).json({ msg: "Usuario o contraseña incorrectos" });
    }

    // Usuario bloqueado (admin nunca)
    if (user.isBlocked && user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Usuario bloqueado. Contacta con el administrador." });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    // ❌ Contraseña incorrecta
    if (!passwordCorrect) {
      if (user.role !== "admin") {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= 3) {
          user.isBlocked = true;
        }

        await user.save();
      }

      return res.status(401).json({ msg: "Usuario o contraseña incorrectos" });
    }

    // 🔐 OBLIGAR A CAMBIAR CONTRASEÑA
    if (user.mustChangePassword) {
      return res.status(200).json({
        mustChangePassword: true,
        userId: user._id,
      });
    }

    // ✅ Login correcto → reset intentos
    user.failedLoginAttempts = 0;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Error login:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
