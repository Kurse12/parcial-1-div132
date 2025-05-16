/*  
    Instrucciones del Parcial

    - Responde los puntos en orden.
    - Se valorará:
        * Código limpio
        * Comentarios claros
        * Separación en bloques funcionales
        * Buen uso de funciones/modularización

    IMPORTANTE:
    - El trabajo debe desarrollarse utilizando buenas prácticas de programación en JavaScript.
*/

/*  
    Punto 1 _________________________

    Este parcial consiste en crear el frontend de una tienda de frutas.
    Para ello ya se dispone del HTML y deberás programar el JavaScript necesario.

    1. Almacena tus datos personales (nombre, apellido, DNI) en un objeto y:
        - Imprime tu nombre y apellido en la etiqueta del <nav> (donde corresponda).
        - Imprímelo también en la consola.
*/
const datosPersonales = {
    nombre: "Valentin",
    apellido: "Corallo",
    dni: "46285856"
};

console.log(`${datosPersonales.nombre} ${datosPersonales.apellido}`);

const alumno = document.querySelector(".nombreAlumno"); 
if (alumno) { 
    alumno.textContent = `${datosPersonales.nombre} ${datosPersonales.apellido}`;
}

/*  
    Punto 2 _________________________

    Simula la carga de datos desde un archivo `db.json`. Este debe tener objetos con esta estructura:
    {
        "id": 1,
        "nombre": "arandano",
        "precio": 5000,
        "img": "img/arandano.jpg"
    }
*/
fetch("db.json")
    .then(res => res.json())
    .then(frutas => {
        console.log("Datos cargados:", frutas);

        frutas.forEach(fruta => {
            console.log(`ID: ${fruta.id}, Nombre: ${fruta.nombre}, Precio: ${fruta.precio}`);
        });
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });


/*  
    Punto 3 _________________________

    Imprime los productos en pantalla al cargar la página.
    Agrega esta funcionalidad dentro de la función `init()`.

    El HTML que debes agregar por cada producto es el siguiente:

        <div class="product-card">
            <img src="ruta" alt="nombre">
            <h3>Nombre del producto</h3>
            <p>$Precio</p>
            <button class="add-to-cart">Agregar a carrito</button>
        </div>
*/

/*  
    Punto 4 _________________________

    Crea la función `filtro()` para filtrar los productos por nombre.
    - Asocia esta función al evento `keyup` de un campo `<input>`.
    - Cada vez que se escriba una letra, deben mostrarse solo los productos que coincidan con el texto ingresado.
*/

/*  
    Punto 5 _________________________

    Agrega la funcionalidad de carrito:
    - Crea un array `carrito` que almacene los productos seleccionados.
    - Al presionar “Agregar a carrito”, el producto debe aparecer en el listado con id `cart-items`.

    El HTML del carrito debe tener el siguiente formato:

        <li class="item-block">
            <p class="item-name">nombreproducto - $precioproducto</p>
            <button class="delete-button">Eliminar</button>
        </li>
*/

/*  
    Punto 6 _________________________

    Guarda los productos del carrito en `localStorage`.
    - Asegúrate de que al recargar la página el carrito se recupere automáticamente desde `localStorage`.
*/

let frutasGlobal = [];
let carrito = [];
//punto 6
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
// Función inicializadora
function init() {
  // Aquí deben invocarse todas las funciones necesarias para que la aplicación comience a funcionar
    // cargar productos
    fetch("db.json")
        .then(res => res.json())
        .then(frutas => {
            frutasGlobal = frutas;
            mostrarProductos(frutasGlobal);
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
        });

    document.querySelector(".search-bar").addEventListener("keyup", filtro);

    // cargar carrito punto 6
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        renderizarCarrito();
    }
}

//punto 3
function mostrarProductos(lista) {
    const container = document.querySelector(".product-grid"); // contenedor de productos
    container.innerHTML = ""; // limpiar contenedor

    lista.forEach(fruta => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${fruta.img}" alt="${fruta.nombre}">
            <h3>${fruta.nombre}</h3>
            <p>$${fruta.precio}</p>
            <button class="add-to-cart">Agregar a carrito</button>
        `;

        // agregar al carrito
        const boton = card.querySelector(".add-to-cart");
        boton.addEventListener("click", () => agregarAlCarrito(fruta));

        container.appendChild(card);
    });
}

//punto 4
function filtro(e) {
    const texto = e.target.value.toLowerCase();
    const filtradas = frutasGlobal.filter(fruta =>
        fruta.nombre.toLowerCase().includes(texto)
    );
    mostrarProductos(filtradas);
}

// punto 5
function agregarAlCarrito(producto) {
    carrito.push(producto);
    guardarCarrito();
    renderizarCarrito();
}


function renderizarCarrito() {
    const contenedor = document.getElementById("cart-items");
    contenedor.innerHTML = ""; // limpiar contenedro
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay elementos en el carrito.</p>";
        actualizarTotal();
        return;
    }

    const ul = document.createElement("ul");

    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("item-block");

        li.innerHTML = `
            <p class="item-name">${item.nombre} - $${item.precio}</p>
            <button class="delete-button">Eliminar</button>
        `;

        li.querySelector(".delete-button").addEventListener("click", () => {
            eliminarDelCarrito(index);
        });

        ul.appendChild(li);
    });

    contenedor.appendChild(ul);
    actualizarTotal();
}


function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
}

function actualizarTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
    document.getElementById("cart-count").textContent = carrito.length;
}


document.addEventListener("DOMContentLoaded", init);


