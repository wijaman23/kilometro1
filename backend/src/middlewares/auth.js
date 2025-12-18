const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req || !res) {
    return;
  }

  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Token no válido" });
  }
};
