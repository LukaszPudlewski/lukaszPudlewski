


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

                $('#txtContinent').html(result['data'][0]['continent']);
                $('#txtCapital').html(result['data'][0]['capital']);
                $('#txtLanguages').html(result['data'][0]['languages']);
                $('#txtPopulation').html(result['data'][0]['population']);
                $('#txtArea').html(result['data'][0]['areaInSqKm']);

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

                $('#txtPostalCode').html(result['data'][0]['postalCode']);
                $('#txtPlaceName').html(result['data'][0]['placeName']);
                $('#txtAdminCode1').html(result['data'][0]['adminCode1']);
                $('#txtAdminName2').html(result['data'][0]['adminName2']);
                $('#txtAdminCode2').html(result['data'][0]['adminCode2']);
                $('#txtAdminName2').html(result['data'][0]['adminName2']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});