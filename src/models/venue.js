function user(sequelize, DataTypes) {
  const Venue = sequelize.define('venue', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    googlePlaceId: {
      type: DataTypes.STRING,
    },
    googleFormattedAddress: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.STRING,
    },
    lng: {
      type: DataTypes.STRING,
    },
  });

  Venue.associate = (models) => {
    Venue.hasMany(models.Zone, { onDelete: 'CASCADE' });
    Venue.belongsTo(models.User);
  };

  return Venue;
};

module.exports = user;
