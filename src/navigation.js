searchFormBtn.addEventListener('click', () => {
    location.hash='#search=';
});

trendingBtn.addEventListener('click', () => {
    location.hash='#trends';
});

arrowBtn.addEventListener('click', () =>{
    location.hash='home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({ location });
    // Definimos un objeto 'routes' donde cada clave representa una parte del hash
    // y su valor es el mensaje que queremos mostrar en la consola.
    const routes = {
        '#trends': trendsPage,
        '#search=': searchPage,
        '#movie=': movieDetailsPage,
        '#category=':categoriesPage,
        '#home=': homePage
    };
    // Iteramos sobre las claves y valores del objeto 'routes'
    for (const [key, page] of Object.entries(routes)) {
        // Verificamos si el hash de la ubicación actual comienza con una de las claves
        if (location.hash.startsWith(key)) {
            // Si coincide, mostramos el valor correspondiente (mensaje) en la consola
            page();
            return;
        } 
    }
    homePage();
}

// Funciones para cada evento
function homePage() {
    console.log('Home!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ' ';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    const childrenCategoriesPreview = Array.from(categoriesPreviewList.children);
    if(!childrenCategoriesPreview.length){
        getTrendingMoviesPreview();
        getCategoriesPreview();
    }
}

function trendsPage() {
    console.log('Trends!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ' ';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
}

function searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ' ';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
}

function movieDetailsPage() {
    console.log('Movies!!');

    headerSection.classList.add('header-container--long');
    headerSection.style.background = ' ';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
}

function categoriesPage() {
    console.log('Categories!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ' ';
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

