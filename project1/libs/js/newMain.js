// global variables
var currentFeature;


//layers

  const streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
    {
        id: 'mapbox/streets-v11',
        maxZoom: 14,
        tileSize: 512,
        setView: true,
        zoomOffset: -1, 
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    }),
        satellite   = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
    {
        id: 'mapbox/satellite-v9', 
        maxZoom: 14,
        tileSize: 512,
        setView: true,
        zoomOffset: -1, 
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    }),

        dark   = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
        {
        id: 'mapbox/dark-v10', 
        maxZoom: 14,
        tileSize: 512,
        setView: true,
        zoomOffset: -1, 
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        });
        night   = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
        {
        id: 'mapbox/navigation-night-v1', 
        maxZoom: 14,
        tileSize: 512,
        setView: true,
        zoomOffset: -1, 
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        });
    var baseMaps = {
    "Street View": streets,
    "Satellite": satellite,
    "Dark Mode": dark,
    "Night Mode": night
    }

//map

const worldMap = L.map("mapid", { zoomControl: true}).setView([0, 0], 2);
streets.addTo(worldMap,);
L.control.layers(baseMaps).addTo(worldMap);

//markers


let POI = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    maxClusterRadius: 50,
      iconCreateFunction: function (cluster) {
      var childCount = cluster.getChildCount();
      var c = ' marker-cluster-';
      if (childCount < 10) {
        c += 'small';
      }
      else if (childCount < 100) {
        c += 'medium';
      }
      else {
        c += 'large';
      }
  
      return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>',
       className: 'POI marker-cluster' + c, iconSize: new L.Point(40, 40) });
    }
  });
  

    var citiesMarker = L.ExtraMarkers.icon({
        icon: 'fa-city',
        extraClasses: 'fa-2x',
        markerColor: 'violet',
        shape: 'circle',
        prefix: 'fas',
        shadowSize: [0, 0]
    });
    var userMarker = L.ExtraMarkers.icon({
        icon: 'fa-home',
        extraClasses: 'fa-2x',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fas',
        shadowSize: [0, 0]
    });

// select countries function

function handleCountryJSON() {
    $.ajax({
        url: "./libs/php/getCountryListings.php",
        type: "get",
        dataType: "json",
        success: function(response) {
            //[Handle Success]
            var countryList = [];
            $.each(response.data.features, function(i, item) {

                var country = {
                    countryCode: response.data.features[i].properties.iso_a2,
                    countryName: response.data.features[i].properties.name
                };
                countryList.push(country);
            });
            countryList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);

            $.each(countryList, function(i, item) {
                let listEntry = "<option class='dropdown-item' value = '" + countryList[i].countryCode + "' id = '" + countryList[i].countryName + "'>" + countryList[i].countryName + "</option>";
                $("#dropdownList").append(listEntry);
            })

        },
        error: function(jqXHR, textStatus, errorThrown) {
            //[Handle errors]
            console.log(error, jqXHR, textStatus, errrorThrown);
        }
    })
}

//border function

function applyBorder() {
    $.ajax({
        //Pulls the list of borders, loops and filters through the JSON to find the same country with a matching ISO Code
        url: './libs/php/getSpecificCountry.php',
        type: 'get',
        dataType: 'json',
        data: {
            iso: $('#dropdownList').val()
        },

        success: function(response) {
            if (currentFeature) {
                currentFeature.clearLayers();
            }

            currentFeature = L.geoJSON(response.data, {
                style: function(feature) {
                    return {
                        color: "#45bbff",
                        opacity: 1,

                    };
                }
            }).bindPopup(function(layer) {
                return layer.feature.properties.description;
            }).addTo(worldMap)
            worldMap.fitBounds(currentFeature.getBounds())

        },
        error: function(jqXHR, textStatus, errorThrown) {
            //[Handle errors]
            console.log(error, jqXHR, textStatus, errorThrown);
        }
    })
}


//api functions declare

