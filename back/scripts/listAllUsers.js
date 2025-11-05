import Usuario from '../src/models/Usuario.js'
import sequelize from '../src/config/database.js'

async function listAllUsers() {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a base de datos exitosa\n')

    const usuarios = await Usuario.findAll({
      attributes: ['id_usuarios', 'nombre', 'apellido', 'email', 'avatar', 'rol'],
      order: [['id_usuarios', 'ASC']]
    })

    console.log(`📋 Total de usuarios en la base de datos: ${usuarios.length}\n`)

    usuarios.forEach((usuario, index) => {
      console.log(`${index + 1}. ID: ${usuario.id_usuarios}`)
      console.log(`   Nombre: ${usuario.nombre} ${usuario.apellido}`)
      console.log(`   Email: ${usuario.email}`)
      console.log(`   Rol: ${usuario.rol}`)
      console.log(`   Avatar: ${usuario.avatar || '(sin foto)'}`)

      if (usuario.avatar) {
        if (usuario.avatar.includes('googleusercontent')) {
          console.log(`   Tipo: 🔵 Foto de Google OAuth`)
        } else if (usuario.avatar.includes('/uploads/avatars/')) {
          console.log(`   Tipo: 📸 Foto subida localmente`)
        }
      }
      console.log('')
    })

    await sequelize.close()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

listAllUsers()
