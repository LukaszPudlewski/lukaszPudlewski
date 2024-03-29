/* Instantiate the object with raw data*/
countryObject = {
    countryName: "No Country known", //Replace with function to instantiate
    capitalName: "Capital City is unknown", //Replace with function to instantiate
    isoCode: "??",
    latitude: "Unknown latitude",
    longitude: "Unknown Longitude",
    population: 0,
    area : 0,
    continentName: "Unknown continent",
    currencyName: "Unknown currency name",
    currencyCode: "Unknown Currency Code",
    currencyValue: 1,
    baseCurrencyValue: 1,
    baseCurrencyCode: "GBP",
    weather: {
        temperature: 0,
        humidity: 0,
        pressure: 0
    },
    timezone: [],
};

user = {
    latitude: "",
    longitude: "",
}
var countryCode = "";

//Marker related variables
var capital;
var citiesMarkers = L.markerClusterGroup({
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
       className: 'cities marker-cluster' + c, iconSize: new L.Point(40, 40) });
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
 
  var cityLat, cityLng, capitalCityMarker;

//Instantiates the World Map
var worldMap;
//Globally declares current or initial geoJSON feature collection
var currentFeature;



  //Requests location and updates the country Object
if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
} else {
    navigator.geolocation.getCurrentPosition(success, error, geoOptions);
};




/* Configuration Options for GeoLocation */
var geoOptions = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0
};

function success(pos) {
    countryObject.latitude, user.latitude = pos.coords.latitude;
    countryObject.longitude, user.longitude = pos.coords.longitude;
        getIsoFromCoords(pos.coords.latitude, pos.coords.longitude);
        $("#selCountry").val(countryCode);
    }


