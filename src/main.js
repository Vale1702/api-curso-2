async function  getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();

    const movies = data.results;

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer =document.querySelector('#trendingPreview .trendingPreview-movieList')

    const billboard=`
        <div class="movie-container">
            <img
              src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
              class="movie-img"
              alt=${movie.title}/>
          </div> `
          trendingPreviewMoviesContainer.innerHTML += billboard
    });
    console.log( {data , movies});
}

async function  getCategoriesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    const data = await res.json();

    const categories = data.genres;
        categories.forEach(category => {
        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')

    const cat=`
          <div class="category-container">
            <h3 class="category-title" id ="id${category.id}">
            ${category.name}
            </h3>
          </div>`
          previewCategoriesContainer.innerHTML += cat
    });
}

getTrendingMoviesPreview();
getCategoriesPreview();