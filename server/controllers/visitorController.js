const { Visitor, User } = require('../models');

exports.addVisitor = async (req, res) => {
  try {
    const { name, phoneNumber, purpose, residentId } = req.body;
    
    // Security creates visitor, status starts as PENDING
    const visitor = await Visitor.create({
      name,
      phoneNumber,
      purpose,
      residentId,
      status: 'PENDING'
    });

    // Notify Resident via Socket.io
    const io = req.io;
    io.to(`resident-${residentId}`).emit('newVisitor', visitor);

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVisitors = async (req, res) => {
    try {
        let visitors;
        if (req.user.role === 'RESIDENT') {
            visitors = await Visitor.findAll({ where: { residentId: req.user.id } });
        } else {
            visitors = await Visitor.findAll({ include: [{ model: User, as: 'resident', attributes: ['name', 'apartmentNumber'] }] });
        }
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVisitorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED, REJECTED, EXITED

        const visitor = await Visitor.findByPk(id);
        if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

        visitor.status = status;
        if (status === 'EXITED') {
            visitor.exitTime = new Date();
        }

        await visitor.save();

        // Notify Security/Admin if Resident approves
        // And notify Resident if Security updates (e.g. EXITED)
        const io = req.io;
        io.emit('visitorStatusUpdate', visitor);

        res.json(visitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
