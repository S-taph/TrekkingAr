# 🏔️ Backend Completo - TrekkingAR Full E-commerce

## 📋 Resumen

Implementación completa del backend para la plataforma TrekkingAR con todas las funcionalidades core para e-commerce de turismo aventura.

---

## ✅ Checklist de Funcionalidades Implementadas

### 🔐 Autenticación y Usuarios
- [x] Login con email/password (JWT + httpOnly cookies)
- [x] Registro de usuarios con validaciones
- [x] Google OAuth 2.0 (Passport.js)
- [x] Vinculación automática de cuentas por email
- [x] Campo `dni` nullable para usuarios OAuth
- [x] Middleware de autenticación y autorización por roles
- [x] Endpoint `/api/auth/me` para obtener perfil
- [x] Logout con limpieza de cookies

### 🛒 Carrito de Compras
- [x] Modelo `Carrito` (cabecera) y `CarritoItem` (items)
- [x] Persistencia por usuario en base de datos
- [x] Items vinculados a `FechaViaje` (fechas específicas de salida)
- [x] CRUD completo de items (GET, POST, PUT, DELETE)
- [x] Validación de cupos disponibles
- [x] Snapshot de precios en `precio_unitario`
- [x] Cálculo automático de subtotales
- [x] Endpoint `/api/carrito/checkout` (placeholder para pagos)

### 📧 Contacto y Notificaciones
- [x] Formulario de contacto público (`POST /api/contact`)
- [x] Modelo `MensajeContacto` para mensajes
- [x] Modelo `AdminNotificacion` para notificaciones admin
- [x] Sistema de notificaciones en tiempo real con Socket.IO
- [x] Namespace `/admin` para administradores
- [x] Eventos: `new:notification`, `notification:read`, `notification:replied`
- [x] Centro de notificaciones con filtros y paginación
- [x] Marcar notificaciones como leídas
- [x] Responder mensajes desde admin → envía email automático
- [x] Envío de emails a admins con Nodemailer (Gmail SMTP)
- [x] Plantillas HTML para emails (notificaciones y respuestas)

### 🏔️ Viajes y Productos
- [x] Endpoints GET para listar viajes (con filtros y paginación)
- [x] Filtros: categoría, dificultad, búsqueda, activo
- [x] Endpoint GET para detalle de viaje con todas las relaciones
- [x] Incluye: categoría, fechas, imágenes
- [x] URLs completas para imágenes
- [x] Upload de imágenes con Multer (POST /api/viajes/:id/images)
- [x] Validación de tipos (JPEG, PNG, WebP) y tamaño (5MB max)
- [x] Almacenamiento local en `uploads/viajes/:viajeId/`
- [x] Servir archivos estáticos con express.static
- [x] Endpoints para eliminar imágenes y actualizar orden

### 🗄️ Base de Datos
- [x] Migraciones consolidadas y limpias
- [x] Modelos Sequelize completamente implementados:
  - Usuario (con campos OAuth)
  - Carrito y CarritoItem
  - MensajeContacto
  - AdminNotificacion
  - Viaje, FechaViaje, ImagenViaje
  - Categoria, Guia, Reserva, Compra
- [x] Relaciones definidas en `associations.js`
- [x] Configuración de sequelize-cli (`config.cjs` y `.sequelizerc`)
- [x] Migraciones numeradas y ordenadas
- [x] Seeds para datos de prueba

### 🛡️ Seguridad
- [x] Helmet para headers de seguridad
- [x] CORS configurado para frontend específico
- [x] Rate limiting (100 requests / 15 minutos)
- [x] Validación de inputs con express-validator
- [x] Sanitización de datos
- [x] JWT con secret fuerte
- [x] Bcrypt para hash de passwords (12 rounds)
- [x] Protección contra SQL injection (Sequelize ORM)
- [x] No exponer credenciales (uso de .env)

### 📧 Emails
- [x] Servicio EmailService con Nodemailer
- [x] Configuración Gmail SMTP
- [x] Plantillas HTML con estilos inline
- [x] Email a admins en nuevo contacto
- [x] Email a usuarios con respuesta de admin
- [x] Manejo de errores en envío (no bloquea operaciones)
- [x] Variable `ADMIN_EMAILS` (comma-separated)

### 🔌 Real-time (Socket.IO)
- [x] Socket.IO integrado en servidor Express
- [x] Namespace `/admin` para administradores
- [x] Autenticación en handshake (JWT token)
- [x] Eventos implementados:
  - `new:notification` - Nueva notificación para admin
  - `notification:read` - Notificación marcada como leída
  - `notification:replied` - Respuesta enviada a usuario
- [x] Rooms para administradores (`admin`)
- [x] Integración en `contactController`

### 🧪 Testing
- [x] Configuración de Jest + Supertest
- [x] Setup global de tests (`tests/setup.js`)
- [x] Tests de autenticación (`auth.test.js`):
  - Register, login, logout, Google OAuth, /me
- [x] Tests de carrito (`carrito.test.js`):
  - GET, POST, PUT, DELETE, checkout
- [x] Tests de contacto (`contacto.test.js`):
  - Envío de mensaje, listado, marcar leída, responder
- [x] Tests de viajes (`viajes.test.js`):
  - Listado con filtros, detalle, upload de imágenes
- [x] Smoke tests (validación de estructura y status codes)
- [x] Uso de bypass auth para testing sin DB poblada

### 📚 Documentación
- [x] README.md completo con:
  - Guía de instalación paso a paso
  - Configuración de variables de entorno
  - Instrucciones para migraciones
  - Guía para ejecutar tests
  - Descripción de módulos
  - Troubleshooting
  - Estructura del proyecto
- [x] API_EXAMPLES.md con:
  - Ejemplos curl para todos los endpoints
  - Autenticación (login, register, OAuth)
  - Carrito (CRUD completo)
  - Contacto y notificaciones
  - Viajes y filtros
  - Upload de imágenes
  - Estructura de respuestas
  - Códigos de estado HTTP
  - Tips y buenas prácticas
- [x] Comentarios en código con JSDoc
- [x] .env.example actualizado

---

## 🏗️ Arquitectura

### Stack Tecnológico
- **Node.js** 18+ con ES Modules
- **Express.js** 4.x
- **Sequelize** 6.x (ORM)
- **MySQL** 8.x
- **JWT** para autenticación
- **Passport** para Google OAuth
- **Socket.IO** para real-time
- **Nodemailer** para emails
- **Multer** para uploads
- **Jest + Supertest** para testing

### Estructura de Carpetas
```
back/
├── config/               # Configuraciones (DB, Multer, Passport)
├── migrations/           # Migraciones de Sequelize
├── scripts/              # Scripts de utilidad
├── src/
│   ├── config/           # Configs (database.js, multer.js, passport.js)
│   ├── controllers/      # Lógica de negocio
│   ├── middleware/       # Auth, errorHandler
│   ├── models/           # Modelos Sequelize
│   ├── routes/           # Definición de rutas
│   ├── services/         # EmailService
│   ├── utils/            # Utilidades (mailer.js)
│   └── server.js         # Punto de entrada
├── tests/                # Tests con Jest
├── uploads/              # Archivos subidos
├── .env                  # Variables de entorno (git-ignored)
└── package.json
```

### Modelos Principales

#### Relaciones Clave
- `Usuario` ← hasMany → `Carrito`
- `Carrito` ← hasMany → `CarritoItem`
- `CarritoItem` ← belongsTo → `FechaViaje`
- `FechaViaje` ← belongsTo → `Viaje`
- `Viaje` ← belongsTo → `Categoria`
- `Viaje` ← hasMany → `ImagenViaje`
- `MensajeContacto` ← belongsTo → `Usuario` (respondido_por)

---

## 🚀 Cómo Probar

### 1. Setup Inicial

```bash
cd TrekkingAr/back
npm install
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. Base de Datos

```bash
# Crear DB
mysql -u root -p -e "CREATE DATABASE trekking_ar;"

# Ejecutar migraciones
npx sequelize-cli db:migrate

# (Opcional) Seeds
npm run seed
```

### 3. Iniciar Servidor

```bash
npm run dev
```

El servidor estará en `http://localhost:3000`

### 4. Probar Endpoints

Ver `API_EXAMPLES.md` para ejemplos completos con curl.

**Quick test:**

```bash
# Health check
curl http://localhost:3000/api/health

# Listar viajes
curl http://localhost:3000/api/viajes

# Enviar mensaje de contacto
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "asunto": "Consulta de prueba",
    "mensaje": "Hola, esta es una consulta de prueba del sistema."
  }'
```

### 5. Ejecutar Tests

```bash
npm test
```

Todos los tests deben pasar ✅

---

