const express = require('express');
const router = express.Router();
const { createItem, getItems, deleteItem } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createItem);
router.get('/', protect, getItems);
router.delete('/:id', protect, deleteItem);

module.exports = router;
