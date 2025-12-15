import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/user';
const router = express.Router();

router.get('/', getAllUsers); // Get all users
router.put('/:id', updateUser); // Update user
router.delete('/:id', deleteUser); // Delete User
export default router;
