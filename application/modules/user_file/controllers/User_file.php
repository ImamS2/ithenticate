<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class User_file_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		Modules::load("User");
		$this->load->model("Group_model");
	}
}

/**
* 
*/
class User_file extends User_file_Controller
{
	function __construct()
	{
		parent::__construct();
		if ($this->ion_auth->is_admin() && !$this->ion_auth->in_group("cho admin")) {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us","refresh");
		}
		$this->load->model("User_file_model");
	}

	public function index($id = NULL)
	{
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "user_file");
		$this->template->set("body_class","template layout_3_3colh");

		if ($this->input->get("per_page")) {
			$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
		} else {
			$start = 0;
		}

		if (isset($id) && !empty($id)) {
			$this->data["id"] = $id;
		} else {
			$this->data["id"] = $this->data["userdata"]->id;
		}

		$user_file_obj = $this->User_file_model->get_file_by_user($this->data["id"]);

		$this->data["i"] = 0;
		$this->data["count_file"] = $user_file_obj->num_rows();
		$this->data["pagination"] = $this->User_file_model->pagination($this->data["count_file"]);

		if ($this->data["count_file"] > 0) {
			$this->data["files_list"] = $this->User_file_model->limit($this->data["userdata"]->document_per_page)->offset($start)->get_file_by_user($this->data["id"])->result_array();
		}

		$this->data["score_change"] = $this->data["userdata"]->score_change;

		$folder_view_js = array(
			"js/account.js",
			"js/document_manager.js",
			"js/folder_view.js",
		);
		$this->main_js = array_push_values($this->main_js,$folder_view_js);

		$main_css = $this->main_css;
		$main_js = $this->main_js;

		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "User File Management",
		);
		$this->User_file_model->render_page("index",$this->data,$_template);
	}

	public function edit($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$file_obj = $this->User_file_model->get_file($id);
			if ($file_obj->num_rows() > 0) {
				$file_detail = $file_obj->row();
				$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
				$this->template->set("body_class","template layout_3_2colh");
				
				$this->data["id"] = $file_detail->id;
				$this->data["file"] = $file_detail;
				// pre($file_detail);

				$folder_view_js = array(
					"js/account.js",
					"js/jquery_fileuploader.js",
					"js/upload_one.js",
				);
				$this->main_js = array_push_values($this->main_js,$folder_view_js);

				$main_css = $this->main_css;
				$main_js = $this->main_js;

				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Edit User File Management",
				);

				$this->User_file_model->edit_file_rule();

				if ($this->form_validation->run() === TRUE) {
					$edit_file = $this->User_file_model->edit_file($id);
					if ($edit_file !== FALSE) {
						$this->session->set_flashdata("message","File " . $file_detail->title . " has been updated");
					} else {
						$this->session->set_flashdata("message","File " . $file_detail->title . " failed to updated");
					}
					redirect("en_us/user_file","refresh");
				} else {
					$this->User_file_model->render_page("edit",$this->data,$_template);
				}
			} else {
				$this->session->set_flashdata("message","File not Found");
				redirect("en_us/user_file","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID File must be set");
			redirect("en_us/user_file","refresh");
		}
	}

	public function download($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$file_obj = $this->User_file_model->get_file($id);
			if ($file_obj->num_rows() > 0) {
				$this->load->helper("download");
				$file_detail = $file_obj->row();
				$path_file = $file_detail->path_folder;
				$file_name = $file_detail->data_name;
				if (!empty($path_file) && !empty($file_name)) {
					$full_file_path = $path_file . $file_name;
					if(file_exists(FCPATH.$full_file_path)){
						force_download($full_file_path,NULL);
					}
				}
			} else {
				$this->session->set_flashdata("message","File not Found");
				redirect("en_us/user_file","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID File must be set");
			redirect("en_us/user_file","refresh");
		}
	}
}