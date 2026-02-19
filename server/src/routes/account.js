const express = require('express');
const router = express.Router();
const { getProfile, getBalance } = require('../controllers/accountController');
const { authenticate } = require('../middleware/auth');

router.get('/profile', authenticate, getProfile);
router.get('/balance', authenticate, getBalance);

module.exports = router;
