<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Upload_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
	}
}

/**
* 
*/
class Upload extends Upload_Controller
{

	function __construct()
	{
		parent::__construct();
		$this->load->model("File_model");
		$this->load->model("Folder/Folder_model");
		$this->template->set("message",$this->session->flashdata("message"));
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "upload");
		$this->template->set("body_class","yui-skin-sam template layout_3_2colh");
	}

	public function index($id = NULL)
	{
		$this->data["putaran"] = 10;

		if (!empty($id) && isset($id)) {
			$this->data["id"] = $id;
		}

		$this->main_js = array_diff($this->main_js, ["js/ithen_site_custom.js"]);

		$upload_css = array(
			"css/upload.css",
		);

		$upload_js = array(
			"js/progress.js",
			"js/ithen_site_custom.js",
			"js/jquery_fileuploader.js",
			"js/upload_one.js",
			"js/upload_two.js",
			"js/upload_click.js",
		);

		$this->main_css = array_push_values($this->main_css,$upload_css);
		$this->main_js = array_push_values($this->main_js,$upload_js);

		$browse_dir = $this->Folder_model->get_folder_upload_lists();
		$count_folders = $this->Folder_model->get_folders_lists()->num_rows();
		$this->data["count_folders"] = $count_folders;
		$this->data["browse_dir"] = $browse_dir;

		$main_css = $this->main_css;
		$main_js = $this->main_js;
		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Upload File",
		);

		$this->form_validation->set_rules("folder","Folder","required");

		if ($this->form_validation->run() === TRUE) {
			$this->File_model->uploading_file($this->data["putaran"]);
		} else {
			$this->File_model->render_page("index",$this->data,$_template);
		}
	}

	public function zip($id = NULL)
	{
		if (!empty($id) && isset($id)) {
			$this->data["id"] = $id;
		}

		$this->main_js = array_diff($this->main_js, ["js/ithen_site_custom.js"]);

		$browse_dir = $this->Folder_model->get_folder_upload_lists();
		$count_folders = $this->Folder_model->get_folders_lists()->num_rows();
		$this->data["count_folders"] = $count_folders;
		$this->data["browse_dir"] = $browse_dir;

		$upload_css = array(
			"css/upload.css",
		);

		$upload_js = array(
			"js/progress.js",
			"js/ithen_site_custom.js",
			"js/jquery_fileuploader.js",
			"js/upload_one.js",
			"js/upload_two.js",
			"js/upload_click.js",
		);

		$this->main_css = array_push_values($this->main_css,$upload_css);
		$this->main_js = array_push_values($this->main_js,$upload_js);

		$main_css = $this->main_css;
		$main_js = $this->main_js;

		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Upload Zip File",
		);

		$this->form_validation->set_rules("folder","Folder","required");

		if ($this->form_validation->run() === TRUE) {
			$this->File_model->uploading_file();
		} else {
			$this->File_model->render_page("zip",$this->data,$_template);
		}
	}

	public function paste($id = NULL)
	{
		if (!empty($id) && isset($id)) {
			$this->data["id"] = $id;
		}

		$this->main_js = array_diff($this->main_js, ["js/ithen_site_custom.js"]);

		$upload_css = array(
			"css/upload.css",
		);

		$upload_js = array(
			"js/progress.js",
			"js/ithen_site_custom.js",
			"js/jquery_fileuploader.js",
			"js/upload_one.js",
			"js/upload_zip_2.js",
			"js/upload_click.js",
		);

		$browse_dir = $this->Folder_model->get_folder_upload_lists();
		$count_folders = $this->Folder_model->get_folders_lists()->num_rows();
		$this->data["count_folders"] = $count_folders;
		$this->data["browse_dir"] = $browse_dir;

		$this->main_css = array_push_values($this->main_css,$upload_css);
		$this->main_js = array_push_values($this->main_js,$upload_js);

		$main_css = $this->main_css;
		$main_js = $this->main_js;

		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Upload Copy Paste File",
		);

		$this->form_validation->set_rules("folder","Folder","required");

		if ($this->form_validation->run() === TRUE) {
			$this->File_model->upload_text();
		} else {
			$this->File_model->render_page("paste",$this->data,$_template);
		}
	}
}