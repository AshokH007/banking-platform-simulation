const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate, staffOnly } = require('../middleware/auth');

// Diagnostic route
router.get('/ping', (req, res) => res.json({ message: 'Staff router is active' }));

// Apply both middlewares to all staff routes
router.use(authenticate, staffOnly);

router.post('/create-customer', staffController.createCustomer);
router.post('/deposit', staffController.depositFunds);
router.get('/users', staffController.getAllUsers);

module.exports = router;
