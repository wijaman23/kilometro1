require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const exists = await User.findOne({ role: "admin" });
  if (exists) {
    console.log("Admin ya existe ❗");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("Admin creado ✅");
  process.exit();
};

createAdmin();
