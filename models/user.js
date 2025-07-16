'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  
  User.associate = function(models) {
    User.belongsToMany(models.Event, {
      through: 'Registration',
      foreignKey: 'userId'
    });
  };

  return User;
};
