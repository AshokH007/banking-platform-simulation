const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate, staffOnly } = require('../middleware/auth');

// Apply both middlewares to all staff routes
router.use(authenticate, staffOnly);

router.post('/create-customer', staffController.createCustomer);
router.post('/deposit', staffController.depositFunds);
router.get('/users', staffController.getAllUsers);

module.exports = router;
