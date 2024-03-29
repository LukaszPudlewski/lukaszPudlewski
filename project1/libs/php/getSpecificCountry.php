

<?php



$executionStartTime = microtime(true);

$countryBorders = file_get_contents('../data/countryBorders.json', true);

$iso = $_REQUEST['iso'];

$decode = json_decode($countryBorders,true);



if(isset($decode)){

    $output['status']['code'] = "200";

    $output['status']['name'] = "ok";

    $output['status']['description'] = "success";

    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

            //Loop through the results of the JSON array and creating a new index by the ISO code

            foreach($decode['features'] as $countrydata) {

                if($iso == $countrydata['properties']["iso_a2"]) {

                    $output['data'] = $countrydata;

                }

            }

} else {

    $output['status']['code'] = "500";

    $output['status']['name'] = "no data";

    $output['status']['description'] = "No data available";

    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

}

header('Content-Type: application/json; charset=UTF-8');



echo json_encode($output); 



?>