function error(ex) {
    try {
        worldMap.locate();
    } catch {
        console.log("Geolocation unavailable after navigator attempt/locate attempt "+ex.message)
    }
}
//Functions for acquiring data
function getIsoFromCoords(lat, long) {
    $.ajax({
        url: "./libs/php/getISOCode.php",
        type: "get",
        data: {
            lat: lat,
            lng: long,
        },
        success: function(response) {
            countryCode = response.data.countryCode;

            loadCountryDataFromISO(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    });
    //return isoCode
}
//Populates the list of countries
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

//Loads data from restCountries, countryborders and WeatherMaps APIs
function loadCountryDataFromISO(isoCode) {
    citiesMarkers.clearLayers();
    $.ajax({
        url: './libs/php/getCountryData.php',
        type: "get",
        dataType: "json",
        data: {
            countryISO: isoCode,
        },
        success: function(response) {
            console.log(response.data.geonames[0]);

            
            
            if(response.data.geonames[0].countryName != undefined){
                countryObject.countryName = response.data.geonames[0].countryName;
                $('#defaultOption').html(countryObject.countryName);
                $('#ModalLongTitle').html(countryObject.countryName);
            }
            if(response.data.geonames[0].capital != undefined){
                countryObject.capitalName = response.data.geonames[0].capital;
                callMapData(countryObject.capitalName);
                $('#capitalModal').html(countryObject.capitalName + ", " + isoCode);
            }
            if(response.data.latlng != undefined){
                countryObject.latitude = response.data.latlng[0];
                countryObject.longitude = response.data.latlng[1];
            }
            if(response.data.geonames[0].currencyCode != undefined){
                countryObject.currencyCode = response.data.geonames[0].currencyCode;
                $('#currencyNameModal').html(countryObject.currencyCode)
            }
            if(response.data.geonames[0].population != undefined){
                countryObject.population = response.data.geonames[0].population;
                $('#populationModal').html(countryObject.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if(response.data.timezones != undefined){
                countryObject.timezone = response.data.timezones;
                $('#timezoneModal').html(countryObject.timezone[0] + " to " + response.data.timezones[countryObject.timezone.length - 1]);
            }
            if(response.data.geonames[0].isoAlpha3 != undefined)
                countryObject.isoCode = response.data.isoAlpha3;
            if(response.data.geonames[0].areaInSqKm != undefined){
                countryObject.area = response.data.geonames[0].areaInSqKm;
                $('#areaModal').html(countryObject.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" Km&sup2;");
            }
            if(response.data.geonames[0].languages != undefined){
                $('#languageModal').html(response.data.geonames[0].languages);
            }



        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })

    $.ajax({
        //Pulls the list of borders, loops and filters through the JSON to find the same country with a matching ISO Code
        url: './libs/php/getSpecificCountry.php',
        type: 'get',
        dataType: 'json',
        data: {
            iso: isoCode
        },

        success: function(response) {
            if (currentFeature) {
                currentFeature.clearLayers();
            }

            //currentFeature.clearLayers();
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
};

function callWeather(wLatitude, wLongitude) {
                $('#coordinatesModal').html(countryObject.latitude + " Latitude, " + countryObject.longitude + " Longitude");
    $.ajax({
        url: './libs/php/getForecast.php',
        type: 'get',
        dataType: 'json',
        data: {
            lat: wLatitude,
            lon: wLongitude,
        },
        success: function(response) {
            var url = 'https://openweathermap.org/img/wn/' + response.data.current.weather[0].icon + '@2x.png';
            $('#coordinatesModal').html((Math.round(wLatitude*100)/100) + " Latitude<br> " + (Math.round(wLongitude*100)/100) + " Longitude");
            $('#weatherIcon').html('<img src="'+url+'" />');
            $('#weatherDescription').html(response.data.current.weather[0].main+"/"+response.data.current.weather[0].description);
            $('#temperatureModal').html('<b>'+response.data.daily[0].temp.max + ' &#8451;</b><br>'+response.data.daily[0].temp.min+' &#8451;');
            $('#humidityModal').html('<i class="bi bi-droplet"></i> '+response.data.current.humidity + '% Humidity')
            $('#pressureModal').html('<i class="bi bi-arrows-collapse"></i> '+response.data.current.pressure + 'Mb');
            $('#windModal').html('<i class="bi bi-wind"></i> '+response.data.current.wind_speed + 'Mph');

            //Loads the Forecast Data
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var d = new Date();
            dayName = days[d.getDay()];
            dayNameTomorrow = days[d.getDay()+1];
            dayNameNextDay = days[d.getDay()+2];
            $('#currentDay').html(dayName+ " "+(d.getDate()));
            $('#tomorrow').html(dayNameTomorrow+ " "+(d.getDate()+1));
            $('#nextDay').html(dayNameNextDay+ " "+(d.getDate()+2));

            var currentUrl = 'https://openweathermap.org/img/wn/' + response.data.daily[1].weather[0].icon + '@2x.png';
            var tomorrowUrl = 'https://openweathermap.org/img/wn/' + response.data.daily[2].weather[0].icon + '@2x.png';
            var nextDayURL = 'https://openweathermap.org/img/wn/' + response.data.daily[3].weather[0].icon + '@2x.png';
            $('#currentWeatherIcon').html('<img src="'+currentUrl+'" />');
            $('#currentTemperature').html('<b>'+response.data.daily[1].temp.max + ' &#8451;</b><br>'+response.data.daily[1].temp.min+' &#8451;');

            $('#tomorrowWeatherIcon').html('<img src="'+nextDayURL+'" />');
            $('#tomorrowsTemperature').html('<b>'+response.data.daily[2].temp.max + ' &#8451;</b><br>'+response.data.daily[2].temp.min+' &#8451;');


            $('#nextDayWeatherIcon').html('<img src="'+url+'" />');
            $('#nextDayTemperature').html('<b>'+response.data.daily[3].temp.max + '  &#8451;</b><br>'+response.data.daily[3].temp.min+' &#8451;');



            
            //Pulls up the modal once all data has finally finished
            $('#ModalCenter').modal('show');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(error, jqXHR, textStatus, errorThrown);
        }
    })
}



function callMapData(cityName) {

        var cityLat, cityLng;
        //Acquire the capital city's exact Lat/Long
        $.ajax({
            url: './libs/php/getCity.php',
            type: 'get',
            dataType: 'json',
            data: {
                city: cityName
            },
        success: function(response) {
            cityLat = response.data.latitude;
            cityLng = response.data.longitude;
            callWeather(cityLat, cityLng);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //[Handle errors]
            console.log(error, jqXHR, textStatus, errorThrown);
        }
    });
}

function callWiki(countryName) {


    $.ajax({
        url: './libs/php/wikiLinks.php.php',
        type: 'get',
        dataType: 'json',
        data: {
            countryName: countryName
        },
    success: function(response) {
        console.log(response)
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //[Handle errors]
        console.log(error, jqXHR, textStatus, errorThrown);
    }
});
}




//Trigger when a country is selected
// Needs to be reconfigured to work for options
$('#dropdownList').change(function() {
    if ($('#dropdownList').val()) {
        $('#placeholder').val(countryObject.name);
        countryObject.isoCode = $('#dropdownList').val();
        loadCountryDataFromISO(countryObject.isoCode);
    } else {
        console.log("Failed to acquire country code - OnChange #dropdownList");
        //(Configure the model with the new data)
        $('#ModalCenter').modal('show');
    }
})

/*$('#closeModal').click(function() {
    $('#ModalCenter').modal('hide');
})*/


$(document).ready(function() {


    //Updates the country list to choose from the countries.json
    handleCountryJSON();
    //Acquire data on
    getIsoFromCoords(user.latitude, user.longitude);



    //

    try {
        worldMap = L.map('mapid').setView([user.latitude, user.longitude], 5)
    } catch (err) {
        console.log("oops");
    }
    var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
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

    L.control.layers(baseMaps).addTo(worldMap);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 14,
        setView: true,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(worldMap);
    L.marker([user.latitude, user.longitude], {icon: userMarker}).bindPopup("Current location").addTo(worldMap);

//ikony font awesome do zmiany
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
});


