const User = require("../models/User");

// 📄 LISTAR USUARIOS
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// 🔒 BLOQUEAR
exports.blockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: true,
  });
  res.json({ msg: "Usuario bloqueado" });
};

// 🔓 DESBLOQUEAR
exports.unblockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: false,
    failedLoginAttempts: 0,
  });
  res.json({ msg: "Usuario desbloqueado" });
};

// ❌ ELIMINAR
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user.role === "admin") {
    return res.status(403).json({ msg: "No puedes eliminar un admin" });
  }

  await user.deleteOne();
  res.json({ msg: "Usuario eliminado" });
};
