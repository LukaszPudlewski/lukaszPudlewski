


$('#btn1').click(function() {

    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country1: $('#selCountry1').val(),
            lang: $('#selLanguage').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#p1').html(result['data'][0]['continent']);
                $('#p2').html(result['data'][0]['capital']);
                $('#p3').html(result['data'][0]['languages']);
                $('#p4').html(result['data'][0]['population']);
                $('#p5').html(result['data'][0]['areaInSqKm']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});


$('#btn2').click(function() {

    $.ajax({
        url: "libs/php/findNearbyPostalCodes.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country2: $('#selCountry2').val(),
            postalCode: $('#selPostalCode').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#p1').html(result['data'][0]['postalCode']);
                $('#p2').html(result['data'][0]['placeName']);
                $('#p3').html(result['data'][0]['adminCode1']);
                $('#p4').html(result['data'][0]['adminName1']);
                $('#p5').html(result['data'][0]['adminCode2']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});

$('#btn3').click(function() {

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

                $('#p1').html(result['data']['sunrise']);
                $('#p2').html(result['data']['sunset']);
                $('#p3').html(result['data']['timezoneId']);
                $('#p4').html(result['data']['countryName']);
                $('#p5').html(result['data']['time']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});