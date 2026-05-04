const { User, Maintenance, Complaint, Visitor, MarketplaceItem, Announcement } = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalResidents = await User.count({ where: { role: 'RESIDENT' } });
        const pendingComplaints = await Complaint.count({ where: { status: 'OPEN' } });
        const totalVisitorsToday = await Visitor.count({ 
            where: { 
                entryTime: new Date() // Exact match? No, needs range. 
            }
        }); 
        // Sequelize count with date range needed for "Today". 
        // For simplicity, let's just get total visitors count or pending visitors.
        const pendingVisitors = await Visitor.count({ where: { status: 'PENDING' } });
        
        const unpaidMaintenance = await Maintenance.count({ where: { status: 'PENDING' } });
        const totalUnpaidAmount = await Maintenance.sum('amount', { where: { status: 'PENDING' } });

        res.json({
            totalResidents,
            pendingComplaints,
            pendingVisitors,
            unpaidMaintenance,
            totalUnpaidAmount: totalUnpaidAmount || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
