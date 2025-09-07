





// --- Mock de productos
const productosBase = [
  {id: 1, nombre: "Torta Cuadrada de Chocolate", precio: 12000, img: "../img/pastel-chocolate-decadente-sinfonia-marron_632498-24549.jpg"},
  {id: 2, nombre: "Torta Cuadrada de Frutas", precio: 11500, img: "../img/cuadrad de frutas.png"},
  {id: 5, nombre: "Mousse de Chocolate", precio: 4500, img: "../img/mouseChoco.png"},
];

// Intenta obtener el carrito guardado en localStorage (almacenamiento local del navegador)
// localStorage.getItem("carrito_ms") devuelve un string JSON o null si no existe
// JSON.parse convierte ese string JSON en un objeto JavaScript (aquí un arreglo)
// Si no hay datos guardados, usa el arreglo por defecto con productos y cantidades
let carrito = JSON.parse(localStorage.getItem("carrito_ms")) || [
  {id: 1, qty: 1},
  {id: 2, qty: 2},
  {id: 5, qty: 3},
];

// Igual que arriba, intenta cargar el cupón aplicado guardado en localStorage
// Si no existe, queda como null
let cuponAplicado = JSON.parse(localStorage.getItem("cupon_ms")) || null; // {code, factor}

// --- Helpers
// Función abreviada para seleccionar un elemento del DOM con querySelector
// document.querySelector(sel) devuelve el primer elemento que coincide con el selector CSS
const $ = (sel) => document.querySelector(sel);

// Función abreviada para seleccionar todos los elementos que coinciden con el selector CSS
// document.querySelectorAll(sel) devuelve una NodeList con todos los elementos
const $$ = (sel) => document.querySelectorAll(sel);

// Crea un formateador para mostrar números en formato moneda chilena (CLP)
// Intl.NumberFormat es una API para formatear números según localización y formato
const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// Busca un producto en productosBase por su id usando Array.find
// Array.find(callback) devuelve el primer elemento que cumple la condición
function findProd(id) {
  return productosBase.find(p => p.id === id);
}

// Guarda el estado actual del carrito y cupón en localStorage
// JSON.stringify convierte objetos JavaScript en strings JSON para almacenarlos
// localStorage.setItem(clave, valor) guarda un string bajo una clave
function saveState() {
  localStorage.setItem("carrito_ms", JSON.stringify(carrito));
  localStorage.setItem("cupon_ms", JSON.stringify(cuponAplicado));
}

// Calcula subtotal, descuento, envío y total del carrito
function calcularTotales() {
  // Array.reduce(callback, initial) acumula un valor recorriendo el arreglo
  // Aquí suma precio * cantidad de cada producto
  const subtotal = carrito.reduce((acc, item) => {
    const prod = findProd(item.id);
    return acc + (prod ? prod.precio * item.qty : 0);
  }, 0);

  let descuento = 0;
  if (cuponAplicado) {
    if (cuponAplicado.type === "porcentaje") {
      // Math.round redondea al entero más cercano
      descuento = Math.round(subtotal * cuponAplicado.factor);
    } else if (cuponAplicado.type === "fijo") {
      descuento = cuponAplicado.amount;
    }
    // Asegura que el descuento no sea mayor que el subtotal
    descuento = Math.min(descuento, subtotal);
  }

  // Operador ternario: si subtotal > 30000 envío gratis, sino 3000
  const envio = subtotal > 30000 ? 0 : 3000;

  // Total final
  const total = subtotal - descuento + envio;

  // Retorna un objeto con los totales
  return { subtotal, descuento, envio, total };
}

// Actualiza el resumen de precios en la interfaz
function renderResumen() {
  const { subtotal, descuento, envio, total } = calcularTotales();

  // textContent cambia el texto interno de un elemento HTML
  // CLP.format formatea el número a moneda chilena
  $("#subtotalTxt").textContent = CLP.format(subtotal);
  $("#descuentoTxt").textContent = `-${CLP.format(descuento)}`;
  $("#envioTxt").textContent = CLP.format(envio);
  $("#totalTxt").textContent = CLP.format(total);
}

