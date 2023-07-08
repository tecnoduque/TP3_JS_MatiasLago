// Fijarse si hay servicios en el local storage y crear algunos 
let serviciosPosibles = JSON.parse(localStorage.getItem(`servicios`)) || [
  { id: 1, cant: 0, nombre: `Visita a domicilio`, precio: 3000 },
  { id: 2, cant: 0, nombre: `Adicional por distancia`, precio: 1500 },
  { id: 3, cant: 0, nombre: `Configuración modem / router / mikrotik / unifi)`, precio: 3500 },
  { id: 4, cant: 0, nombre: `Cableado estructurado con materiales x 20mts`, precio: 3000 },
  { id: 5, cant: 0, nombre: `Cableado estructurado sin materiales x 20mts`, precio: 3000 },
  { id: 6, cant: 0, nombre: `Trabajos sobre CCTV / Controles de acceso`, precio: 4000 },
  { id: 7, cant: 0, nombre: `Instalación sistemas operativos w10 / OSX`, precio: 8000 },
  { id: 8, cant: 0, nombre: `Instalación puesto de trabajo`, precio: 3000 },
  { id: 9, cant: 0, nombre: `Acceso remoto simple`, precio: 200 },
  { id: 10, cant: 0, nombre: `Acceso remoto complejo`, precio: 3500 },
  { id: 11, cant: 0, nombre: `Relevamientos eléctricos, de red, de CCTV`, precio: 2500 },
  { id: 12, cant: 0, nombre: `Cambios en página web, dominios, hosting, integraciones de pago`, precio: 3000 }
]

// DOM

const inputBusqueda = document.getElementById(`inputBusqueda`)
const listaResultados = document.getElementById(`listaResultados`)
const btnNuevoServicio = document.getElementById(`btn-nuevo-servicio`)
const eliminarResultados = document.getElementById(`eliminarResultados`)
const contenedor = document.getElementById(`contenedor`)
const elementosCarrito = document.getElementById(`carrito`)
const verRegistroBtn = document.getElementById(`verRegistro`)
let totalCarrito = document.getElementById(`totalCarrito`)
const registro = document.getElementById(`registro`)
const btnVaciarLocalStorage = document.getElementById(`btnVaciarLocalStorage`)
let carritoCantidad = document.getElementById(`carritoCantidad`)


// crear el carrito 
let carrito = obtenerCarrito()

//definir total, que usa sumarPreciosCarrito
let total = `0`

//para ya mostrar en el total lo que resuelve
totalCarrito.innerHTML = (sumarPreciosCarrito())

// Fn traer el carrito de localStorage
function obtenerCarrito() {
  const carritoJSON = localStorage.getItem(`carrito`)
  return carritoJSON ? JSON.parse(carritoJSON) : [] // si null/undefined deja el arraw vacío 
}
// Llamar a la fn mostrarCarrito por si había algo en localStorage
mostrarCarrito()

//controlar y fn de eliminar del localStorage
btnVaciarLocalStorage.addEventListener(`click`, () => {
  eliminarLocalStorage()
})
function eliminarLocalStorage() {
  localStorage.clear()
  agregarRegistro(`vaciado el localStorage`)
}
function agregarRegistro(mensaje) {
  registro.value += `${mensaje}\n`
}

// Fn para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem(`carrito`, JSON.stringify(carrito))
}

// Fn para agregar un servicio al carrito mirando si ya está
function agregarAlCarrito(servicio) {
  const servicioExistente = carrito.find(item => item.id === servicio.id)

  if (servicioExistente) {
    servicioExistente.cant += 1
    agregarRegistro(`se incrementó +1 el servicio ${servicioExistente.nombre}`)
    alertTostada(`se incrementó +1 el servicio ${servicioExistente.nombre}`)

  } else {
    const nuevoServicio = {
      id: servicio.id,
      cant: 1,
      nombre: servicio.nombre,
      precio: servicio.precio
    }
    carrito.push(nuevoServicio)
    agregarRegistro(`se agregó el servicio ${nuevoServicio.nombre}`)
    alertTostada(`se agregó el servicio ${nuevoServicio.nombre}`)

  }
  // Limpiar la lista de resultados
  listaResultados.innerHTML = ``
  // Limpiar el campo de búsqueda
  inputBusqueda.value = ``
  // Guardar el carrito en localStorage y mostrar el carrito actualizado
  guardarCarrito()
  mostrarCarrito()
}
// Fn para mostrar el array carrito
function mostrarCarrito() {
  // Limpiar el contenido anterior del carrito para no repetir resultados
  elementosCarrito.innerHTML = ``
  // Recorrer los elementos del carrito
  carrito.forEach(servicio => {
    const servicioElemento = document.createElement(`li`)
    // Crear el elemento para mostrar la imagen del servicio
    const imagenElemento = document.createElement(`img`)

    if (servicio.id < 13) {
      imagenElemento.src = `./img/${servicio.id}.jpg`
    } else {
      imagenElemento.src = `./img/nuevo.jpg`

    }
    imagenElemento.alt = servicio.nombre

    // Crear el elemento para mostrar el nombre y precio del servicio
    const nombrePrecioElemento = document.createElement(`div`)
    nombrePrecioElemento.innerHTML = `${servicio.cant} -  ${servicio.nombre} - $${servicio.precio}`

    //Crear el botón de eliminación
    const eliminarBtn = document.createElement(`button`)
    eliminarBtn.innerHTML = `-`
    eliminarBtn.addEventListener(`click`, () => eliminarDelCarrito(servicio.id))

    //Crear el botón de incrementar
    const agregarBtn = document.createElement(`button`)
    agregarBtn.innerHTML = `+`
    agregarBtn.addEventListener(`click`, () => incrementarEnCarrito(servicio.id))

    //el total del carrito acá para que itinere  
    totalCarrito.innerHTML = sumarPreciosCarrito()

    // Agregar los elementos al servicioElemento
    servicioElemento.appendChild(imagenElemento)
    servicioElemento.appendChild(nombrePrecioElemento)
    servicioElemento.appendChild(eliminarBtn)
    servicioElemento.appendChild(agregarBtn)

    // Agregar el servicioElemento al HTML
    elementosCarrito.appendChild(servicioElemento)
    actualizarCantidadCarrito()
  })
}

