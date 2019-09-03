<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Widget_Controller extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
	}
}


/**
* 
*/
class Widget_admin extends Widget_Controller
{
	protected $data = [];

	function __construct()
	{
		parent::__construct();
		$this->load->model("Widget_admin_model");
	}

	public function nav_tab()
	{
		Modules::load("auth");
		$cek_impersonate = $this->session->has_userdata("impersonate");
		if ($cek_impersonate === TRUE) {
			$this->data["impersonate"] = TRUE;
		}
		$this->load->view("nav_tab",$this->data);
	}

	public function header()
	{
		$this->load->view("header");
	}

	public function announcement()
	{
		$this->load->view("announcement");
	}

	public function confirm_tip()
	{
		$this->load->view("confirm_tip");
	}

	public function confirm_tip_excel()
	{
		$this->load->view("confirm_tip_excel");
	}

	public function alert_api()
	{
		if ($this->ion_auth->in_group("cho admin")) {
			$use_api = $this->Settings_model->get_app_config("use_api")->row()->nilai;
			if ($use_api === "0") {
				$this->data["use_api"] = FALSE;
			} elseif ($use_api === "1") {
				$this->data["use_api"] = TRUE;
			}
			if ($this->data["use_api"] === TRUE) {
				Modules::load("Api");
				$this->load->model("Api/Api_account_model");
				$api_active = $this->Api_account_model->get_account(array("active"=>1))->row();
				if (!empty($api_active) && (is_object($api_active) || is_array($api_active))) {
					pre("ada akun, lalu cek, apa bisa konek");
				} else {
					$this->data["response_msg"] = "Api Account is not set yet. Change to manual?";
					$this->data["link_manual"] = "en_us/settings/override_manual";
					$this->data["uri_string"] = $this->uri->uri_string;
					$this->load->view("alert_api",$this->data);
				}
			}
		}
	}

	public function folder_directory()
	{
		$trash_obj = $this->Group_folder_model->get_data_trash();
		if ($trash_obj->num_rows() === 1) {
			$trash = $trash_obj->row();
			$this->data["trash"] = $trash;
		}
		$this->data["browse_dir"] = $this->Widget_admin_model->primary_browse_folder();
		$this->load->model("Share_folder_model");
		$get_shared_obj = $this->Share_folder_model->get_shared_users_lists();
		// pre($get_shared_obj);
		if ($get_shared_obj->num_rows() > 0) {
			$get_shared_folders = $get_shared_obj->result();
			foreach ($get_shared_folders as $kunci => $users) {
				$foldere = $this->Share_folder_model->get_shared_users_folders($users->shared_id_user)->result();
				$folder_temp = new stdClass();
				foreach ($foldere as $key => $folder) {
					$folder_dets = new stdClass();
					$folder_dets->name_folder = $folder->name;
					$folder_dets->id_folder = $folder->id;
					$folder_temp->$key = $folder_dets;
				}
				$users->folders = $folder_temp;
			}
			$this->data["share_folders"] = $get_shared_folders;
		}
		$this->load->view("folder_directory",$this->data);
	}

	public function user_folder_directory()
	{
		$this->data["browse_dir"] = $this->Widget_admin_model->user_browse_folder();
		$this->load->view("user_folder_directory",$this->data);
	}

	public function footer()
	{
		$this->data["list"] = array(
			anchor("http://www.ithenticate.com/usage-policy/","Usage Policy"),
			anchor("http://www.ithenticate.com/privacy-pledge/","Privacy Pledge"),
			anchor("http://www.ithenticate.com/contact-us/","Contact Us"),
		);
		$this->load->view("footer",$this->data);
	}

	public function submit_file()
	{
		$this->load->model("Settings_model");
		$use_api = $this->Settings_model->get_app_config("use_api")->row()->nilai;
		if ($use_api === "0") {
			$this->data["use_api"] = FALSE;
		} elseif ($use_api === "1") {
			$this->data["use_api"] = TRUE;
		}
		$userdata = $this->ion_auth->user()->row();
		$this->data["limit_quota"] = $userdata->quota - $userdata->usage_quota;
		if ($this->ion_auth->in_group("cho admin")) {
			if ($this->data["use_api"] == TRUE) {
				$account_get = Modules::run("Api/ithenticate/account_get");
				// pre($account_get);
				$limit_quota = 0;
				if (is_array($account_get) || is_object($account_get)) {
					if(array_key_exists("report_limit", $account_get) === TRUE){
						$report_limit = $account_get->report_limit;
					}
					if(array_key_exists("report_count", $account_get) === TRUE){
						$report_count = $account_get->report_count;
					}
					if(array_key_exists("valid_until", $account_get) === TRUE){
						$valid_until = $account_get->valid_until;
					}
					if (isset($report_limit) && isset($report_count) && !empty($report_count) && !empty($report_limit)) {
						$limit_quota = $report_limit - $report_count;
					}
				}
				$this->data["limit_quota"] = $limit_quota;
				$this->data["limit_quota_left"] = $this->data["limit_quota"];
			}
		} else {
			$this->data["limit_quota_left"] = $this->data["limit_quota"];
		}
		$this->data["list"] = array(
			anchor(site_url("en_us/upload"),"<span>Upload a File</span>"),
			anchor(site_url("en_us/upload/zip"),"<span>Zip File Upload</span>"),
			anchor(site_url("en_us/upload/paste"),"<span>Cut &amp; Paste</span>"),
		);
		$this->load->view("submit_file",$this->data);
	}

	public function new_folder()
	{
		$this->load->view("new_folder",$this->data);
	}

