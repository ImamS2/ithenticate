<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Ithenticate extends Api_Controller
{

	protected $url = "https://api.ithenticate.com/rpc"; /* link api ithenticate */
	protected $id_account; /* account id api ithenticate yang aktif */
	protected $username; /* username api ithenticate */
	protected $password; /* password user api ithenticate */
	protected $sid; /* key untuk menjalankan api, kecuali login */
	protected $check_only; /* status cek login, dicek saja tanpa simpan sid atau disimpan sidnya */
	protected $api_status; /* status response dari api ithenticate */
	protected $messages; /* pesan response dari api ithenticate */

	protected $name_group_folders; /* nama group folder yang akan di tambahkan */
	protected $id_group_folder; /* id group folder, yang nampung folder lainnya */

	function __construct()
	{
		parent::__construct();
		$this->load->model("Api_account_model");
		$api_active = $this->Api_account_model->where(array("active"=>1))->get()->row(); /* mencari 1 akun api yang aktif, kalau gak ada, duarr bebek */
		if (!empty($api_active) && (is_object($api_active) || is_array($api_active))) {
			$this->id_account = $api_active->id;
			$this->username = $api_active->api_username;
			$this->password = $api_active->api_password;
			$this->sid = $api_active->sid;
		}
		// pre($this);
	}

	public function test()
	{
		$this->load->view("index");
	}

	public function get_account()
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

	public function check_login_api()
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
	}

	public function check_group_folders_api()
	{
		$postData = $this->input->post();
		$data = $postData;
		echo json_encode($data);
	}

	public function login($remethod = FALSE)
	{
		if ($remethod === FALSE) {
			$xml = $this->pre_request("login");
			if (!empty($xml)) {
				$member = $this->send_request($xml);
				// var_dump($member);
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

					case "group_folder_add":
						return $this->group_folder_add($this->name_group_folders);
						break;

					case "get_folder":
						return $this->get_folder($this->id_group_folder);
						break;

					case "list_group_folders":
						return $this->list_group_folders();
						break;

					default:
						break;
				}
			}
		}
	}

	public function account_get()
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
					if (array_key_exists("sid", $response)) {
						$sid = $response->sid;
					}
					if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
						switch ($api_status) {
							case "200":
								if (array_key_exists("account", $response)) {
									$account = $response->account;
								}
								// pre($account);
								$this->sid = $sid;
								return $account;
								break;

							case "401":
								if (array_key_exists("messages", $response)) {
									$messages = $response->messages;
								}
								switch ($messages) {
									case "Failed to provide authenticated sid":
										// pre($messages);
										return $this->login("account_get");
										break;
									
									default:
										return $messages;
										break;
								}
								break;
							
							default:
								break;
						}
					}
				}
			}
		}
	}

	public function list_group_folders()
	{
		$xml = $this->pre_request("list_group_folders");
		if (!empty($xml)) {
			$data = $this->send_request($xml);
			pre($data);
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
					if (array_key_exists("sid", $response)) {
						$sid = $response->sid;
					}
					if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
						switch ($api_status) {
							case "200":
								break;

							case "404":
								if (array_key_exists("errors", $response)) {
									$errors = $response->errors;
								}
								return $errors;
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
										return $messages;
										break;
								}
								break;
							
							default:
								break;
						}
					}
				}
			}
		}
		return false;
	}

	public function group_folder_add($nama = NULL)
	{
		$nama = isset($nama) ? $nama : $this->name_group_folders;
		if (!empty($nama)) {
			$params = array(
				"name" => $nama,
			);
			$xml = $this->pre_request("group_folder_add",$params);
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
						if (array_key_exists("sid", $response)) {
							$sid = $response->sid;
						}
						if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
							switch ($api_status) {
								case "200":
									if (array_key_exists("messages", $response)) {
										$messages = $response->messages;
									}
									if (array_key_exists("id", $response)) {
										$id = $response->id;
									}
									$this->sid = $sid;
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
											return $messages;
											break;
									}
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

	public function get_folder($id_group_folder = NULL)
	{
		$id_group_folder = isset($id_group_folder) ? $id_group_folder : $this->id_group_folder;
		if (!empty($id_group_folder)) {
			$params = array(
				"id"=>$id_group_folder,
			);
			$xml = $this->pre_request("get_folder",$params);
			// pre($xml);
			if (!empty($xml)) {
				$data = $this->send_request($xml);
				pre($data);
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
						if (array_key_exists("sid", $response)) {
							$sid = $response->sid;
						}
						if (isset($api_status) && !empty($api_status) && isset($status) && !empty($status)) {
							switch ($api_status) {
								case "200":
									break;

								case "404":
									if (array_key_exists("errors", $response)) {
										$errors = $response->errors;
									}
									return $errors;
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
											return $messages;
											break;
									}
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
					$xml = "<methodCall><methodName>folder.add</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>folder_group</name><value><int>" . $params["id_group_folder"] . "</int></value></member><member><name>name</name><value><string>" . $params["name"] . "</string></value></member><member><name>description</name><value><string>" . $params["description"] . "</string></value></member><member><name>exclude_quotes</name><value><boolean>" . $params["exclude_quotes"] . "</boolean></value></member></struct></value></param></params></methodCall>";
				} else {
					$this->login("folder_add");
				}
				break;

			case "file_add":
				if (!empty($this->sid)) {
					$xml = "<methodCall><methodName>document.add</methodName><params><param><value><struct><member><name>sid</name><value><string>" . $this->sid . "</string></value></member><member><name>uploads</name><value><array><data><value><struct><member><name>filename</name><value><string>" . $params["filename"] . "</string></value></member><member><name>author_last</name><value><string>" . $params["last_name"] . "</string></value></member><member><name>upload</name><value><base64>" . base64_encode($params["upload"]) . "</base64></value></member><member><name>title</name><value><string>" . $params["title"] . "</string></value></member><member><name>author_first</name><value><string>" . $params["first_name"] . "</string></value></member></struct></value></data></array></value></member><member><name>submit_to</name><value><int>" . $params["submit_to"] . "</int></value></member><member><name>folder</name><value><int>" . $params["id_folder_api"] . "</int></value></member></struct></value></param></params></methodCall>";
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