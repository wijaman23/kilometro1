const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

// Solo admin
router.post("/", auth(["admin"]), createUser);
router.get("/", auth(["admin"]), getUsers);
router.delete("/:id", auth(["admin"]), deleteUser);

module.exports = router;
