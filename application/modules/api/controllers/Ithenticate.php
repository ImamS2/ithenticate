<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Ithenticate extends Api_Controller
{

	protected $url = "https://api.ithenticate.com/rpc";
	protected $id_account;
	protected $username;
	protected $password;
	protected $sid;
	protected $check_only;
	protected $name_group_folders;
	protected $api_status;
	protected $messages;
	protected $id_folder_group;
	protected $name_folder;
	protected $description;
	protected $id_subfolder_api;
	protected $upload_param;

	function __construct()
	{
		parent::__construct();
		$this->load->model("Api_account_model");
		$api_active = $this->Api_account_model->where(array("active"=>1))->get()->row();
		if (!empty($api_active) && (is_object($api_active) || is_array($api_active))) {
			$this->id_account = $api_active->id;
			$this->username = $api_active->api_username;
			$this->password = $api_active->api_password;
			$this->sid = $api_active->sid;
		}
		// pre($this);
	}

	function test()
	{
		$this->load->view("index");
	}

	function get_account()
	{
		$postData = $this->input->post();
		if (isset($postData) && !empty($postData)) {
			$id = "";
			if (array_key_exists("id", $postData)) {
				$id = $postData["id"];
			}

			$result = new stdClass();

			if (!empty($id)) {
				$get_account = $this->Api_account_model->where(array("id"=>$id))->get();
				if ($get_account->num_rows() > 0) {
					$result = $get_account->row();
				}
			}
		}
		$data = $result;
		echo json_encode($data);
		return $data;
	}

	function check_login_api()
	{
		$postData = $this->input->post();
		if (isset($postData) && !empty($postData)) {

			$username = "";
			$password = "";

			if (array_key_exists("username", $postData)) {
				$username = $postData["username"];
			}

			if (array_key_exists("password", $postData)) {
				$password = $postData["password"];
			}

			if (!empty($username) && !empty($password) || !empty($id_account)) {
				$this->password = $password;
				$this->username = $username;
				// $this->id_account = $id_account;
				$this->check_only = TRUE;
				$login_test = $this->login();
				// pre($login_test);
				// pre($this->sid);
				$response["sid"] = $this->sid;
				$response["login_result"] = $login_test;
			}
		}
		$data = $response;
		// $data = $postData;
		echo json_encode($data);
		return $response;
	}

	function group_folder_check()
	{
		$postData = $this->input->post();
		if (isset($postData) && !empty($postData)) {

			$sid = "";
			$username = "";
			$password = "";
			$id_folder_group = "";
			$acc_id = "";

			if (array_key_exists("sid", $postData)) {
				$sid = $postData["sid"];
				$this->sid = $sid;
			}

			if (array_key_exists("username", $postData)) {
				$username = $postData["username"];
				$explosion = explode("@", $username);
				$name = $explosion[0];
			}

			if (array_key_exists("id_folder_group", $postData)) {
				$id_folder_group = $postData["id_folder_group"];
			}

			if (array_key_exists("password", $postData)) {
				$password = $postData["password"];
			}

			if (array_key_exists("acc_id", $postData)) {
				$acc_id = $postData["acc_id"];
			}

			if (!empty($sid)) {
				$list_group_folders = $this->list_group_folders();
				if (count($list_group_folders) > 0 && (is_array($list_group_folders) || is_object($list_group_folders))) {
					// pre($list_group_folders);
					// ada group_folder
					if (isset($name) && !empty($name)) {
						// pre($name);
						// pre($id_folder_group);
						if (empty($id_folder_group)) {
							$create_group_folder = $this->group_folder_add_blank($name);
							$id_folder_group_api = $create_group_folder;
						} else {
							// dicek dari id groupnya
							$cek_id = $this->group_folder_check_by_id($id_folder_group);
							// var_dump($cek_id);
							if ($cek_id === TRUE) {
								// pre("buat baru lah");
								$create_group_folder = $this->group_folder_add_blank($name);
								// pre("cek id" . $cek_id);
								$id_folder_group_api = $create_group_folder;
							} else {
								// pre("podo kabeh");
								// cek list folder
								$id_folder_group_api = $id_folder_group;
							}
						}
					} else {
						$id_folder_group_api = false;
					}

					if ($id_folder_group_api !== FALSE) {

						$params_add = array(
							"api_username" => $username,
							"api_password" => $password,
							"sid" => $sid,
							"id_group_folder_api" => $id_folder_group_api,
							"name_group_folder_api" => $name,
						);

						$params_edit = array(
							"id_group_folder_api" => $id_folder_group_api,
							"name_group_folder_api" => $name,
						);

						if (isset($acc_id) && !empty($acc_id)) {
							$edit_account_data = $this->Api_account_model->edit_account_data($acc_id,$params_edit);
							$response["acc_id"] = $acc_id;
						} else {
							$add_account_data = $this->Api_account_model->add_account_data($params_add);
							$response["acc_id"] = $add_account_data;
						}

						$response["name_folder_group"] = $name;
						$response["id_folder_group"] = $id_folder_group_api;
					}
				} else {
					// buat group folder
					$id_folder_group_api = $this->group_folder_add_blank($name);
					if ($id_subfolder_api !== FALSE) {

						$params_add = array(
							"api_username" => $username,
							"api_password" => $password,
							"sid" => $sid,
							"id_group_folder_api" => $id_folder_group_api,
							"name_group_folder_api" => $name,
						);

						$params_edit = array(
							"id_group_folder_api" => $id_folder_group_api,
							"name_group_folder_api" => $name,
						);

						if (isset($acc_id) && !empty($acc_id)) {
							$edit_account_data = $this->Api_account_model->edit_account_data($acc_id,$params_edit);
							$response["acc_id"] = $acc_id;
						} else {
							$add_account_data = $this->Api_account_model->add_account_data($params_add);
							$response["acc_id"] = $add_account_data;
						}

						$response["name_folder_group"] = $name;
						$response["id_folder_group"] = $id_folder_group_api;
					}
				}
				$response["list_group_folders"] = $list_group_folders;
				$response["sid"] = $sid;
			}
		}
		$data = $response;
		echo json_encode($data);
	}

	function group_folder_add_blank($name)
	{
		if (isset($name) && !empty($name)) {
			// pre($name);
			$create_group_folder = $this->group_folder_add($name);
			return $create_group_folder;
		} else {
			return false;
		}
	}

	function group_folder_check_by_id($id_folder_group = NULL)
	{
		if (isset($id_folder_group) && !empty($id_folder_group)) {
			$list_group_folders = $this->list_group_folders();
			$id_folder_group_lists = array();
			foreach ($list_group_folders as $list_group_folder) {
				if (array_key_exists("id", $list_group_folder)) {
					$id_folder_group_api = $list_group_folder["id"];
				} else {
					$id_folder_group_api = "";
				}
				array_push($id_folder_group_lists, $id_folder_group_api);
			}
			// pre($id_folder_group);
			// pre($id_folder_group_lists);
			// var_dump(in_array($id_folder_group, $id_folder_group_lists));
			if (!in_array($id_folder_group, $id_folder_group_lists)) {
				// pre("tidak ada nama yang cocok");
				// lanjut pembuatan
				return true;
			} else {
				// pre("nama ada yang cocok");
				return false;
			}
		}
	}

	function folder_check()
	{
		$postData = $this->input->post();
		if (isset($postData) && !empty($postData)) {

			$sid = "";
			$acc_id = "";
			$id_folder_group = "";

			if (array_key_exists("sid", $postData)) {
				$sid = $postData["sid"];
				$this->sid = $sid;
			}

			if (array_key_exists("acc_id", $postData)) {
				$acc_id = $postData["acc_id"];
			}

			if (array_key_exists("id_folder_group", $postData)) {
				$id_folder_group = $postData["id_folder_group"];
			}

			if (!empty($sid)) {

				$list_folders_ithenticate = $this->list_folders();
				$list_id_folder_api_real = array();
				if (!empty($list_folders_ithenticate)) {
					foreach ($list_folders_ithenticate as $list_folder_ithenticate) {
						$id_folder_api_real = $list_folder_ithenticate["id"];
						$name_folder_api_real = $list_folder_ithenticate["name"];
						array_push($list_id_folder_api_real, $id_folder_api_real);
					}
				}

				$response["list_folders_api"] = $list_id_folder_api_real;

				if (!empty($acc_id)) {
					$this->load->model("user/Group_model");
					$this->load->model("user/Account_campus_model");
					$campus_lists_obj = $this->Group_model->get_campus_lists();
					$list_folders_campus_obj = $this->Account_campus_model->where(array("id_account"=>$acc_id))->get();
					$account_data = array();
					if ($campus_lists_obj->num_rows() > 0) {
						$campus_data = $campus_lists_obj->result();
						if (isset($campus_data) && !empty($campus_data)) {
							foreach ($campus_data as $campus) {
								$name_campus = $campus->name;
								$id_campus = $campus->id;
								if ($list_folders_campus_obj->num_rows() > 0) {
									// ada account campus folder
									$list_folder_campus = $list_folders_campus_obj->result();
									foreach ($list_folder_campus as $folder_campus) {
										$old_folder_api = $folder_campus->id_folder_api;
										if (in_array($old_folder_api, $list_id_folder_api_real)) {
											$id_folder_api = $old_folder_api;
											$params = array(
												"id_account" => $acc_id,
												"id_campus" => $id_campus,
												"id_folder_api" => $id_folder_api,
											);
										} else {
											$id_folder_api = $this->folder_add($id_folder_group,$name_campus);
											$params = array(
												"id_account" => $acc_id,
												"id_campus" => $id_campus,
												"id_folder_api" => $id_folder_api,
											);
											$this->Account_campus_model->add_account($params);
										}
									}
									if (!empty($params)) {
										array_push($account_data, $params);
									}
								} else {
									// tidak ada account campus folder
									// auto buat
									$id_folder_api = $this->folder_add($id_folder_group,$name_campus);
									if (!empty($id_folder_api)) {
										$params_add = array(
											"id_account" => $acc_id,
											"id_campus" => $id_campus,
											"id_folder_api" => $id_folder_api,
										);
										$this->Account_campus_model->add_account($params_add);
										array_push($account_data, $params_add);
									}
								}
							}
						}
					}
					$response["account_data"] = $account_data;
				}
				$response["sid"] = $sid;
			}
		}
		$data = $response;
		echo json_encode($data);
	}

	function login($remethod = FALSE)
	{
		if ($remethod === FALSE) {
			$xml = $this->pre_request("login");
			if (!empty($xml)) {
				$member = $this->send_request($xml);
				// pre($member);
				if (isset($member) && !empty($member)) {
					$response = $this->Api_account_model->ithenticate_response($member);
					if (isset($response) && !empty($response) && (is_object($response) || is_array($response))) {
						if (array_key_exists("api_status", $response)) {
							$api_status = $response->api_status;
						}
						if (array_key_exists("messages", $response)) {
							$messages = $response->messages;
						}
						if (array_key_exists("errors", $response)) {
							$errors = $response->errors;
						}
						if (array_key_exists("sid", $response)) {
							$sid = $response->sid;
						}
						if (array_key_exists("response_timestamp", $response)) {
							$response_timestamp = $response->response_timestamp;
						}
						if (array_key_exists("status", $response)) {
							$status = $response->status;
						}
					}
					// pre($response_timestamp);
					// pre($status);
					// pre($api_status);
					if (isset($api_status) && isset($status) && !empty($status) && !empty($api_status)) {
						switch ($api_status) {
							case "200":
								// pre($sid);
								if (isset($messages) && !empty($messages)) {
									return $messages;
								}
								if (isset($sid) && !empty($sid)) {
									$this->sid = $sid;
								}
								if ($this->check_only === TRUE) {
									return true;
								} else {
									return $this->Api_account_model->edit_account_data($this->id_account,array("sid" => $sid,"response_timestamp"=>$response_timestamp));
								}
								break;

							case "401":
								// pre($messages);
								// $this->load->model("Settings_model");
								// $this->Settings_model->get_manual();
								return $messages;
								// ganti ke manual
								break;

							case "500":
								return $errors;
								break;

							default:
								break;
						}
					}
				}
			}
		} elseif (isset($remethod) && is_string($remethod)) {
			// pre($remethod);
			$login = $this->login();
			if ($login === TRUE) {
				switch ($remethod) {
					case "account_get":
						return $this->account_get();
						break;

					case "list_folders":
						return $this->list_folders();
						break;

					case "list_group_folders":
						return $this->list_group_folders();
						break;

					case "group_folder_add":
						return $this->group_folder_add($this->name_group_folders);
						break;

					case "folder_add":
						return $this->folder_add($this->id_folder_group, $this->name_folder, $this->description);
						break;

					case "file_add":
						return $this->file_add($this->id_subfolder_api, $this->upload_param);
						break;

					default:
						break;
				}
			}
		}
	}

	function account_get()
	{
		$xml = $this->pre_request("account_get");
		if (!empty($xml)) {
			$data = $this->send_request($xml);
			// pre($data);
			if (isset($data) && !empty($data)) {
				$response = $this->Api_account_model->ithenticate_response($data);
				// pre($response);
				if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
					if (array_key_exists("status", $response)) {
						$status = $response->status;
					}
					if (array_key_exists("api_status", $response)) {
						$api_status = $response->api_status;
					}
					if (array_key_exists("response_timestamp", $response)) {
						$response_timestamp = $response->response_timestamp;
					}
					if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
						switch ($api_status) {
							case "200":
								if (array_key_exists("account", $response)) {
									$account = $response->account;
								}
								// pre($account);
								return $account;
								break;

							case "401":
								if (array_key_exists("messages", $response)) {
									$messages = $response->messages;
								}
								switch ($messages) {
									case "Failed to provide authenticated sid":
										// pre($messages);
										return $this->login("list_group_folders");
										break;
									
									default:
										break;
								}
								return $messages;
								break;
							
							default:
								break;
						}
					}
				}
			}
		}
	}

	function list_folders()
	{
		$xml = $this->pre_request("list_folders");
		if (!empty($xml)) {
			$data = $this->send_request($xml);
			// pre($data);
			if (isset($data) && !empty($data)) {
				$response = $this->Api_account_model->ithenticate_response($data);
				// pre($response);
				if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
					if (array_key_exists("status", $response)) {
						$status = $response->status;
					}
					if (array_key_exists("api_status", $response)) {
						$api_status = $response->api_status;
					}
					if (array_key_exists("response_timestamp", $response)) {
						$response_timestamp = $response->response_timestamp;
					}
					if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
						switch ($api_status) {
							case "200":
								if (array_key_exists("folders", $response)) {
									$folders = $response->folders;
								}
								return $folders;
								break;

							case "401":
								if (array_key_exists("messages", $response)) {
									$messages = $response->messages;
								}
								switch ($messages) {
									case "Failed to provide authenticated sid":
										// pre($messages);
										return $this->login("list_group_folders");
										break;
									
									default:
										break;
								}
								return $messages;
								break;
							
							default:
								break;
						}
					}
				}
			}
		}
	}

	function list_group_folders()
	{
		$xml = $this->pre_request("list_group_folders");
		if (!empty($xml)) {
			$data = $this->send_request($xml);
			// pre($data);
			if (isset($data) && !empty($data)) {
				$response = $this->Api_account_model->ithenticate_response($data);
				// pre($response);
				if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
					if (array_key_exists("status", $response)) {
						$status = $response->status;
					}
					if (array_key_exists("api_status", $response)) {
						$api_status = $response->api_status;
					}
					if (array_key_exists("response_timestamp", $response)) {
						$response_timestamp = $response->response_timestamp;
					}
					if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
						switch ($api_status) {
							case "200":
								if (array_key_exists("groups", $response)) {
									$groups = $response->groups;
								}
								// pre($groups);
								return $groups;
								break;

							case "401":
								if (array_key_exists("messages", $response)) {
									$messages = $response->messages;
								}
								switch ($messages) {
									case "Failed to provide authenticated sid":
										// pre($messages);
										return $this->login("list_group_folders");
										break;
									
									default:
										break;
								}
								return $messages;
								break;
							
							default:
								break;
						}
					}
				}
			}
		}
	}

	function group_folder_add($name)
	{
		if (isset($name) && !empty($name)) {
			$this->name_group_folders = $name;
			$params = array("name"=>$name);
			$xml = $this->pre_request("group_folder_add",$params);
			if (!empty($xml)) {
				$data = $this->send_request($xml);
				if (isset($data) && !empty($data)) {
					$response = $this->Api_account_model->ithenticate_response($data);
					if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
						if (array_key_exists("status", $response)) {
							$status = $response->status;
						}
						if (array_key_exists("api_status", $response)) {
							$api_status = $response->api_status;
						}
						if (array_key_exists("response_timestamp", $response)) {
							$response_timestamp = $response->response_timestamp;
						}
						if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
							switch ($api_status) {
								case "200":
									if (array_key_exists("id", $response)) {
										$id = $response->id;
									}
									// pre($id);
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									$this->messages = $messages;
									$this->api_status = $api_status;
									return $id;
									break;

								case "401":
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									switch ($messages) {
										case "Failed to provide authenticated sid":
											// pre($messages);
											return $this->login("group_folder_add");
											break;
										
										default:
											break;
									}
									$this->api_status = $api_status;
									return $messages;
									break;
								
								default:
									break;
							}
						}
					}
				}
			}
		} else {
			return false;
		}
	}

	function folder_add($id_folder_group, $name, $description = NULL, $exclude_quotes = TRUE)
	{
		if (isset($id_folder_group) && !empty($id_folder_group) && isset($name) && !empty($name)) {
			$description = isset($description) ? $description : "";
			$this->id_folder_group = $id_folder_group;
			$this->name_folder = $name;
			$this->description = $description;
			$params = array(
				"id_folder_group" => $id_folder_group,
				"name" => $name,
				"description" => $description,
				"exclude_quotes" => $exclude_quotes,
			);
			$xml = $this->pre_request("folder_add",$params);
			if (!empty($xml)) {
				$data = $this->send_request($xml);
				// pre($data);
				if (isset($data) && !empty($data)) {
					$response = $this->Api_account_model->ithenticate_response($data);
					if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
						if (array_key_exists("status", $response)) {
							$status = $response->status;
						}
						if (array_key_exists("api_status", $response)) {
							$api_status = $response->api_status;
						}
						if (array_key_exists("response_timestamp", $response)) {
							$response_timestamp = $response->response_timestamp;
						}
						if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
							switch ($api_status) {
								case "200":
									if (array_key_exists("id", $response)) {
										$id = $response->id;
									}
									// pre($id);
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									$this->messages = $messages;
									$this->api_status = $api_status;
									return $id;
									break;

								case "401":
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									switch ($messages) {
										case "Failed to provide authenticated sid":
											// pre($messages);
											return $this->login("folder_add");
											break;
										
										default:
											break;
									}
									$this->api_status = $api_status;
									return $messages;
									break;
								
								default:
									break;
							}
						}
					}
				}
			}
		} else {
			return false;
		}
	}

	function file_add($id_subfolder_api,$upload_param)
	{
		if (isset($id_subfolder_api) && !empty($id_subfolder_api) && isset($upload_param) && !empty($upload_param)) {
			$submit_to = 1;
			$this->id_subfolder_api = $id_subfolder_api;
			$this->upload_param = $upload_param;
			$params = array(
				"id_subfolder_api" => $id_subfolder_api,
				"submit_to" => $submit_to,
				"title" => $upload_param["title"],
				"first_name" => $upload_param["first_name"],
				"last_name" => $upload_param["last_name"],
				"filename" => $upload_param["filename"],
				"upload" => $upload_param["path_file"],
			);
			$xml = $this->pre_request("file_add",$params);
			if (!empty($xml)) {
				$data = $this->send_request($xml);
				pre($data);
				if (isset($data) && !empty($data)) {
					$response = $this->Api_account_model->ithenticate_response($data);
					if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
						pre($response);
						if (array_key_exists("status", $response)) {
							$status = $response->status;
						}
						if (array_key_exists("api_status", $response)) {
							$api_status = $response->api_status;
						}
						if (array_key_exists("response_timestamp", $response)) {
							$response_timestamp = $response->response_timestamp;
						}
						if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
							switch ($api_status) {
								case "200":
									if (array_key_exists("uploaded", $response)) {
										$uploaded = $response->uploaded;
										if (array_key_exists("id", $uploaded)) {
											$id_upload = $uploaded->id;
										} else {
											$id_upload = 0;
										}
									} else {
										$id_upload = 0;
									}
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									$this->messages = $messages;
									$this->api_status = $api_status;
									return $id_upload;
									break;

								case "401":
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									switch ($messages) {
										case "Failed to provide authenticated sid":
											// pre($messages);
											return $this->login("folder_add");
											break;
										
										default:
											break;
									}
									$this->api_status = $api_status;
									return $messages;
									break;
								
								default:
									break;
							}
						}
					}
				}
			}
		}
		return false;
	}

	function get_folder($id_folder)
	{
		if (isset($id_folder) && !empty($id_folder)) {
			$params = array(
				"id" => $id_folder,
			);
			$xml = $this->pre_request("get_folder",$params);
			if (!empty($xml)) {
				$data = $this->send_request($xml);
				// pre($data);
				if (isset($data) && !empty($data)) {
					$response = $this->Api_account_model->ithenticate_response($data);
					if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
						pre($response);
					}
				}
			}
		} else {
			return false;
		}
	}

	private function pre_request($method,$params=[])
	{
		$xml = "";
		switch ($method) {
			case "login":
				if (!empty($this->password) && !empty($this->username)) {
					$xml = "<methodCall><methodName>login</methodName><params><param><value><struct><member><name>password</name><value><string>". $this->password ."</string></value></member><member><name>username</name><value><string>" . $this->username . "</string></value></member></struct></value></param></params></methodCall>";
				}
				break;

			case "account_get":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>account.get</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("account_get");
				}
				break;

			case "list_folders":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>folder.list</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("list_folders");
				}
				break;

			case "list_group_folders":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>group.list</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("list_group_folders");
				}
				break;

			case "group_folder_add":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>group.add</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>name</name><value><string>" . $params["name"] . "</string></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("group_folder_add");
				}
				break;

			case 'folder_add':
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>folder.add</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>folder_group</name><value><int>" . $params["id_folder_group"] . "</int></value></member><member><name>name</name><value><string>" . $params["name"] . "</string></value></member><member><name>description</name><value><string>" . $params["description"] . "</string></value></member><member><name>exclude_quotes</name><value><boolean>" . $params["exclude_quotes"] . "</boolean></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("folder_add");
				}
				break;

			case "file_add":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>document.add</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>uploads</name><value><array><data><value><struct><member><name>filename</name><value><string>" . $params["filename"] . "</string></value></member><member><name>author_last</name><value><string>" . $params["last_name"] . "</string></value></member><member><name>upload</name><value><base64>" . base64_encode($params["upload"]) . "</base64></value></member><member><name>title</name><value><string>" . $params["title"] . "</string></value></member><member><name>author_first</name><value><string>" . $params["first_name"] . "</string></value></member></struct></value></data></array></value></member><member><name>submit_to</name><value><int>" . $params["submit_to"] . "</int></value></member><member><name>folder</name><value><int>" . $params["id_subfolder_api"] . "</int></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("file_add");
				}
				break;

			case "get_folder":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>folder.get</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>id</name><value><int>" . $params["id"] . "</int></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("get_folder");
				}
				break;

			case "get_status_file":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>document.get</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>id</name><value><int>" . $params["id"] . "</int></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("get_status_file");
				}
				break;

			case "get_similarity_report":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>report.get</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>id</name><value><int>" . $params["id"] . "</int></value></member><member><name>exclude_quotes</name><value><boolean>" . $params["exclude_quotes"] . "</boolean></value></member><member><name>exclude_biblio</name><value><boolean>" . $params["exclude_biblio"] . "</boolean></value></member><member><name>exclude_small_matches</name><value><boolean>" . $params["exclude_small_matches"] . "</boolean></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("get_similarity_report");
				}
				break;
			
			default:
				$xml = "";
				break;
		}
		return $xml;
	}

	private function send_request($xml)
	{
		$headers = array(
			"Content-type: application/xml"
		);

		$ch = curl_init(); 
		curl_setopt($ch, CURLOPT_URL,$this->url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		// curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

		$data = $this->Api_account_model->curl_request($ch,"Ithenticate");
		// pre($data);
		if ($data !== false) {
			return $data;
		}

		// if (!curl_errno($ch)) {
		//  $xml = simplexml_load_string($data, "SimpleXMLElement");
		//  $json = json_encode($xml);
		//  $array = json_decode($json,true);
		//  $member = $array["params"]["param"]["value"]["struct"]["member"];
		//  return $member;
		// } else {
		//  // karena gagal koneksi ke url api atau server itenticate sedang main tenis
		//  // plannya ganti mode manual dulu.
		//  // print curl_error($ch);
		//  // print curl_errno($ch);
		//  exit();
		// }
		// curl_close($ch);
	}
}