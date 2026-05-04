const { Maintenance, Payment, User } = require('../models');

exports.createMaintenance = async (req, res) => {
    try {
        const { title, amount, month, year, residentId } = req.body;
        
        // If residentId is provided, create for specific user
        // If not, create for ALL residents (Bulk)
        if (residentId) {
            const maintenance = await Maintenance.create({ title, amount, month, year, residentId });
            return res.status(201).json(maintenance);
        } else {
             const residents = await User.findAll({ where: { role: 'RESIDENT' } });
             const maintenances = await Promise.all(residents.map(resident => 
                 Maintenance.create({ title, amount, month, year, residentId: resident.id })
             ));
             return res.status(201).json(maintenances);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMaintenance = async (req, res) => {
    try {
        let where = {};
        if (req.user.role === 'RESIDENT') {
            where.residentId = req.user.id;
        }
        
        const maintenance = await Maintenance.findAll({ 
            where,
            include: [{ model: User, as: 'resident', attributes: ['name', 'apartmentNumber'] }]
        });
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.payMaintenance = async (req, res) => {
    try {
        const { id } = req.params; // Maintenance ID
        const { method, transactionId } = req.body;
        
        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) return res.status(404).json({ message: 'Record not found' });

        if (maintenance.status === 'PAID') return res.status(400).json({ message: 'Already paid' });

        const payment = await Payment.create({
            amount: maintenance.amount,
            method,
            transactionId,
            maintenanceId: id,
            residentId: req.user.id
        });

        maintenance.status = 'PAID';
        await maintenance.save();

        res.json({ maintenance, payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
