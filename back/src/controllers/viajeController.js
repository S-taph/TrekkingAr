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
      activo = true 
    } = req.query;
    
    const offset = (page - 1) * limit;

    // Construir filtros
    const where = {};
    if (activo !== undefined) {
      where.activo = activo === 'true';
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
      
      // Agregar URL completa a las imágenes
      if (viajeData.imagenes) {
        viajeData.imagenes = viajeData.imagenes.map(img => ({
          ...img,
          url: getFileUrl(req, img.url_local, viaje.id_viaje)
        }));
      }

      // Agregar imagen principal si existe
      if (viajeData.imagen_principal_url) {
        viajeData.imagen_principal_url = getFileUrl(req, viajeData.imagen_principal_url, viaje.id_viaje);
      }

      return viajeData;
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
    
    if (viajeData.imagenes) {
      viajeData.imagenes = viajeData.imagenes.map(img => ({
        ...img,
        url: getFileUrl(req, img.url_local, viaje.id_viaje)
      }));
    }

    if (viajeData.imagen_principal_url) {
      viajeData.imagen_principal_url = getFileUrl(req, viajeData.imagen_principal_url, viaje.id_viaje);
    }

    res.json({
      success: true,
      data: {
        viaje: viajeData
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
      
      // Crear registro en la base de datos
      const imagenViaje = await ImagenViaje.create({
        id_viaje: parseInt(id),
        url_local: file.filename,
        orden: i + 1,
        descripcion: `Imagen ${i + 1} de ${viaje.titulo}`
      });

      imagenesSubidas.push({
        id: imagenViaje.id,
        url: getFileUrl(req, file.filename, id),
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

    // Verificar que el viaje existe
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({
        success: false,
        message: 'Viaje no encontrado'
      });
    }

    // Buscar la imagen
    const imagen = await ImagenViaje.findOne({
      where: {
        id: imagenId,
        id_viaje: id
      }
    });

    if (!imagen) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    // Eliminar archivo físico
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'uploads', 'viajes', id, imagen.url_local);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de la base de datos
    await imagen.destroy();

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
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