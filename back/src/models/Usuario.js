import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Usuario = sequelize.define(
  "usuarios",
  {
    id_usuarios: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true, // allow null for social login
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null for Google OAuth users
      unique: true,
      validate: {
        isInt: true,
        len: {
          args: [7, 8],
          msg: 'El DNI debe tener 7 u 8 dígitos'
        }
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contacto_emergencia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    telefono_emergencia: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    experiencia_previa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rol: {
      type: DataTypes.ENUM("cliente", "admin", "guia"),
      defaultValue: "cliente",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: "googleid",
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
)

export default Usuario
