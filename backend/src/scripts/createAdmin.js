/**
 * Script para crear o recrear el usuario ADMIN
 * Ejecutar con:
 *   node src/scripts/createAdmin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kilometro1";

async function createAdmin() {
  try {
    console.log("🔌 Conectando a MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🗑️ Eliminando admin existente (si existe)...");
    await User.deleteOne({ username: "admin" });

    console.log("🔐 Creando nuevo admin...");
    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = new User({
      firstName: "Admin",
      lastName: "Principal",
      username: "admin",
      email: "admin@kilometro1.com",
      password: hashedPassword,
      role: "admin",
      mustChangePassword: false,
      failedLoginAttempts: 0,
      isBlocked: false,
    });

    await admin.save();

    console.log("✅ ADMIN CREADO CORRECTAMENTE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 Usuario: admin");
    console.log("🔑 Contraseña: Admin123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (err) {
    console.error("❌ Error creando admin:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
