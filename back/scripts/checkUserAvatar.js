import Usuario from '../src/models/Usuario.js'
import sequelize from '../src/config/database.js'

async function checkUserAvatar() {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a base de datos exitosa')

    // Buscar el usuario por email
    const email = 'juampligamer2013@gmail.com'
    const usuario = await Usuario.findOne({
      where: { email },
      attributes: ['id_usuarios', 'nombre', 'apellido', 'email', 'avatar', 'rol']
    })

    if (!usuario) {
      console.log(`❌ No se encontró usuario con email: ${email}`)
      process.exit(0)
    }

    console.log('\n📋 Información del usuario:')
    console.log('ID:', usuario.id_usuarios)
    console.log('Nombre:', usuario.nombre, usuario.apellido)
    console.log('Email:', usuario.email)
    console.log('Rol:', usuario.rol)
    console.log('Avatar:', usuario.avatar || '(sin foto)')

    if (usuario.avatar) {
      console.log('\n✅ El usuario TIENE foto de perfil')
      console.log('URL:', usuario.avatar)

      if (usuario.avatar.includes('googleusercontent')) {
        console.log('⚠️  Es una foto de Google OAuth')
      } else if (usuario.avatar.includes('/uploads/avatars/')) {
        console.log('✅ Es una foto subida localmente')
      }
    } else {
      console.log('\n❌ El usuario NO tiene foto de perfil')
      console.log('Para subir una foto:')
      console.log('1. Inicia sesión en http://localhost:5173')
      console.log('2. Ve a http://localhost:5173/perfil')
      console.log('3. Haz clic en el ícono de cámara para subir una foto')
    }

    await sequelize.close()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkUserAvatar()
