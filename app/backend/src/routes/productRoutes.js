import express from 'express';
import { createProduct, getAllProducts, getProductById, deleteProduct } from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes for the Storefront
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (Requires JWT)
router.post('/', requireAdmin, createProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
