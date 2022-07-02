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

//button

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

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});