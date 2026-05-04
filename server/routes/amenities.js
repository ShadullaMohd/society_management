const express = require('express');
const router = express.Router();
const { createAmenity, getAmenities, bookAmenity, getBookings } = require('../controllers/amenityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('ADMIN'), createAmenity);
router.get('/', protect, getAmenities);
router.post('/book', protect, authorize('RESIDENT'), bookAmenity);
router.get('/bookings', protect, getBookings);

module.exports = router;
