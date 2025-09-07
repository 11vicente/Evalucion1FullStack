
// Mensaje en la consola para confirmar que el archivo JS se cargó correctamente
console.log("validaciones.js cargado ✅");

// --- Escucha el evento "submit" (cuando se envía el formulario) ---
document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que el formulario se envíe automáticamente (recarga la página)

  // --- Obtener los valores de los campos del formulario ---
  const nombre = document.getElementById("nombre").value.trim(); // Nombre ingresado (sin espacios extras)
  const correo = document.getElementById("correo").value.trim(); // Correo principal
  const confirmarCorreo = document.getElementById("confirmarCorreo").value.trim(); // Confirmación de correo
  const password = document.getElementById("password").value; // Contraseña
  const confirmarPassword = document.getElementById("confirmarPassword").value; // Confirmación de contraseña
  const edad = parseInt(document.getElementById("edad").value); // Convierte la edad a número
  const codigo = document.getElementById("codigo").value.trim().toUpperCase(); // Código promocional (mayúsculas)
  const mensaje = document.getElementById("mensaje"); // Elemento donde se mostrarán mensajes al usuario

  // --- Validaciones básicas ---
  if (correo !== confirmarCorreo) { // Verifica que los correos coincidan
    mensaje.textContent = "❌ Los correos no coinciden.";
    mensaje.style.color = "red";
    return; // Detiene la ejecución si hay error
  }

  // --- Validación de dominio de correo permitido ---
  const regexCorreo = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  // Solo acepta correos @duoc.cl, @profesor.duoc.cl o @gmail.com
  if (!regexCorreo.test(correo)) {
    mensaje.textContent = "❌ Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com";
    mensaje.style.color = "red";
    return;
  }
  
  if (password !== confirmarPassword) { // Verifica que las contraseñas coincidan
    mensaje.textContent = "❌ Las contraseñas no coinciden.";
    mensaje.style.color = "red";
    return;
  }

  // --- Aplicación de descuentos y beneficios ---
  let beneficio = "";

  if (edad >= 50) { // Si es mayor de 50 años
    beneficio = "🎉 Descuento del 50% por ser mayor de 50 años.";
  }

  if (codigo === "FELICES50") { // Si usa el código especial
    beneficio = "🎉 Descuento del 10% de por vida con el código FELICES50.";
  }

  if (correo.endsWith("@duoc.cl")) { // Si es estudiante DUOC
    beneficio = "🎂 ¡Torta gratis en tu cumpleaños por ser estudiante Duoc!";
  }

  if (beneficio === "") { // Si no aplica ningún beneficio
    beneficio = "✅ Registro exitoso. ¡Bienvenido a la tienda!";
  }

  // Muestra el beneficio en pantalla
  mensaje.textContent = beneficio;
  mensaje.style.color = "green";
});

// --- Filtro de solo números ---
// Evita que en ciertos inputs se escriban letras
document.querySelectorAll("input[data-numerico]").forEach(input => {
  input.addEventListener("keypress", function(e) {
    if (!/[0-9]/.test(e.key)) { // Si lo que escribe NO es un número
      e.preventDefault(); // Evita que se escriba
    }
  });
});

// --- Regiones y comunas relacionadas ---
// Objeto que contiene las comunas disponibles por región
const comunasPorRegion = {
  "RMS": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Araucania": ["Temuco", "Villarrica", "Pucón", "Angol"],
  "Nuble": ["Chillán", "San Carlos", "Bulnes", "Quillón"]
};

const regionSelect = document.getElementById("region"); // Selector de regiones
const comunaSelect = document.getElementById("comuna"); // Selector de comunas

// --- Cuando cambia la región seleccionada ---
regionSelect.addEventListener("change", function() {
  const regionSeleccionada = this.value; // Guarda el valor de la región elegida

  // Reinicia el selector de comunas
  comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

  // Si la región tiene comunas registradas, las agrega como opciones
  if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
    comunasPorRegion[regionSeleccionada].forEach(comuna => {
      const option = document.createElement("option"); // Crea un <option>
      option.value = comuna; // Valor interno
      option.textContent = comuna; // Texto visible
      comunaSelect.appendChild(option); // Inserta la opción en el select
    });
  }
});
