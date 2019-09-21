<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Account_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$_langfile = "account_lang";
		$def_lang = $this->config->config['language'];
		$path = APPPATH."modules/account/language/" . $def_lang . "/";
		$account_lang = Modules::load_file($_langfile, $path, "lang");
		if($this->lang->language != $account_lang)
		{
			$this->lang->language = array_merge($this->lang->language, $account_lang);
			$this->lang->is_loaded[] = $_langfile.EXT;
			unset($account_lang);
		}
		Modules::load("user");
		// pre($this->data["userdata"]);
		// cek_password_default($this->data["userdata"]);
	}
}

/**
* 
*/
class Account extends Account_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set("body_class","template");
		$this->load->model(array("Account_model","Group_model"));
		$this->template->set("message",$this->session->flashdata("message"));
	}

	public function index()
	{
		$this->Account_model->_account_rules();
		if ($this->form_validation->run() === TRUE) {
			$path_upload = "assets/images/users/";
			$field_upload = "form_photo";
			$account_update = $this->Account_model->account_update();
			redirect("en_us/account","refresh");
		} else {
			$this->data['title'] = "Account Information";
			$this->data["attr_form"] = array(
				"class" => "__validate",
				"id" => "form0",
			);
			$this->data["hidden"] = array(
				"_token" => "",
			);
			$this->data["update_profile_btn"] = array(
				"class" => "btn btn-primary",
				"value" => "Update Profile",
			);
			$this->data["old_password"] = array(
				"name" => "form_old_password",
				"type" => "password",
				"class" => "EnterPassword form-control __required __validateProfile:EnterPassword",
				"id" => "form_old_password",
			);
			$this->data["first_name"] = array(
				"id" => "form_first_name",
				"name" => "form_first_name",
				"class" => "Author form-control __required __validateProfile:Author",
				"type" => "text",
				"value" => $this->ion_auth->user()->row()->first_name,
			);
			$this->data["last_name"] = array(
				"id" => "form_last_name",
				"name" => "form_last_name",
				"class" => "Author form-control __required __validateProfile:Author",
				"type" => "text",
				"value" => $this->ion_auth->user()->row()->last_name,
			);
			$this->data["email"] = array(
				"name" => "form_email",
				"value" => $this->ion_auth->user()->row()->email,
				"type" => "text",
				"class" => "Email form-control __required __validateProfile:Email",
				"id" => "form_email",
			);
			$this->data["photo"] = array(
				"name" => "form_photo",
				"type" => "file",
				"class" => "File form-control __validateProfile:File",
				"id" => "form_photo",
				"style" => "position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;",
			);
			$this->data["password"] = array(
				"name" => "form_password",
				"class" => "ScryptPassword form-control __validateProfile:ScryptPassword",
				"type" => "password",
				"id" => "form_password",
			);
			$this->data["password_chk"] = array(
				"name" => "form_password_chk",
				"type" => "password",
				"class" => "EnterPassword form-control __validateProfile:EnterPassword",
				"id" => "form930password_chk",
			);
			$this->data["profile_pic"] = array(
				"src" => site_url("assets/images/users/".$this->ion_auth->user()->row()->profile_pic),
				"alt" => "User Photo",
				"class" => "user_photo",
			);
			$this->data["limit_quota_left"] = $this->data["limit_quota"];
			$use_api = $this->data["use_api"];
			if ($use_api === TRUE) {
				$ithenticate = Modules::load("api/Ithenticate");
				$account_get = $ithenticate->account_get();
				if (!empty($account_get)) {
					$this->data["expired_real"] = format_tanggal_indo($account_get->valid_until);
				}
			}
			$account_js = array(
				'js/jquery_fileuploader.js',
				'js/upload_one.js',
				'js/account.js',
			);
			$account_css = array(
				'css/account_style.css',
			);
			$this->main_css = array_push_values($this->main_css,$account_css);
			$this->main_js = array_push_values($this->main_js,$account_js);
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Account Information",
			);
			$this->Account_model->render_page("index",$this->data,$_template);
		}
	}
}