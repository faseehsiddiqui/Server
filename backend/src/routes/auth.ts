import express from 'express';
import { signUp, signIn } from '../controllers/auth';

const router = express.Router();

// Register
router.post('/signup', signUp);
// Login
router.post('/signin', signIn);

export default router;