## 📊 Endpoints Implementados

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| **Auth** |
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/google` | OAuth Google | No |
| GET | `/api/auth/google/callback` | Callback OAuth | No |
| GET | `/api/auth/me` | Perfil actual | Sí |
| POST | `/api/auth/logout` | Logout | No |
| **Carrito** |
| GET | `/api/carrito` | Obtener carrito | Sí |
| POST | `/api/carrito/items` | Agregar item | Sí |
| PUT | `/api/carrito/items/:id` | Actualizar cantidad | Sí |
| DELETE | `/api/carrito/items/:id` | Eliminar item | Sí |
| POST | `/api/carrito/checkout` | Checkout | Sí |
| **Contacto** |
| POST | `/api/contact` | Enviar mensaje | No |
| GET | `/api/admin/notificaciones` | Listar notificaciones | Admin |
| PUT | `/api/admin/notificaciones/:id/read` | Marcar leída | Admin |
| POST | `/api/admin/notificaciones/:id/reply` | Responder | Admin |
| GET | `/api/admin/mensajes` | Listar mensajes | Admin |
| **Viajes** |
| GET | `/api/viajes` | Listar viajes | No |
| GET | `/api/viajes/:id` | Detalle de viaje | No |
| POST | `/api/viajes/:id/images` | Upload imágenes | Admin |
| DELETE | `/api/viajes/:id/images/:imgId` | Eliminar imagen | Admin |
| PUT | `/api/viajes/:id/images/order` | Ordenar imágenes | Admin |

---

## 🔧 Variables de Entorno

### Requeridas

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=7d

# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=tu_password
DB_NAME=trekking_ar
DB_PORT=3306

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Gmail SMTP
GMAIL_SMTP_USER=juanrojas.laboral@gmail.com
GMAIL_SMTP_PASS=tu_app_password
ADMIN_EMAILS=juanrojas.laboral@gmail.com,otro@example.com
```

### Opcionales (para futuro)

```env
# Chatbot (por implementar en frontend)
GROQ_API_KEY=
GROQ_PROJECT_ID=
LLAMA_MODEL=llama-3.1-8b-instant

# Socket.io
SOCKET_IO_PATH=/socket.io
```

---

## 🎯 Objetivos Cumplidos

✅ **Panel admin completo** - Sistema de notificaciones funcional
✅ **Carga de imágenes** - Multer con storage local
✅ **Carrito persistente** - Vinculado a FechaViaje, persistencia en DB
✅ **Centro de notificaciones** - Socket.IO en tiempo real
✅ **Login social** - Google OAuth con vinculación automática
✅ **Emails automáticos** - Nodemailer con plantillas HTML
✅ **API RESTful** - Endpoints documentados y testeados
✅ **Tests básicos** - Jest + Supertest smoke tests
✅ **Documentación completa** - README + API_EXAMPLES

---

## 📝 Notas para Revisión

### Cambios Estructurales
1. **Consolidación de modelos**: Eliminados duplicados (Notificacion.js vs AdminNotificacion.js)
2. **Migraciones limpias**: Eliminadas duplicadas (20251014*.js)
3. **Socket.IO corregido**: Uso correcto de `req.io` en controllers
4. **DNI nullable**: Permite usuarios OAuth sin DNI inicial

### Decisiones de Diseño
1. **CarritoItem → FechaViaje**: Permite reservar fechas específicas de viajes
2. **Precio en CarritoItem**: Snapshot para evitar cambios retroactivos
3. **AdminNotificacion**: Modelo separado para notificaciones admin (vs notificaciones de campaña)
4. **Bypass auth en tests**: Permite testing sin setup de DB poblada

### Próximos Pasos (Frontend)
- Implementar `CartContext` con React Context API
- Componente `CartDrawer` para vista lateral del carrito
- Integración Socket.IO en `NotificationCenter`
- Widget de chatbot con Groq + Llama
- Tema MUI con paleta "aventura"
- Modo oscuro/claro con toggle

---

## 🐛 Problemas Conocidos y Soluciones

### Si Google OAuth no funciona
1. Verificar URLs en Google Cloud Console
2. Asegurar que callback URL es exacta
3. Habilitar Google+ API en el proyecto

### Si emails no se envían
1. Verificar 2FA habilitada en Gmail
2. Usar App Password (no password normal)
3. Verificar ADMIN_EMAILS en .env

### Si Socket.IO no conecta
1. Verificar CORS en frontend
2. Asegurar token JWT en handshake
3. Verificar namespace correcto (`/admin`)

---

## 📞 Contacto y Soporte

**Autor**: Juan Rojas
**Email**: juanrojas.laboral@gmail.com

**Documentación**:
- [README.md](./README.md) - Guía completa de instalación
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Ejemplos de uso con curl

---

## 🎉 Conclusión

Backend completamente funcional para una plataforma de e-commerce de turismo aventura con todas las funcionalidades core:

- ✅ Autenticación robusta (manual + OAuth)
- ✅ Carrito persistente y completo
- ✅ Sistema de notificaciones en tiempo real
- ✅ Upload de imágenes
- ✅ Emails automáticos
- ✅ API RESTful documentada
- ✅ Tests funcionando
- ✅ Código limpio y comentado

**¡Listo para integrar con el frontend!** 🚀

---

🏔️ Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