// para que queden en 0 los contadores si carrito no tiene nada
function carritoVacio() {
  if (carrito.length === 0) {
    totalCarrito.innerHTML = `Total: $0`
    carritoCantidad.innerHTML = `Items: 0`
  } else {
    // Actualizar el total del carrito y la cantidad de items
    totalCarrito.innerHTML = `Total: $${sumarPreciosCarrito()}`
    actualizarCantidadCarrito()
  }
}

//fn de reduce para el total del carrito
function sumarPreciosCarrito() {
  total = carrito.reduce((suma, servicio) => suma + (servicio.precio * servicio.cant), 0)
  const totalCompleto = `Total: $${total}`
  return totalCompleto

}

//fn de reduce para cantidad de items 
function actualizarCantidadCarrito() {
  const totalItems = carrito.reduce((total, servicio) => total + servicio.cant, 0)
  carritoCantidad.innerHTML = `Items: ${totalItems.toString()}`
}

//fn eliminar del carrito
function eliminarDelCarrito(servicioId) {
  const servicioEliminar = carrito.findIndex(item => item.id === servicioId)

  if (servicioEliminar !== -1) {
    carrito[servicioEliminar].cant -= 1
    agregarRegistro(`se eliminó del carrito una unidad de ${carrito[servicioEliminar].nombre}`)
    alertTostada(`se eliminó del carrito una unidad de ${carrito[servicioEliminar].nombre}`)


    if (carrito[servicioEliminar].cant === 0) {
      carrito.splice(servicioEliminar, 1)
    }
    // Guardar el carrito en localStorage y mostrar el carrito actualizado
    guardarCarrito()
    mostrarCarrito()
    carritoVacio()

  }
}
//fn de incrementar en carrito
function incrementarEnCarrito(servicioId) {
  const servicioIncrementar = carrito.findIndex(item => item.id === servicioId)

  if (servicioIncrementar !== -1) {
    carrito[servicioIncrementar].cant += 1
    agregarRegistro(`se incrementó una unidad de ${carrito[servicioIncrementar].nombre}`)
    alertTostada(`se incrementó una unidad de ${carrito[servicioIncrementar].nombre}`)

    // Guardar el carrito en localStorage y mostrar el carrito actualizado
    guardarCarrito()
    mostrarCarrito()
    carritoVacio()

  }
}
// controlamos el evento de input 
inputBusqueda.addEventListener(`input`, () => {
  const busqueda = inputBusqueda.value.toLowerCase()
  const resultadosFiltrados = serviciosPosibles.filter(servicio => servicio.nombre.toLowerCase().includes(busqueda))


  //ordenar alfabeticamente la lista de resultados
  resultadosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))


  // Limpiar la lista de resultados cuando se hace click
  listaResultados.innerHTML = ``

  // Mostrar qué se encontró 
  resultadosFiltrados.forEach(resultado => {
    const elementoResultado = document.createElement(`li`)
    if (resultado.id < 13){
    elementoResultado.innerHTML = `<img src="./img/${resultado.id}.jpg" alt="${resultado.nombre}">
      <span>${resultado.nombre}</span>`}
      else {
        elementoResultado.innerHTML = `<img src="./img/nuevo.jpg" alt="${resultado.nombre}">
        <span>${resultado.nombre}</span>`
      }
    elementoResultado.addEventListener(`click`, () => agregarAlCarrito(resultado))
    listaResultados.appendChild(elementoResultado)

  })
})
// Fn para eliminar un servicio de serviciosPosibles
buscarParaEliminar.addEventListener(`input`, () => {
  const busqueda = buscarParaEliminar.value.toLowerCase()
  const resultadosFiltrados = serviciosPosibles.filter(servicio => servicio.nombre.toLowerCase().includes(busqueda))

  //ordenar alfabeticamente 
  resultadosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))


  // Mostrar qué se encontró 
  resultadosFiltrados.forEach(resultado => {
    const elementoResultado = document.createElement(`li`)
    elementoResultado.innerHTML = resultado.nombre
    elementoResultado.addEventListener(`click`, () => eliminarServicio(resultado))
    eliminarResultados.appendChild(elementoResultado)

  })
})
//limpiar con escape el input busqueda
document.getElementById(`inputBusqueda`).addEventListener(`keyup`, function (event) {
  if (event.key === `Escape`) {
    this.value = ``
    listaResultados.innerHTML = ``
    agregarRegistro(`se presionó ESC y se limpió el campo de buscar servicio`)
    alertTostada(`se presionó ESC y limpió el campo de buscar servicio`)
  }
})
//limpiar con escape el input de eliminar servicios 
document.getElementById(`buscarParaEliminar`).addEventListener(`keyup`, function (event) {
  if (event.key === `Escape`) {
    this.value = ``
    eliminarResultados.innerHTML = ``
    agregarRegistro(`se presionó ESC y limpió el campo de eliminar servicio`)
    alertTostada(`se presionó ESC y limpió el campo de eliminar servicio`)

  }
})

