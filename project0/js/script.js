//map

var map = L.map('map').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// geolocation --how to store in global var?? ask

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else { 
  console.log('geolocation not supported by this browser');
}

function showPosition(position) {
  console.log(position.coords.latitude + " " + position.coords.longitude);
}

// marker

let countryBorder = countryInput.value;
console.log(countryBorder);

//api call, button, inner.Html -- combine few api, use data from 1 to 2
/*
let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");
searchBtn.addEventListener("click", () => {
  let countryName = countryInput.value;
  let finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  let wikiLinks = `http://api.geonames.org/wikipediaSearch?q=${countryName}&maxRows=3&username=pudel1923`
  let restCountries = 'libs/php/restCountries.php'
  console.log(finalURL);
  console.log(wikiLinks);
    fetch(finalURL)
    .then((response) => response.json())
    .then((data) => {
      result.innerHTML = `
        <img src="${data[0].flags.svg}" class="flag-img">
        <h2>${data[0].name.common}</h2>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Capital:</h4>
                <span>${data[0].capital[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Continent:</h4>
                <span>${data[0].continents[0]}</span>
            </div>
        </div>
         <div class="wrapper">
            <div class="data-wrapper">
                <h4>Population:</h4>
                <span>${data[0].population}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Currency:</h4>
                <span>${
                  data[0].currencies[Object.keys(data[0].currencies)].name
                } - ${Object.keys(data[0].currencies)[0]}</span>
            </div>
        </div>
         <div class="wrapper">
            <div class="data-wrapper">
                <h4>Common Languages:</h4>
                <span>${Object.values(data[0].languages)
                  .toString()
                  .split(",")
                  .join(", ")}</span>
            </div>
        </div>
      `;
    })
    .catch(() => {
      if (countryName.length == 0) {
        result.innerHTML = `<h3>The input field cannot be empty</h3>`;
      } else {
        result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
      }
    });
    
  });
*/


/*
// where should I put .catch
let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");
  $('#search-btn').click(function() {

    $.ajax({
        url: "php/restCountries.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryName: $('#countryInput').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

              info.innerHTML = `
              <img src="${result.data[0].flags.svg}" class="flag-img">
              <h2>${result.data[0].name.common}</h2>
              <div class="wrapper">
                  <div class="data-wrapper">
                      <h4>Capital:</h4>
                      <span>${result.data[0].capital[0]}</span>
                  </div>
              </div>
              <div class="wrapper">
                  <div class="data-wrapper">
                      <h4>Continent:</h4>
                      <span>${result.data[0].continents[0]}</span>
                  </div>
              </div>
               <div class="wrapper">
                  <div class="data-wrapper">
                      <h4>Population:</h4>
                      <span>${result.data[0].population}</span>
                  </div>
              </div>
              <div class="wrapper">
                  <div class="data-wrapper">
                      <h4>Currency:</h4>
                      <span>${
                        result.data[0].currencies[Object.keys(result.data[0].currencies)].name
                      } - ${Object.keys(result.data[0].currencies)[0]}</span>
                  </div>
              </div>
               <div class="wrapper">
                  <div class="data-wrapper">
                      <h4>Common Languages:</h4>
                      <span>${Object.values(result.data[0].languages)
                        .toString()
                        .split(",")
                        .join(", ")}</span>
                  </div>
              </div>
              `
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    })

});
*/

$('#search-btn').click( async function()  {
  let resultCountry;
  let resultWiki;
  let resultWeather;

  try {
      result = await $.ajax({
      url: "php/restCountries.php",
      type: 'POST',
      dataType: 'json',
      data: {
          countryName: $('#countryInput').val()
      },
  });

      return resultCountry;
  } catch (error) {
      console.log(error);
  }

  try {
    result2 = await $.ajax({
    url: "php/wikiLinks.php",
    type: 'POST',
    dataType: 'json',
    data: {
        countryName: $('#countryInput').val()
    },
});

    return resultWiki;
} catch (error) {
    console.log(error);
}

try {
  result3 = await $.ajax({
  url: "php/openWeather.php",
  type: 'POST',
  dataType: 'json',
  data: {
      lat: result.data[0].lat,
      lon: result.data[0].lon,
      apiKey: process.env.API_KEY
  },
});

  return resultWeather;
} catch (error) {
  console.log(error);
}

})