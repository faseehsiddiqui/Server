import express from 'express';
import { signUp, signIn, refreshAccessToken } from '../controllers/auth';

const router = express.Router();

router.post('/signup', signUp);     // Register
router.post('/signin', signIn);     // Login
router.get("/refresh-token", refreshAccessToken);      // Refresh Token

export default router;
