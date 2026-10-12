const APY_KEY = 'bbe5b1a42479aeb0abba2f9303117e67';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesgrid = document.getElementById('movies-grid');
const loading_Div = document.getElementById('loading');
const erroDiv = document.getElementById('error');
const errorMessage = document.getElementById('error-message');

const mostrarLoading = () => {
    loading_Div.style.display = 'flex';
    erroDiv.style.display = 'none';
    moviesgrid.innerHTML = '';
}

const ocultarLoading = () => {
    loading_Div.style.display = 'none';
}

const mostrarError = (mensaje) => {
    ocultarLoading();
    errorMessage.textContent = mensaje;
    erroDiv.style.display = 'flex';
    moviesgrid.innerHTML = '';
}

const obtenerPeliculas = async () => {
    const url = `${BASE_URL}/movie/popular?api_key=${APY_KEY}&language=es-ES`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos.results;
}

const crearTarjeta = (pelicula) => {
    const { title, release_date, vote_average, poster_path } = pelicula;
    const año = release_date ? release_date.split('-')[0] : 'N/A';
    const imagen = poster_path ? `${IMAGE_URL}${poster_path}` : '';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
    return `
        <article class="movie-card">
            <div class="movie-card__poster">
                <img class="movie-card__image" src="${imagen}" alt="${title}">
            </div>
            <div class="movie-card__content">
                <h3 class="movie-card__title">${title}</h3>
                <p class="movie-card__year">${año}</p>
            </div>
        </article>
    `;
}

const iniciar = async () => {
    console.log('Mostrar Pelicula');
    mostrarLoading();
    try {
        const peliculas = await obtenerPeliculas();
        console.log(`${peliculas.length} peliculas obtenidas`);
        ocultarLoading();
        moviesgrid.innerHTML = peliculas.map(crearTarjeta).join('');
        console.log('Peliculas renderizadas');
    } catch (error) {
        console.log('Error', error);
        let mensaje = 'No se pudo cargar la pelicula';
        if (error.message.includes('401')) {
            mensaje = 'Api key invalida, verifica tu clave';
        } else if (error.message.includes('fetch')) {
            mensaje = 'Error de red';
        } else if (error.message.includes('429')) {
            mensaje = 'Existen demasiadas peticiones, espere un momento';
        }

        mostrarError(mensaje);
    }
}

iniciar();
