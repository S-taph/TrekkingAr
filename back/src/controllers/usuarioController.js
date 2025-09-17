// controllers/usuarioController.js
import Usuario from '../models/Usuario.js'

const getUsuarios = async (req, res) => {
  try {
    const { search, rol } = req.query
    let query = { activo: true }

    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellido: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { dni: { $regex: search, $options: 'i' } }
      ]
    }

    if (rol) {
      query.rol = rol
    }

    const usuarios = await Usuario.find(query)
      .select('_id nombre apellido email dni rol')
      .limit(20)
      .sort({ apellido: 1, nombre: 1 })

    // Devuelve directamente el array para coincidir con tu patrón frontend
    res.json(usuarios)
    
  } catch (error) {
    console.error('Error en getUsuarios:', error)
    res.status(500).json({ 
      message: 'Error al obtener usuarios',
      error: error.message 
    })
  }
}

export { getUsuarios }