/**
 * Viaje Controller
 * 
 * Controlador para manejo de viajes y sus imágenes.
 * Incluye endpoints para CRUD de viajes y upload de imágenes.
 */

import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { Viaje, FechaViaje, Categoria, ImagenViaje } from "../models/associations.js";
import { upload, handleMulterError, getFileUrl } from "../config/multer.js";
import { processViajeImages } from "../utils/imageUrlHelper.js";

/**
 * Obtiene todos los viajes con filtros y paginación
 */
export const getViajes = async (req, res) => {
  try {
    const {
      categoria,
      dificultad,
      search,
      page = 1,
      limit = 12,
      activo = true,
      destacado
    } = req.query;
    
    const offset = (page - 1) * limit;

    // Construir filtros
    const where = {};
    if (activo !== undefined) {
      where.activo = activo === 'true';
    }

    if (destacado !== undefined) {
      where.destacado = destacado === 'true';
    }

    if (dificultad) {
      where.dificultad = dificultad;
    }

    if (search) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { descripcion_corta: { [Op.like]: `%${search}%` } }
      ];
    }

    // Construir include para categoría
    const include = [
      {
        model: Categoria,
        as: 'categoria'
      },
      {
        model: FechaViaje,
        as: 'fechas',
        where: { estado_fecha: 'disponible' },
        required: false
      },
      {
        model: ImagenViaje,
        as: 'imagenes',
        required: false
      }
    ];

    // Filtrar por categoría si se especifica
    if (categoria) {
      include[0].where = { id_categoria: categoria };
    }

    // Obtener viajes con paginación
    const { count, rows: viajes } = await Viaje.findAndCountAll({
      where,
      include,
      order: [['fecha_creacion', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Procesar URLs de imágenes
    const viajesConImagenes = viajes.map(viaje => {
      const viajeData = viaje.toJSON();
      return processViajeImages(viajeData, req);
    });

    res.json({
      success: true,
      data: {
        viajes: viajesConImagenes,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo viajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un viaje por ID con todas sus relaciones
 */
export const getViajeById = async (req, res) => {
  try {
    const { id } = req.params;

    const viaje = await Viaje.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria'
        },
        {
          model: FechaViaje,
          as: 'fechas',
          order: [['fecha_inicio', 'ASC']]
        },
        {
          model: ImagenViaje,
          as: 'imagenes',
          order: [['orden', 'ASC']]
        }
      ]
    });

    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Procesar URLs de imágenes
    const viajeData = viaje.toJSON();
    const viajeConImagenes = processViajeImages(viajeData, req);

    res.json({
      success: true,
      data: {
        viaje: viajeConImagenes
      }
    });

  } catch (error) {
    console.error('Error obteniendo viaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Sube imágenes para un viaje específico
 */
export const uploadImagenes = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el viaje existe
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Verificar que hay archivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se subieron archivos'
      });
    }

    // Procesar archivos subidos
    const imagenesSubidas = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      // Generar URL completa del archivo
      const urlCompleta = getFileUrl(req, file.filename, id);

      // Crear registro en la base de datos con URL completa
      const imagenViaje = await ImagenViaje.create({
        id_viaje: parseInt(id),
        url: urlCompleta,
        orden: i + 1,
        descripcion: `Imagen ${i + 1} de ${viaje.titulo}`
      });

      imagenesSubidas.push({
        id: imagenViaje.id_imagen_viaje,
        url: imagenViaje.url,
        orden: imagenViaje.orden,
        descripcion: imagenViaje.descripcion
      });
    }

    res.status(201).json({
      success: true,
      message: `${req.files.length} imagen(es) subida(s) exitosamente`,
      data: {
        imagenes: imagenesSubidas
      }
    });

  } catch (error) {
    console.error('Error subiendo imágenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Elimina una imagen de un viaje
 */
export const deleteImagen = async (req, res) => {
  try {
    const { id, imagenId } = req.params;

    console.log(`[deleteImagen] Intentando borrar imagen ${imagenId} del viaje ${id}`);

    // Verificar que el viaje existe
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Buscar la imagen - FIX: usar id_imagen_viaje en lugar de id
    const imagen = await ImagenViaje.findOne({
      where: {
        id_imagen_viaje: imagenId,
        id_viaje: id
      }
    });

    if (!imagen) {
      console.error(`[deleteImagen] Imagen ${imagenId} no encontrada para viaje ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    // Si esta imagen es la principal del viaje, limpiar referencia
    if (viaje.imagen_principal_url === imagen.url) {
      console.log(`[deleteImagen] Limpiando imagen_principal_url del viaje ${id}`);
      await viaje.update({ imagen_principal_url: null });
    }

    // Eliminar archivo físico
    try {
      const fs = await import('fs');
      const path = await import('path');

      // Extraer el nombre del archivo de la URL
      // Si es URL completa: http://localhost:3003/uploads/viajes/file.jpg
      // Si es path relativo: /uploads/viajes/file.jpg
      let fileName = imagen.url;
      if (fileName.includes('/uploads/')) {
        fileName = fileName.split('/uploads/')[1];
      }

      const filePath = path.join(process.cwd(), 'uploads', fileName);
      console.log(`[deleteImagen] Intentando borrar archivo: ${filePath}`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[deleteImagen] Archivo físico eliminado: ${filePath}`);
      } else {
        console.warn(`[deleteImagen] Archivo no encontrado en disco: ${filePath}`);
      }
    } catch (fsError) {
      console.error('[deleteImagen] Error al eliminar archivo físico:', fsError);
      // Continuar aunque falle la eliminación del archivo físico
    }

    // Eliminar registro de la base de datos
    await imagen.destroy();
    console.log(`[deleteImagen] Registro de imagen ${imagenId} eliminado de la BD`);

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });

  } catch (error) {
    console.error('[deleteImagen] Error eliminando imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Actualiza el orden de las imágenes
 */
export const updateImagenOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagenes } = req.body;

    if (!Array.isArray(imagenes)) {
      return res.status(400).json({
        success: false,
        message: 'Las imágenes deben ser un array'
      });
    }

    // Verificar que el viaje existe
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Actualizar orden de cada imagen
    for (const img of imagenes) {
      await ImagenViaje.update(
        { orden: img.orden },
        {
          where: {
            id: img.id,
            id_viaje: id
          }
        }
      );
    }

    res.json({
      success: true,
      message: 'Orden de imágenes actualizado'
    });

  } catch (error) {
    console.error('Error actualizando orden de imágenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Crea un nuevo viaje
 * ✅ Conectado con frontend
 */
export const createViaje = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const {
      titulo,
      descripcion,
      descripcion_corta,
      destino,
      duracion_dias,
      dificultad,
      precio_base,
      id_categoria,
      incluye,
      no_incluye,
      itinerario
    } = req.body;

    const nuevoViaje = await Viaje.create({
      titulo,
      descripcion,
      descripcion_corta,
      destino,
      duracion_dias: parseInt(duracion_dias),
      dificultad,
      precio_base: parseFloat(precio_base),
      id_categoria: id_categoria ? parseInt(id_categoria) : null,
      incluye: incluye ? JSON.stringify(incluye) : null,
      no_incluye: no_incluye ? JSON.stringify(no_incluye) : null,
      itinerario: itinerario ? JSON.stringify(itinerario) : null,
      activo: true
    });

    res.status(201).json({
      success: true,
      message: 'Viaje creado exitosamente',
      data: { viaje: nuevoViaje }
    });

  } catch (error) {
    console.error('Error creando viaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Actualiza un viaje existente
 * ✅ Conectado con frontend
 */
export const updateViaje = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    const {
      titulo,
      descripcion,
      descripcion_corta,
      destino,
      duracion_dias,
      dificultad,
      precio_base,
      id_categoria,
      incluye,
      no_incluye,
      itinerario,
      activo
    } = req.body;

    await viaje.update({
      titulo: titulo || viaje.titulo,
      descripcion: descripcion || viaje.descripcion,
      descripcion_corta: descripcion_corta || viaje.descripcion_corta,
      destino: destino || viaje.destino,
      duracion_dias: duracion_dias ? parseInt(duracion_dias) : viaje.duracion_dias,
      dificultad: dificultad || viaje.dificultad,
      precio_base: precio_base ? parseFloat(precio_base) : viaje.precio_base,
      id_categoria: id_categoria !== undefined ? parseInt(id_categoria) : viaje.id_categoria,
      incluye: incluye ? JSON.stringify(incluye) : viaje.incluye,
      no_incluye: no_incluye ? JSON.stringify(no_incluye) : viaje.no_incluye,
      itinerario: itinerario ? JSON.stringify(itinerario) : viaje.itinerario,
      activo: activo !== undefined ? activo : viaje.activo
    });

    res.json({
      success: true,
      message: 'Viaje actualizado exitosamente',
      data: { viaje }
    });

  } catch (error) {
    console.error('Error actualizando viaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Elimina un viaje (soft delete)
 * ✅ Conectado con frontend
 */
export const deleteViaje = async (req, res) => {
  try {
    const { id } = req.params;

    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Soft delete: marcar como inactivo
    await viaje.update({ activo: false });

    res.json({
      success: true,
      message: 'Viaje eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando viaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};