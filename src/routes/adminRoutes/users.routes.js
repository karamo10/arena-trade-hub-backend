import { Router } from "express";
import {getUsers, updateUser} from '../../controllers/adminController/users.controller.js';

const router = Router();

router.get('/', getUsers);
router.patch('/:id/role', updateUser);

export default router;

