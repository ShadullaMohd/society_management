module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    method: {
      type: DataTypes.STRING,
      defaultValue: 'ONLINE' // or CASH, CHEQUE
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED'),
      defaultValue: 'SUCCESS'
    }
  });
  return Payment;
};
