'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
    Location.hasMany(models.BookingLocation)

  };
  return Location;
};