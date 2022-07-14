<?php
require 'api_keys.php';

$executionStartTime = microtime(true);

$countryCode = $_REQUEST['countryISO'];

$url = 'https://www.triposo.com/api/20220104/location.json?countrycode=' .$countryCode. '&tag_labels=city&count=100&fields=coordinates,snippet,name,score&account=pudel1923&token='.$triposo_key;




$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);
curl_close($ch);

$decode = json_decode($result,true);

if(isset($decode)){
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "no data";
    $output['status']['description'] = "No data available";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
}
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>