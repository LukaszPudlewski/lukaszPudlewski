//currentLocation

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    document.getElementById("currentLocation").innerHTML =
    "Geolocation is not supported by this browser.";
  }
  
  function showPosition(position) {
    document.getElementById("currentLocation").innerHTML =
    "Latitude: " + position.coords.latitude + "<br>" +
    "Longitude: " + position.coords.longitude;
  }

//map ----- cant set marker as selected lat/lng-----

var map = L.map('map').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);



//button -----delete old marker every time new is set-------

$('#btn1').click(function() {

    $.ajax({
        url: "libs/php/timezones.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#selLat').val(),
            lng: $('#selLng').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#p1').html("Country: " + result.data.countryName);
                $('#p2').html("Sunrise: " + result.data.sunrise);
                $('#p3').html("Sunset: " + result.data.sunset);
                $('#p4').html("Time Zone: " + result.data.timezoneId);
                $('#p5').html("Time: " + result.data.time);
                $('#currentLocation').html("Latitude: " + result.data.lat + "<br>"
                + "Longtitude: " + result.data.lng);

                var marker = L.marker([result.data.lat, result.data.lng]).addTo(map);


            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

    $.ajax({
        url: "libs/php/timezones.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#selLat').val(),
            lng: $('#selLng').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#p1').html("Country: " + result.data.countryName);
                $('#p2').html("Sunrise: " + result.data.sunrise);
                $('#p3').html("Sunset: " + result.data.sunset);
                $('#p4').html("Time Zone: " + result.data.timezoneId);
                $('#p5').html("Time: " + result.data.time);
                $('#currentLocation').html("Latitude: " + result.data.lat + "<br>"
                + "Longtitude: " + result.data.lng);

                var marker = L.marker([result.data.lat, result.data.lng]).addTo(map);


            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});