import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import emailExistence from "email-existence";

// Generate JWT token with expiry
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check all fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Must be valid email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email to login" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist. Please register." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Create token
    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message:"User Logged In Successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check valid email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Check email domain exists
    const emailValid = await new Promise((resolve) => {
      emailExistence.check(email, (err, response) => {
        console.log(response);
        resolve(response);
      });
    });

    if (!emailValid) {
      return res.status(400).json({ success: false, message: "Email domain does not exist" });
    }

    // Strong password check
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: "Password not strong enough" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Generate token
    const token = createToken(user._id);

    return res.json({
      success: true,
      message:"User Account created Successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser };
