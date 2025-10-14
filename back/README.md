# 🏔️ TrekkingAR Backend

Backend para la aplicación de trekking y turismo aventura. Incluye autenticación con Google OAuth, carrito de compras, notificaciones en tiempo real, y manejo de imágenes.

## 🚀 Características Implementadas

- ✅ **Autenticación completa** (login, registro, Google OAuth)
- ✅ **Carrito de compras persistente** con items por fecha de viaje
- ✅ **Sistema de notificaciones** en tiempo real con Socket.IO
- ✅ **Manejo de imágenes** con Multer (upload local)
- ✅ **Emails automáticos** con Nodemailer (Gmail SMTP)
- ✅ **API RESTful** con validaciones y manejo de errores
- ✅ **Base de datos** con Sequelize y MySQL
- ✅ **Migraciones** con sequelize-cli

## 📋 Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## 🛠️ Instalación

### 1. Clonar y configurar

```bash
# Navegar al directorio del backend
cd TrekkingAr/back

# Instalar dependencias
npm install
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE trekking_db;
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus valores
nano .env
```

### 4. Ejecutar Migraciones

```bash
# Ejecutar migraciones para crear tablas
npx sequelize-cli db:migrate

# (Opcional) Ejecutar seeders para datos de prueba
npx sequelize-cli db:seed:all
```

### 5. Iniciar Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 🔧 Configuración Detallada

### Variables de Entorno Requeridas

#### Base de Datos
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=trekking_db
DB_PORT=3306
```

#### JWT
```env
JWT_SECRET=tu_secret_muy_seguro
JWT_EXPIRES_IN=7d
```

#### Google OAuth2
1. Ir a [Google Cloud Console](https://console.developers.google.com/)
2. Crear un nuevo proyecto o seleccionar existente
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Configurar URLs autorizadas:
   - Origen: `http://localhost:5173`
   - Redirección: `http://localhost:3000/api/auth/google/callback`

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

#### Gmail SMTP
1. Habilitar autenticación de 2 factores en Gmail
2. Generar App Password:
   - Ir a Configuración de Google Account
   - Seguridad → Contraseñas de aplicaciones
   - Generar nueva contraseña para "Mail"

```env
GMAIL_SMTP_USER=juanrojas.laboral@gmail.com
GMAIL_SMTP_PASS=tu_app_password
ADMIN_EMAILS=juanrojas.laboral@gmail.com,otro@example.com
```

## 📚 API Endpoints

### Autenticación
```bash
POST /api/auth/register     # Registro de usuario
POST /api/auth/login        # Login con email/password
GET  /api/auth/google       # Iniciar OAuth Google
GET  /api/auth/google/callback # Callback OAuth Google
GET  /api/auth/me           # Obtener perfil actual
POST /api/auth/logout       # Cerrar sesión
```

### Carrito
```bash
GET    /api/carrito                    # Obtener carrito del usuario
POST   /api/carrito/items              # Agregar item al carrito
PUT    /api/carrito/items/:id          # Actualizar cantidad
DELETE /api/carrito/items/:id          # Eliminar item
POST   /api/carrito/checkout           # Procesar compra
```

### Contacto y Notificaciones
```bash
POST /api/contact                      # Enviar mensaje de contacto
GET  /api/admin/notificaciones         # Listar notificaciones (admin)
PUT  /api/admin/notificaciones/:id/read # Marcar como leída (admin)
POST /api/admin/notificaciones/:id/reply # Responder mensaje (admin)
```

### Viajes e Imágenes
```bash
GET    /api/viajes                     # Listar viajes
GET    /api/viajes/:id                 # Obtener viaje por ID
POST   /api/viajes/:id/images          # Subir imágenes (admin)
DELETE /api/viajes/:id/images/:imgId   # Eliminar imagen (admin)
PUT    /api/viajes/:id/images/order    # Actualizar orden (admin)
```

## 🧪 Ejemplos de Uso

### 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": 12345678
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### 3. Agregar Item al Carrito
```bash
curl -X POST http://localhost:3000/api/carrito/items \
  -H "Content-Type: application/json" \
  -H "Cookie: token=tu_jwt_token" \
  -d '{
    "fechaViajeId": 1,
    "cantidad": 2
  }'
```

