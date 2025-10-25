/**
 * Utilidades para construir URLs de imágenes
 *
 * Detecta si la imagen guardada en DB es:
 * - URL completa (http://... o https://...)
 * - Path relativo (/uploads/... o uploads/...)
 * - Solo nombre de archivo
 */

const API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3003';

/**
 * Construye URL completa para una imagen
 * @param {string} img - URL, path o nombre de archivo
 * @param {number} viajeId - ID del viaje (opcional)
 * @returns {string|null} URL completa o null si no hay imagen
 */
export const buildImageUrl = (img, viajeId = null) => {
  if (!img) return null;

  // Si ya es una URL completa, retornarla tal cual
  if (/^https?:\/\//.test(img)) {
    return img;
  }

  // Si comienza con /uploads o uploads/, construir URL completa
  if (img.startsWith('/uploads') || img.startsWith('uploads/')) {
    return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  }

  // Asumir que es solo el nombre de archivo
  if (viajeId) {
    return `${API_URL}/uploads/viajes/${viajeId}/${img}`;
  }

  // Sin viajeId, asumir que está en uploads root
  return `${API_URL}/uploads/${img}`;
};

/**
 * Procesa un array de imágenes
 * @param {Array} imagenes - Array de strings o objetos con campo url
 * @param {number} viajeId - ID del viaje
 * @returns {Array} Array de URLs procesadas
 */
export const buildImageUrls = (imagenes, viajeId = null) => {
  if (!Array.isArray(imagenes)) return [];

  return imagenes
    .map(img => {
      // Si es un objeto con campo url (ej: ImagenViaje)
      if (typeof img === 'object' && img.url) {
        return buildImageUrl(img.url, viajeId);
      }
      // Si es un string directo
      if (typeof img === 'string') {
        return buildImageUrl(img, viajeId);
      }
      return null;
    })
    .filter(Boolean); // Remover nulls
};

/**
 * Obtiene la imagen principal de un viaje
 * @param {Object} viaje - Objeto del viaje
 * @returns {string|null} URL de la imagen principal
 */
export const getViajeMainImage = (viaje) => {
  if (!viaje) return null;

  // Prioridad 1: imagen_principal_url
  if (viaje.imagen_principal_url) {
    return buildImageUrl(viaje.imagen_principal_url, viaje.id_viaje);
  }

  // Prioridad 2: primera imagen del array imagenes
  if (viaje.imagenes && Array.isArray(viaje.imagenes) && viaje.imagenes.length > 0) {
    const primeraImagen = viaje.imagenes[0];
    if (typeof primeraImagen === 'object' && primeraImagen.url) {
      return buildImageUrl(primeraImagen.url, viaje.id_viaje);
    }
    if (typeof primeraImagen === 'string') {
      return buildImageUrl(primeraImagen, viaje.id_viaje);
    }
  }

  // Fallback: imagen placeholder
  return '/placeholder-trip.jpg';
};

/**
 * Maneja error de carga de imagen y establece placeholder
 * @param {Event} e - Evento de error
 */
export const handleImageError = (e) => {
  e.target.src = '/placeholder-trip.jpg';
  e.target.onerror = null; // Prevenir loop infinito
};
