// scripts/seedDatabase.js
import sequelize from '../src/config/database.js'
import bcrypt from 'bcryptjs'

const seedDatabase = async () => {
  try {
    console.log('🌱 Ejecutando seed de la base de datos...')

    const passwordHash = await bcrypt.hash('password123', 12)

    // Verificar si ya existen usuarios
    const existingUsers = await sequelize.models.usuarios.count()
    if (existingUsers > 0) {
      console.log('✅ La base de datos ya tiene datos, omitiendo seed')
      return
    }

    // Insertar usuarios de prueba
    await sequelize.models.usuarios.bulkCreate([
      {
        nombre: 'Admin',
        apellido: 'Sistema',
        dni: 12345678,
        email: 'admin@trekking.com',
        password_hash: passwordHash,
        telefono: '+54911234567',
        rol: 'admin',
        experiencia_previa: 'Administrador del sistema',
        activo: true,
        fecha_registro: new Date()
      },
      {
        nombre: 'Carlos',
        apellido: 'Mendez',
        dni: 23456789,
        email: 'carlos@example.com',
        password_hash: passwordHash,
        telefono: '+54911234568',
        rol: 'guia',
        experiencia_previa: 'Guía de montaña con 10 años de experiencia',
        activo: true,
        fecha_registro: new Date()
      },
      {
        nombre: 'Ana',
        apellido: 'Rodriguez',
        dni: 34567890,
        email: 'ana@example.com',
        password_hash: passwordHash,
        telefono: '+54911234569',
        rol: 'guia',
        experiencia_previa: 'Especialista en trekking y escalada',
        activo: true,
        fecha_registro: new Date()
      },
      {
        nombre: 'Miguel',
        apellido: 'Torres',
        dni: 45678901,
        email: 'miguel@example.com',
        password_hash: passwordHash,
        telefono: '+54911234570',
        rol: 'guia',
        experiencia_previa: 'Guía certificado en alta montaña',
        activo: true,
        fecha_registro: new Date()
      },
      {
        nombre: 'Juan',
        apellido: 'Perez',
        dni: 56789012,
        email: 'juan@example.com',
        password_hash: passwordHash,
        telefono: '+54911234571',
        rol: 'cliente',
        experiencia_previa: 'Principiante en trekking',
        activo: true,
        fecha_registro: new Date()
      }
    ])

    console.log('✅ Seed completado: 5 usuarios creados')
    console.log('📧 Emails de prueba:')
    console.log('   - admin@trekking.com (admin)')
    console.log('   - carlos@example.com (guía)')
    console.log('   - ana@example.com (guía)')
    console.log('   - miguel@example.com (guía)')
    console.log('   - juan@example.com (cliente)')
    console.log('🔐 Password para todos: password123')

    // Seed métodos de pago
    const existingMetodosPago = await sequelize.models.metodos_pago.count()
    if (existingMetodosPago === 0) {
      await sequelize.models.metodos_pago.bulkCreate([
        {
          nombre: 'tarjeta',
          descripcion: 'Pago con tarjeta de crédito/débito',
          activo: true,
          comision_porcentaje: 3.5
        },
        {
          nombre: 'pagar_despues',
          descripcion: 'Reservar con seña del 30% - Pagar más tarde',
          activo: true,
          comision_porcentaje: 0
        },
        {
          nombre: 'transferencia',
          descripcion: 'Transferencia bancaria',
          activo: true,
          comision_porcentaje: 0
        },
        {
          nombre: 'efectivo',
          descripcion: 'Pago en efectivo',
          activo: true,
          comision_porcentaje: 0
        }
      ])
      console.log('✅ Seed completado: 4 métodos de pago creados')
    }

  } catch (error) {
    console.error('❌ Error en el seed:', error.message)
  }
}

export default seedDatabase