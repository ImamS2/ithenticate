<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|
|----------------------------------------------------------------
|
| PRE Function (for debug use, not in production / live)
|
|----------------------------------------------------------------
|
*/

if (!function_exists("pre"))
{
	function pre($value='')
	{
		if (ENVIRONMENT !== "production") {
			echo "<pre>";
			print_r($value);
			echo "</pre>";
		}
	}
}

/*
|
|----------------------------------------------------------------
|
| Array PUSH Values
|
|----------------------------------------------------------------
|
*/

if (!function_exists("array_push_values")) {

	function array_push_values($to_array,$values)
	{
		/*Check values is not empty and set*/
		if (isset($values) && !empty($values)) {
			/*Check values is array or not*/
			if (is_array($values)) {
				/*if values is array*/
				foreach ($values as $value) {
					/*push the values value to to_array */
					array_push($to_array, $value);
				}
				return $to_array;
			}
		}
	}

}

/* Generate a list of all IP addresses
   between $start and $end (inclusive). */
if (!function_exists("ip_range")) {
	function ip_range($start, $end)
	{
		$start = ip2long($start);
		$end = ip2long($end);
		$range = array_map("long2ip",range($start,$end));
		// pre($range);
		return $range;
		// return array_map('long2ip', range($start, $end));
	}
}


if (!function_exists("number_to_alphabet")) {
	function number_to_alphabet($number)
	{
		$number = intval($number);
		if ($number <= 0) {
			return "";
		}
		$alphabet = "";
		while ($number != 0) {
			$p = ($number - 1) % 26;
			$number = intval(($number - $p) / 26);
			$alphabet = chr(65 + $p) . $alphabet;
		}
		return $alphabet;
	}
}

if (!function_exists("alphabet_to_number")) {
	function alphabet_to_number($string)
	{
		$string = strtoupper($string);
		$length = strlen($string);
		$number = 0;
		$level = 1;
		while ($length >= $level) {
			$char = $string[$length - $level];
			$c = ord($char) - 64;
			$number += $c * (26 ** ($level - 1 ));
			$level++;
		}
		return $number;
	}
}

if (!function_exists("excel_reader")) {
	function excel_reader($lib_excel_reader, $upload_path, $filename)
	{
		$sheet = array();
		if (isset($lib_excel_reader) && !empty($lib_excel_reader) && isset($upload_path) && isset($filename) && !empty($upload_path) && !empty($filename)) {
			include $lib_excel_reader;
			$excelreader = new PHPExcel_Reader_Excel2007();
			$loadexcel = $excelreader->load($upload_path.$filename.".xlsx");
			$sheet = $loadexcel->getActiveSheet()->toArray(null, true, true ,true);
		}
		return $sheet;
	}
}