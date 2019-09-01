<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Recent_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
	}
}

/**
* 
*/
class Recent extends Recent_Controller
{
	function __construct()
	{
		Modules::load("folder");
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_2colh");
		$this->load->model("File_model");
		$this->load->model("Folder_model");
	}

	public function index()
	{
		$id_user = $this->session->userdata("user_id");
		if (!empty($id_user) && isset($id_user)) {
			$user_obj = $this->ion_auth->user($id_user);
			if ($user_obj->num_rows() > 0) {
				$main_css = $this->main_css;
				$main_js = $this->main_js;
				if ($this->input->get("per_page")) {
					$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
				} else {
					$start = 0;
				}

				$recent_upload = $this->Folder_model->get_recent_uploads();

				$this->data["count_file"] = $recent_upload->num_rows();
				$this->data["pagination"] = $this->Folder_model->pagination($this->data["count_file"]);

				if ($this->data["count_file"] > 0) {
					$this->data["recent_uploads"] = $this->Folder_model->limit($this->data["userdata"]->document_per_page)->offset($start)->get_recent_uploads()->result_array();
				}

				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Recent Upload",
				);

				$this->data["i"] = 0;

				$this->File_model->render_page("recent",$this->data,$_template);

			} else {
				$this->session->set_flashdata("message","User Not Found");
				redirect("en_us","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID User must be set");
			redirect("en_us","refresh");
		}
	}

	public function uploadlog($time_id = NULL)
	{
		if (isset($time_id) && !empty($time_id)) {
			$this->data["id"] = $time_id;

			if ($this->input->get("per_page")) {
				$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
			} else {
				$start = 0;
			}

			$main_css = $this->main_css;
			$main_js = $this->main_js;

			$uploadlog = $this->File_model->get_files_detail_logs($time_id);
			// pre($uploadlog);

			$this->data["count_file"] = $uploadlog->num_rows();
			$this->data["pagination"] = $this->Folder_model->pagination($this->data["count_file"]);

			if ($this->data["count_file"] > 0) {
				$this->data["file_lists"] = $this->File_model->limit($this->data["userdata"]->document_per_page)->offset($start)->get_files_detail_logs($time_id)->result_array();
			}

			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Recent Upload Details",
			);

			$this->File_model->render_page("log",$this->data,$_template);
		} else {
			$this->session->set_flashdata("message","ID Log Time must be set");
			redirect("en_us","refresh");
		}
	}
}