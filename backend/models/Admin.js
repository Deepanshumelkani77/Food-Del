const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Prevent model recompilation
let Admin;

try {
  // Try to get the model if it exists
  Admin = mongoose.model('Admin');
} catch (error) {
  // If it doesn't exist, create it
  Admin = mongoose.model('Admin', adminSchema);
}

module.exports = Admin;
