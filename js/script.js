// Elementos del DOM

const formulario    = document.getElementById("form-pedido");
const selectProd    = document.getElementById("producto");
const inputCant     = document.getElementById("cantidad");
const mensajeError  = document.getElementById("mensaje-error");
const listaCarrito  = document.getElementById("lista-carrito");
const carritoVacio  = document.getElementById("carrito-vacio");
const spanTotal     = document.getElementById("total");
const btnVaciar     = document.getElementById("vaciar");
const botonesElegir = document.querySelectorAll(".btn-elegir");

// Importe acumulado
let total = 0;


// Funciones propias

// Reformateo de valor numérico a precio en €
function formatearEuros(valor) {
    return valor.toFixed(2).replace(".", ",") + " €";
}

/* Comprueba los datos del formulario.
Devuelve "" si todo está bien; texto de error si falla en algún punto del formulario. */
function validarPedido(idProducto, textoCantidad) {
    if (idProducto == "") {
        return "Elige un producto de la lista.";
    }
    if (textoCantidad.trim() === "") {
        return "introduce una cantidad.";
    }
    const cantidad = Number(textoCantidad);
    if (!Number.isInteger(cantidad)) {
        return "La cantidad debe ser un número entero.";
    }
    if (cantidad < 1 || cantidad > 10) {
        return "La cantidad debe estar entre 1 y 10.";
    }
    return "";
}

// Muestra el mensaje de error y marca en rojo el campo que falla.
function mostrarError(mensaje, campo) {
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove("oculto");
    campo.classList.add("error");
}

//Oculta el mensaje error y quita las marcas rojas
function ocultarError() {
    mensaje.Error.textContent = mensaje;
    mensajeError.classList.add("oculto");
    selectProd.classList.remove("error");
    inputCant.classList.add("error");
}

// Crea una línea nueva en el carrito y suma su importe al total
function agregarAlCarrito(nombre, precio, cantidad) {
    const subtotal = precio * cantidad;

    const linea = document.createElement("li");
    linea.textContent = nombre + " × " + cantidad + " — " + formatearEuros(subtotal);
    listaCarrito.appendChild(linea);

    total = total + subtotal;
    actualizarCarrito();
}

// Actualiza el total, el aviso de carrito vacío y el estado del botón Vaciar
function actualizarCarrito() {
    spanTotal.textContent = formatearEuros(total);

    const hayProductos = listaCarrito.children.length > 0;
    if (hayProductos) {
        carritoVacio.classList.add("oculto");
    } else {
        carritoVacio.classList.remove("oculto");
    }
    btnVaciar.disabled = !hayProductos;
}

// Se ejecuta al enviar el formulario
function procesarPedido(evento) {
    evento.preventDefault();  // Evita que se recargue la página

    const idProducto    = selectProd.value;
    const textoCantidad = inputCant.value;

    const error = validarPedido(idProducto, textoCantidad);
    if (error !== "") {
        const campo = (idProducto === "") ? selectProd : inputCant;
        mostrarError(error, campo);
        return;
    }

    // Prueba temporal: comprueba que funciona
    console.log("pedido válido");


    // Datos del producto elegido (texto y atributo data-precio de la opción)
    const opcion   = selectProd.options[selectProd.selectedIndex];
    const nombre   = opcion.textContent;
    const precio   = Number(opcion.dataset.precio);
    const cantidad = Number(textoCantidad);

    agregarAlCarrito(nombre, precio, cantidad);

    formulario.reset();
    quitarSeleccion();
}

// Quita el resaltado de todas las tarjetas del catálogo
function quitarSeleccion() {
    document.querySelectorAll(".producto").forEach(function (tarjeta) {
        tarjeta.classList.remove("seleccionado");
    });
}

// Se ejecuta al pulsar "Elegir" en una tarjeta del catálogo
function seleccionarProducto(evento) {
    const boton   = evento.currentTarget;
    const tarjeta = boton.closest(".producto");

    selectProd.value = boton.dataset.id;   // el formulario queda rellenado
    quitarSeleccion();
    tarjeta.classList.add("seleccionado");
    ocultarError();
    inputCant.focus();
}

// Se ejecuta al pulsar "Vaciar carrito"
function vaciarCarrito() {
    listaCarrito.innerHTML = "";
    total = 0;
    actualizarCarrito();
}


// Registro de eventos
formulario.addEventListener("submit", procesarPedido);
btnVaciar.addEventListener("click", vaciarCarrito);
botonesElegir.forEach(function (boton) {
    boton.addEventListener("click", seleccionarProducto);
});


// Tema: claro, oscuro o el del sistema
const raiz        = document.documentElement;
const botonesTema = document.querySelectorAll(".btn-tema");

// Aplica el tema elegido y marca su botón como pulsado
function aplicarTema(modo) {
    if (modo === "sistema") {
        raiz.removeAttribute("data-tema");      // manda la preferencia del sistema
    } else {
        raiz.setAttribute("data-tema", modo);   // "claro" u "oscuro"
    }
    botonesTema.forEach(function (boton) {
        boton.setAttribute("aria-pressed", boton.dataset.tema === modo);
    });
}

function cambiarTema(evento) {
    aplicarTema(evento.currentTarget.dataset.tema);
}

botonesTema.forEach(function (boton) {
    boton.addEventListener("click", cambiarTema);
});