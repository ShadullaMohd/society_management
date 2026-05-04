const express = require('express');
const router = express.Router();
const { getAllUsers, getResidents } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('ADMIN'), getAllUsers);
router.get('/residents', protect, authorize('ADMIN', 'SECURITY', 'RESIDENT'), getResidents);

module.exports = router;
