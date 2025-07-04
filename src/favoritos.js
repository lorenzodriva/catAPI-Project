import { abrirModal } from './modal.js';

const contenedor = document.getElementById('contenedor-cards');
const loader = document.getElementById('loader');
const favoritos = JSON.parse(localStorage.getItem('favoritosGatos')) || [];
const modal = document.getElementById('modal-detalle');
const cerrarBtn = document.getElementById('cerrar-modal');



/* Si no encuentra favoritos guardados */
if (favoritos.length === 0) {
    contenedor.innerHTML = `
        <div class="pantalla-error">
            <h3>¡No hay favoritos guardados!</h3>
            <p>Vuelve a <a href="./gatos.html"><u><b>Gatos</b></u></a> y guarda tus favoritos!</p>
            <img src="/img/gato-error.svg" alt="Imagen de gato error">
        </div>
    `;

    loader.style.display = 'none';

/* Recopilar los favoritos en las cards*/
} else {
    favoritos.forEach(breed => {
        const card = document.createElement('div');
        card.classList.add('card-gato');

        const imagenHtml = breed.imagen
        ? `<div class="foto" style="background-image: url('${breed.imagen}')"></div>`
        : `<div class="foto-sin-imagen"><div class="foto-logo"></div><div class="texto">Sin imagen</div></div>`;

        card.innerHTML = `
        <div class="card-imagen">
            <div class="contenedor-foto">${imagenHtml}</div>
        </div>
        <div class="texto">
            <h3 class="nombre">${breed.name}</h3>
            <p class="detalles"><b>Origen</b>: ${breed.origin}<br><b>Temperamento</b>: ${breed.temperament.split(',').slice(0,2).join(', ')}</p>
        </div>
        <div class="card-contenedor-boton">
            <button class="detalles-btn"><img src="/img/info.svg" title="Ver detalles"></button>
            <button class="favoritos-btn"><img src="/img/favorito-s.svg" title="Quitar de Favoritos" alt="♥"></button>
        </div>
        `;

        /* Abrir el modal */
        card.querySelector('.detalles-btn').addEventListener('click', () => {
            abrirModal(breed, breed.imagen);
        });
        /* Cerrar el modal */
        cerrarBtn.addEventListener('click', () => {
            modal.classList.add('oculto');
        });


        /* Quitar de favoritos y remover la card de la pantalla de Favoritos */
        card.querySelector('.favoritos-btn').addEventListener('click', () => {
            const favoritosActuales = JSON.parse(localStorage.getItem('favoritosGatos')) || [];

            const nuevos = favoritosActuales.filter(f => f.id !== breed.id);

            localStorage.setItem('favoritosGatos', JSON.stringify(nuevos));

            card.remove();
            /* Mostrar pantalla de favoritos nulos */
            if (nuevos.length === 0) {
                contenedor.innerHTML = `
                <div class="pantalla-error">
                    <h3>¡No hay favoritos guardados!</h3>
                    <p>Vuelve a <a href="./gatos.html"><u><b>Gatos</b></u></a> y guarda tus favoritos!</p>
                    <img src="/img/gato-error.svg" alt="Imagen de gato error">
                </div>
                `;
            }
        });


        contenedor.appendChild(card);
    });
    /* Ocultar el loader si ya cargaron*/
    loader.style.display = 'none';
}


