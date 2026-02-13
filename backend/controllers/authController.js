import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashed });
    await newUser.save();

    return res.json({ message: "User registered" });
  } catch (err) {
    console.log("REGISTER ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIX: search only by email
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "SECRET123", {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
