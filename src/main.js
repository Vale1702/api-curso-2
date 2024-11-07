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
const images = document.querySelectorAll('[data-src]');

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.getAttribute('data-src'); 
      lazyLoader.unobserve(img); // Deja de observar una vez cargada.
      console.log(`Imagen cargada: ${img.src}`);
    }
  });
}, {
  root: null,
  threshold: 0.1
});

function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) {
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
          class="movie-img lazy-image"
          alt="${movie.title}" />
      </div>`;
  });

  container.innerHTML = billboard;

  const movieContainers = container.querySelectorAll('.movie-container');
  movieContainers.forEach(movieContainer => {
    movieContainer.addEventListener('click', () => {
      const movieId = movieContainer.getAttribute('data-id');
      location.hash = '#movie=' + movieId;
    });
  });

  if (lazyLoad) {
    const images = container.querySelectorAll('.lazy-image');
    images.forEach((img) => lazyLoader.observe(img));
  }
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
    createMovies(movies, genericSection, true);
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

async function  getTrendingMovies(page =1) {
    const {data} = await api('trending/movie/day', {
        params:{
            page,
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });

    // const btnLoadMore= document.createElement('button');
    // btnLoadMore.innerText='Cargar más';
    // btnLoadMore.addEventListener('click',()=>{
    //     btnLoadMore.style.display= 'none';
    //     getTrendingMovies(page +1)
    // });
    // genericSection.appendChild(btnLoadMore);    
}
async function showTrendingPage() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    
    console.log( scrollTop, scrollHeight, clientHeight);

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
    if (scrollIsBottom) {
        page++ ;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
        
        createMovies(
            movies,
            genericSection,
            { lazyLoad: true, clean: false },
        );
        console.log('Scroll is Buttom', scrollIsBottom);
    }
    // console.log(showTrendingPage);

//     // const btnLoadMore = document.createElement('button');
//     // btnLoadMore.innerText = 'Cargar más';
//     // btnLoadMore.addEventListener('click', showTrendingPage);
//     // genericSection.appendChild(btnLoadMore);
//     // console.log('Carga de nuevo el scroll')
// }
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

