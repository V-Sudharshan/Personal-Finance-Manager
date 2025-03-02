const express = require("express");
const { loginController, registerController } = require("../controllers/userController");

const router = express.Router();

// ✅ Ensure registerController is defined
if (!registerController) {
  console.error("Error: registerController is undefined. Check your import in userController.js.");
}

// POST || LOGIN USER
router.post("/login", loginController);

// POST || REGISTER USER
router.post("/register", registerController);

module.exports = router;
