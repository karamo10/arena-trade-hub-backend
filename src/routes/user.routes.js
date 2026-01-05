import { Router } from "express";
import { getUsers, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get('/', getUsers);
router.patch('/:id/role', updateUser);

export default router;

