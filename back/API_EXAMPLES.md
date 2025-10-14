# 📖 TrekkingAR API - Ejemplos de Uso

Guía completa con ejemplos de uso de la API usando `curl`. Todos los ejemplos asumen que el servidor está corriendo en `http://localhost:3000`.

---

## 📑 Índice

1. [Autenticación](#autenticación)
2. [Carrito de Compras](#carrito-de-compras)
3. [Contacto y Notificaciones](#contacto-y-notificaciones)
4. [Viajes](#viajes)
5. [Carga de Imágenes](#carga-de-imágenes)
6. [Respuestas y Códigos de Estado](#respuestas-y-códigos-de-estado)

---

## 🔐 Autenticación

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": 12345678,
    "telefono": "+54 9 11 1234-5678",
    "experiencia_previa": "Principiante en trekking"
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "cliente"
    }
  }
}
```

---

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "cliente"
    }
  }
}
```

> **Nota**: El token JWT se envía en una cookie httpOnly. Usa `-c cookies.txt` para guardar las cookies y `-b cookies.txt` para enviarlas en requests subsiguientes.

---

### Google OAuth

#### 1. Iniciar flujo de autenticación

```bash
# Abre en el navegador:
open http://localhost:3000/api/auth/google
```

O con curl (para ver la redirección):

```bash
curl -L http://localhost:3000/api/auth/google
```

Esto redirige a Google para autenticación. Después del login, Google redirige a `/api/auth/google/callback` y finalmente al frontend con el token en cookie.

---

### Obtener Perfil del Usuario Autenticado

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id_usuarios": 1,
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": 12345678,
      "telefono": "+54 9 11 1234-5678",
      "rol": "cliente",
      "activo": true,
      "googleId": null,
      "avatar": null
    }
  }
}
```

---

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

---

## 🛒 Carrito de Compras

### Obtener Carrito del Usuario

```bash
curl -X GET http://localhost:3000/api/carrito \
  -b cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "carrito": {
      "id": 1,
      "items": [
        {
          "id": 1,
          "cantidad": 2,
          "precio_unitario": "15000.00",
          "subtotal": "30000.00",
          "fechaViaje": {
            "id_fechas_viaje": 1,
            "fecha_inicio": "2024-12-15T00:00:00.000Z",
            "fecha_fin": "2024-12-18T00:00:00.000Z",
            "cupos_disponibles": 8,
            "precio_fecha": "15000.00",
            "viaje": {
              "id_viaje": 1,
              "titulo": "Aconcagua - Cumbre",
              "dificultad": "extremo",
              "duracion_dias": 14,
              "imagen_principal_url": "http://localhost:3000/uploads/viajes/1/img-1234.jpg"
            }
          }
        }
      ],
      "subtotal": 30000,
      "totalItems": 2,
      "createdAt": "2024-10-14T03:30:00.000Z",
      "updatedAt": "2024-10-14T03:35:00.000Z"
    }
  }
}
```

---

### Agregar Item al Carrito

```bash
curl -X POST http://localhost:3000/api/carrito/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "fechaViajeId": 1,
    "cantidad": 2
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Item agregado al carrito",
  "data": {
    "item": {
      "id": 1,
      "cantidad": 2,
      "precio_unitario": "15000.00",
      "subtotal": "30000.00",
      "fechaViaje": {
        "id_fechas_viaje": 1,
        "fecha_inicio": "2024-12-15T00:00:00.000Z",
        "fecha_fin": "2024-12-18T00:00:00.000Z",
        "viaje": {
          "titulo": "Aconcagua - Cumbre",
          "duracion_dias": 14
        }
      }
    }
  }
}
```

---

### Actualizar Cantidad de un Item

```bash
curl -X PUT http://localhost:3000/api/carrito/items/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "cantidad": 3
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Item actualizado",
  "data": {
    "item": {
      "id": 1,
      "cantidad": 3,
      "precio_unitario": "15000.00",
      "subtotal": "45000.00"
    }
  }
}
```

---

### Eliminar Item del Carrito

```bash
curl -X DELETE http://localhost:3000/api/carrito/items/1 \
  -b cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Item eliminado del carrito"
}
```

---

### Checkout (Procesar Compra)

```bash
curl -X POST http://localhost:3000/api/carrito/checkout \
  -b cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Checkout procesado exitosamente",
  "data": {
    "orderId": "ORDER-1729212345678",
    "subtotal": 45000,
    "totalItems": 3,
    "items": [
      {
        "id": 1,
        "cantidad": 3,
        "precio_unitario": "15000.00",
        "subtotal": "45000.00"
      }
    ]
  }
}
```

> **Nota**: Actualmente es un placeholder. En producción, aquí se integraría con un procesador de pagos (Mercado Pago, Stripe, etc.)

---

## 📧 Contacto y Notificaciones

### Enviar Mensaje de Contacto (Público)

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@example.com",
    "asunto": "Consulta sobre viaje al Aconcagua",
    "mensaje": "Hola, me interesa saber más sobre el viaje al Aconcagua en diciembre. ¿Qué nivel de experiencia se requiere?"
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Mensaje enviado exitosamente",
  "data": {
    "mensajeId": 1
  }
}
```

> **Nota**: Este endpoint es público (no requiere autenticación). Automáticamente:
> - Crea una notificación para administradores
> - Envía un email a los admins configurados en `ADMIN_EMAILS`
> - Emite un evento Socket.IO para notificación en tiempo real

---

### Listar Notificaciones (Admin)

```bash
# Todas las notificaciones
curl -X GET http://localhost:3000/api/admin/notificaciones \
  -b admin-cookies.txt

# Solo no leídas
curl -X GET "http://localhost:3000/api/admin/notificaciones?leido=false" \
  -b admin-cookies.txt

# Con paginación
curl -X GET "http://localhost:3000/api/admin/notificaciones?page=1&limit=10" \
  -b admin-cookies.txt

# Filtrar por tipo
curl -X GET "http://localhost:3000/api/admin/notificaciones?tipo=contact_form" \
  -b admin-cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "notificaciones": [
      {
        "id": 1,
        "tipo": "contact_form",
        "mensaje": "María García (maria@example.com): Consulta sobre viaje al Aconcagua",
        "leido": false,
        "from_email": "maria@example.com",
        "to_admin": true,
        "meta": {
          "contactoId": 1,
          "nombre": "María García",
          "asunto": "Consulta sobre viaje al Aconcagua"
        },
        "createdAt": "2024-10-14T03:45:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    },
    "notificacionesNoLeidas": 5
  }
}
```

---

### Marcar Notificación como Leída (Admin)

```bash
curl -X PUT http://localhost:3000/api/admin/notificaciones/1/read \
  -b admin-cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Notificación marcada como leída",
  "data": {
    "notificacion": {
      "id": 1,
      "leido": true,
      "mensaje": "María García (maria@example.com): Consulta sobre viaje al Aconcagua"
    }
  }
}
```

---

### Responder a un Mensaje de Contacto (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/notificaciones/1/reply \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "respuesta": "Hola María, gracias por tu consulta. El viaje al Aconcagua requiere experiencia previa en alta montaña y un buen estado físico. Te recomiendo comenzar con nuestros trekkings de nivel moderado. ¿Te gustaría recibir más información sobre nuestros programas de entrenamiento?"
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Respuesta enviada exitosamente",
  "data": {
    "mensajeContacto": {
      "id": 1,
      "nombre": "María García",
      "email": "maria@example.com",
      "asunto": "Consulta sobre viaje al Aconcagua",
      "mensaje": "Hola, me interesa saber más...",
      "estado": "respondido",
      "respuesta": "Hola María, gracias por tu consulta...",
      "respondido_por": 1,
      "fecha_respuesta": "2024-10-14T04:00:00.000Z"
    },
    "notificacion": {
      "id": 1,
      "leido": true
    }
  }
}
```

> **Nota**: Automáticamente:
> - Envía un email a `maria@example.com` con la respuesta
> - Marca la notificación como leída
> - Actualiza el estado del mensaje a "respondido"

---

### Obtener Mensajes de Contacto (Admin)

```bash
# Todos los mensajes
curl -X GET http://localhost:3000/api/admin/mensajes \
  -b admin-cookies.txt

# Filtrar por estado
curl -X GET "http://localhost:3000/api/admin/mensajes?estado=nuevo" \
  -b admin-cookies.txt

# Con paginación
curl -X GET "http://localhost:3000/api/admin/mensajes?page=1&limit=20" \
  -b admin-cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "mensajes": [
      {
        "id": 1,
        "nombre": "María García",
        "email": "maria@example.com",
        "asunto": "Consulta sobre viaje al Aconcagua",
        "mensaje": "Hola, me interesa saber más...",
        "estado": "respondido",
        "respuesta": "Hola María, gracias por tu consulta...",
        "respondido_por": 1,
        "fecha_respuesta": "2024-10-14T04:00:00.000Z",
        "fecha_creacion": "2024-10-14T03:45:00.000Z",
        "adminRespondio": {
          "id_usuarios": 1,
          "nombre": "Admin",
          "apellido": "TrekkingAR",
          "email": "admin@trekking.com"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "totalPages": 2
    }
  }
}
```

---

## 🏔️ Viajes

### Listar Viajes

```bash
# Todos los viajes
curl -X GET http://localhost:3000/api/viajes

# Con filtros
curl -X GET "http://localhost:3000/api/viajes?dificultad=moderado&categoria=1&page=1&limit=12"

# Búsqueda por texto
curl -X GET "http://localhost:3000/api/viajes?search=aconcagua"

# Solo viajes activos
curl -X GET "http://localhost:3000/api/viajes?activo=true"
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "viajes": [
      {
        "id_viaje": 1,
        "titulo": "Aconcagua - Cumbre",
        "descripcion_corta": "Expedición al techo de América",
        "dificultad": "extremo",
        "duracion_dias": 14,
        "precio_base": "15000.00",
        "imagen_principal_url": "http://localhost:3000/uploads/viajes/1/img-main.jpg",
        "activo": true,
        "categoria": {
          "id_categoria": 1,
          "nombre": "Alta Montaña",
          "descripcion": "Expediciones en alta montaña"
        },
        "fechas": [
          {
            "id_fechas_viaje": 1,
            "fecha_inicio": "2024-12-15",
            "fecha_fin": "2024-12-28",
            "cupos_disponibles": 8,
            "estado_fecha": "disponible",
            "precio_fecha": "15000.00"
          }
        ],
        "imagenes": [
          {
            "id": 1,
            "url": "http://localhost:3000/uploads/viajes/1/img-1.jpg",
            "orden": 1
          }
        ]
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 12,
      "totalPages": 3
    }
  }
}
```

---

### Obtener Viaje por ID

```bash
curl -X GET http://localhost:3000/api/viajes/1
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "viaje": {
      "id_viaje": 1,
      "id_categoria": 1,
      "titulo": "Aconcagua - Cumbre",
      "descripcion_corta": "Expedición al techo de América",
      "descripcion_completa": "Expedición de 14 días al cerro Aconcagua (6,962 msnm)...",
      "itinerario_detallado": "Día 1: Mendoza - Penitentes...",
      "dificultad": "extremo",
      "duracion_dias": 14,
      "precio_base": "15000.00",
      "imagen_principal_url": "http://localhost:3000/uploads/viajes/1/img-main.jpg",
      "condiciones_fisicas": "Excelente estado físico, experiencia en alta montaña",
      "minimo_participantes": 4,
      "activo": true,
      "categoria": {
        "id_categoria": 1,
        "nombre": "Alta Montaña"
      },
      "fechas": [
        {
          "id_fechas_viaje": 1,
          "fecha_inicio": "2024-12-15T00:00:00.000Z",
          "fecha_fin": "2024-12-28T00:00:00.000Z",
          "cupos_disponibles": 8,
          "cupos_ocupados": 2,
          "precio_fecha": "15000.00",
          "estado_fecha": "disponible"
        }
      ],
      "imagenes": [
        {
          "id": 1,
          "url": "http://localhost:3000/uploads/viajes/1/img-1.jpg",
          "orden": 1,
          "descripcion": "Vista del Aconcagua"
        },
        {
          "id": 2,
          "url": "http://localhost:3000/uploads/viajes/1/img-2.jpg",
          "orden": 2,
          "descripcion": "Campo base"
        }
      ]
    }
  }
}
```

---

## 📷 Carga de Imágenes

### Subir Imágenes para un Viaje (Admin)

```bash
curl -X POST http://localhost:3000/api/viajes/1/images \
  -b admin-cookies.txt \
  -F "imagenes=@/path/to/imagen1.jpg" \
  -F "imagenes=@/path/to/imagen2.jpg" \
  -F "imagenes=@/path/to/imagen3.jpg"
