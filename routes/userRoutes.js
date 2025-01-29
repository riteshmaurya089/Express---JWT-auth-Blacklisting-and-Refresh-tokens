const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// Protected route example
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;