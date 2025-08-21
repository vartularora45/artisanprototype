import express from 'express';
import { register, login } from '../cantrollers/user.cantroller.js';
// import auth from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

export default router;
