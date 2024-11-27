//Data
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

function likedMoviesList(){
    //Devuelve el array de peliculas que se tengan guardadas en Local Storage//
    const item = localStorage.getItem('liked_movies');
    return item ? JSON.parse(item) : {};
}

function likeMovie(movie) {
    // movie.id
    if (!movie || !movie.id) {
        console.error('El objeto movie es inválido o no tiene un id');
        return;
      }
    console.log(movie);

 const likedMovies = likedMoviesList();
  console.log("Peliculas guardadas", likedMovies);
  if (likedMovies[movie.id]) {
    delete likedMovies[movie.id];
  } else {
    likedMovies[movie.id] = movie;
  }
    // console.log('MOVIE', movie);
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
    // console.log(likedMoviesList());
    // return likedMoviesList();
  }
//Utils

const lazyLoader = new IntersectionObserver(entries => {
  entries.forEach((entry) => {
    //   console.log(entry.target.setAttribute);
    if (entry.isIntersecting) {
     const img = entry.target;
      img.src = img.getAttribute('data-src'); // Asigna el atributo 'src' real
      img.removeAttribute('data-src'); // Elimina 'data-src' para evitar futuras observaciones
      lazyLoader.unobserve(img); // Deja de observar la imagen cargada
    //Muestra la URL de la imagen
    //    console.log(`Imagen cargada: ${img.src}`);
    }
 });
});

function createMovies(movies, container, {lazyLoad = true, clean = true } = {}) {
  if (clean) {
    container.innerHTML = "";
  }

  let billboard = '';
  movies.forEach(movie => {
    if (!movie.poster_path) return;
    
    billboard += `
      <div class="movie-container" data-id="${movie.id}">
        <img
        data-src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
        class="movie-img"
        alt="${movie.title}" />
        <button class="movie-btn"  data-favorite-btn="${movie.id}">
        </button>
        </div>`;
        });
        
        container.innerHTML = billboard;
        
    const movieContainers = container.querySelectorAll('.movie-container');
    movieContainers.forEach(movieContainer => {
        movieContainer.addEventListener('click', (e) => {
         const isFavoriteBtn = e.target.closest('[data-favorite-btn]');
        if(isFavoriteBtn){
            console.log("IsFavorite Btn", isFavoriteBtn);
            return;
        };
            const movieId = movieContainer.getAttribute('data-id');
            location.hash = '#movie=' + movieId;
            // console.log('MovieID', movieId);
        });
            
    });
    
    const movieBtns = container.querySelectorAll('[data-favorite-btn]');
    movieBtns.forEach(movieBtn =>{
        const movieId = movieBtn.getAttribute('data-favorite-btn');
        const movie = movies.find(m => m.id == movieId);
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', (e) =>{
            e.stopPropagation();
            e.stopImmediatePropagation();
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies();
        });
    });          

    if (lazyLoad) {
        const images = container.querySelectorAll('.movie-img');
        images.forEach((img) => {
            // Observar cada imagen para cargarla perezosamente
            lazyLoader.observe(img);
        });
        // console.log(images);
    }
 // Reiniciar scroll al tope
 document.body.scrollTop = 0;
 document.documentElement.scrollTop = 0;
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
    createCategories(categories, categoriesPreviewList, true)
}

async function  getMoviesByCategory(id) {
    const {data} = await api('discover/movie',{
        params:{
            with_genres : id,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    createMovies(movies, genericSection, {lazyLoad: true});
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('discover/movie',{
                params:{
                    with_genres:id,
                    page,
                },
            });
            const movies = data.results;
            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean: false },
            );
        }
    }
}

async function  getMoviesBySearch(query) {
    const {data} = await api('search/movie',{
        params:{
            query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('search/movie',{
                params:{
                    query,
                    page,
                },
            });
            const movies = data.results;
    
            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean: false },
            );
        }
    }
}

async function  getTrendingMovies() {
    const {data} = await api('trending/movie/day', {
        params:{
            page,
        }
    });
    const movies = data.results;
    maxPage=data.total_pages;
    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

async function showTrendingPage() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    
    console.log( scrollTop, scrollHeight, clientHeight);
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
        console.log(data);
        createMovies(
            movies,
            genericSection,
            { lazyLoad: true, clean: false },
        );
       // console.log('Scroll is Buttom', scrollIsBottom);
    }
    // console.log(showTrendingPage);
    // console.log('Carga de nuevo el scroll')
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

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMoviesListArticle, {lazyLoad: true, clean: true });
    console.log(likedMovies);
}