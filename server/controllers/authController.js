import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/nodemailer.js";


// REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Sending email automatically after registration
        sendEmail(email, username);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                token: token
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// LOGIN USER
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// LOGOUT USER
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

//send verification OTP email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id;  // from token

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ message: "Account already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendEmail(
            user.email,
            "Verify Your Account",
            `Your verification OTP is: ${otp}`
        );

        return res.status(200).json({ message: "OTP sent to email" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

//Verify User Email
export const verifyEmail = async (req, res) => {
    try {
        const userId = req.user.id;   // from token
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verifyOtp !== otp || Date.now() > user.verifyOtpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = null;
        user.verifyOtpExpiry = null;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
 
//check if user is authenticated
export const checkAuth = async (req, res) => {
    try {
        // Token already verified by authMiddleware
        const userId = req.user.id;

        // Fetch user without password or internal OTP fields
        const user = await User.findById(userId).select(
            "-password -verifyOtp -verifyOtpExpiry"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User authenticated",
            user
        });

    } catch (error) {
        console.error("checkAuth Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

//SEnd Password Reset OTP to Email
export const sendPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendEmail(
            user.email,
            "Password Reset OTP",
            `Your password reset OTP is: ${otp}`
        );
        return res.status(200).json({ message: "Password reset OTP sent to email" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

//Reset Password using OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate input
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check OTP validity
        if (user.resetOtp !== otp || Date.now() > user.resetOtpExpireAt) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear OTP after reset
        user.resetOtp = null;
        user.resetOtpExpireAt = null;

        await user.save();

        return res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


