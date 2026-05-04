module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define('Complaint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('PLUMBING', 'ELECTRICAL', 'SECURITY', 'OTHER'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'CLOSED'),
      defaultValue: 'OPEN'
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      defaultValue: 'MEDIUM'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return Complaint;
};
