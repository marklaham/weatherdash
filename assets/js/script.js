var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var resultContentE2 = document.querySelector('#result-weekly');
var searchFormEl = document.querySelector('#search-form');
var searchHistoryDisplay = document.querySelector('#search-history-list');
//var clearSearchButton = document.getElementById ('clear-search-btn');


var lat ;
var lon ;
var currentCity = '';
var currentQuery = '';

//declaring a moment object for current date
var today = moment();

//retreiving saved searches from local storage and assigning to an array if it is not null
var jsonData = JSON.parse(localStorage.getItem('searchedCitiesList')) ;
var searchHistoryArray =  [];

//console.log(jsonData);
if (jsonData !== null) {

        for(var i = 0; i < jsonData.length; i++)
            searchHistoryArray.push(jsonData[i]);

    //console.log( searchHistoryArray);
}

//update the display history with what was retreived from local storage
updateHistoryDisplay ();


// Display current weather for what ever city is passed to it from who ever calls the method 
function printCurrentWeather (resultObj) {
   // console.log(resultObj);


    //creates the main card and the div elements to dispaky current weather 
    var currentResultCard = document.createElement('div');
    currentResultCard.classList.add("current-card");

    var cardHeading = document.createElement('h2');
    cardHeading.innerText = currentCity.toUpperCase() + "  " + today.format("ddd MMM Do");

    var currentTemp = resultObj.current.temp - 273;
  
    // set up `<div>` to hold result content
     currentTempResult = document.createElement('div');
    currentTempResult.classList.add('current-temp');
    currentTempResult.innerText = "Temp: " + currentTemp.toFixed(0) + " C";
  
    var currentHumResult  = document.createElement('div');
    currentHumResult.classList.add('current-Humidity');
    currentHumResult.innerText = "Humidity: " + resultObj.current.humidity;
   // currentTempResult.append(currentHumResult);

  
    var currentWindResult  = document.createElement('div');
    currentWindResult.classList.add('current-Himidity');
    currentWindResult.innerText = "Wind speed: " + (resultObj.current.wind_speed * 3.6) + "  Km/h";
// currentTempResult.append(currentWindResult);

    var currentUVResult  = document.createElement('div');
    currentUVResult.classList.add('current-UV');
    currentUVResult.innerText = "UV Index: "
    var uvAnswer = document.createElement('span');
    uvAnswer.innerText = resultObj.current.uvi;


    //if else statement handles the color code for the uvi index
    if (resultObj.current.uvi <6){
       uvAnswer.setAttribute("style", "background-color: yellow;");
    } else if (resultObj.current.uvi > 5 &&  resultObj.current.uvi < 8){
        uvAnswer.setAttribute("style", "background-color: orange;");
    } else if (resultObj.current.uvi > 7){
        uvAnswer.setAttribute("style", "background-color: red;");
    }
     currentUVResult.append(uvAnswer);

    //ads all the elements to the card 
   currentResultCard.append(cardHeading, currentTempResult, currentHumResult, currentWindResult, currentUVResult);
    
   //ads the card to the page
    resultContentEl.append(currentResultCard);
  }


// prints five day  weather function 
function printFiveDayWeather (resultObj) {
    //resultObj.preventDefault();
    console.log(resultObj);
    resultContentE2.innerHTML = '';


    // For loop that creates the card and the div elements to dispaky 5 day  weather 
    for(i = 0; i < 5; i++ ) {
        // create the main card for that day
        var currentTemp = resultObj.daily[i].temp.day - 273;
        var dailyCard = document.createElement('div');
        dailyCard.classList.add('card');

        var cardHeading = document.createElement('h4');
        cardHeading.innerText = today.add(1, 'days').format('ddd');
  

        var  dailyTempResult = document.createElement('div');
        dailyTempResult.classList.add('daily-temp');
        dailyTempResult.innerText = "Temp: " + currentTemp.toFixed(0) + " C";

    
        var dailyHumResult  = document.createElement('div');
        dailyHumResult.classList.add('current-Humidity');
        dailyHumResult.innerText = "Humidity: " + resultObj.daily[i].humidity;


        var dailyIconResult  = document.createElement('div');
        dailyIconResult.classList.add('daily-icon');
        var icon = resultObj.daily[i].weather[0].icon; 
        var image = document.createElement('IMG');
        image.src = "http://openweathermap.org/img/wn/" + icon + ".png"
        dailyIconResult.append(image);

        //append all the elements to the card 
        dailyCard.append(cardHeading ,dailyIconResult , dailyTempResult ,dailyHumResult);
        //append the card to the weekly display area
        resultContentE2.append(dailyCard);
    }
 }

