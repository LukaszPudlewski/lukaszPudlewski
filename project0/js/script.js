

//require('dotenv').config();

//map

var map = L.map('map').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// geolocation 

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  document.getElementById("demo").innerHTML =
  "Geolocation is not supported by this browser.";
}

function showPosition(position) {
console.log(position.coords.latitude + ' ' + position.coords.longitude);
};

// marker



//button

$('#search-btn').click( async function()  {
  let resultCountry;
  let resultWiki;
  let resultWeather;


/*    if (countryName.length == 0) {
      result.innerHTML = `<h3>The input field cannot be empty</h3>`;
    } 
    else if (!countries.includes($('#countryInput').val())) {
      result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
    }
    else {
*/
  try {
      resultCountry = await $.ajax({
      url: "php/restCountries.php",
      type: 'POST',
      dataType: 'json',
      data: {
          countryName: $('#countryInput').val()
      },
  });

  } catch(error) {
    console.log(error);
  }

  try {
    resultWiki = await $.ajax({
    url: "php/wikiLinks.php",
    type: 'POST',
    dataType: 'json',
    data: {
        countryName: $('#countryInput').val()
    },
});

} catch (error) {
    console.log(error);
}

try {
  resultWeather = await $.ajax({
  url: "php/openWeather.php",
  type: 'POST',
  dataType: 'json',
  data: {
      lat: resultCountry.data[0].latlng[0],
      lon: resultCountry.data[0].latlng[1],
      apiKey: /*process.env.API_KEY*/ '527a25be90efba24541cd7ca1ac87e7e'
  },
});

} catch (error) {
  console.log(error);
}

  info.innerHTML = `
    <img src="${resultCountry.data[0].flags.svg}" class="flag-img">
    <h2>${resultCountry.data[0].name.common}</h2>
    <div class="wrapper">
        <div class="data-wrapper">
            <h4>Capital:</h4>
            <span>${resultCountry.data[0].capital[0]}</span>
        </div>
    </div>
    <div class="wrapper">
        <div class="data-wrapper">
            <h4>Continent:</h4>
            <span>${resultCountry.data[0].continents[0]}</span>
        </div>
    </div>
     <div class="wrapper">
        <div class="data-wrapper">
            <h4>Population:</h4>
            <span>${resultCountry.data[0].population}</span>
        </div>
    </div>
    <div class="wrapper">
        <div class="data-wrapper">
            <h4>Currency:</h4>
            <span>${
              resultCountry.data[0].currencies[Object.keys(resultCountry.data[0].currencies)].name
            } - ${Object.keys(resultCountry.data[0].currencies)[0]}</span>
        </div>
    </div>
     <div class="wrapper">
        <div class="data-wrapper">
            <h4>Common Languages:</h4>
            <span>${Object.values(resultCountry.data[0].languages)
              .toString()
              .split(",")
              .join(", ")}</span>
        </div>
    </div>
    <div class="wrapper">
      <div class="data-wrapper">
          <h4>Weather (°C):</h4>
          <span>${resultWeather.data.main.temp}</span>
      </div>
    </div>
    <div class="wrapper">
    <div class="data-wrapper">
        <h4>Wiki Links:</h4>
        <br>
        <span><a href="${resultWiki.data.geonames[0].wikipediaUrl}">${resultWiki.data.geonames[0].wikipediaUrl}</a></span>
        <span><a href="${resultWiki.data.geonames[1].wikipediaUrl}">${resultWiki.data.geonames[1].wikipediaUrl}</a></span>
        <span><a href="${resultWiki.data.geonames[2].wikipediaUrl}">${resultWiki.data.geonames[2].wikipediaUrl}</a></span>

    </div>
  </div>

  `;
            }
})