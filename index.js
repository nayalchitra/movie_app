// const { default: axios } = require("axios");

const URL = "http://localhost:8000/data";
const searchInput = document.querySelector('.input');

const ratingValue = document.querySelector('.value-rating');
const genreRating = document.querySelector('.genre-filter');
const appTitle = document.querySelector('.heading-1');

let serachValues = "";
let rating = 0;
let filteredData = [];
let genreValue = "";

let genre = new Set();

const getMovieData  = async (URL) =>{
        try {
            const {data} = await axios.get(URL);
            return data;
        } catch (error) {
            
        }
}

const movieData = await getMovieData(URL);



const createElement = (element)=>document.createElement(element);
const mainContainer = document.querySelector('.main');

const createMovieCard = (movieData)=>{
        mainContainer.innerHTML = "";
        for(let movie of movieData){
            // console.log(movie);
            // create card
            const cardContainer = createElement('div');
            cardContainer.classList.add("card");

            // card image 
            const cardImageContainer = createElement('div');
            cardImageContainer.classList.add('card-image-container');

            const image = createElement('img');
            image.setAttribute('src',movie.img_link);
            image.classList.add('card-image');
            image.setAttribute('alt','movie');

            cardImageContainer.appendChild(image);

            // movie details
            const movieDetailsContainer = createElement('div');
            movieDetailsContainer.classList.add('movie-details');

            // title
            const title = createElement('p');
            title.classList.add('title');
            title.innerHTML = movie.name;

            // genre
            const genre = createElement('p');
            genre.classList.add('genre');
            genre.innerHTML = movie.genre;

            //ratings
            const ratingsContainer = createElement('div');
            ratingsContainer.classList.add('ratings');

            //star-rating
            const starRatingContainer = createElement('div');
            starRatingContainer.classList.add('star-ratings');

            // star-symbol
            const starSymbol = createElement('span');
            starSymbol.classList.add('material-symbols-outlined','star-color-filled');
            starSymbol.innerHTML = "star";


            //rating points
            const numberRating = createElement('span');
            numberRating.classList.add('number-rating');
            numberRating.innerHTML = movie.imdb_rating;


            starRatingContainer.appendChild(starSymbol);
            starRatingContainer.appendChild(numberRating);

            // movieTime
            const movieTime = createElement('p');
            movieTime.innerHTML = `${movie.duration} mins`;

            ratingsContainer.appendChild(starRatingContainer);
            ratingsContainer.appendChild(movieTime);

            movieDetailsContainer.appendChild(title);
            movieDetailsContainer.appendChild(genre);
            movieDetailsContainer.appendChild(ratingsContainer);

            cardContainer.appendChild(cardImageContainer);
            cardContainer.appendChild(movieDetailsContainer);

            mainContainer.appendChild(cardContainer);

        }

        
}


createMovieCard(movieData);

const getFilteredData= ()=>{
   
    filteredData = serachValues?.length > 0 ? 
            movieData.filter((movie)=>movie.name.toLowerCase().includes(serachValues) || 
            movie.writter_name.toLowerCase().includes(serachValues) || 
            movie.director_name.toLowerCase().includes(serachValues) ||
            movie.cast_name.toLowerCase().includes(serachValues)
            ) :
            movieData;
    

    if(rating?.length > 0){
      
        filteredData = serachValues?.length > 0 ? filteredData : movieData;
        filteredData = filteredData.filter(movie => movie.imdb_rating >= rating);
     
    }
    if(genreValue?.length > 0){
        filteredData = serachValues?.length > 0  || rating?.length > 0 ? filteredData : movieData;
        filteredData = filteredData.filter((movie)=>movie.genre.includes(genreValue));
       
    }
    return filteredData;
}

const handleSearch= (e)=>{
    serachValues = e.target.value.toLowerCase();
    filteredData = getFilteredData();
    mainContainer.innerHTML = "";
    createMovieCard(filteredData);
}


function debounce(callback, delay){
    let timer ;
   
    return (...args)=>{
        clearTimeout(timer);
        
        timer = setTimeout(()=>callback(...args),delay);
    }
}


searchInput.addEventListener('keyup', debounce(handleSearch,3000));

const handleFilterByRating = (e)=>{
    rating = e.target.value;
    filteredData = getFilteredData()
    mainContainer.innerHTML = "";
    createMovieCard(filteredData);
    
}

ratingValue.addEventListener('click', handleFilterByRating);


const getGenreData = (movieData)=>{
    for(let movie of movieData){
        let arr = movie.genre.split(",");
        genre.add(...arr);
        
    }
}

getGenreData(movieData);

const genreData = ()=>{
    
    let option = createElement('option');
    option.innerHTML = "--genre--";
    genreRating.appendChild(option);
    for(let gen of genre){
         option = createElement('option');
         option.setAttribute('value',gen)
        option.innerHTML = gen;
        genreRating.appendChild(option);
    }
    
}

genreData();



genreRating.addEventListener('change', (e)=>{
    //console.log("change");
    //console.log(e.target.value);
    genreValue = e.target.value;
    filteredData = getFilteredData();
    mainContainer.innerHTML = "";
    createMovieCard(filteredData);
})

appTitle.addEventListener('click',()=>{
    location.reload();
})