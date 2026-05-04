module.exports = (sequelize, DataTypes) => {
  const MarketplaceItem = sequelize.define('MarketplaceItem', {
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'SOLD'),
      defaultValue: 'AVAILABLE'
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
  });

  return MarketplaceItem;
};
