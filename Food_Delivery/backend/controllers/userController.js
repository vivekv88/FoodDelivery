// import userModel from "../models/userModel.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import validator from "validator";


// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };


// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Please enter a valid email to login" });
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User doesn't exist. Please register." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     const token = createToken(user._id);

//     return res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       message:"User Logged In Successfully"
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const registerUser = async (req, res) => {
//   const { name, password, email } = req.body;

//   try {
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Please enter a valid email" });
//     }

//     const userExists = await userModel.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }


//     // if (!validator.isStrongPassword(password)) {
//     //   return res.status(400).json({ success: false, message: "Password not strong enough" });
//     // }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const user = await newUser.save();

//     const token = createToken(user._id);

//     return res.json({
//       success: true,
//       message:"User Account created Successfully",
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export { loginUser, registerUser };








import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import formData from "form-data";
import Mailgun from "mailgun.js";
import "dotenv/config"

// ✅ Mailgun Setup
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,   // put in .env
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 STEP 1: Register → send OTP
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // ✅ Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // ✅ Send OTP via Mailgun
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Tomato <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: "Verify your Email - OTP",
      text: `Hello ${name},\n\nYour OTP is: ${otp}\n\nIt is valid for 10 minutes.`,
    });

    // ✅ Save user temporarily with OTP (account not active yet)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,   // custom field
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 min expiry
    });

    await newUser.save();

    return res.json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 STEP 2: Verify OTP → Activate account
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = createToken(user._id);

    return res.json({
      success: true,
      message: "Email verified successfully! Account created.",
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Login (only if verified)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User Logged In Successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerUser, verifyOtp, loginUser };

