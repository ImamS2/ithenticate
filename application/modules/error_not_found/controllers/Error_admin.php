<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Error_admin extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_2colh");
		$this->load->model("Error_model");
	}

	public function e_404()
	{
		$error_admin_css = array(
			"css/error.css",
		);
		$this->main_css = array_push_values($this->main_css,$error_admin_css);
		$main_css = $this->main_css;
		$main_js = $this->main_js;
		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "404 Sorry we could not find that page",
		);
		$this->Error_model->render_page("admin",$this->data,$_template);
	}
}