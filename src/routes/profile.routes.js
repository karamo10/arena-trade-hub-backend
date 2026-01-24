import { Router } from 'express';
import upload from '../utils/mutler.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getFullProfile, getBasicProfile, getReadOnlyProfile, updateProfile } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', getFullProfile);
router.get('/basic', authenticateToken, getBasicProfile);
router.get('/readonly', authenticateToken, getReadOnlyProfile); 
router.patch('/', authenticateToken, upload.single('image'), updateProfile);

export default router;

// router.get('/readonly', authenticateToken, getReadOnlyProfile); 
// The middleware runs first, then sets req.user, 
// Then your controller can safely do req.user.id.