// Renderiza la tabla del carrito con productos y cantidades
function renderCarrito() {
  const body = $("#carritoBody");

  // innerHTML permite establecer el contenido HTML interno de un elemento
  // Aquí se limpia el contenido para volver a renderizar
  body.innerHTML = "";

  if (carrito.length === 0) {
    // classList permite manipular las clases CSS de un elemento
    // remove("d-none") muestra el mensaje de carrito vacío
    $("#carritoVacio").classList.remove("d-none");
    // add("d-none") oculta la tabla del carrito
    $("#tablaCarrito").classList.add("d-none");
  } else {
    $("#carritoVacio").classList.add("d-none");
    $("#tablaCarrito").classList.remove("d-none");
  }

  // Recorre cada producto en el carrito para crear filas en la tabla
  carrito.forEach(item => {
    const prod = findProd(item.id);
    if (!prod) return;

    // Crea un elemento <tr> para la fila de la tabla
    const tr = document.createElement("tr");

    // dataset permite acceder a atributos data-* personalizados
    // Aquí se guarda el id del producto en data-id para luego identificarlo
    tr.dataset.id = item.id;

    // innerHTML inserta el contenido HTML de la fila con datos del producto
    tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${prod.img}" class="cart-thumb" alt="${prod.nombre}">
          <div>
            <div class="fw-semibold">${prod.nombre}</div>
            <small class="text-muted">ID: ${prod.id}</small>
          </div>
        </div>
      </td>
      <td class="text-center">${CLP.format(prod.precio)}</td>
      <td class="text-center">
        <div class="d-inline-flex align-items-center border rounded-2 overflow-hidden">
          <button class="btn btn-sm btn-light btn-qty" data-action="minus" aria-label="Disminuir">−</button>
          <input class="form-control form-control-sm text-center qty-input" style="width: 56px;" value="${item.qty}" min="1" inputmode="numeric" pattern="[0-9]*" />
          <button class="btn btn-sm btn-light btn-qty" data-action="plus" aria-label="Aumentar">+</button>
        </div>
      </td>
      <td class="text-end fw-semibold item-subtotal">${CLP.format(prod.precio * item.qty)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger btn-remove">Eliminar</button>
      </td>
    `;

    // Agrega la fila creada al cuerpo de la tabla
    body.appendChild(tr);
  });

  // Actualiza el resumen de precios
  renderResumen();
}

// Actualiza la cantidad de un producto en el carrito
function updateQty(id, nuevaQty) {
  // parseInt convierte string a entero, si falla usa 1
  // Math.max asegura que la cantidad mínima sea 1
  nuevaQty = Math.max(1, parseInt(nuevaQty) || 1);

  // Busca el producto en el carrito por id
  const it = carrito.find(i => i.id === id);
  if (!it) return;

  // Actualiza la cantidad
  it.qty = nuevaQty;

  // Guarda el estado y vuelve a renderizar
  saveState();
  renderCarrito();
}

// Elimina un producto del carrito por id
function removeItem(id) {
  // Array.filter devuelve un nuevo arreglo sin el producto con ese id
  carrito = carrito.filter(i => i.id !== id);

  saveState();
  renderCarrito();
}

// Aplica un cupón según código ingresado
function aplicarCupon(codeRaw) {
  // trim elimina espacios al inicio y fin, toUpperCase pasa a mayúsculas
  const code = codeRaw.trim().toUpperCase();

  // Selecciona el elemento donde se mostrará el mensaje del cupón
  const msg = $("#cuponMsg");

  if (!code) {
    // Si el código está vacío, elimina el cupón aplicado
    cuponAplicado = null;
    msg.textContent = "Cupón borrado.";
    msg.className = "form-text text-muted";
    saveState();
    renderResumen();
    return;
  }

  // Reglas mock para cupones válidos
  if (code === "FELICES10") {
    cuponAplicado = { code, type: "porcentaje", factor: 0.10 };
    msg.textContent = "✔ Cupón aplicado: 10% de descuento.";
    msg.className = "form-text text-success";
  } else if (code === "TORTA5") {
    cuponAplicado = { code, type: "fijo", amount: 5000 };
    msg.textContent = "✔ Cupón aplicado: $5.000 de descuento.";
    msg.className = "form-text text-success";
  } else {
    cuponAplicado = null;
    msg.textContent = "❌ Cupón inválido.";
    msg.className = "form-text text-danger";
  }

  saveState();
  renderResumen();
}

// --- Listeners para manejar eventos de click e input en la página
document.addEventListener("click", (e) => {
  // closest busca el ancestro más cercano que sea un <tr>
  const tr = e.target.closest("tr");
  if (!tr) return;

  // dataset.id obtiene el id del producto guardado en data-id
  const id = parseInt(tr.dataset.id);

  // matches verifica si el elemento clickeado tiene la clase .btn-qty
  if (e.target.matches(".btn-qty")) {
    // data-action indica si es "plus" o "minus"
    const action = e.target.dataset.action;

    // Busca el input de cantidad dentro de la fila
    const input = tr.querySelector(".qty-input");

    // Obtiene el valor actual y lo convierte a entero
    let val = parseInt(input.value) || 1;

    // Suma o resta según el botón clickeado
    val = action === "plus" ? val + 1 : val - 1;

    // Actualiza la cantidad
    updateQty(id, val);
  }

  // Si clickeó el botón eliminar
  if (e.target.matches(".btn-remove")) {
    removeItem(id);
  }
});

// Escucha cambios en inputs de cantidad para actualizar el carrito
document.addEventListener("input", (e) => {
  if (e.target.matches(".qty-input")) {
    const tr = e.target.closest("tr");
    const id = parseInt(tr.dataset.id);
    updateQty(id, e.target.value);
  }
});

// Vacía el carrito al hacer click en el botón vaciar
$("#vaciarBtn").addEventListener("click", () => {
  carrito = [];
  saveState();
  renderCarrito();
});

// Aplica el cupón al hacer click en el botón aplicar cupón
$("#aplicarCuponBtn").addEventListener("click", () => {
  aplicarCupon($("#cuponInput").value);
});

// Render inicial del carrito y cupón si existe
renderCarrito();

if (cuponAplicado) {
  $("#cuponInput").value = cuponAplicado.code;
  $("#cuponMsg").textContent = cuponAplicado.type === "porcentaje"
    ? "✔ Cupón aplicado: 10% de descuento."
    : "✔ Cupón aplicado: $5.000 de descuento.";
  $("#cuponMsg").className = "form-text text-success";
}

// Botón para finalizar compra
$("#finalizarBtn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("🛒 Tu carrito estaba vacío, pero hemos cargado productos de prueba para seguir la demo.");
  } else {
    alert("✅ ¡Compra realizada con éxito! 🎉 Gracias por tu pedido.");
  }

  // Reinicia carrito y cupón a valores iniciales
  carrito = [
    {id: 1, qty: 1},
    {id: 2, qty: 2},
    {id: 5, qty: 3},
  ];
  cuponAplicado = null;
  saveState();
  renderCarrito();
});