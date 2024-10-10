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
    let billboard='';
    movies.forEach(movie => {
        billboard +=`
        <div class="movie-container">
            <img
              src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" class="movie-img"
              alt="${movie.title}"
              loading="lazy"    />
        </div> `
    });
    container.innerHTML=billboard;
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

