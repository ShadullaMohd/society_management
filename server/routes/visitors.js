const express = require('express');
const router = express.Router();
const { addVisitor, getVisitors, updateVisitorStatus } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('SECURITY', 'ADMIN'), addVisitor);
router.get('/', protect, getVisitors);
router.put('/:id/status', protect, updateVisitorStatus);

module.exports = router;
