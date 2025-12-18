module.exports = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Acceso solo para administradores" });
  }
  next();
};
