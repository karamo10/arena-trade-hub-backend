import { Router } from "express";
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware.js';
import { getProductById, getProducts, getProductBySlug, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import upload from "../utils/mutler.js";

const router = Router();

// public routes
router.get('/', getProducts);
router.get('/id/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

// admin routes
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), addProduct);
router.patch('/:id', authenticateToken, authorizeAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

// router.route('/getProducts').get(getProducts);
// router.route('/getProducts/:id').get(getProductById);
// router.route('/getProducts:slug').get(getProductBySlug);

export default router;
