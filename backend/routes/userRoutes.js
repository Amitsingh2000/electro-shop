const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/adminAuth');

// 🔐 All routes below are admin-protected
router.use(protect, isAdmin);

// 📥 Create a new user
router.post('/', userController.createUser);

// 📄 Get all users
router.get('/', userController.getAllUsers);

// 🛠️ Update a user
router.patch('/:id', userController.updateUser);

// ❌ Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
