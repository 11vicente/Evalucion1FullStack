console.log("validaciones.js cargado ✅");

document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const confirmarCorreo = document.getElementById("confirmarCorreo").value.trim();
  const password = document.getElementById("password").value;
  const confirmarPassword = document.getElementById("confirmarPassword").value;
  const edad = parseInt(document.getElementById("edad").value);
  const codigo = document.getElementById("codigo").value.trim().toUpperCase();
  const mensaje = document.getElementById("mensaje");

  // Validaciones básicas
  if (correo !== confirmarCorreo) {
    mensaje.textContent = "❌ Los correos no coinciden.";
    mensaje.style.color = "red";
    return;
  }

  //  Validación de dominio de correo permitido
  const regexCorreo = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  if (!regexCorreo.test(correo)) {
    mensaje.textContent = "❌ Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com";
    mensaje.style.color = "red";
    return;
  }

  if (password !== confirmarPassword) {
    mensaje.textContent = "❌ Las contraseñas no coinciden.";
    mensaje.style.color = "red";
    return;
  }

  // Reglas especiales
  let beneficio = "";

  if (edad >= 50) {
    beneficio = "🎉 Descuento del 50% por ser mayor de 50 años.";
  }

  if (codigo === "FELICES50") {
    beneficio = "🎉 Descuento del 10% de por vida con el código FELICES50.";
  }

  if (correo.endsWith("@duoc.cl")) {
    beneficio = "🎂 ¡Torta gratis en tu cumpleaños por ser estudiante Duoc!";
  }

  if (beneficio === "") {
    beneficio = "✅ Registro exitoso. ¡Bienvenido a la tienda!";
  }

  mensaje.textContent = beneficio;
  mensaje.style.color = "green";
});

// Filtro de solo números
document.querySelectorAll("input[data-numerico]").forEach(input => {
  input.addEventListener("keypress", function(e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });
});

// Regiones y Comunas relacionadas
const comunasPorRegion = {
  "RMS": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Araucania": ["Temuco", "Villarrica", "Pucón", "Angol"],
  "Nuble": ["Chillán", "San Carlos", "Bulnes", "Quillón"]
};

const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");

regionSelect.addEventListener("change", function() {
  const regionSeleccionada = this.value;

  comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

  if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
    comunasPorRegion[regionSeleccionada].forEach(comuna => {
      const option = document.createElement("option");
      option.value = comuna;
      option.textContent = comuna;
      comunaSelect.appendChild(option);
    });
  }
});
