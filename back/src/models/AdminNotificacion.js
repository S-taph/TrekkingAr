// Admin-focused notification for contact form etc.
import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const AdminNotificacion = sequelize.define(
  "admin_notificaciones",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo: { type: DataTypes.ENUM("contact_form", "sistema", "order"), allowNull: false },
    leido: { type: DataTypes.BOOLEAN, defaultValue: false },
    meta: { type: DataTypes.JSON, allowNull: true },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    from_email: { type: DataTypes.STRING(255), allowNull: true },
    to_admin: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true, freezeTableName: true },
)

export default AdminNotificacion
