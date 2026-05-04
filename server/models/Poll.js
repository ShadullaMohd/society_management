module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON, // Store as JSON array ["Option A", "Option B"]
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
  });

  return Poll;
};
