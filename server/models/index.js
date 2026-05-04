const Sequelize = require('sequelize');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models
db.User = require('./User')(sequelize, Sequelize);
db.Visitor = require('./Visitor')(sequelize, Sequelize);
db.Maintenance = require('./Maintenance')(sequelize, Sequelize);
db.Payment = require('./Payment')(sequelize, Sequelize);
db.Complaint = require('./Complaint')(sequelize, Sequelize);
db.ComplaintMessage = require('./ComplaintMessage')(sequelize, Sequelize);
db.Amenity = require('./Amenity')(sequelize, Sequelize);
db.Booking = require('./Booking')(sequelize, Sequelize);
db.Announcement = require('./Announcement')(sequelize, Sequelize);
db.Poll = require('./Poll')(sequelize, Sequelize);
db.Vote = require('./Vote')(sequelize, Sequelize);
db.MarketplaceItem = require('./MarketplaceItem')(sequelize, Sequelize);

// Associations

// User Associations
db.User.hasMany(db.Visitor, { foreignKey: 'residentId', as: 'visitors' });
db.User.hasMany(db.Maintenance, { foreignKey: 'residentId', as: 'metrics' });
db.User.hasMany(db.Complaint, { foreignKey: 'residentId', as: 'complaints' });
db.User.hasMany(db.Booking, { foreignKey: 'residentId', as: 'bookings' });
db.User.hasMany(db.Vote, { foreignKey: 'residentId', as: 'votes' });
db.User.hasMany(db.MarketplaceItem, { foreignKey: 'sellerId', as: 'items' });

// Visitor Associations
db.Visitor.belongsTo(db.User, { foreignKey: 'residentId', as: 'resident' });

// Maintenance Associations
db.Maintenance.belongsTo(db.User, { foreignKey: 'residentId', as: 'resident' });
db.Maintenance.hasOne(db.Payment, { foreignKey: 'maintenanceId', as: 'payment' });

// Payment Associations
db.Payment.belongsTo(db.Maintenance, { foreignKey: 'maintenanceId', as: 'maintenance' });
db.Payment.belongsTo(db.User, { foreignKey: 'residentId', as: 'resident' });

// Complaint Associations
db.Complaint.belongsTo(db.User, { foreignKey: 'residentId', as: 'resident' });
db.Complaint.hasMany(db.ComplaintMessage, { foreignKey: 'complaintId', as: 'messages' });

// ComplaintMessage Associations
db.ComplaintMessage.belongsTo(db.Complaint, { foreignKey: 'complaintId', as: 'complaint' });
db.ComplaintMessage.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });

// Booking Associations
db.Booking.belongsTo(db.User, { foreignKey: 'residentId', as: 'resident' });
db.Booking.belongsTo(db.Amenity, { foreignKey: 'amenityId', as: 'amenity' });

// Vote Associations
db.Vote.belongsTo(db.Poll, { foreignKey: 'pollId', as: 'poll' });
db.Vote.belongsTo(db.User, { foreignKey: 'residentId', as: 'resident' });

// Poll Associations
db.Poll.hasMany(db.Vote, { foreignKey: 'pollId', as: 'votes' });

// MarketplaceItem Associations
db.MarketplaceItem.belongsTo(db.User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = db;
