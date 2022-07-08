/*countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

if ($('#countryInput').val().length == 0) {
   console.log('1');
  } 
  else if (!countries.includes($('#countryInput').val())) {
    console.log('2');
  }
  else {
    console.log('3');
  }*/



  function returnBoundingBoxFromCountryName(countryName) {

    let countriesInfo = countriesInfoFunctions.returnCountriesInfo();

    let features = countriesInfo['countryBorders']['features'];

    let countryBoundary;

    for (let i = 0; i < features.length; i++) {

        if (features[i]['properties']['name'] == countryName) {

            countryBoundary = coordinatesToMultipolylineArray(features[i]['geometry']['coordinates']);
            break;

        }

    }

    if (!(countryBoundary)) {

        console.error("returnBoundingBoxFromCountryName: Country not in countryBoundaries");
        return;

    }

    let maxNorth;
    let maxSouth;
    let maxEast;
    let maxWest;

    for (let i = 0; i < countryBoundary.length; i++) {

        let currentNorth = countryBoundary[i][0][0]; // lat = y
        let currentSouth = countryBoundary[i][0][0]; // lat = y
        let currentEast = countryBoundary[i][0][1]; // lon = x
        let currentWest = countryBoundary[i][0][1]; // lon = x

        for (let j = 1; j < countryBoundary[i].length; j++) {

            let currentX = countryBoundary[i][j][1];
            let currentY = countryBoundary[i][j][0];

            // North and South
            if (currentY > currentNorth) {

                currentNorth = currentY;

            } else if (currentY < currentSouth) {

                currentSouth = currentY;

            }

            // East and West
            if (currentX > currentEast) {

                currentEast = currentX;

            } else if (currentX < currentWest) {

                currentWest = currentX;

            }

        }

        if (i == 0) {

            maxNorth = currentNorth;
            maxSouth = currentSouth;
            maxEast = currentEast;
            maxWest = currentWest;

        } else {

            if (currentNorth > maxNorth) {

                maxNorth = currentNorth;

            }

            if (currentSouth < maxSouth) {

                maxSouth = currentSouth;

            }

            if (currentEast > maxEast) {

                maxEast = currentEast;

            }

            if (currentWest < maxWest) {

                maxWest = currentWest;

            }

        }

    }

    return {

        north: maxNorth,
        east: maxEast,
        south: maxSouth,
        west: maxWest

    }

}


for (let i=0; i< 20; i++) {
    data = some.features[i]
    if (data.properties[i][name == 'Bahamas']) {
        console.log(data.properties);
    }
}