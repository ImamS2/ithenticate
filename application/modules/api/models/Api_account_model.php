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

	function add_account_data($params)
	{
		if ($this->insert($params)) {
			return $this->db->insert_id();
		} else {
			return FALSE;
		}
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
	}

	function delete_account_data($id)
	{
		return $this->delete($this->pk,$id);
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

								case "id":
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

					case "pager":
						$pager = new stdClass();
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							$pager_components = $resp["value"]["struct"]["member"];
							foreach ($pager_components as $pager_detail) {
								switch ($pager_detail["name"]) {
									case "total_entries":
										$total_entries = $pager_detail["value"]["int"];
										$pager->total_entries = $total_entries;
										break;

									case "current_page":
										$current_page = $pager_detail["value"]["int"];
										$pager->current_page = $current_page;
										break;

									case "entries_per_page":
										$entries_per_page = $pager_detail["value"]["int"];
										$pager->entries_per_page = $entries_per_page;
										break;

									default:
										break;
								}
							}
							$return->pager = $pager;
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
						}
						$return->account = $account;
						break;

					case "groups":
						$groups = new stdClass();
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							$groups_comps = $resp["value"]["array"]["data"]["value"];
							if (array_key_exists("struct", $groups_comps)) {
								$group_folder_comps = $groups_comps["struct"]["member"];
								$group_folders = new stdClass();
								$key = 0;
								foreach ($group_folder_comps as $group_folder_comp) {
									switch ($group_folder_comp["name"]) {
										case "name":
											$group_folders->name = $group_folder_comp["value"]["string"];
											break;

										case "id":
											$group_folders->id = $group_folder_comp["value"]["int"];
											break;
										
										default:
											break;
									}
								}
								$groups->$key = $group_folders;
							} else {
								foreach ($groups_comps as $urut_folder => $groups_comp) {
									$group_folder_comps = $groups_comp["struct"]["member"];
									$group_folders = new stdClass();
									foreach ($group_folder_comps as $group_folder_comp) {
										switch ($group_folder_comp["name"]) {
											case "name":
												$group_folders->name = $group_folder_comp["value"]["string"];
												break;

											case "id":
												$group_folders->id = $group_folder_comp["value"]["int"];
												break;
											
											default:
												break;
										}
									}
									$groups->$urut_folder = $group_folders;
								}
							}
						}
						$return->groups = $groups;
						break;

					case "folders": /* untuk list folder, alias folder jamak, namanya juga folders pake "S" */
						$folder_lists = new stdClass(); /* biar gak ketuker ama yang single, ane kasih nama folder lists */
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							$user_folders = $resp["value"]["array"]["data"]["value"];
							if (array_key_exists("struct", $user_folders)) {
								$folder_lists_comps = $user_folders["struct"]["member"];
								$folders = new stdClass();
								$key = 0;
								foreach ($folder_lists_comps as $folder_comp) {
									switch ($folder_comp["name"]) {
										case "name":
											$folders->name = $folder_comp["value"]["string"];
											break;

										case "id":
											$folders->id = $folder_comp["value"]["int"];
											break;

										case "group":
											$group_det_comps = $folder_comp["value"]["struct"]["member"];
											$group_detail = new stdClass();
											foreach ($group_det_comps as $group_det_comp) {
												switch ($group_det_comp["name"]) {
													case "name":
														$group_detail->name = $group_det_comp["value"]["string"];
														break;

													case "id":
														$group_detail->id = $group_det_comp["value"]["int"];
														break;

													default:
														break;
												}
											}
											$folders->group = $group_detail;
											break;

										default:
											break;
									}
								}
								$folder_lists->$key = $folders;
							} else {
								foreach ($user_folders as $key => $folders) {
									$folder_lists_comps = $folders["struct"]["member"];
									$folders = new stdClass();
									foreach ($folder_lists_comps as $folder_comp) {
										switch ($folder_comp["name"]) {
											case "name":
												$folders->name = $folder_comp["value"]["string"];
												break;

											case "id":
												$folders->id = $folder_comp["value"]["int"];
												break;

											case "group":
												$group_det_comps = $folder_comp["value"]["struct"]["member"];
												$group_detail = new stdClass();
												foreach ($group_det_comps as $group_det_comp) {
													switch ($group_det_comp["name"]) {
														case "name":
															$group_detail->name = $group_det_comp["value"]["string"];
															break;

														case "id":
															$group_detail->id = $group_det_comp["value"]["int"];
															break;

														default:
															break;
													}
												}
												$folders->group = $group_detail;
												break;

											default:
												break;
										}
									}
									$folder_lists->$key = $folders;
								}
							}
						}
						$return->folder_lists = $folder_lists;
						break;

					case "folder": /* untuk get folder, alias single folder alias siji tok foldere, kan gak pake "S" */
						$folder = new stdClass();
						if (isset($resp["value"]) && !empty($resp["value"]) && (is_object($resp["value"]) || is_array($resp["value"]))) {
							$key = 0;
							$folder_detail = new stdClass();
							$folder_comps = $resp["value"]["struct"]["member"];
							foreach ($folder_comps as $folder_comp) {
								switch ($folder_comp["name"]) {
									case "name":
										$folder_detail->name = $folder_comp["value"]["string"];
										break;

									case "id":
										$folder_detail->id = $folder_comp["value"]["int"];
										break;

									case "group":
										$group_det_comps = $folder_comp["value"]["struct"]["member"];
										$group_detail = new stdClass();
										foreach ($group_det_comps as $group_det_comp) {
											switch ($group_det_comp["name"]) {
												case "name":
													$group_detail->name = $group_det_comp["value"]["string"];
													break;

												case "id":
													$group_detail->id = $group_det_comp["value"]["int"];
													break;

												default:
													break;
											}
										}
										$folder_detail->group = $group_detail;
										break;

									default:
										break;
								}
							}
							$folder->$key = $folder_detail;
						}
						$return->folder = $folder;
						break;

					case "document":
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