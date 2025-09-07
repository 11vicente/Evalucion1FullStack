


// --- Filtrado de productos por categoría ---

// Selecciona todos los botones/elementos que sirven como filtro (los <li> con clase .filtro-categoria)
const filtros = document.querySelectorAll('.filtro-categoria');

// Selecciona todos los productos (los divs con clase .producto)
const productos = document.querySelectorAll('.producto');

// Recorre cada filtro
filtros.forEach(filtro => {
  // A cada filtro le agrega un "click listener"
  filtro.addEventListener('click', () => {

    // Quita la clase 'active' de todos los filtros (para que no queden varios seleccionados a la vez)
    filtros.forEach(f => f.classList.remove('active'));

    // Agrega la clase 'active' al filtro que se acaba de hacer click
    filtro.classList.add('active');

    // Obtiene la categoría seleccionada desde el atributo data-categoria del filtro
    const categoria = filtro.dataset.categoria;

    // Recorre todos los productos para mostrar u ocultar según corresponda
    productos.forEach(prod => {
      // Si la categoría seleccionada es "todos" o coincide con la categoría del producto, se muestra
      if (categoria === 'todos' || prod.dataset.categoria === categoria) {
        prod.style.display = 'block'; // Mostrar producto
      } else {
        prod.style.display = 'none'; // Ocultar producto
      }
    });
  });
});
