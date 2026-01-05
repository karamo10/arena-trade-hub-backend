import { Router } from 'express';
import upload from '../utils/mutler.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', getProfile);
router.patch('/', authenticateToken, upload.single('image'), updateProfile);

export default router;
