const User = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, "your_jwt_secret_key", { expiresIn: "7d" });
};

// ---------------- SIGNUP ----------------
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Email already exists" });

    admin = await Admin.create({ username, email, password });

    const token = generateToken(admin._id);

    res
      .status(201)
      .json({
        message: "Signup success",
        admin: { id: admin._id, username: admin.username, email: admin.email },
        token,
      });
  } catch (error) {
    res.status(500).json({ message: "Signup error: " + error.message });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);

    res.status(200).json({
      message: "Login success",
      admin: { id: admin._id, username: admin.username, email: admin.email },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Login error: " + error.message });
  }
};



