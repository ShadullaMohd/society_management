module.exports = (sequelize, DataTypes) => {
  const Maintenance = sequelize.define('Maintenance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false // e.g., "Maintenance Charge Jan 2026"
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE'),
      defaultValue: 'PENDING'
    },
    penalty: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  });

  return Maintenance;
};