	public function folder_info()
	{
		// $id_folder = $this->uri->segment(3);
		$this->load->model("Share_folder_model");
		foreach ($this->uri->segments as $uri_segment) {
			$id_folder = $uri_segment;
		}

		if (intval($id_folder) !== 0) {
			$folder_detail = $this->Folder_model->get_folder_details($id_folder);
			$shared_users_obj = $this->Share_folder_model->get_shared_users($id_folder);
		} else {
			$folder_detail = $this->Folder_model->get_folder_details();
			$shared_users_obj = $this->Share_folder_model->get_shared_users();
		}

		$trash_obj = $this->Group_folder_model->get_data_trash();
		if ($trash_obj->num_rows() === 1) {
			$trash = $trash_obj->row();
			if ($trash->id === $id_folder) {
				$this->data["is_trash"] = TRUE;
			} else {
				$this->data["is_trash"] = FALSE;
			}
		}

		$this->data["folder"] = $folder_detail->row_array();
		if ($shared_users_obj->num_rows() > 0) {
			$shared_users = $shared_users_obj->result();
			// pre($shared_users);
			$shared_user_list = array();
			$i = 0;
			foreach ($shared_users as $shared_user) {
				$id_shared_user = $shared_user->id_user;
				$shared_user_list[$i] = $id_shared_user;
				$i++;
			}
			$this->data["shared_users"] = $shared_user_list;
		}
		$this->load->view("folder_info",$this->data);
	}

	public function user_add()
	{
		$this->load->model("User/Group_model");
		if ($this->ion_auth->is_admin() && $this->ion_auth->in_group("cho admin")) {
			$this->data["active_users"] = $this->ion_auth->where(array("active"=>1))->users()->num_rows();
		} elseif ($this->ion_auth->is_admin() && !$this->ion_auth->in_group("cho admin")) {
			$universitas = $this->Group_model->get_user_campus()->row();
			$this->data["active_users"] = $this->ion_auth->where(array("active"=>1))->users($universitas->id)->num_rows();
			$this->data["jumlah_user_kampus"] = $this->ion_auth->users($universitas->id)->num_rows();
		}
		$this->load->view("user_add",$this->data);
	}

	public function user_navbar()
	{
		$this->load->view("user_navbar",$this->data);
	}

	public function user_folder_col_top()
	{
		$userdata = $this->ion_auth->user()->row();
		$this->data["userdata"] = $userdata;
		foreach ($this->uri->segments as $uri_segment) {
			$id = $uri_segment;
		}
		if ($id === "user_file") {
			$this->data["user_data"] = $this->data["userdata"];
		} else {
			$this->data["user_data"] = $this->ion_auth->user($id)->row();
		}
		$this->load->view("user_folder_col_top",$this->data);
	}

	public function folder_col_top()
	{
		$this->load->model("Group/Group_folder_model");
		$userdata = $this->ion_auth->user()->row();
		$this->data["userdata"] = $userdata;
		if (isset($userdata) && !empty($userdata)) {
			$this->data["temp_id"] = $userdata->home_folder;
		}
		foreach ($this->uri->segments as $uri_segment) {
			$id_folder = $uri_segment;
		}
		$trash_obj = $this->Group_folder_model->get_data_trash();
		if ($trash_obj->num_rows() === 1) {
			$trash = $trash_obj->row();
			if ($trash->id === $id_folder) {
				$this->data["is_trash"] = TRUE;
			} else {
				$this->data["is_trash"] = FALSE;
			}
		}
		if (empty($this->uri->segment(3)) && $this->uri->segment(2) === "folder") {
			$this->data["id"] = $this->data["userdata"]->home_folder;
		} elseif ($this->uri->segment(3) != "sharing" && $this->uri->segment(3) != "settings") {
			$this->data["id"] = $this->uri->segment(3);
		} elseif ($this->uri->segment(3) == "sharing" || $this->uri->segment(3) == "settings") {
			$this->data["id"] = $this->uri->segment(4);
		}
		if (isset($this->data["id"]) && !empty($this->data["id"])) {
			$this->data["folder"] = $this->Folder_model->get_folder_details($this->data["id"])->row_array();
		}
		$this->load->view("folder_col_top",$this->data);

	}

	public function group_folder_col_top()
	{
		if ($this->uri->segment(2) == "group") {
			if ($this->uri->segment(3) == "folders" || $this->uri->segment(3) == "edit") {
				$this->data["id"] = $this->uri->segment(4);
			}
		}
		if (isset($this->data["id"]) && !empty($this->data["id"])) {
			$this->data["group_folder"] = $this->Folder_model->get_folder_details($this->data["id"])->row_array();
		}
		$this->load->view("group_folder_col_top",$this->data);
	}

	public function shared_users_col_top()
	{
		if ($this->uri->segment(2) == "folder") {
			if ($this->uri->segment(3) == "users") {
				$this->data["id"] = $this->uri->segment(4);
			}
		}
		if (isset($this->data["id"]) && !empty($this->data["id"])) {
			$this->data["shared_users"] = $this->ion_auth->user($this->data["id"])->row();
			// $this->data["group_folder"] = $this->Folder_model->get_folder_details($this->data["id"])->row_array();
		}
		$this->load->view("shared_users_col_top",$this->data);
	}

	public function secondary_navtab_folder()
	{
		$this->load->view("secondary_navtab_folder");
	}

	public function settings_navbar()
	{
		$this->load->view("settings_navbar");
	}

	public function settings_tips()
	{
		$this->load->view("settings_tips");
	}

	public function error_form()
	{
		$this->load->view("validation_error_notification",$this->data);
	}

	public function sidebar_edit_activated()
	{
		$this->load->view("sidebar_edit_activated",$this->data);
	}

	public function sidebar_edit_banned()
	{
		$this->load->view("sidebar_edit_banned",$this->data);
	}

	public function sidebar_edit_delete()
	{
		$this->load->view("sidebar_edit_delete",$this->data);
	}
}
