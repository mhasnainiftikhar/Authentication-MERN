import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Also allow token from Authorization header (Bearer TOKEN)
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = {
            id: decoded.userId,
            ...decoded
        };

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired, please login again"
            });
        }

        return res.status(401).json({
            message: "Invalid token, authorization denied"
        });
    }
};
