import { abrirModal } from './modal.js';

const apiKey = 'live_UMXdlmxz4z36xnY7qyyivBnCNNUgQ5GJwvRjVw8mgbX0slUMljlH67W3WJINlHLZ';

const contenedor = document.getElementById('contenedor-cards');

const loader = document.getElementById('loader');

const cargarMas = document.getElementById('cargarMas');

const modal = document.getElementById('modal-detalle');
const cerrarBtn = document.getElementById('cerrar-modal');

document.getElementById('orden').addEventListener('change', aplicarFiltros);
document.getElementById('origen').addEventListener('change', aplicarFiltros);
document.getElementById('buscador').addEventListener('input', aplicarFiltros);


let razas = [];
let index = 0;
const porPagina = 7;

/* Mostrar loader hasta que las primeras cards terminen de cargarse */
loader.style.display = 'flex';

cerrarBtn.addEventListener('click', () => {
  modal.classList.add('oculto');
});

// Cargar todas las razas y guardarlas
async function cargarRazas() {
  try {
    const res = await fetch('https://api.thecatapi.com/v1/breeds', {
      headers: { 'x-api-key': apiKey }
    });
    const data = await res.json();
    razas = data;
    /* Tomar los paises de origen de las razas y ordenarlos alfabeticamente */
    const orígenes = [...new Set(data.map(b => b.origin))].sort();
    const selectOrigen = document.getElementById('origen');
    /* Crear options para el select de origen */
    orígenes.forEach(pais => {
      const opt = document.createElement('option');
      opt.value = pais;
      opt.textContent = pais;
      selectOrigen.appendChild(opt);
    });
    await cargarSiguienteLote();
  } catch (err) {
    /* Si hay un error al cargarlas, mostrar pantalla de Error*/
    contenedor.innerHTML = `
      <div class="pantalla-error">
          <h3>¡Ha ocurrido un error!</h3>
          <p>No se han encontrado las razas. <br>Intenta recargar la página o sino espera unos minutos y vuelve a intentar</p>
          <img src="../public/img/gato-error.svg" alt="Imagen de gato error">
      </div>
    `
    console.error("Error al cargar razas:", err);
  } finally {
    /* Ocultar el loader */
    loader.style.display = 'none';
  }
}

// Cargar un grupo de razas (7 por vez)
async function cargarSiguienteLote() {
  const filtradas = filtrarYOrdenar(razas);
  const lote = filtradas.slice(index, index + porPagina);

  if (filtradas.length === 0) {
    contenedor.innerHTML = `
      <div class="pantalla-error">
          <h3>¡Perdón!</h3> 
          <p>No se han encontrado gatos que coincidan con la búsqueda. <br>Intenta buscar la raza con otro nombre</p> 
          <img src="../public/img/gato-error.svg" alt="Imagen de gato error">
      </div>
    `;
    cargarMas.style.display = 'none';
    loader.style.display = 'none';
    return;
  }

  const promesas = lote.map(async breed => {
    try {
      const resImg = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${breed.id}&api_key=${apiKey}`);
      const imgData = await resImg.json();

      const imgUrl = imgData[0]?.url || '';
      let imagenHtml;

      if (imgUrl) {
        imagenHtml = `<div class="foto" style="background-image: url('${imgUrl}')"></div>`;
      } else {
        imagenHtml = `<div class="foto-sin-imagen"><div class="foto-logo"></div><div class="texto">No se encontró imagen para ${breed.name}</div></div>`;
      }

      const card = document.createElement('div');
      card.classList.add('card-gato');
      card.innerHTML = `
        <div class="card-imagen">
          <div class="contenedor-foto">${imagenHtml}</div>
        </div>
        <div class="texto">
          <h3 class="nombre">${breed.name}</h3>
          <p class="detalles"><b>Origen</b>: ${breed.origin}<br><b>Temperamento</b>: ${breed.temperament.split(',').slice(0,2).join(', ')}</p>
        </div>
        <div class="card-contenedor-boton">
          <button class="detalles-btn"><img src="../public/img/info.svg" title="Ver detalles"></button>
          <button class="favoritos-btn" id="favoritos-btn"><img src="../public/img/favorito-n.svg" title="Agregar a Favoritos" alt="♥"></button>
        </div>
      `;

      // Abrir modal de detalles
      card.querySelector('.detalles-btn').addEventListener('click', () => abrirModal(breed, imgUrl));

      // Agregar gato a favoritos
      const favBtn = card.querySelector('.favoritos-btn');
      actualizarIconoFavorito(favBtn, breed.id); 
      favBtn.addEventListener('click', () => {
        const favoritos = JSON.parse(localStorage.getItem('favoritosGatos')) || [];
        const index = favoritos.findIndex(fav => fav.id === breed.id);

        if (index === -1) {
          favoritos.push({ ...breed, imagen: imgUrl });
          favBtn.style.filter = 'opacity(1)';
        } else {
          favBtn.style.filter = 'opacity(0.5)';
          favoritos.splice(index, 1); // Quitar si ya estaba
        }

        localStorage.setItem('favoritosGatos', JSON.stringify(favoritos));
        actualizarIconoFavorito(favBtn, breed.id);
      });
      /* Concatenar las cards de los gatos*/
      contenedor.appendChild(card);
    } catch (err) {
      console.warn(`Error cargando imagen para ${breed.name}`, err);
    }
  });

  await Promise.all(promesas);
  index += porPagina;
  loader.style.display = 'none';
  
  if (index >= razas.length) {
    cargarMas.style.display = 'none';
  }
}

// Mostrar mas
cargarMas.addEventListener('click', cargarSiguienteLote);

// Iniciar
cargarRazas();

function actualizarIconoFavorito(boton, breedId) {
  const favoritos = JSON.parse(localStorage.getItem('favoritosGatos')) || [];
  const esFavorito = favoritos.some(f => f.id === breedId);

  boton.querySelector('img').src = esFavorito
    ? '../public/img/favorito-s.svg'
    : '../public/img/favorito-n.svg';
}

/* Filtrar */
function filtrarYOrdenar(data) {
  const orden = document.getElementById('orden').value;
  const origenSel = document.getElementById('origen').value;
  const texto = document.getElementById('buscador').value.toLowerCase();

  let resultado = [...data];

  // Filtro por origen
  if (origenSel !== 'todos') {
    resultado = resultado.filter(b => b.origin === origenSel);
  }

  // Filtro por buscador (nombre de raza)
  if (texto.trim() !== '') {
    resultado = resultado.filter(b =>
      b.name.toLowerCase().includes(texto)
    );
  }

  // Ordenamiento
  if (orden === 'az') {
    resultado.sort((a, b) => a.name.localeCompare(b.name));
  } else if (orden === 'za') {
    resultado.sort((a, b) => b.name.localeCompare(a.name));
  }

  return resultado;
}


/* Aplcar filtros*/
function aplicarFiltros() {
  loader.style.display = 'flex';
  index = 0;
  contenedor.innerHTML = ''; 
  cargarSiguienteLote(); 
  cargarMas.style.display = 'block';
}
