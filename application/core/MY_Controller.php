<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/* load the MX_Controller class */
require APPPATH."third_party/MX/Controller.php";

/**
* 
*/
class MY_Controller extends MX_Controller
{
	protected $data = [];
	function __construct()
	{
		parent::__construct();
		$this->template->set("icon","assets/images/favicon.ico");
	}
}

/**
* 
*/
class Api_Controller extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
	}
}

/**
* 
*/
class Auth_Controller extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "auth");
		$this->data["asterisk"] = [
			"src" => "assets/images/asterick.gif",
			"title" => "required",
			"class" => "is_required",
			"alt" => "(required)",
		];

		$this->data["transparent"] = [
			"src" => "assets/images/transparent.gif",
			"class" => "is_optional",
			"alt" => "(optional)",
		];
	}
}

/**
* 
*/
class Admin_Controller extends MY_Controller
{
	protected $main_css;
	protected $main_js;

	function __construct()
	{
		parent::__construct();
		$auth = Modules::load("Auth");
		if (!empty($auth))
		{
			if (!$this->ion_auth->logged_in())
			{
				// redirect them to the login page
				redirect("en_us/logout");
			}
			$userdata = $this->ion_auth->user()->row();

			$this->main_css = array(
				"css/css.css",
				"css/style.css",
				"css/cms.css",
			);
			$this->main_js = array(
				"js/jquery.min.js",
				"js/ithen_site_custom.js",
				"js/en_us.js",
			);

			Modules::load("settings");
			Modules::load("widget_admin");
			$this->load->model("settings/Settings_model");
			$this->data["userdata"] = $userdata;
			$this->data["announcement"] = $this->Settings_model->get_app_config("maintenance")->row()->nilai;
			$use_api = $this->Settings_model->get_app_config("use_api")->row()->nilai;
			if ($use_api === "0") {
				$this->data["use_api"] = FALSE;
			} elseif ($use_api === "1") {
				$this->data["use_api"] = TRUE;
			}
			$this->data["limit_quota"] = $userdata->quota - $userdata->usage_quota;

			if (!$this->ion_auth->in_group("cho admin")) {
				Modules::load("user");
				$this->load->model("user/Group_model");
				$universitas = $this->Group_model->get_user_campus($userdata->id)->row();
				$this->data["universitas"] = $universitas;
				$cek_impersonate = $this->session->has_userdata("impersonate");
				if ($cek_impersonate === FALSE) {
					$this->load->model("user/Ip_address_model");
					$check_ip_address = $this->Ip_address_model->check_ip_address();
					if ($check_ip_address == FALSE) {
						redirect("en_us/logout","refresh");
					}
				}
			}

			$this->data["asterisk"] = [
				"src" => "assets/images/asterick.gif",
				"title" => "required",
				"class" => "is_required",
				"alt" => "(required)",
			];


			$this->data["transparent"] = [
				"src" => "assets/images/transparent.gif",
				"class" => "is_optional",
				"alt" => "(optional)",
			];
			// pre($this);
		}
	}
}

/**
* 
*/
class Front_Controller extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "front");
	}
}