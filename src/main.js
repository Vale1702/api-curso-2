const api=axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    },
    params:{
        'api_key': API_KEY,
        'language': 'es',
    }
})

//Utils

function createMovies (movies, container) {
    container.innerHTML="";
    let billboard='';
    movies.forEach(movie => {
        billboard +=`
        <div class="movie-container" data-id="${movie.id}">
            <img
              src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" class="movie-img"
              alt="${movie.title}"
              loading="lazy"    />
        </div> `        
    });
    container.innerHTML=billboard;
    const movieContainers= container.querySelectorAll('.movie-container');
    movieContainers.forEach(movieContainers=>{
        movieContainers.addEventListener('click', (event)=>{
            const movieId= movieContainers.getAttribute('data-id');
            location.hash='#movie='+ movieId;
        });
    });
}

function createCategories(categories, container){
    container.innerHTML="";
    let cat=''; //construye todo el HTML de las categorías
    categories.forEach(category => {
         cat +=`
        <div class="category-container">
            <h3 class="category-title" id ="id${category.id}">
            ${category.name}
            </h3>
        </div>`
        });
        //Añade todo el HTML al DOM
         container.innerHTML = cat;
    
        // Selecciona todos los elementos recién añadidos y agrega los eventos
    categories.forEach(category => {
        const categoryTitle  = document.getElementById(`id${category.id}`);
        categoryTitle.addEventListener('click', () => {
            location.hash=`#category=${category.id}-${category.name} `;
        })
    });

}
//Llamados a la API
async function  getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, trendingMoviePreviewList);
}

async function  getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;
    createCategories(categories, categoriesPreviewList)
}

async function  getMoviesByCategory(id) {
    const {data} = await api('discover/movie',{
        params:{
            with_genres : id,
        },
    });
    const movies = data.results;
    createMovies(movies, genericSection);
}
async function  getMoviesBySearch(query) {
    const {data} = await api('search/movie',{
        params:{
            query,
        },
    });
    const movies = data.results;
    createMovies(movies, genericSection);
}

async function  getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, genericSection);
}
async function  getMovieById(id) {
    const {data: movie} = await api('movie/' + id);
    const movieImgUrl='https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})`;    
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    createCategories(movie.genres, movieDetailsCategoriesList);
    getRelatesMovieById(id);
}
async function  getRelatesMovieById(id) {
    const {data} = await api(`movie/${id}/similar`);
    const relatedMovies=data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
    // window.scroll(0,0);
}

