import express from 'express';
import { getCars, getUserData, loginUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';
import { authLimiter } from '../middleware/security.js';

const userRouter = express.Router()

userRouter.post('/register', authLimiter, validateUserRegistration, registerUser)
userRouter.post('/login', authLimiter, validateUserLogin, loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', protect, getCars)

export default userRouter;