```

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "3 imagen(es) subida(s) exitosamente",
  "data": {
    "imagenes": [
      {
        "id": 1,
        "url": "http://localhost:3000/uploads/viajes/1/img-1729212345678-123456789.jpg",
        "orden": 1,
        "descripcion": "Imagen 1 de Aconcagua - Cumbre"
      },
      {
        "id": 2,
        "url": "http://localhost:3000/uploads/viajes/1/img-1729212345678-987654321.jpg",
        "orden": 2,
        "descripcion": "Imagen 2 de Aconcagua - Cumbre"
      },
      {
        "id": 3,
        "url": "http://localhost:3000/uploads/viajes/1/img-1729212345678-456789123.jpg",
        "orden": 3,
        "descripcion": "Imagen 3 de Aconcagua - Cumbre"
      }
    ]
  }
}
```

**Restricciones:**
- Máximo 10 archivos por request
- Máximo 5MB por archivo
- Formatos permitidos: JPEG, PNG, WebP

---

### Eliminar Imagen (Admin)

```bash
curl -X DELETE http://localhost:3000/api/viajes/1/images/2 \
  -b admin-cookies.txt
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Imagen eliminada exitosamente"
}
```

---

### Actualizar Orden de Imágenes (Admin)

```bash
curl -X PUT http://localhost:3000/api/viajes/1/images/order \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "imagenes": [
      { "id": 3, "orden": 1 },
      { "id": 1, "orden": 2 },
      { "id": 2, "orden": 3 }
    ]
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Orden de imágenes actualizado"
}
```

---

## 📊 Respuestas y Códigos de Estado

### Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Request exitoso (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | Sin autenticación o token inválido |
| 403 | Forbidden | No tiene permisos para este recurso |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

### Estructura de Respuestas

#### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Mensaje descriptivo (opcional)",
  "data": {
    // Datos de respuesta
  }
}
```

#### Respuesta con Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    // Array de errores de validación (opcional)
  ]
}
```

---

### Ejemplo de Error de Validación

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
```

**Respuesta (400 Bad Request):**
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Debe ser un email válido",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "La contraseña debe tener al menos 6 caracteres",
      "path": "password",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "El nombre debe tener al menos 2 caracteres",
      "path": "nombre",
      "location": "body"
    }
  ]
}
```

---

## 🔗 Testing con Postman

Puedes importar la colección de Postman incluida en el repositorio:

```bash
# Archivo: back/postman-collection.json
```

1. Abre Postman
2. Importa la colección
3. Configura las variables de entorno:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (se actualiza automáticamente después del login)

---

## 💡 Tips y Buenas Prácticas

### 1. Manejo de Cookies

Para mantener la sesión entre requests:

```bash
# Guardar cookies en un archivo
curl -c cookies.txt ...

# Usar cookies guardadas
curl -b cookies.txt ...
```

### 2. Debug de Requests

Para ver los headers completos:

```bash
curl -v http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### 3. JSON Pretty Print

Para formatear la respuesta JSON:

```bash
curl ... | jq '.'
```

### 4. Guardar Respuesta en Archivo

```bash
curl ... > response.json
```

---

## 📞 Soporte

Si encuentras algún problema con los ejemplos:

1. Verifica que el servidor esté corriendo: `npm run dev`
2. Verifica las variables de entorno en `.env`
3. Revisa los logs del servidor en la terminal
4. Consulta la [documentación completa](./README.md)

---

🏔️ **TrekkingAR API** - v1.0.0
