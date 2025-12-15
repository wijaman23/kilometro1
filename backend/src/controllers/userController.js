const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Crear usuario (admin)
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;

  const exists = await User.findOne({ username });
  if (exists)
    return res.status(400).json({ msg: "Usuario ya existe" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
    role: role || "user",
  });

  await user.save();
  res.status(201).json({ msg: "Usuario creado ✅" });
};

// Listar usuarios (admin)
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Eliminar usuario (admin)
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Usuario eliminado 🗑️" });
};
