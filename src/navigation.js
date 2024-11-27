let maxPage;
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
        window.removeEventListener('scroll', infiniteScroll, {passive:false});
        infiniteScroll=undefined;
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
             if(infiniteScroll){
                window.addEventListener('scroll', infiniteScroll, {passive:false});
            }
        return;
        }
    }
    homePage();    
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
    likedSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();

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
    likedSection.classList.add('inactive');
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
    likedSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#search', 'loBuscado'] 
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
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
    likedSection.classList.add('inactive');
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
    likedSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //['#category', 'id-name'] 
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName]= categoryData.split('-');

    headerCategoryTitle.innerHTML= decodeURIComponent( categoryName);
    window.scroll(0,0);
    getMoviesByCategory(categoryId);
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}