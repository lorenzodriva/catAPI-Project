const apiKey = 'live_UMXdlmxz4z36xnY7qyyivBnCNNUgQ5GJwvRjVw8mgbX0slUMljlH67W3WJINlHLZ';
const btnIniciar = document.getElementById('btn-iniciar');
const contenedorJuego = document.getElementById('contenedor-juego');
const contenedorImagen = document.getElementById('contenedor-imagen');
const contenedorOpciones = document.getElementById('contenedor-opciones');
const bloqueVidas = document.getElementById('bloque-vidas');

let razas = [];
let vidas = 7;
let razaCorrecta = null;

btnIniciar.addEventListener('click', async () => {
    btnIniciar.style.display = 'none';
    contenedorJuego.classList.remove('oculto');
    bloqueVidas.innerHTML = '';
    vidas = 7;
    for (let i = 0; i < 7; i++) {
        const img = document.createElement('img');
        img.src = '/img/gato-exito.svg';
        img.classList.add('vida');
        bloqueVidas.appendChild(img);
    }
    await cargarRazas();
    siguienteNivel();
});

async function cargarRazas() {
    const res = await fetch('https://api.thecatapi.com/v1/breeds', {
        headers: { 'x-api-key': apiKey }
    });
    razas = await res.json();
}

async function siguienteNivel() {
    contenedorOpciones.innerHTML = '';
    contenedorImagen.innerHTML = '';

    const seleccionadas = razas.sort(() => 0.5 - Math.random()).slice(0, 3);
    razaCorrecta = seleccionadas[Math.floor(Math.random() * 3)];

    const res = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${razaCorrecta.id}&api_key=${apiKey}`);
    const data = await res.json();
    const imgUrl = data[0]?.url || '/img/gato-error.svg';

    contenedorImagen.innerHTML = `<img src="${imgUrl}" alt="Gato" class="gato-imagen">`;

    seleccionadas.forEach(breed => {
        const btn = document.createElement('button');
        btn.textContent = breed.name;
        btn.classList.add('opcion');
        btn.addEventListener('click', () => verificarRespuesta(btn, breed));
        contenedorOpciones.appendChild(btn);
    });
}

function verificarRespuesta(boton, seleccion) {
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(op => op.disabled = true);

    if (seleccion.id === razaCorrecta.id) {
        boton.classList.add('correcta');
    } else {
        boton.classList.add('incorrecta');
        vidas--;
        const vidasImgs = bloqueVidas.querySelectorAll('img');
        const idx = vidasImgs.length - vidas - 1;
        if (vidasImgs[idx]) {
            vidasImgs[idx].src = '/img/gato-error.svg';
            vidasImgs[idx].style.opacity = '0.5';
        }
    }

    setTimeout(() => {
        if (vidas > 0) siguienteNivel();
        else finDelJuego();
    }, 1000);
}

function finDelJuego() {
    contenedorJuego.innerHTML = `
    <div class="fin-juego">
        <h2>¡Fin del juego!</h2>
        <p>Has perdido todas las vidas.</p>
        <button onclick="location.reload()">Volver a intentar</button>
    </div>
    `;
}