### 4. Enviar Mensaje de Contacto
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@example.com",
    "asunto": "Consulta sobre viaje",
    "mensaje": "Hola, me interesa saber más sobre el viaje al Aconcagua."
  }'
```

### 5. Subir Imágenes (Admin)
```bash
curl -X POST http://localhost:3000/api/viajes/1/images \
  -H "Cookie: token=admin_jwt_token" \
  -F "imagenes=@imagen1.jpg" \
  -F "imagenes=@imagen2.jpg"
```

## 🔌 Socket.IO

### Conexión desde Frontend
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'tu_jwt_token'
  }
});

// Para administradores
const adminSocket = io('http://localhost:3000/admin', {
  auth: {
    token: 'admin_jwt_token'
  }
});

// Escuchar notificaciones
adminSocket.on('new:notification', (notification) => {
  console.log('Nueva notificación:', notification);
});
```

### Eventos Disponibles
- `new:notification` - Nueva notificación para admins
- `notification:read` - Notificación marcada como leída
- `notification:replied` - Respuesta enviada a mensaje de contacto

## 🗄️ Base de Datos

### Comandos de Migración
```bash
# Crear nueva migración
npx sequelize-cli migration:generate --name nombre-migracion

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Revertir última migración
npx sequelize-cli db:migrate:undo

# Ver estado de migraciones
npx sequelize-cli db:migrate:status
```

### Estructura de Tablas Principales
- `usuarios` - Usuarios del sistema
- `carrito` - Carritos de compra por usuario
- `carrito_items` - Items individuales del carrito
- `mensajes_contacto` - Mensajes del formulario de contacto
- `notificaciones` - Notificaciones del sistema
- `viajes` - Viajes disponibles
- `fechas_viaje` - Fechas específicas de viajes
- `imagenes_viaje` - Imágenes de viajes

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
back/
├── config/
│   ├── database.js          # Configuración de BD
│   ├── multer.js           # Configuración de uploads
│   └── passport.js         # Configuración OAuth
├── controllers/
│   ├── authController.js   # Autenticación
│   ├── carritoController.js # Carrito de compras
│   ├── contactController.js # Contacto y notificaciones
│   └── viajeController.js  # Viajes e imágenes
├── middleware/
│   ├── auth.js            # Middleware de autenticación
│   └── errorHandler.js    # Manejo de errores
├── models/
│   ├── associations.js    # Relaciones entre modelos
│   ├── CarritoItem.js     # Modelo de items del carrito
│   ├── MensajeContacto.js # Modelo de mensajes
│   ├── Notificacion.js    # Modelo de notificaciones
│   └── Usuario.js         # Modelo de usuarios
├── routes/
│   ├── authRoutes.js      # Rutas de autenticación
│   ├── carritoRoutes.js   # Rutas del carrito
│   ├── contactRoutes.js   # Rutas de contacto
│   └── viajeRoutes.js     # Rutas de viajes
├── services/
│   └── emailService.js    # Servicio de emails
├── migrations/            # Migraciones de BD
├── uploads/              # Archivos subidos
└── server.js             # Servidor principal
```

## 🚨 Solución de Problemas

### Error de Conexión a BD
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar credenciales en .env
mysql -u root -p -e "SHOW DATABASES;"
```

### Error de Google OAuth
- Verificar que las URLs estén configuradas correctamente
- Asegurarse de que el proyecto tenga Google+ API habilitada
- Verificar que las credenciales sean correctas

### Error de Email
- Verificar que Gmail tenga 2FA habilitado
- Usar App Password, no la contraseña normal
- Verificar que el email esté en ADMIN_EMAILS

### Error de Uploads
- Verificar permisos del directorio uploads/
- Asegurarse de que el directorio existe
- Verificar límites de tamaño en multer.js

## 📝 Logs y Debugging

```bash
# Ver logs en tiempo real
npm run dev

# Logs de producción
NODE_ENV=production npm start
```

## 🔒 Seguridad

- ✅ Validación de inputs con express-validator
- ✅ Autenticación JWT con cookies httpOnly
- ✅ Rate limiting para prevenir abuso
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado correctamente
- ✅ Sanitización de uploads con Multer

## 📞 Soporte

Para problemas o preguntas:
- Revisar logs del servidor
- Verificar configuración de variables de entorno
- Consultar documentación de las dependencias

---

**Desarrollado con ❤️ para TrekkingAR**