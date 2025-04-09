import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

// login user function

const loginUser = async (req, res) => {

}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// register user function

const registerUser = async (req, res) => {

    const { name, password, email } = req.body;

    try {
        // check for existing user
        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creating user account
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { loginUser, registerUser }