const { MarketplaceItem, User } = require('../models');

exports.createItem = async (req, res) => {
    try {
        const item = await MarketplaceItem.create({
            ...req.body,
            sellerId: req.user.id
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await MarketplaceItem.findAll({
            include: [{ model: User, as: 'seller', attributes: ['name', 'apartmentNumber'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MarketplaceItem.findByPk(id);
        
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        if (item.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await item.destroy();
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
