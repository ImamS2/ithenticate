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
		// $this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		// $this->template->set("body_class","yui-skin-sam template layout_3_2colh");
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
		// echo "gunakan api<br>Id file : ".$id;
		$this->load->view("report");
	}

	private function _manual($id)
	{
		// echo "mode manual<br>Id file : ".$id;
		$this->load->view("report");
	}
}