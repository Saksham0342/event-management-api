'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER
  }, {});
  Registration.associate = function(models) {
    // Associations are defined in User and Event
  };
  return Registration;
};
