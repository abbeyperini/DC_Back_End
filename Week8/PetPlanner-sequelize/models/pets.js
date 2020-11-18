'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.pets.hasMany(models.Providers, {as: 'providers', foreignKey: 'pet_id'})
      models.pets.belongsTo(models.Users, {as: 'user', foreignKey: 'user_id'})
    }
  };
  pets.init({
    name: DataTypes.STRING,
    favorites: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pets',
  });
  return pets;
};