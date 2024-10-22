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
const LazyLoad = () => {
    const images = document.querySelectorAll('img[data-src]'); // Selecciona todas las imágenes con el atributo data-src

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src'); // Reemplaza el data-src por el src real
          img.removeAttribute('data-src'); // Opcional: eliminar el atributo data-src después de que se ha cargado la imagen
          observer.unobserve(img); // Deja de observar la imagen ya que se ha cargado
        }
      });
    });
  
    images.forEach(image => {
      imageObserver.observe(image);
    });
  };

function createMovies (movies, container, lazyLoad=false) {
    container.innerHTML="";
    let billboard='';
    movies.forEach(movie => {
        billboard +=`
        <div class="movie-container" data-id="${movie.id}">
            <img
              data-src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" class="movie-img"
              alt="${movie.title}" />
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
        LazyLoad(); // Llamar a LazyLoad después de que las imágenes se han creado
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
    createMovies(movies, trendingMoviePreviewList, true);
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
    window.scroll(0,0);
}

