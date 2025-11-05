import { Usuario, UsuarioRol } from "../src/models/associations.js"

async function testUsuarioRoles() {
  try {
    console.log("🔍 Testeando obtención de usuarios con roles...\n")

    const usuarios = await Usuario.findAll({
      where: { email: "juanrojas.edu@gmail.com" },
      attributes: ["id_usuarios", "nombre", "apellido", "email", "dni", "rol", "activo", "created_at"],
      include: [
        {
          model: UsuarioRol,
          as: "roles",
          where: { activo: true },
          required: false,
          attributes: ["rol"],
        },
      ],
    })

    // Simular el mapeo del controlador
    const usuariosWithRoles = usuarios.map((usuario) => {
      const usuarioData = usuario.toJSON()
      // Incluir el rol principal del campo 'rol' de la tabla usuarios
      const rolPrincipal = usuarioData.rol
      // Incluir los roles adicionales de la tabla usuario_roles
      const rolesAdicionales = usuario.roles?.map((r) => r.rol) || []
      // Combinar ambos y eliminar duplicados
      const todosLosRoles = [rolPrincipal, ...rolesAdicionales]
      usuarioData.rolesArray = [...new Set(todosLosRoles)].filter(Boolean)
      return usuarioData
    })

    console.log("📊 Resultado del mapeo:\n")
    usuariosWithRoles.forEach((u) => {
      console.log(`Usuario: ${u.nombre} ${u.apellido}`)
      console.log(`Email: ${u.email}`)
      console.log(`Rol principal (tabla usuarios): ${u.rol}`)
      console.log(`Roles en usuario_roles:`, u.roles?.map((r) => r.rol))
      console.log(`✅ rolesArray final:`, u.rolesArray)
      console.log()
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

testUsuarioRoles()
