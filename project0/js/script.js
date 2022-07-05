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
  console.log('geolocation not supported by this browser');
}

function showPosition(position) {
  console.log(position.coords.latitude + " " + position.coords.longitude);
}

// marker



//button

$('#search-btn').click( async function()  {
  let resultCountry;
  let resultWiki;
  let resultWeather;

  try {
      resultCountry = await $.ajax({
      url: "php/restCountries.php",
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

})