import { Router } from "express";
import getAdminDashboardStats from "../../controllers/adminController/dashboard.stats.controller.js";
import { authorizeAdmin } from "../../middleware/auth.middleware.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.get('/', authenticateToken, authorizeAdmin, getAdminDashboardStats)

export default router

// /api/users/stats/total → total users
// /api/users/stats/active → active users
// /api/products/stats/total → total products