const { User } = require('../models');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all residents (For Security/Admin/Resident to find others)
exports.getResidents = async (req, res) => {
    try {
        const residents = await User.findAll({
            where: { role: 'RESIDENT' },
            attributes: ['id', 'name', 'apartmentNumber', 'phoneNumber', 'email']
        });
        res.json(residents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
