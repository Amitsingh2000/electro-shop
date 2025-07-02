const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/adminAuth');

// Public: create order
router.post('/', orderController.createOrder);

// Admin routes
router.get('/', protect, isAdmin, orderController.getAllOrders);
router.get('/:id', protect, isAdmin, orderController.getOrderById);
router.put('/:id', protect, isAdmin, orderController.updateOrder);
router.delete('/:id', protect, isAdmin, orderController.deleteOrder);

module.exports = router;
