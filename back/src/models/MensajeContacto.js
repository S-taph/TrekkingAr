// MensajeContacto: stores contact form messages from users/visitors
import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const MensajeContacto = sequelize.define(
  "mensajes_contacto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    asunto: { type: DataTypes.STRING(255), allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    estado: { type: DataTypes.ENUM("nuevo", "respondido"), defaultValue: "nuevo" },
    respuesta: { type: DataTypes.TEXT, allowNull: true },
    respondido_por: { type: DataTypes.INTEGER, allowNull: true }, // admin id
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true, freezeTableName: true },
)

export default MensajeContacto
