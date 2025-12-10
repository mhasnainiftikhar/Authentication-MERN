import express from 'express';
import { getUserData } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const userRouter = express.Router();

// Route to get user data
userRouter.get('/data', authMiddleware, getUserData);

export default userRouter;