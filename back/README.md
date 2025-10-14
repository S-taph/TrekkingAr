# TrekkingAR Backend

Este backend Express + Sequelize + MySQL soporta catálogo de viajes, reservas y ahora carrito persistente, contacto/notificaciones, uploads locales y login social con Google.

## Requisitos
- Node.js 18+
- MySQL 8+

## Variables de entorno
Crea un archivo `.env` basado en `.env.example`:

```
cp back/.env.example back/.env
```

Configura credenciales de DB, JWT, Google OAuth y Gmail SMTP.

## Instalación
```
cd back
npm install
```

## Migraciones (sequelize-cli)
```
# Config ubicado en back/config/config.js
npx sequelize-cli db:migrate --config config/config.js --migrations-path migrations
```

## Correr en desarrollo
```
cd back
npm run dev
```

Por defecto expone:
- API: http://localhost:3000
- Health: http://localhost:3000/api/health

## Endpoints nuevos clave

### Carrito
- GET /api/carrito
- POST /api/carrito/items { id_fecha_viaje, cantidad }
- PUT /api/carrito/items/:id { cantidad }
- DELETE /api/carrito/items/:id
- POST /api/carrito/checkout

### Contacto/Notificaciones
- POST /api/contact { nombre, email, asunto, mensaje }
- GET /api/admin/notificaciones (admin)
- PUT /api/admin/notificaciones/:id/read (admin)
- POST /api/admin/notificaciones/:id/reply { respuesta } (admin)

### Uploads de imágenes
- POST /api/viajes/:id/images (admin) multipart field: images[]
- Archivos expuestos en /uploads

### Auth Google
- GET /api/auth/google
- GET /api/auth/google/callback
- GET /api/auth/profile (autenticado)

## Ejemplos curl

Agregar al carrito:
```
curl -X POST http://localhost:3000/api/carrito/items \
 -H 'Content-Type: application/json' \
 -H 'Cookie: token=YOUR_JWT' \
 -d '{"id_fecha_viaje":1,"cantidad":2}'
```

Enviar contacto:
```
curl -X POST http://localhost:3000/api/contact \
 -H 'Content-Type: application/json' \
 -d '{"nombre":"Juan","email":"juan@example.com","asunto":"Consulta","mensaje":"Hola!"}'
```

## Notas
- Usa ADMIN_EMAILS (coma separada) para notificar admins.
- Para Gmail, genera App Password y colócalo en GMAIL_SMTP_PASS.
