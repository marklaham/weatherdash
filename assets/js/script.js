var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var resultContentE2 = document.querySelector('#result-weekly');
var searchFormEl = document.querySelector('#search-form');
var searchHistoryDisplay = document.querySelector('#search-history-list');
//var clearSearchButton = document.getElementById ('clear-search-btn');


var lat ;
var lon ;
var currentCity = '';
var isHis = false;

var currentQuery = '';

var today = moment();
var jsonData = JSON.parse(localStorage.getItem('searchedCitiesList')) ;
var searchHistoryArray =  [];

console.log(jsonData);
if (jsonData !== null) {

  
       // var obj = eval('(' + jsonData + ')');
        //var res = [];
        
        for(var i = 0; i < jsonData.length; i++)
            searchHistoryArray.push(jsonData[i]);


    //isHis = true;
    console.log( searchHistoryArray);
}
//console.log(searchHistoryArray);
//updateSearchHistory();;
updateHistoryDisplay ();


function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var query = searchParamsArr[0].split('=').pop();
  //var format = searchParamsArr[1].split('=').pop();

  searchApi(query);
}



function printResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
 // resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Date:</strong> ' + resultObj.date + '<br/>';

  if (resultObj.subject) {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> ' + resultObj.subject.join(', ') + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }

  if (resultObj.description) {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong> ' + resultObj.description[0];
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  No description for this entry.';
  }

  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'Read More';
  linkButtonEl.setAttribute('href', resultObj.url);
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContentEl.append(resultCard);
}



// prints current weather 
function printCurrentWeather (resultObj) {
    console.log(resultObj);


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
    currentWindResult.innerText = "Wind speed: " + resultObj.current.wind_speed;
   // currentTempResult.append(currentWindResult);

    var currentUVResult  = document.createElement('div');
    currentUVResult.classList.add('current-UV');
    currentUVResult.innerText = "UV Index: " + resultObj.current.uvi;
   // currentTempResult.append(currentUVResult);

   currentResultCard.append(cardHeading, currentTempResult, currentHumResult, currentWindResult, currentUVResult);

    resultContentEl.append(currentResultCard);
  }


// prints current weather 
function printFiveDayWeather (resultObj) {
    //resultObj.preventDefault();
    console.log(resultObj);
    resultContentE2.innerHTML = '';

    for(i = 0; i < 5; i++ ) {
        // set up `<div>` to hold result content
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
        //dailyTempResult.append(dailyHumResult);

    
        var dailyIconResult  = document.createElement('div');
        dailyIconResult.classList.add('daily-icon');
        var icon = resultObj.daily[i].weather[0].icon; 
        var image = document.createElement('IMG');
        image.src = "http://openweathermap.org/img/wn/" + icon + ".png"
        dailyIconResult.append(image);


        dailyCard.append(cardHeading ,dailyIconResult , dailyTempResult ,dailyHumResult);

        //currentWindResult.innerText = "Wind speed: " + resultObj.current.wind_speed;
       // dailyTempResult.append(dailyIconResult);

        //var currentUVResult  = document.createElement('div');
        //currentUVResult.classList.add('current-UV');
        //currentUVResult.innerText = "UV Index: " + resultObj.current.uvi;
        //currentTempResult.append(currentUVResult);

        resultContentE2.append(dailyCard);
    }
 }


function searchApi(query) {
  var locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Ottawa&appid=4c64699c4104231e444899cfd67fa821';
  currentCity = query;
  if (query) {
    locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=4c64699c4104231e444899cfd67fa821';//'/?fo=json'
   
  }

 // locQueryUrl = locQueryUrl + '&q=' + query;

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
        //console.log(locRes);
      // write query to page so user knows what they are viewing
      //resultTextEl.textContent
       lat = locRes.coord.lat;
       lon = locRes.coord.lon;
       fetchinfoByLonLat();
       

      if (!locRes.coord.lat) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
       // for (var i = 0; i < locRes.coord.lat; i++) {
          //printResults(locRes.results[i]);
       // }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}


function fetchinfoByLonLat(){

    // 'https://api.openweathermap.org/data/2.5/weather?q=Ottawa&appid=4c64699c4104231e444899cfd67fa821';
    var citySearchUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=4c64699c4104231e444899cfd67fa821';
      currentQuery = citySearchUrl;
    //var citySearchUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid=4c64699c4104231e444899cfd67fa821'
  //  if (query) {
   //   locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=4c64699c4104231e444899cfd67fa821';//'/?fo=json'
  //  }
  console.log(citySearchUrl);
   // locQueryUrl = locQueryUrl + '&q=' + query;
  
    fetch(citySearchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (loc) {
          console.log(loc);
        // write query to page so user knows what they are viewing
        //resultTextEl.textContent
       
  
       if (!loc.current) {
         console.log('No results found!');
         resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
         
         // for (var i = 0; i < loc.coord.lat; i++) { 
         printCurrentWeather(loc);
         printFiveDayWeather(loc);
         updateSearchHistory();
        }
    });
}


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
          console.log(loc);
        // write query to page so user knows what they are viewing
        //resultTextEl.textContent
       
  
       if (!loc.current) {
         console.log('No results found!');
         resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
         
         // for (var i = 0; i < loc.coord.lat; i++) { 
         printCurrentWeather(loc);
         printFiveDayWeather(loc);
         updateSearchHistory();
        }
    });
}




function updateSearchHistory(){
   // if (searchHistoryArray !== null){
       if (!searchHistoryArray.includes(currentCity)){
           //var queryObj  = { city: currentCity, query: currentQuery};
        searchHistoryArray.push(currentCity);
        localStorage.setItem( 'searchedCitiesList', JSON.stringify(searchHistoryArray));

       }
        
        updateHistoryDisplay();
   // }
}

function updateHistoryDisplay ()  {

    if (searchHistoryArray !== null ){
       
        searchHistoryDisplay.innerHTML = '';
        for (i = 0; i < searchHistoryArray.length  ; i++) {

            var nextItem = document.createElement('li');
            var button = document.createElement('button');
            button.className= "search-list-button";
            button.innerText = searchHistoryArray[i];
            button.onclick = function preSearch(event) {searchApi(event.srcElement.innerHTML); }
            nextItem.append(button);
            searchHistoryDisplay.append(nextItem);
            
        }
    }
  
}


function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }

    searchApi(searchInputVal);
    searchFormEl.reset();
}




searchFormEl.addEventListener('submit', handleSearchFormSubmit);
//clearSearchButton.addEventListener("submit", clearSearchHistory);

function clearSearchHistory() {
    //event.preventDefault();
    console.log('clear');
    searchHistoryArray = [];
    localStorage.clear();
    updateHistoryDisplay();

}

//localStorage.clear();
//updateSearchHistory();
