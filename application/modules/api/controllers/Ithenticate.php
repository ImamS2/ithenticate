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
	protected $response_timestamp; /* waktu response dibalas dari api ithenticate */

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
			return $this->_request_api("login");
		} elseif (isset($remethod) && is_string($remethod)) {
			// pre($remethod);
			$login = $this->login();
			if ($login === TRUE) {
				switch ($remethod) {
					case "account_get":
						return $this->account_get();
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
		return $this->_request_api("account_get");
	}

	public function list_group_folders()
	{
		return $this->_request_api("list_group_folders");
	}

	public function list_folders()
	{
		return $this->_request_api("list_folders");
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
		// var_dump($data);
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

	private function update_sid($method, $sid = NULL)
	{
		if (isset($sid) && !empty($sid)) {
			$this->sid = $sid;
			$update_sid = array(
				"sid" => $sid,
				"response_timestamp" => $this->response_timestamp,
			);
			switch ($method) {
				case "login":
					if ($this->check_only === TRUE) {
						return true;
					} else {
						return $this->Api_account_model->edit_account_data($this->id_account,$update_sid);
					}
					break;
				
				default:
					$this->Api_account_model->edit_account_data($this->id_account,$update_sid);
					break;
			}
		}
		return false;
	}

	private function _request_api($method,$params = [])
	{
		if (isset($method) && !empty($method)) {
			$xml = $this->pre_request($method,$params);
			if (!empty($xml)) {
				$data = $this->send_request($xml);
				if (isset($data) && !empty($data)) {
					// pre($data);
					$response = $this->Api_account_model->ithenticate_response($data);
					if (isset($response) && !empty($response) && (is_array($response) || is_object($response))) {
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
							$this->response_timestamp = $response_timestamp;
						}
						if (array_key_exists("status", $response)) {
							$status = $response->status;
						}
						if (isset($api_status) && isset($status) && !empty($status) && !empty($api_status)) {
							switch ($api_status) {
								case "200": /* success, may contain message but no error */
									switch ($method) {
										case "login":
											// pre($sid);
											if (isset($messages) && !empty($messages)) {
												return $messages;
											}
											$this->update_sid($method,$sid);
											break;

										case "account_get":
											if (array_key_exists("account", $response)) {
												$account = $response->account;
											}
											// pre($account);
											// pre($sid);
											$this->update_sid($method,$sid);
											return $account;
											break;

										case "list_group_folders":
											if (array_key_exists("groups", $response)) {
												$groups = $response->groups;
											}
											// pre($groups);
											// pre($sid);
											$this->update_sid($method,$sid);
											return $groups;
											break;

										case "list_folders":
											if (array_key_exists("folder_lists", $response)) {
												$folders = $response->folder_lists;
											}
											// pre($folders);
											// pre($sid);
											$this->update_sid($method,$sid);
											return $folders;
											break;

										default:
											break;
									}
									break;

								case "401": /*  request failed to provide an authenticated session id (sid) for the resource */
									switch ($method) {
										case "login":
											// pre($messages);
											// $this->load->model("Settings_model");
											// $this->Settings_model->get_manual();
											return $messages;
											// ganti ke manual
											break;

										default:
											switch ($messages) {
												case "Failed to provide authenticated sid":
													// pre($messages);
													return $this->login($method);
													break;
												
												default:
													return $messages;
													break;
											}
											break;
									}
									break;

								case "403": /* access to the requested resource is not authorized */
									break;

								case "404": /* requested resource was not found */
									break;

								case "500": /* error in the request, response payload may contain errors or messages */
									switch ($method) {
										case "login":
											return $errors;
											break;

										default:
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
}