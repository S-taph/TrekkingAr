// CarritoItem model: Items within a user's persistent cart, referencing a specific FechaViaje.
// Purpose: Persist items per user cart so checkout can create Reservas/Compras later.
import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const CarritoItem = sequelize.define(
  "carrito_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_carrito: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "carrito",
        key: "id_carrito",
      },
    },
    id_fecha_viaje: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fechas_viaje",
        key: "id_fechas_viaje",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updatedAt",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
)

export default CarritoItem
