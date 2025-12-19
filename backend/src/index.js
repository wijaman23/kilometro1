//backend/src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const userRoutes = require("./routes/users");
const videoRoutes = require("./routes/videos");
const adminUsersRoutes = require("./routes/adminUsers");
const newsRoutes = require("./routes/news");
const racesRoutes = require("./routes/races");
const achievementsRoutes = require("./routes/achievements");

const app = express();

// Conectar DB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/races", racesRoutes);
app.use("/api/achievements", achievementsRoutes);

app.get("/", (req, res) => {
  res.send("Kilómetro 1 API funcionando 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`)
);
