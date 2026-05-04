module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    optionIndex: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Vote;
};
