/**
 * Elementos y variables para manejar el carrito de compras en la página.

 */

const carrito = document.querySelector('#carrito'),
  contenedorCarrito = document.querySelector('#lista-carrito tbody'),
  vaciarCarritoBtn = document.querySelector('#vaciar-carrito'),
  listaCursos = document.querySelector('#lista-cursos');

// Inicializa el array vacio
let aritculosCarrito = [];

/**
 * Maneja el evento de clic para agregar un curso al carrito de compras.
 * Si el elemento clicado tiene la clase 'agregar-carrito', extrae el elemento
 * y llama a `leerDatosCurso` para procesar los datos del curso.

 */
const agregarAlCarrito = (e) => {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    // console.log(cursoSeleccionado);
    leerDatosCurso(cursoSeleccionado);
  }
};

/**
 * Elimina un curso del carrito de compras. Este método se activa al hacer clic en el botón de eliminar
 * y verifica si el elemento clicado es el botón de eliminación. Si lo es, obtiene el ID del curso y
 * filtra el arreglo del carrito para eliminar el curso especificado. Luego, actualiza el HTML del carrito.
 */

const eliminarCurso = (e) => {
  if (e.target.classList.contains('borrar-curso')) {
    const cursoId = e.target.getAttribute('data-id');
    //elimina del arreglo de articulosCarrito por el data-id
    aritculosCarrito = aritculosCarrito.filter((curso) => curso.id !== cursoId);
    carritoHTML(); //iterar sobre el carrito y mostrar su html
  }
};

/**
 * Extrae la información de un curso seleccionado y crea un objeto con estos datos.
 *
 * @param {Element} curso
 * @returns {Object} infoCurso
 */

const leerDatosCurso = (curso) => {
  //objeto con contenido del curso
  const infoCurso = {
    imagen: curso.querySelector('img').src,
    titulo: curso.querySelector('h4').textContent,
    precio: curso.querySelector('.precio span').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1,
  };

  /**
   * Verifica si el curso seleccionado ya existe en el carrito. Si existe, incrementa su cantidad.
   * Si no existe, lo agrega al carrito. Finalmente, imprime el estado actual del carrito y actualiza
   * @param {Object} infoCurso
   *
   */
  const existe = aritculosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    const cursos = aritculosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; //retorna el objeto actualizado
      } else {
        return curso; //retorna los objetos que no son duplicados
      }
    });
    aritculosCarrito = [...cursos];
  } else {
    //agrega elementos al arreglo de carritos
    aritculosCarrito = [...aritculosCarrito, infoCurso];
  }

  console.log(aritculosCarrito);
  carritoHTML();
};

//Crea los elementos para mostrar el carrito

const carritoHTML = () => {
  //limpiar el html
  limpiarHTML();
  //recorre el carrito y genera el html

  aritculosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad } = curso;
    const row = document.createElement('tr');
    row.innerHTML = `

    <td><img src="${imagen}" width="100"></td>
     
    <td>${titulo}</td>

    <td>${precio}</td>

    <td>${cantidad}</td>

    <td>
     <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
    </td >

    `;

    //agrega el html del carrito en el tbody

    contenedorCarrito.appendChild(row);
  });

  //agregar el carrito de compras al storage

  sincronizarStorage();
};

//local storage

function sincronizarStorage() {
  localStorage.setItem('carrito', JSON.stringify(aritculosCarrito));
}

//elimina los curso del tbody

const limpiarHTML = () => {
  //forma lenta
  //! contenedorCarrito.innerHTML = '';

  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
};

//Eventos click para los botones
const registarEventListeners = () => {
  //Llama este evento cuando se presiona "Agregar Carrito"
  listaCursos.addEventListener('click', agregarAlCarrito);

  //elimina cursos del carrito
  carrito.addEventListener('click', eliminarCurso);

  //muestra los cursos del local storage
  document.addEventListener('DOMContentLoaded', () => {
    aritculosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoHTML();
  });

  //vaciar carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    aritculosCarrito = []; //reseteamos el arreglo
    limpiarHTML(); //eliminamos todo el html
  });
};
registarEventListeners();
