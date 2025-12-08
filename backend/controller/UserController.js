const User = require("../models/User");
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

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res
      .status(201)
      .json({
        message: "Signup success",
        user: { id: user._id, username: user.username, email: user.email },
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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login success",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Login error: " + error.message });
  }
};



