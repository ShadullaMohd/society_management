module.exports = (sequelize, DataTypes) => {
  const ComplaintMessage = sequelize.define('ComplaintMessage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  });

  return ComplaintMessage;
};