// Controlar el botón de Nuevo Servicio
btnNuevoServicio.addEventListener(`click`, () => {
  nuevoServicio()
})

// Fn para agregar un nuevo servicio a serviciosPosibles y ya meterlo al carrito
function nuevoServicio() {
  const ultimoIDutilizado = obtenerUltimoID()
  let nuevoNombre = document.getElementById(`nombreServicio`).value
  let nuevoPrecio = parseFloat(document.getElementById(`valorServicio`).value)

  if (nuevoNombre === ``) {
    nuevoNombre = `Servicio con ID ${ultimoIDutilizado + 1}`
    agregarRegistro(`No se le puso nombre al servicio así que le puse automáticamente ${nuevoNombre}`)
    alertTostada(`No se le puso nombre al servicio así que le puse automáticamente ${nuevoNombre}`)

    
  }

  if (isNaN(nuevoPrecio)) {
    nuevoPrecio = 0
    agregarRegistro(`El servicio con ID ${ultimoIDutilizado + 1} tenía un precio raro, así que se asignó 0.`)
    alertTostada(`El servicio con ID ${ultimoIDutilizado + 1} tenía un precio raro, así que se asignó 0.`)

    
  }

  const nuevoServicio = {
    id: ultimoIDutilizado + 1,
    cant: 1,
    nombre: nuevoNombre,
    precio: nuevoPrecio,
    imagen: "",
  }

  serviciosPosibles.push(nuevoServicio)
  carrito.push(nuevoServicio)
  agregarRegistro(`se agregó un servicio con ID ${nuevoServicio.id} y se puso en el carrito`)
  alertTostada(`se agregó un servicio con ID ${nuevoServicio.id} y se puso en el carrito`)

  mostrarCarrito()
  guardarCarrito()
  guardarServicios()
}
// Fn para obtener el último ID utilizado en el array serviciosPosibles
function obtenerUltimoID() {
  let ultimoID = 0
  serviciosPosibles.forEach(servicio => {
    if (servicio.id > ultimoID) {
      ultimoID = servicio.id
    }
  })
  return ultimoID
}

//fn para eliminar servicios 
function eliminarServicio(servicio) {
  const indiceServicio = serviciosPosibles.findIndex(item => item.id === servicio.id)

  if (indiceServicio !== -1) {
    serviciosPosibles.splice(indiceServicio, 1)
    eliminarResultados.innerHTML = ``
    buscarParaEliminar.value = ``
    agregarRegistro(`se eliminó el servicio con id ${servicio.id}`)
    alertTostada(`se eliminó el servicio con id ${servicio.id}`)

    

    // Guardar los cambios en localStorage y mostrar los servicios actualizados
    guardarServicios()
    mostrarCarrito()

  }
}

// Fn para guardar los serviciosPosibles en localStorage
function guardarServicios() {
  localStorage.setItem(`servicios`, JSON.stringify(serviciosPosibles))
}

// Function to toggle the display of the registro element
function toggleRegistro() {
  const registro = document.getElementById(`registro`)
  // const verRegistroBtn = document.getElementById(`verRegistroBtn`)
    if (registro.style.display === `none`) {
    registro.style.display = `block` 
    verRegistroBtn.innerHTML = `Ocultar Registro (o)`
    alertTostada(`se muestra el registro`)

  } else {
    registro.style.display = `none` 
    verRegistroBtn.innerHTML = `Mostrar Registro (o)`
    alertTostada(`se oculta el registro`)
  }
}
// Controlar el botón de ver u ocultar el registro
verRegistroBtn.addEventListener(`click`, toggleRegistro)

document.addEventListener(`keyup`, function (event) {
  if (event.key === `o` || event.key === `O`) {
    agregarRegistro(`se presionó O y se muestra el registro`)
    toggleRegistro()
 
  }
})



// prueba fn de fade in
function paraFade(elemento) {
  elemento.classList.add(`visible`)
}
const elementosFade = document.querySelectorAll(`.fade-in`)
elementosFade.forEach(element => {
  paraFade(element)
})

function alertTostada(texto) {
  Toastify({
    text: texto,
    duration: 3000
  }).showToast()
}
