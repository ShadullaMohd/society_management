module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define('Amenity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chargePerHour: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Amenity;
};
