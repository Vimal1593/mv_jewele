import express from 'express';
import { createOrder, verifyRazorpayPayment, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', createOrder); // Open for guest checkout
router.post('/verify', verifyRazorpayPayment);

// Admin Routes
router.get('/', requireAdmin, getAllOrders);
router.put('/:orderId', requireAdmin, updateOrderStatus);

export default router;
