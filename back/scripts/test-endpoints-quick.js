// Usando fetch nativo de Node.js (disponible desde Node 18+)
const BASE_URL = "http://localhost:3000/api"

// Colores para la consola
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
}

async function testEndpoint(method, url, headers = {}, body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    console.log(`${colors.blue}${colors.bold}Testing:${colors.reset} ${method} ${url}`)

    const response = await fetch(url, options)
    const data = await response.text()

    if (response.ok) {
      console.log(`${colors.green}✅ SUCCESS${colors.reset} - Status: ${response.status}`)
      try {
        const jsonData = JSON.parse(data)
        console.log(`${colors.green}Response:${colors.reset}`, JSON.stringify(jsonData, null, 2))
      } catch {
        console.log(`${colors.green}Response:${colors.reset}`, data)
      }
    } else {
      console.log(`${colors.red}❌ FAILED${colors.reset} - Status: ${response.status}`)
      console.log(`${colors.red}Error:${colors.reset}`, data)
    }

    console.log("─".repeat(60))
    return { success: response.ok, status: response.status, data }
  } catch (error) {
    console.log(`${colors.red}❌ CONNECTION ERROR${colors.reset}`)
    console.log(`${colors.red}Error:${colors.reset}`, error.message)
    console.log("─".repeat(60))
    return { success: false, error: error.message }
  }
}

async function runDiagnostics() {
  console.log(`${colors.bold}${colors.blue}🔍 DIAGNÓSTICO RÁPIDO DE ENDPOINTS${colors.reset}\n`)

  let token = null

  // 1. Test básico de conexión
  console.log(`${colors.yellow}1. Verificando conexión básica...${colors.reset}`)
  await testEndpoint("GET", `${BASE_URL}/health`)
  await testEndpoint("GET", `${BASE_URL}/test`)

  // 2. Test de autenticación
  console.log(`${colors.yellow}2. Probando autenticación...${colors.reset}`)
  const loginResult = await testEndpoint(
    "POST",
    `${BASE_URL}/auth/login`,
    {},
    {
      email: "admin@trekking.com",
      password: "123456",
    },
  )

  if (loginResult.success && loginResult.data) {
    try {
      const loginData = JSON.parse(loginResult.data)
      token = loginData.data?.token
      console.log(`${colors.green}🔑 Token obtenido exitosamente${colors.reset}`)
    } catch (e) {
      console.log(`${colors.red}❌ Error al extraer token${colors.reset}`)
    }
  }

  if (!token) {
    console.log(`${colors.red}❌ No se pudo obtener token. Probando con usuario regular...${colors.reset}`)
    const userLoginResult = await testEndpoint(
      "POST",
      `${BASE_URL}/auth/login`,
      {},
      {
        email: "test@example.com",
        password: "123456",
      },
    )

    if (userLoginResult.success && userLoginResult.data) {
      try {
        const userData = JSON.parse(userLoginResult.data)
        token = userData.data?.token
      } catch (e) {
        console.log(`${colors.red}❌ Error al extraer token de usuario regular${colors.reset}`)
      }
    }
  }

  // 3. Test de endpoints de reservas
  if (token) {
    console.log(`${colors.yellow}3. Probando endpoints de reservas...${colors.reset}`)
    const authHeaders = { Authorization: `Bearer ${token}` }

    // Mis reservas
    await testEndpoint("GET", `${BASE_URL}/reservas/mis-reservas`, authHeaders)

    // Todas las reservas (admin)
    await testEndpoint("GET", `${BASE_URL}/reservas`, authHeaders)

    // Crear reserva
    await testEndpoint("POST", `${BASE_URL}/reservas`, authHeaders, {
      id_fecha_viaje: 1,
      cantidad_personas: 2,
      observaciones_reserva: "Reserva de prueba desde diagnóstico",
    })

    // Cambiar estado de reserva (admin) - ESTE ES EL ENDPOINT QUE FALTABA
    await testEndpoint("PUT", `${BASE_URL}/reservas/1/estado`, authHeaders, {
      estado_reserva: "confirmada",
      observaciones_reserva: "Confirmada desde diagnóstico",
    })

    // Cancelar reserva
    await testEndpoint("PUT", `${BASE_URL}/reservas/1/cancelar`, authHeaders)
  } else {
    console.log(`${colors.red}❌ No se pudo obtener token. Saltando tests de reservas.${colors.reset}`)
  }

  // 4. Test de otros endpoints
  console.log(`${colors.yellow}4. Probando otros endpoints...${colors.reset}`)
  await testEndpoint("GET", `${BASE_URL}/categorias`)
  await testEndpoint("GET", `${BASE_URL}/viajes`)

  console.log(`${colors.bold}${colors.green}✅ Diagnóstico completado${colors.reset}`)

  // Resumen de URLs disponibles
  console.log(`\n${colors.bold}${colors.blue}📋 ENDPOINTS DISPONIBLES:${colors.reset}`)
  console.log(`
${colors.green}✅ Básicos:${colors.reset}
  GET  ${BASE_URL}/health
  GET  ${BASE_URL}/test

${colors.green}✅ Autenticación:${colors.reset}
  POST ${BASE_URL}/auth/register
  POST ${BASE_URL}/auth/login
  GET  ${BASE_URL}/auth/profile

${colors.green}✅ Reservas:${colors.reset}
  POST ${BASE_URL}/reservas
  GET  ${BASE_URL}/reservas/mis-reservas
  GET  ${BASE_URL}/reservas (admin)
  PUT  ${BASE_URL}/reservas/:id/estado (admin) ⭐ NUEVO
  PUT  ${BASE_URL}/reservas/:id/cancelar ⭐ NUEVO

${colors.green}✅ Categorías:${colors.reset}
  GET  ${BASE_URL}/categorias
  GET  ${BASE_URL}/categorias/:id
  POST ${BASE_URL}/categorias (admin)

${colors.green}✅ Viajes:${colors.reset}
  GET  ${BASE_URL}/viajes
  GET  ${BASE_URL}/viajes/:id
  GET  ${BASE_URL}/viajes/categoria/:id
  POST ${BASE_URL}/viajes (admin)
  `)

  console.log(`\n${colors.bold}${colors.yellow}🔑 CREDENCIALES PARA PROBAR:${colors.reset}`)
  console.log(`
${colors.blue}Admin:${colors.reset}
  Email: admin@trekking.com
  Password: 123456

${colors.blue}Usuario Regular:${colors.reset}
  Email: test@example.com
  Password: 123456
  `)
}

// Ejecutar diagnósticos
runDiagnostics().catch(console.error)
