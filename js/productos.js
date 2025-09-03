// Filtrado de productos por categoría
const filtros = document.querySelectorAll('.filtro-categoria');
const productos = document.querySelectorAll('.producto');

filtros.forEach(filtro => {
  filtro.addEventListener('click', () => {
    filtros.forEach(f => f.classList.remove('active'));
    filtro.classList.add('active');

    const categoria = filtro.dataset.categoria;

    productos.forEach(prod => {
      if (categoria === 'todos' || prod.dataset.categoria === categoria) {
        prod.style.display = 'block';
      } else {
        prod.style.display = 'none';
      }
    });
  });
});
