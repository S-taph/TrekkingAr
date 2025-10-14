'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarritoItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CarritoItem.init({
    id_carrito: DataTypes.INTEGER,
    id_fecha_viaje: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precio_unitario: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'CarritoItem',
  });
  return CarritoItem;
};