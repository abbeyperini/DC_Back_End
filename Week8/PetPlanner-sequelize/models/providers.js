'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Providers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Providers.belongsTo(models.pets, {as: 'pet', foreignKey: 'pet_id'})
    }
  };
  Providers.init({
    name: DataTypes.STRING,
    number: DataTypes.STRING,
    service: DataTypes.STRING,
    pet_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Providers',
  });
  return Providers;
};