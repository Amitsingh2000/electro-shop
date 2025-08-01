// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, wishlistController.getWishlist);
router.post('/', protect, wishlistController.addToWishlist);
router.delete('/:productId', protect, wishlistController.removeFromWishlist);

module.exports = router;
