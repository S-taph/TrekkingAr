import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Notificacion = sequelize.define(
  "notificaciones",
  {
    id_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuarios",
      },
    },
    id_campania: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "campanias",
        key: "id_campania",
      },
    },
    tipo_notificacion: {
      type: DataTypes.ENUM("reserva", "pago", "campania", "sistema", "recordatorio"),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    enviada_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fecha_envio_email: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    prioridad: {
      type: DataTypes.ENUM("baja", "media", "alta", "urgente"),
      defaultValue: "media",
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_lectura: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: false,
  },
)

export default Notificacion
