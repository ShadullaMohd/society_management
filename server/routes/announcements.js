const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, createPoll, getPolls, votePoll } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('ADMIN'), createAnnouncement);
router.get('/', protect, getAnnouncements);

// Polls Routes embedded here for simplicity or separate
router.post('/polls', protect, authorize('ADMIN'), createPoll);
router.get('/polls', protect, getPolls);
router.post('/polls/:id/vote', protect, authorize('RESIDENT'), votePoll);

module.exports = router;
