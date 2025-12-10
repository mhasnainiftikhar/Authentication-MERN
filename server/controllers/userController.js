import User from "../models/userModels.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await User.findById(userId).select(
            "-password -verifyOtp -verifyOtpExpiry -resetOtp -resetOtpExpireAt"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User data fetched successfully",
            userData: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        console.error("Get User Data Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
