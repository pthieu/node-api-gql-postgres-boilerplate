function zone(sequelize, DataTypes) {
  const Zone = sequelize.define('zone', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Zone.associate = (models) => {
    Zone.belongsTo(models.Venue);
  };

  return Zone;
}

module.exports = zone;
