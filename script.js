src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
var fiveDayURL;
var currentQueryURL;
var UVIndURL;
var latitude;
var longitude;
var citySearch;
var cityStorage;

if (JSON.parse(localStorage.getItem("cityArray") !== null)) {
  cityStorage = JSON.parse(localStorage.getItem("cityArray"));
} else {
  cityStorage=[]
  localStorage.setItem("cityArray", cityStorage);
}

$("#searchSubBtn").on("click", function (event) {
  $("#cityCurrent").html("");
  $("#fiveDay").html("");
  event.preventDefault();
  citySearch = $("#searchBar").val().trim();
  console.log(citySearch);
  getWeather();
  //   appendPage();
});

function getWeather() {
  var currentQueryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    citySearch +
    "&appid=18a8feef5d0c615b7e0d94298dc9dfbe";
  // May need to pull coords from other responses to get the UV Index (search by coords)

  var fiveDayURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearch +
    "&appid=18a8feef5d0c615b7e0d94298dc9dfbe";
  // TODAY's WEATHER
  var todayTemp;
  var todayWS;
  var todayHumidity;
  var UVInd;
  var cityName;
  $.ajax({
    url: currentQueryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    latitude = response.coord.lat;
    longitude = response.coord.lon;
    UVIndURL =
      "http://api.openweathermap.org/data/2.5/uvi?appid=18a8feef5d0c615b7e0d94298dc9dfbe&lat=" +
      latitude +
      "&lon=" +
      longitude;
    todayTemp = (response.main.temp - 273) * (9 / 5) + 32;
    todayHumidity = response.main.humidity;
    todayWS = response.wind.speed;
    UVInd;
    cityName = response.name;
    cityStorage.push(response.name);
    
    $.ajax({
      url: UVIndURL,
      method: "GET",
    }).then(function (responseUV) {
      console.log(responseUV);
      UVInd = responseUV.value;
      // Copied In Here
      var thisDate = response.dt;
      var dateConvert = new Date(thisDate * 1000).toLocaleDateString("en-US");
      console.log(dateConvert);
      var currentWeather = $("<div>").attr("id", "currentWeather");
      currentWeather.append(
        "<h2>" +
          cityName +
          " (" +
          dateConvert +
          ") <img id='wicon' src='http://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png' alt = 'weather icon'></h2>"
      );
      currentWeather.append(
        "<div>Temperature: " + todayTemp.toFixed(1) + "&#176" + "F </h5>"
      );
      currentWeather.append("<div>Humidity: " + todayHumidity + "%</h5>");
      currentWeather.append("<div>Wind Speed: " + todayWS + " MPH");
      var currentLastLine = $("<div>").text("UV Index: ");
      var UVIndexNum = $("<span>").text(UVInd).attr("id", "UVIndex");
      if (UVInd < 3) {
        UVIndexNum.attr("style", "background-color: green");
      } else if (UVInd > 7) {
        UVIndexNum.attr("style", "background-color: red");
      } else {
        UVIndexNum.attr("style", "background-color: yellow");
      }
      currentLastLine.append(UVIndexNum);
      currentWeather.append(currentLastLine);
      $("#cityCurrent").append(currentWeather);
      $("#weatherInfo").attr("style", "visibility: visible");
    });
  });

  $.ajax({
    url: fiveDayURL,
    method: "GET",
  }).then(function (responseForecast) {
    console.log(responseForecast);
    for (i = 0; i < 5; i++) {
      console.log(i * 8 + 4);
      var date = responseForecast.list[i * 8 + 4].dt_txt;
      var dateSplit = date.split(" ", 1)[0];
      var dateSplit2 = dateSplit.split("-");
      console.log(dateSplit2);

      var finalDate = dateSplit2[1] + "/" + dateSplit2[2] + "/" + dateSplit2[0];
      var newCard = $("<div>").attr("class", "card");
      newCard.append("<div class='card-body'>");
      newCard.append(
        "<h5 class='card-title' id = 'cardHead'>" + finalDate + "</h5>"
      );
      var imgDiv = $(
        "<div id = 'icon'><img id='wicon' src='http://openweathermap.org/img/w/" +
          responseForecast.list[i * 8 + 4].weather[0].icon +
          ".png' alt = 'weather icon'></div>"
      );
      newCard.append(imgDiv);
      var newCardTemp =
        (responseForecast.list[i * 8 + 4].main.temp - 273) * (9 / 5) + 32;
      newCard.append(
        "<div>Temp: " + newCardTemp.toFixed(1) + " &#176" + "F</div>"
      );
      newCard.append(
        "<div>Humidity: " +
          responseForecast.list[i * 8 + 4].main.humidity +
          "%</h5>"
      );
      $("#fiveDay").append(newCard);
    }
  });
}
