import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// Hardcoded admin credentials (hashed at startup)
// In production: store in DB with bcrypt
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_PLAIN = "admin123"; // change in production

// @desc   Admin login
// @route  POST /api/auth/login
// @access Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD_PLAIN) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "admin", username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      admin: { username, role: "admin" },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Verify current token
// @route  GET /api/auth/me
// @access Admin
export const getMe = (req, res) => {
  res.json({ success: true, admin: req.admin });
};
