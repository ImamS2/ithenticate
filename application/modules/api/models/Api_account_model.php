<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Api_account_model extends MY_Model
{
	protected $table = "api_account";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_account()
	{
		$this->get();
		return $this;
	}

	function edit_account_data($id,$params)
	{
		if (isset($id) && !empty($id)) {
			$this->where(array($this->pk => $id));
			$edit_account_data = $this->update($params);
		} else {
			$edit_account_data = FALSE;
		}
		return $edit_account_data;
		// return $this->db->where(array("id"=>$id))
		// 				->update($this->table,$params);
	}

	function curl_request($handle, $type_response)
	{
		$response = curl_exec($handle);
		// pre(curl_getinfo($handle));

		if ($response === false) {
			$errno = curl_errno($handle);
			$error = curl_error($handle);
			error_log("Curl returned error $errno: $error\n");
			curl_close($handle);
			return false;
		}

		$http_code = intval(curl_getinfo($handle, CURLINFO_HTTP_CODE));
		curl_close($handle);

		if ($http_code >= 500) {
			// do not wat to DDOS server if something goes wrong
			sleep(10);
			return false;
		} else if ($http_code != 200) {
			switch ($type_response) {
				case "Telegram":
					$response = json_decode($response, true);
					error_log("Request has failed with error {$response["error_code"]}: {$response["description"]}\n");
					if ($http_code == 401) {
						throw new Exception("Invalid access token provided");
					}
					break;

				case "Ithenticate":
					$xml = simplexml_load_string($response, "SimpleXMLElement");
					$json = json_encode($xml);
					$response = json_decode($json,true);
					break;
				
				default:
					break;
			}
			return false;
		} else {
			switch ($type_response) {
				case "Telegram":
					$response = json_decode($response, true);
					if (isset($response["description"])) {
						error_log("Request was successfull: {$response["description"]}\n");
					}
					$response = $response["result"];
					break;

				case "Ithenticate":
					$xml = simplexml_load_string($response, "SimpleXMLElement");
					$json = json_encode($xml);
					$array = json_decode($json,true);
					$response = $array["params"]["param"]["value"]["struct"]["member"];
					break;
				
				default:
					break;
			}
		}
		// pre($response);
		return $response;
	}

	function ithenticate_response($response)
	{
		if (is_object($response) || is_array($response)) {
			$return = new stdClass();
			foreach ($response as $resp) {
				// pre($resp);
				switch ($resp["name"]) {
					case "response_timestamp":
						$response_timestamp;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_timestamp) {
								$response_timestamp = DateTime::createFromFormat("Y-m-d\TH:i:s\Z", $resp_timestamp)->format("Y-m-d H:i:s");
							}
							// masih waktu server itenticate
							$return->response_timestamp = $response_timestamp;
						}
						break;

					case "status":
						$status;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_status) {
								$status = $resp_status;
							}
							$return->status = $status;
						}
						// pre($response_timestamp);
						break;

					case "id":
						$id;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_id) {
								$id = $resp_id;
							}
							$return->id = $id;
						}
						// pre($response_timestamp);
						break;

					case "api_status":
						$api_status;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_api_status) {
								$api_status = $resp_api_status;
							}
							$return->api_status = $api_status;
						}
						break;

					case "sid":
						$sid;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_sid) {
								$sid = $resp_sid;
							}
							$return->sid = $sid;
						}
						break;

					case "account":
						$account = new stdClass();
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_account) {
								$account_data = $resp_account["member"];
								// $account = new stdClass();
								foreach ($account_data as $accounts) {
									// pre($accounts);
									switch ($accounts["name"]) {
										case "valid_until":
											$valid_until = DateTime::createFromFormat("Y-m-d\TH:i:s\Z", $accounts["value"]["dateTime.iso8601"])->format("Y-m-d H:i:s");
											$account->valid_until = $valid_until;
											break;

										case "report_count":
											$report_count = $accounts["value"]["int"];
											$account->report_count = $report_count;
											break;

										case "report_limit":
											$report_limit = $accounts["value"]["int"];
											$account->report_limit = $report_limit;
											break;

										case "user_limit":
											$user_limit = $accounts["value"]["int"];
											$account->user_limit = $user_limit;
											break;

										case "user_count":
											$user_count = $accounts["value"]["int"];
											$account->user_count = $user_count;
											break;

										case "resubmission_limit":
											$resubmission_limit = $accounts["value"]["int"];
											$account->resubmission_limit = $resubmission_limit;
											break;

										case "resubmission_count":
											$resubmission_count = $accounts["value"]["int"];
											$account->resubmission_count = $resubmission_count;
											break;

										case "words_per_Document":
											$words_per_Document = $accounts["value"]["int"];
											$account->words_per_document = $words_per_Document;
											break;
										
										default:
											break;
									}
								}
							}
							$return->account = $account;
						}
						break;

					case "groups":
						$groups = array();
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							$group_folders = $resp["value"]["array"]["data"]["value"];
							if (array_key_exists("struct", $group_folders)) {
								$group_foldere = array();
								$group_folder_components = $group_folders["struct"]["member"];
								foreach ($group_folder_components as $group_components) {
									switch ($group_components["name"]) {
										case "id":
											$group_foldere["id"] = $group_components["value"]["int"];
											break;

										case "name":
											$group_foldere["name"] = $group_components["value"]["string"];
											break;
										
										default:
											break;
									}
								}
								array_push($groups, $group_foldere);
							} else {
								foreach ($group_folders as $group_folder) {
									$group_foldere = array();
									$group_folder_components = $group_folder["struct"]["member"];
									// pre($group_folder_components);
									foreach ($group_folder_components as $group_components) {
										// pre($group_components);
										switch ($group_components["name"]) {
											case "id":
												$group_foldere["id"] = $group_components["value"]["int"];
												break;

											case "name":
												$group_foldere["name"] = $group_components["value"]["string"];
												break;
											
											default:
												break;
										}
									}
									array_push($groups, $group_foldere);
								}
							}
						}
						$return->groups = $groups;
						break;

					case "messages":
						$messages = "";
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_messages) {
								if (isset($resp_messages["data"]["value"]) && !empty($resp_messages["data"]["value"]) && (is_object($resp_messages["data"]["value"]) || is_array($resp_messages["data"]["value"]))) {
									if (array_key_exists("string", $resp_messages["data"]["value"])) {
										$string = $resp_messages["data"]["value"]["string"];
										$messages .= $string;
									} else {
										foreach ($resp_messages["data"]["value"] as $pesan) {
											$string = $pesan["string"];
											// pre($string);
											$messages .= $string . "\n";
										}
									}
								}
							}
							$return->messages = $messages;
						}
						// pre($messages);
						break;

					case "api":
						$api;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							foreach ($resp["value"] as $resp_api) {
								if (isset($resp_api["member"]["value"]) && !empty($resp_api["member"]["value"]) && (is_object($resp_api["member"]["value"]) || is_array($resp_api["member"]["value"]))) {
									foreach ($resp_api["member"]["value"] as $api_code) {
										$api = $api_code;
									}
								}
							}
							$return->api = $api;
						}
						break;

					case "errors":
						$errors;
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							$errors = $resp["value"]["struct"]["member"];
							// pre($errors);
							switch ($errors["name"]) {
								case "username":
									$error_msg = $errors["value"]["array"]["data"]["value"]["string"];
									break;

								case "password":
									$error_msg = $errors["value"]["array"]["data"]["value"]["string"];
									break;
								
								default:
									$error_msg = "";
									break;
							}
							$errors = $error_msg;
							$return->errors = $errors;
						}
					
						break;
					
					default:
						$response_timestamp;
						$status;
						$api_status;
						$sid;
						$messages;
						$api;
						$errors;
						break;
				}
			}
			return $return;
		}
	}
}