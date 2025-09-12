"use client"

const GuiaDetail = ({ guia, onClose }) => {
  if (!guia) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detalles del Guía</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID del Guía</label>
              <p className="text-gray-900">{guia.id_guia}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <p className="text-gray-900">
                {guia.usuario?.nombre} {guia.usuario?.apellido}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificaciones</label>
              <p className="text-gray-900">{guia.certificaciones || "No especificado"}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades</label>
              <p className="text-gray-900">{guia.especialidades || "No especificado"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Años de Experiencia</label>
              <p className="text-gray-900">{guia.anos_experiencia || "No especificado"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
              <p className="text-gray-900">{guia.idiomas || "No especificado"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Día</label>
              <p className="text-gray-900">{guia.tarifa_por_dia ? `$${guia.tarifa_por_dia}` : "No especificado"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  guia.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {guia.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calificación Promedio</label>
              <p className="text-gray-900">
                {guia.calificacion_promedio ? `${guia.calificacion_promedio}/5` : "Sin calificar"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Viajes Guiados</label>
              <p className="text-gray-900">{guia.total_viajes_guiados || 0}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro</label>
              <p className="text-gray-900">
                {guia.fecha_registro ? new Date(guia.fecha_registro).toLocaleDateString() : "No disponible"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Última Actualización</label>
              <p className="text-gray-900">
                {guia.fecha_actualizacion ? new Date(guia.fecha_actualizacion).toLocaleDateString() : "No disponible"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuiaDetail
