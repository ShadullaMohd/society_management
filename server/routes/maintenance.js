const express = require('express');
const router = express.Router();
const { createMaintenance, getMaintenance, payMaintenance } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('ADMIN'), createMaintenance);
router.get('/', protect, getMaintenance);
router.post('/:id/pay', protect, authorize('RESIDENT'), payMaintenance);

module.exports = router;
