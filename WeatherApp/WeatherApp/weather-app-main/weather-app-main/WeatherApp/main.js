 const api = {
    key: "806732ec48db8aec66138a331df68892",                                     //mohammed ver2
    baseurl: "https://api.openweathermap.org/data/2.5/"
 }

        //Save to local storage

    let searchHistory = (localStorage.searchHistory) ? JSON.parse(localStorage.searchHistory) : [];

    document.querySelector(".search").addEventListener("click", () => {
        let val = document.querySelector(".searchbox").value;
        if (!searchHistory.includes(val)) {
            searchHistory.push(val);
        }
    localStorage.searchHistory = JSON.stringify(searchHistory);
 });

    document.querySelector(".search").addEventListener("click", () => {
    let data = document.querySelector("ul.dropdown-content");
    data.innerHTML = "";    

    searchHistory.forEach((search) => {
        console.log(search);
        // data.innerHTML = "<option>" + data.innerHTML;
        // data.querySelector("option").innerText = search;        
        let listItem = document.createElement("LI");
        listItem.className = "ListItem";
        let textNode = document.createTextNode(search);
        listItem.addEventListener("click", function (){
            getResults(search);
            getFiveDayForecast(search);
            
    });

        listItem.appendChild(textNode);
        data.appendChild(listItem);
        });
  
    });

    //Button to delete saved items from local storage

 document.querySelector(".deleteBtn").addEventListener("click", () =>{
    let data = document.querySelector("ul.dropdown-content");
    data.innerHTML = "";
    localStorage.clear();
 })

    const deleteBtn = document.querySelector('.deleteBtn');
    const searchbox = document.querySelector('.searchbox');
    const adFavorite = document.querySelector('.adFavorite');
    const forecast = document.querySelector('.day');

    //Search with the ENTER key

searchbox.addEventListener('keypress', (evt) => {
    if (evt.keyCode == 13 && searchbox.value != ""){
        getResults(searchbox.value);
        getFiveDayForecast(searchbox.value);
        console.log(searchbox.value)
    }
});

        //Search with a button press

adFavorite.addEventListener('click', () => {
    if (searchbox.value != ""){
        getResults(searchbox.value);
        getFiveDayForecast(searchbox.value);
    }
});

        

    //Fetch weather valeus from api

function getResults(query) {
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults);
}


