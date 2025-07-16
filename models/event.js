'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    dateTime: DataTypes.DATE,
    location: DataTypes.STRING,
    capacity: DataTypes.INTEGER
  }, {});
  
  Event.associate = function(models) {
    Event.belongsToMany(models.User, {
      through: 'Registration',
      foreignKey: 'eventId'
    });
  };

  return Event;
};
