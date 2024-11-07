let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash='#search='+ searchFormInput.value;
    searchFormInput.value='';
});

trendingBtn.addEventListener('click', () => {
    location.hash='#trends=';
});

arrowBtn.addEventListener('click', () =>{
    // if (history.length > 1) {
    //     history.back()
    //   } else {
    //     location.hash = "#home"
    //   };
    history.back();
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
    console.log({ location });
    if(infiniteScroll){
        window.removeEventListener('scroll',{
            passive:false
        });
    }

    const routes = {
        '#trends=': trendsPage,
        '#search=': searchPage,
        '#movie=': movieDetailsPage,
        '#category=': categoriesPage,
        '#home=': homePage
    };

    for (const [key, page] of Object.entries(routes)) {
        if (location.hash.startsWith(key)) {
            page();
            return;
        }
         window.addEventListener('scroll',{
        passive:false
    });
    }
    homePage();
   
   // Cargar la página de inicio si no hay coincidencias
} 
// Funciones para cada evento
function homePage() {
    console.log('Home!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();

    // const childrenCategoriesPreview = Array.from(categoriesPreviewList.children);
    // if(!childrenCategoriesPreview.length){
    //     getTrendingMoviesPreview();
    //     getCategoriesPreview();
    // }
}

function trendsPage() {
    console.log('Trends!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    headerCategoryTitle.innerHTML= 'Tendencias';
    getTrendingMovies();
    infiniteScroll = showTrendingPage;
}

function searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#search', 'loBuscado'] 
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);
}

function movieDetailsPage() {
    console.log('Movies!!');

    headerSection.classList.add('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

     //['#movie', 'ID 93848'] 
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function categoriesPage() {
    console.log('Categories!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#category', 'id-name'] 
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName]= categoryData.split('-');

    headerCategoryTitle.innerHTML= decodeURIComponent( categoryName);
    window.scroll(0,0);
    getMoviesByCategory(categoryId);
}
