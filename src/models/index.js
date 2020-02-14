const Sequelize = require('sequelize');

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE_NAME || process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
    },
  );
}

const models = {
  Message: sequelize.import('./message'),
  User: sequelize.import('./user'),
  Venue: sequelize.import('./venue'),
  Zone: sequelize.import('./zone'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = {
  models,
  sequelize,
};
