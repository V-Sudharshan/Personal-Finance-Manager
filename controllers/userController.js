const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

// ✅ Debug Log
console.log("Loading userController.js...");

// Login Controller
const loginController = async (req, res) => {
  try {
    console.log("Login Attempt:", req.body.email);
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Register Controller
const registerController = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    console.log("User Registered Successfully:", savedUser);
    res.status(201).json({ success: true, message: "User Registered Successfully", user: savedUser });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ✅ Debug Log
console.log("Exporting user controllers...");

module.exports = { loginController, registerController };
