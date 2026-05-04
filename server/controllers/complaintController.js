const { Complaint, ComplaintMessage, User } = require('../models');

exports.createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority, image } = req.body;
        const complaint = await Complaint.create({
            title, description, category, priority, image, residentId: req.user.id
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getComplaints = async (req, res) => {
    try {
        let where = {};
        if (req.user.role === 'RESIDENT') {
            where.residentId = req.user.id;
        }
        const complaints = await Complaint.findAll({ 
            where,
            include: [{ model: User, as: 'resident', attributes: ['name', 'apartmentNumber'] }]
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const complaint = await Complaint.findByPk(id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        
        // Check ownership or admin role
        if (req.user.role === 'RESIDENT' && complaint.residentId !== req.user.id) {
             return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }
        
        // Residents can only close complaints
        if (req.user.role === 'RESIDENT' && status !== 'CLOSED') {
             return res.status(403).json({ message: 'Residents can only close complaints' });
        }

        complaint.status = status;
        await complaint.save();
        
        const io = req.io;
        io.to(`complaint-${id}`).emit('complaintStatusUpdate', { id: complaint.id, status });
        
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        
        const complaint = await Complaint.findByPk(id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        
        if (complaint.status === 'CLOSED') {
            return res.status(400).json({ message: 'Cannot send messages on a closed complaint' });
        }

        const chat = await ComplaintMessage.create({
            complaintId: id,
            senderId: req.user.id,
            message,
            isAdmin: req.user.role === 'ADMIN'
        });
        
        const io = req.io;
        io.to(`complaint-${id}`).emit('newComplaintMessage', chat);
        
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
  try {
      const { id } = req.params;
      const messages = await ComplaintMessage.findAll({
          where: { complaintId: id },
          order: [['createdAt', 'ASC']]
      });
      res.json(messages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, feedback } = req.body;
        
        const complaint = await Complaint.findByPk(id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        
        if (complaint.status !== 'CLOSED') {
             return res.status(400).json({ message: 'Complaint must be closed to give feedback' });
        }

        complaint.rating = rating;
        complaint.feedback = feedback;
        await complaint.save();
        
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
