<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Report extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->load->model("Document_model");
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "report");
		$this->template->set("body_class","sc-theme focus box-shadow border-rad safari windows en_us sc-focus");
	}

	public function index($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$file_obj = $this->Document_model->get_file($id);
			if ($file_obj->num_rows() === 1) {
				$file_detail = $file_obj->row_array();
				$use_api = $this->data["use_api"];
				if ($use_api === TRUE) {
					$this->_api($id);
				} else {
					$this->_manual($id);
				}
			} else {
				$this->session->set_flashdata("message","ID File not found");
				redirect("en_us","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID File must be set");
			redirect("en_us","refresh");
		}
	}

	private function _api($id)
	{
		$main_css = $this->main_css;
		$main_js = $this->main_js;
		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Document Viewer",
		);
		$this->Document_model->render_page("report",$this->data,$_template);
	}

	private function _manual($id)
	{
		$main_css = $this->main_css;
		$main_js = $this->main_js;
		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Document Viewer",
		);
		$this->Document_model->render_page("report",$this->data,$_template);
	}
}