<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Error_Front extends Front_Controller
{
	function __construct()
	{
		parent::__construct();
	}

	public function e_404()
	{
		$main_css = array(
			"css/combined-css.css",
			"css/error_front.css",
		);
		$js_up = array(
			"js/92785.js",
			"js/jquery.min.js",
			"js/analytics.js",
		);
		$this->template->set("main_css", $main_css);
		$this->template->set("js_up", $js_up);
		$this->template->set("title","Plagiarism Detection Software | " . APPNAME);
		$this->template->set("body_class","sub-page");
		$this->template->load("front");
	}
}