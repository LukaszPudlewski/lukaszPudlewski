
//require('dotenv').config();

const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

const countriesLow = countries.map(element => {
  return element.toLowerCase();
});

var latLngBounds;
var borderLayer;
var layerGroup;


//map

var map = L.map('map').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

layerGroup = new L.LayerGroup();
  layerGroup.addTo(map);


// geolocation 
/*
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    let lng = position.coords.longitude;
    let lat = position.coords.latitude;
    map.setView([lat, lng], 5);
    

    $.ajax({
        url: "php/countryCode.php",
        type: 'POST',
        dataType: 'json',
        data: { 
            lng: lng,
            lat: lat
        },
        success: function(result) {
            
            $('#countryInput').val(result.data.countryName).change();
        },

    });       
});

} else {
  console.log("Geolocation is not supported by this browser.");
}

*/
// borders



function applyCountryBorder(map, countryname) {
  jQuery
    .ajax({
      type: "GET",
      dataType: "json",
      url:
        "https://nominatim.openstreetmap.org/search?country=" +
        countryname.trim() +
        "&polygon_geojson=1&format=json"
    })
    .then(function (data) {
      latLngBounds = data[0].boundingbox;
      borderLayer = L.geoJSON(data[0].geojson, {
        color: "blue",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.0
      }).addTo(map);
      layerGroup.addLayer(borderLayer);
      map.fitBounds([
        [parseFloat(latLngBounds[0]), parseFloat(latLngBounds[2])],
        [parseFloat(latLngBounds[1]), parseFloat(latLngBounds[3])]]);
    })

  };

//button

$('#search-btn').click( async function()  {
  let inputLow = $('#countryInput').val().toLowerCase();
  let resultCountry;
  let resultWiki;
  let resultWeather;


    if ($('#countryInput').val().length == 0) {
      info.innerHTML = `<h3>The input field cannot be empty</h3>`;
    } 
    else if (!countriesLow.includes(inputLow)) {
      info.innerHTML = `<h3>Please enter a valid country name.</h3>`;
    }
    else {

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

  applyCountryBorder(map, inputLow);
            }
          })