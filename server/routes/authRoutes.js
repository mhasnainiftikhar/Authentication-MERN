import express from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    sendVerifyOtp,
    verifyEmail,
    checkAuth,
    sendPasswordResetOtp,
    resetPassword
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/sign-up", registerUser);

// LOGIN
router.post("/sign-in", loginUser);

// LOGOUT
router.post("/sign-out", logoutUser);

// SEND OTP TO EMAIL FOR VERIFICATION
router.post("/send-verify-otp",authMiddleware, sendVerifyOtp);

//Verify Email Route
router.post("/verify-email",authMiddleware,verifyEmail);

//Check Auth Status Route
router.get("/is-auth",authMiddleware,checkAuth);

//send password reset OTP
router.post("/send-reset-otp",sendPasswordResetOtp);

//reset password
router.post("/reset-password",resetPassword);

export default router;