async function callApi() {
    let select = $('#dropdownList').val();
    let cities;
    let parks;
    let countryData;
    let capitol;
    let restCountries;
    let forecast;
    let weather;
    let wikiLinks;

    try {
        cities = await $.ajax({
        url: "libs/php/getCities.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: select
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        parks = await $.ajax({
        url: "libs/php/getParks.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: select
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        countryData = await $.ajax({
        url: "libs/php/getCountryData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: select
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        capitol = await $.ajax({
        url: "libs/php/getCapitol.php",
        type: 'POST',
        dataType: 'json',
        data: {
            city: countryData.data[0].capital
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        restCountries = await $.ajax({
        url: "libs/php/getRestCountries.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryName: countryData.data[0].countryName
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        forecast = await $.ajax({
        url: "libs/php/getFoecast.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: restCountries.data[0].latlng[0],
            lon: restCountries.data[0].latlng[1]
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        weather = await $.ajax({
        url: "libs/php/getWeatherData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: restCountries.data[0].latlng[0],
            lon: restCountries.data[0].latlng[1]
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    try {
        wikiLinks = await $.ajax({
        url: "libs/php/getWikiLinks.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryName: countryData.data[0].countryName
        },
    });
  
    } catch(error) {
      console.log(error);
    }

    //forecast modal / weather modal
        var url = 'https://openweathermap.org/img/wn/' + forecast.data.current.weather[0].icon + '@2x.png';
        $('#coordinatesModal').html((Math.round(wLatitude*100)/100) + " Latitude<br> " + (Math.round(wLongitude*100)/100) + " Longitude");
        $('#weatherIcon').html('<img src="'+url+'" />');
        $('#weatherDescription').html(forecast.data.current.weather[0].main+"/"+forecast.data.current.weather[0].description);
        $('#temperatureModal').html('<b>'+forecast.data.daily[0].temp.max + ' &#8451;</b><br>'+forecast.data.daily[0].temp.min+' &#8451;');
        $('#humidityModal').html('<i class="bi bi-droplet"></i> '+forecast.data.current.humidity + '% Humidity')
        $('#pressureModal').html('<i class="bi bi-arrows-collapse"></i> '+forecast.data.current.pressure + 'Mb');
        $('#windModal').html('<i class="bi bi-wind"></i> '+forecast.data.current.wind_speed + 'Mph');

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date();
        dayName = days[d.getDay()];
        dayNameTomorrow = days[d.getDay()+1];
        dayNameNextDay = days[d.getDay()+2];
        $('#currentDay').html(dayName+ " "+(d.getDate()));
        $('#tomorrow').html(dayNameTomorrow+ " "+(d.getDate()+1));
        $('#nextDay').html(dayNameNextDay+ " "+(d.getDate()+2));

        var currentUrl = 'https://openweathermap.org/img/wn/' + forecast.data.daily[1].weather[0].icon + '@2x.png';
        var tomorrowUrl = 'https://openweathermap.org/img/wn/' + forecast.data.daily[2].weather[0].icon + '@2x.png';
        var nextDayURL = 'https://openweathermap.org/img/wn/' + forecast.data.daily[3].weather[0].icon + '@2x.png';
        $('#currentWeatherIcon').html('<img src="'+currentUrl+'" />');
        $('#currentTemperature').html('<b>'+forecast.data.daily[1].temp.max + ' &#8451;</b><br>'+forecast.data.daily[1].temp.min+' &#8451;');

        $('#tomorrowWeatherIcon').html('<img src="'+nextDayURL+'" />');
        $('#tomorrowsTemperature').html('<b>'+forecast.data.daily[2].temp.max + ' &#8451;</b><br>'+forecast.data.daily[2].temp.min+' &#8451;');


        $('#nextDayWeatherIcon').html('<img src="'+url+'" />');
        $('#nextDayTemperature').html('<b>'+forecast.data.daily[3].temp.max + '  &#8451;</b><br>'+forecast.data.daily[3].temp.min+' &#8451;');

    //country info modal
        $('#ModalLongTitle').html(countryData.data[0].countryName);
        $('#capitalModal').html(countryData.data[0].capital);
        $('#currencyNameModal').html(countryData.data.geonames[0].currencyCode);
        $('#populationModal').html(response.data.geonames[0].population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $('#timezoneModal').html(response.data.geonames[0].timezones[0] + " to " + response.data.timezones[countryObject.timezone.length - 1]);
        $('#areaModal').html(response.data.geonames[0].areaInSqKm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" Km&sup2;");
        $('#languageModal').html(response.data.geonames[0].languages);

    // other modals

}

//navigator

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        let lng = position.coords.longitude;
        let lat = position.coords.latitude;
        worldMap.setView([lat, lng], 5);
        $.ajax({
            url: "libs/php/countryCode.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lng: lng,
                lat: lat
            }
        }).done((result) => {
            $('#dropdownList').val(result.data.countryCode);
            callApi();
            applyBorder();
          })
        })
        }
        else {
            console.log("Geolocation is not supported by this browser.");
        }

        //on select

    //api functions

//easybuttons

L.easyButton('fas fa-location-arrow fa-1x', function() {
    getIsoFromCoords(user.latitude, user.longitude);
}, 'Return to your current location').addTo(worldMap);

L.easyButton('fas fa-location-arrow fa-1x', function() {
    $('#ModalCenter2').modal('show');
}, 'Country').addTo(worldMap);

L.easyButton('fas fa-location-arrow fa-1x', function() {
    $('#ModalCenter3').modal('show');
}, 'Capitol').addTo(worldMap);

L.easyButton('fas fa-location-arrow fa-1x', function() {
    $('#ModalCenter4').modal('show');
}, 'Current Weather').addTo(worldMap);

L.easyButton('fas fa-location-arrow fa-1x', function() {
    $('#ModalCenter5').modal('show');
}, 'Weather Forcast').addTo(worldMap);