function displayResults (weather) {
    let city = document.querySelector('.place .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.place .date');
    date.innerText = dateBuilder (now);

    let currentTime = new Date();
    let time = document.querySelector('.place .time');
    time.innerText = timeBuilder (currentTime);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
   
    let highlow = document.querySelector('.high-low');
    highlow.innerText = `Low < ${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c > High`;

    //More info section of current day

    let windDeg = document.querySelector('.wind-deg')
    windDeg.innerText = `Wind Degree: ${weather.wind.deg}°`;

    let windGust = document.querySelector('.wind-gust')
    windGust.innerText = `Wind Gust: ${weather.wind.gust} kn`;

    let windSpeed = document.querySelector('.wind-speed')
    windSpeed.innerText = `Wind Speed: ${weather.wind.speed} km/h`;

    let weatherPressure = document.querySelector('.weather-pressure')
    weatherPressure.innerText = `Weather Pressure: ${weather.main.pressure} hPa`;

    let weatherHumidity = document.querySelector('.weather-humidity')
    weatherHumidity.innerText = `Humidity: ${weather.main.humidity} %`;

    let weatherFeelsLike = document.querySelector('.weather-feels-like')
    weatherFeelsLike.innerText = `Feels Like: ${weather.main.feels_like} °c`;

    document.getElementById('icon').src = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`; //image
}

        //Get 5 day forecast

function getFiveDayForecast(query) {
    fetch(`${api.baseurl}forecast?q=${query}&units=metric&APPID=${api.key}`)
    .then(forecast => {
        return forecast.json();
    }).then(displayForecastResults);
}

        //Displaying the weather valeus for the next 5 days

function displayForecastResults (forecast) {
    var iterator = 0;
    forecast.list.forEach(element => {
        var dateTime = element.dt_txt.split(" ");
        var date = dateTime[0];
        var time = dateTime[1];
        if (time === "15:00:00" && iterator === 0 ) {
            iterator += 1;          
            displayForecastTable('forcastTable', 'day1', element, date, 'icon1')

        } else  if (time === "15:00:00" && iterator === 1) {
            iterator += 1;
            displayForecastTable('forcastTable1', 'day2', element, date, 'icon2')
        }
        else  if (time === "15:00:00" && iterator === 2) {
            iterator += 1;
            displayForecastTable('forcastTable2', 'day3', element, date, 'icon3')

        } else if (time === "15:00:00" && iterator === 3) {
            iterator += 1;
            displayForecastTable('forcastTable3', 'day4', element, date, 'icon4')

        } else if (time === "15:00:00" && iterator === 4) {
            iterator += 1;
            displayForecastTable('forcastTable4', 'day5', element, date, 'icon5')
        }
    });
}

function displayForecastTable (forecastTable, day, element, date, iconId) {
    let windSpeedForcast = document.querySelector(`.${forecastTable} .wind-speed`)
    windSpeedForcast.innerText = `Wind Speed: ${element.wind.speed} km/h`;
    let highTempForcast = document.querySelector(`.${forecastTable} .high-temp`)
    highTempForcast.innerText = `High Temp: ${element.main.temp_max} °c`;            
    let lowTempForcast = document.querySelector(`.${forecastTable} .low-temp`)
    lowTempForcast.innerText = `Low Temp: ${element.main.temp_min} °c`;
    let pressureForcast = document.querySelector(`.${forecastTable} .weather-pressure`)
    pressureForcast.innerText = `Weather Pressure: ${element.main.pressure}`;
    let humidityForcast = document.querySelector(`.${forecastTable} .humidity`)
    humidityForcast.innerText = `Humidity: ${element.main.humidity} %`;          
    let feelsLikeForcast = document.querySelector(`.${forecastTable} .feels-like`)
    feelsLikeForcast.innerText = `Feels Like: ${element.main.feels_like} °c`;

    let forecastdate = document.querySelector(`.${forecastTable} .${day}`)
    forecastdate.innerText = date;

    document.getElementById(iconId).src = `http://openweathermap.org/img/w/${element.weather[0].icon}.png`;
}

function dateBuilder (d) {
let months = ["January", "February", "March", "April", "May", "June", 
"July", "August", "September", "October", "November", "December"];

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
"Saturday"];

let day = days[d.getDay()];
let date = d.getDate();
let month = months[d.getMonth()];
let year = d.getFullYear();

return `${day} ${date} ${month} ${year}`;
}

function timeBuilder(timeInMillis){
    let time = new Date(timeInMillis.getTime());

    if(time.getMinutes() < 10) {
        return `${time.getHours()}:0${time.getMinutes()}`;
    }
    return `${time.getHours()}:${time.getMinutes()}`;
}

function onPageLoad() {
    getLocation();
}

window.onload = onPageLoad();

function hideAndShowForecastTable() {
    var x = document.querySelector('.allForcast');
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

    //My current location

  const x = document.getElementById("location");
  function getLocation() {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          x.innerHTML = "Location not supported."
      }
  };

  function showPosition(position) {      
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;      

      fetch (`${api.baseurl}forecast?lat=${lat}&lon=${lon}&appid=${api.key}`)
      .then(response => response.json()).then(data => {
          x.innerHTML = data.city.name;
          getWeatherDataForLocation(data.city.name);
      }).catch(error => {
          console.log(error);
      })   
  };

function getWeatherDataForLocation (location) {
    getResults(location);
    getFiveDayForecast(location);
}

//canvas

let canvas = document.querySelector('.myCanvas');
ctx = canvas.getContext("2d");    
ctx.font="75px verdana";
ctx.shadowColor="black";
ctx.shadowBlur=7;
ctx.lineWidth=5;
ctx.strokeText("Weather-App",25,100);
ctx.shadowBlur=0;
ctx.fillStyle="white";
ctx.fillText("Weather-App",25,100);