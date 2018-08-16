<?php

$xmlFile = 'To_Cntct_Info_201807270930.txt';
$outputFile = "Locations.txt";
$xml_offices = simplexml_load_file($xmlFile)->LIST_G_CNSL_ORG_ID->G_CNSL_ORG_ID;
if (!is_file($xmlFile)) {
  throw new \RuntimeException(sprintf('File "%s" does not exist.', $xmlFile));
}
if (!is_readable($xmlFile)) {
  throw new \RuntimeException(sprintf('File "%s" cannot be read.', $xmlFile));
}
$counter = 1;
$outputHandle = fopen($outputFile, 'w');
$header = "#\tCNSL_ORG_ID\tCNSL_NAME\tCNSL_ADDR1\tCNSL_ADDR2\tCNSL_CITY\tCNSL_STATE\tCNSL_ZIP\tCNSL_COUNTRY" . PHP_EOL;
echo $header;
fwrite($outputHandle, $header);
foreach ($xml_offices as $xml_office) {
  $xmlId = (string) $xml_office->CNSL_ORG_ID1;
  $officeInfo = $xml_office->LIST_G_CNSL_INFO->G_CNSL_INFO;
  $name = $officeInfo->CNSL_NAME;
  $addr1 = $officeInfo->CNSL_ADDR1;
  $addr2 = $officeInfo->CNSL_ADDR2;
  $city = $officeInfo->CNSL_CITY;
  $state = $officeInfo->CNSL_STATE;
  $zip = $officeInfo->CNSL_ZIP;
  $country = $officeInfo->CNSL_COUNTRY;
  $output = "{$counter}\t{$xmlId}\t{$name}\t{$addr1}\t{$addr2}\t{$city}\t{$state}\t{$zip}\t{$country}" . PHP_EOL;
  fwrite($outputHandle, $output);
  echo $output;
  $counter++;
}
fclose($outputHandle);
