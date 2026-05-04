module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED'),
      defaultValue: 'CONFIRMED'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    }
  });

  return Booking;
};
