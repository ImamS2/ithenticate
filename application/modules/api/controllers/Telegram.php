<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Telegram extends Api_Controller
{
	protected $url = "https://api.telegram.org/bot";
	protected $token;
	protected $id_chat_base;
	protected $debug;
	protected $parse_mode;

	function __construct()
	{
		parent::__construct();
		$this->load->helper("form");
		$this->load->config("api/telegram");

		$this->token = $this->config->item("telegram_bot_key");
		$this->url = $this->url . $this->token . "/";
		$this->debug = TRUE;
		$this->id_chat_base = $this->config->item("creator");
		$this->parse_mode = $this->config->item("parse_mode");
	}

	public function getMe($token_bot = NULL)
	{
		$token_bot = isset($token_bot) ? $token_bot : $this->token;
		if (strlen($token_bot) > 20) {
			return $this->apiRequest("getMe");
		} else {
			return FALSE;
		}
	}

	public function getUpdates($last_id = NULL)
	{
		$getBot = $this->getMe();
		if ($getBot === FALSE) {
			return FALSE;
		} else {
			$params = [];
			if (!empty($last_id)){
				$params = ["offset" => $last_id+1, "limit" => 1];
			}
			return $this->apiRequest("getUpdates", $params);
		}
	}

	public function getWebhookInfo()
	{
		$token_bot = isset($token_bot) ? $token_bot : $this->token;
		if (strlen($token_bot) > 20) {
			return $this->apiRequest("getWebhookInfo");
		} else {
			return FALSE;
		}
	}

	public function deleteWebhook()
	{
		$token_bot = isset($token_bot) ? $token_bot : $this->token;
		if (strlen($token_bot) > 20) {
			return $this->apiRequest("deleteWebhooks");
		} else {
			return FALSE;
		}
	}

	public function sendMessage($pesan = NULL, $idchat = NULL, $mark_html = NULL, $idpesan = NULL)
	{
		if (empty($idchat)) {
			if (empty($this->id_chat_base)) {
			} else {
				$idchat = $this->id_chat_base;
			}
		}
		if (!empty($mark_html)) {
			$parse_mode = $mark_html;
		} else {
			$parse_mode = $this->parse_mode;
		}
		$pesan = isset($pesan) ? $pesan : $this->input->post("message");
		$data = array(
			"chat_id"=> $idchat,
			"text" => $pesan,
			"reply_to_message_id" => $idpesan,
			"parse_mode" => $parse_mode,
		);
		// $this->load->view("send");
		return $this->apiRequest("sendMessage", $data);
	}

	public function processMessage($message = NULL)
	{
		if ($this->debug === TRUE) print_r($message);
		if (empty($message)) {
			return FALSE;
		} elseif (isset($message["message"])) {
			$sumber		= $message["message"];
			$idpesan	= $sumber["message_id"];
			$idchat		= $sumber["chat"]["id"];

			$namamu		= $sumber["from"]["first_name"];

			if (isset($sumber["text"])) {
				$pesan	= $sumber["text"];
				$pecah	= explode(" ", $pesan);
				$katapertama = strtolower($pecah[0]);
				switch ($katapertama) {
					case "/start":
						$text = "Hai $namamu.. Akhirnya kita bertemu!";
						break;

					case "/time":
						$text	= "Waktu Sekarang :\n";
						$text	.= date("d-m-Y H:i:s");
						break;

					default:
						$text = "Pesan sudah diterima, terimakasih ya!";
						break;
				}
			} else {
				$text	= "Ada sesuatu di bola matamu..";
			}

			$hasil = $this->sendMessage($idpesan, $idchat, $text);
			if ($this->debug) {
				// hanya nampak saat metode poll dan debug = true;
				echo "Pesan yang dikirim: ".$text.PHP_EOL;
				print_r($hasil);
			}
		}
	}

	public function printUpdates($result)
	{
		foreach($result as $obj){
			// echo $obj["message"]["text"].PHP_EOL;
			$this->processMessage($obj);
			$last_id = $obj["update_id"];
		}
		return $last_id;
	}

	public function curl_request($handle)
	{
		$response = curl_exec($handle);

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
			$response = json_decode($response, true);
			error_log("Request has failed with error {$response["error_code"]}: {$response["description"]}\n");
			if ($http_code == 401) {
				throw new Exception("Invalid access token provided");
			}
			return false;
		} else {
			$response = json_decode($response, true);
			if (isset($response["description"])) {
				error_log("Request was successfull: {$response["description"]}\n");
			}
			$response = $response["result"];
		}

		return $response;
	}

	public function apiRequest($method, $parameters=null)
	{
		if (!is_string($method)) {
			error_log("Method name must be a string\n");
			return false;
		}

		if (!$parameters) {
			$parameters = array();
		} else if (!is_array($parameters)) {
			error_log("Parameters must be an array\n");
			return false;
		}

		foreach ($parameters as $key => &$val) {
			// encoding to JSON array parameters, for example reply_markup
			if (!is_numeric($val) && !is_string($val)) {
				$val = json_encode($val);
			}
		}

		$url = $this->url.$method."?".http_build_query($parameters);

		$handle = curl_init($url);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
		// curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 5);
		// curl_setopt($handle, CURLOPT_TIMEOUT, 60);
		curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

		return $this->curl_request($handle);
	}
}