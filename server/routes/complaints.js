const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus, addMessage, getMessages, submitFeedback } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('RESIDENT'), createComplaint);
router.get('/', protect, getComplaints);
router.put('/:id/status', protect, authorize('ADMIN', 'RESIDENT'), updateComplaintStatus);
router.post('/:id/feedback', protect, authorize('RESIDENT'), submitFeedback);
router.post('/:id/messages', protect, addMessage);
router.get('/:id/messages', protect, getMessages);

module.exports = router;
