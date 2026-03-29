const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

const auth = require('../middleware/auth');
const { updateProfile } = require('../controllers/authController');

// PUT /api/auth/profile
router.put('/profile', auth, updateProfile);

module.exports = router;  // <-- हे महत्वाचे आहे! router export कर