//this function is passed a city name as a string and creates the query 
//and retrieves the lon and lat coordinates and then call the fetch function which
//will them fetch the info based on lon and lat 
function searchApi(query) {
  var locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Ottawa&appid=4c64699c4104231e444899cfd67fa821';
  currentCity = query;
  if (query) {
    locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=4c64699c4104231e444899cfd67fa821';//'/?fo=json'
   
  }

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      
        //assigns lon and lat to global var 
       lat = locRes.coord.lat;
       lon = locRes.coord.lon;

       //calls the function that fetches 
       fetchinfoByLonLat();
       

      if (!locRes.coord.lat) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
      
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

//feth the weather inof from the one call api by adding the lat and lon of the city that is being searched
function fetchinfoByLonLat(){

    var citySearchUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=4c64699c4104231e444899cfd67fa821';
      currentQuery = citySearchUrl;
  
    fetch(citySearchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (loc) {
      
  
       if (!loc.current) {
         console.log('No results found!');
         resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
         
        //function call to print current weather to screen
         printCurrentWeather(loc);
         //function to display 5 day cards to the screen 
         printFiveDayWeather(loc);
         //function to update the search history
         updateSearchHistory();
        }
    });
}

//fetch the weather info based on city name (so used ny the serach histroy buttons)
function fetchinfoByCity(){
   // var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Ottawa&appid=4c64699c4104231e444899cfd67fa821';
   
     var  queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + currentCity + '&appid=4c64699c4104231e444899cfd67fa821';//'/?fo=json'
    
    fetch(queryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (loc) {
       
       
       if (!loc.current) {
         console.log('No results found!');
         resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
         
         //function call to print current weather to screen
         printCurrentWeather(loc);
         //function to display 5 day cards to the screen
         printFiveDayWeather(loc);
        //function to update the search history
         updateSearchHistory();
        }
    });
}

//function that is called to update the Search history 
function updateSearchHistory(){
    currentCity = currentCity.toUpperCase();

        //checl to see if the city being searched is already in histroy
       if (!searchHistoryArray.includes(currentCity)){
        searchHistoryArray.push(currentCity);
        localStorage.setItem( 'searchedCitiesList', JSON.stringify(searchHistoryArray));

       }
        //updates the history on the screen.
        updateHistoryDisplay();

}

//updates the search history on the screen 
function updateHistoryDisplay ()  {

    if (searchHistoryArray !== null ){
       
        searchHistoryDisplay.innerHTML = '';

        for (i = 0; i < searchHistoryArray.length  ; i++) {

            var nextItem = document.createElement('li');
            var button = document.createElement('button');
            button.className= "search-list-button btn-info btn-block";
            button.attributes
            button.innerText = searchHistoryArray[i].toUpperCase();
            button.onclick = function preSearch(event) {searchApi(event.srcElement.innerHTML.toUpperCase()); }
            nextItem.append(button);
            searchHistoryDisplay.append(nextItem);
            
        }
    }
  
}

//hand;es submit button click event 
function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;

    //makes sure they entered something 
    if (!searchInputVal) {
        console.error('You need a search input value!');
        resultContentEl.innerHTML = 'You need a search input value!';
        resultContentE2.innerHTML = '';
        return;
    }

    searchApi(searchInputVal);
    searchFormEl.reset();
}



//event listener for submit button 
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
//clearSearchButton.addEventListener("submit", clearSearchHistory);

//clear search history in local storage and on screen 
function clearSearchHistory() {
  
    console.log('clear');
    searchHistoryArray = [];
    localStorage.clear();
    updateHistoryDisplay();

}

