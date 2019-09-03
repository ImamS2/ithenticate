<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Settings_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_2colh");
		$this->load->model("Settings_model");
	}
}

/**
* 
*/
class Settings extends Settings_Controller
{
	function __construct()
	{
		parent::__construct();
		$setting_js = array(
			"js/account.js",
		);
		$this->main_js = array_push_values($this->main_js,$setting_js);
		$this->template->set("message",$this->session->flashdata("message"));
	}

	public function index()
	{
		$this->form_validation->set_rules("default_folder","Home Folder","required|numeric");
		$this->form_validation->set_rules("num_items_to_display","Document per page","required|numeric");
		$this->form_validation->set_rules("folder_after_upload","Redirect After Upload","required");

		if ($this->form_validation->run() === TRUE) {
			$update = $this->Settings_model->update_general();
			redirect("en_us/settings","refresh");
		} else {
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$this->load->model("Folder/Folder_model");
			$this->load->model("Group/Group_folder_model");
			$this->template->set("body_class","template layout_3_2colh");
			$this->data["folders"] = $this->Folder_model->get_folders_lists()->result_array();
			// pre($this->Folder_model->get_folders_lists());
			$this->data["document_per_page_lists"] = array(10,25,50,100,200);
			if (isset($this->data["userdata"]) && !empty($this->data["userdata"])) {
				$this->data["home_folder"] = $this->data["userdata"]->home_folder;
				$this->data["document_per_page"] = $this->data["userdata"]->document_per_page;
			}
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Settings",
			);
			$this->Settings_model->render_page("index",$this->data,$_template);
		}
	}

	public function document()
	{
		$this->form_validation->set_rules("alert_threshold","Percentage","required");

		if ($this->form_validation->run() === TRUE) {
			$update = $this->Settings_model->update_document();
			redirect("en_us/settings/document","refresh");
		} else {
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$this->data["percentage_lists"] = range(0,100,10);
			if (isset($this->data["userdata"]) && !empty($this->data["userdata"])) {
				$this->data["score_change"] = $this->data["userdata"]->score_change;
			}
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Settings Document",
			);
			$this->Settings_model->render_page("document",$this->data,$_template);
		}
	}

	public function app_setting()
	{
		if ($this->ion_auth->in_group("cho admin")) {
			Modules::load("Api/ithenticate");
			// $this->load->model()

			$this->form_validation->set_rules("maintenance","Maintenance","trim");
			
			if ($this->form_validation->run() === TRUE) {
				$update = $this->Settings_model->update_app_setting();
				if ($update == TRUE) {
					$this->session->set_flashdata("message","APP Setting was successfully updated");
				} else {
					$this->session->set_flashdata("message","APP Setting was unsuccessfully updated");
				}
				redirect("en_us/settings/app_setting","refresh");
			} else {
				$main_css = $this->main_css;
				$app_setting_js = array(
					"js/app_setting.js",
				);
				$this->main_js = array_push_values($this->main_js,$app_setting_js);
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Settings API iThenticate",
				);
				$api_accounts = $this->Api_account_model->get_account();
				if ($api_accounts->num_rows() > 0) {
					$api_account_lists = $api_accounts->result();
					// pre($api_account_lists);
					$this->data["api_accounts"] = $api_account_lists;
				}
				$this->data["alternate"] = 0;
				$this->data["maintenance"] = $this->Settings_model->get_app_config("maintenance")->row()->nilai;
				$this->data["email"] = $this->Settings_model->get_app_config("email_notif_admin")->row()->nilai;
				$this->data["telegram"] = $this->Settings_model->get_app_config("telegram_notif_admin")->row()->nilai;
				$this->Settings_model->render_page("app_setting",$this->data,$_template);
			}
		} else {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us/settings","refresh");
		}
	}

	public function add_api()
	{
		if ($this->ion_auth->in_group("cho admin")) {
			if ($this->form_validation->run() === TRUE) {
			} else {
				$main_css = $this->main_css;
				$app_setting_js = array(
					"js/add_api_account.js",
				);
				$this->main_js = array_push_values($this->main_js,$app_setting_js);
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Settings API iThenticate",
				);
				$this->Settings_model->render_page("api_add_account",$this->data,$_template);
			}
		} else {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us/settings","refresh");
		}
	}

	public function api_activate($id)
	{
		if (isset($id) && !empty($id)) {
			Modules::load("Api");
			$this->load->model("Api/Api_account_model");
			$api_activation = $this->Settings_model->get_automatic();
			$api_active = $this->Api_account_model->get_account(array("active"=>1))->row();
			if (!empty($api_active) && (is_object($api_active) || is_array($api_active))) {
				$id_aktif_dulu = $api_active->id;
				$nonaktifkan_api_dulu = $this->Api_account_model->edit_account_data($id_aktif_dulu,array("active"=>0));
			}
			$edit_account_data = $this->Api_account_model->edit_account_data($id,array("active"=>1));
			if ($edit_account_data != FALSE) {
				$this->session->set_flashdata("message","API Account activated success");
			} else {
				$this->session->set_flashdata("message","API Account activated failed");
			}
			redirect("en_us/settings/app_setting","refresh");
		}
		return FALSE;
	}

	public function api_deactivate($id)
	{
		if (isset($id) && !empty($id)) {
			Modules::load("Api");
			$this->load->model("Api/Api_account_model");
			$edit_account_data = $this->Api_account_model->edit_account_data($id,array("active"=>0));
			if ($edit_account_data != FALSE) {
				$this->session->set_flashdata("message","API Account deactivated success");
			} else {
				$this->session->set_flashdata("message","API Account deactivated failed");
			}
			redirect("en_us/settings/app_setting","refresh");
		}
		return FALSE;
	}

	public function override_manual()
	{
		$this->Settings_model->get_manual();
		$uri_backlink = $this->input->get("uri");
		redirect($uri_backlink,"refresh");
	}
}