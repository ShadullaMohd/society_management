module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define('Visitor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entryTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    exitTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'EXITED'),
      defaultValue: 'PENDING'
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true
    }
  });

  return Visitor;
};
