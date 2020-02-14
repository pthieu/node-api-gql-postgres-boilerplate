const bcrypt = require('bcryptjs');

function user(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    avatar: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
    strategy: {
      type: DataTypes.STRING,
      default: 'email'
    },
    accessToken: {
      type: DataTypes.STRING
    },
    refreshToken: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
    User.hasMany(models.Venue);
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  User.beforeCreate(async user => {
    if (user.strategy === 'email') {
      user.password = await user.generatePasswordHash();
    }
  });

  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

module.exports = user;
