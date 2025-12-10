import express from 'express';
import { getAllUsers } from '../controllers/user';
const router = express.Router();

// GET all users (protected route)
router.get('/', getAllUsers);

export default router;
