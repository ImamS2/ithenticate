<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends Front_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$main_css = array(
			"css/combined-css.css",
			"css/home-head.css",
		);
		$js_up = array(
			"js/92785.js",
			"js/jquery.min.js",
			"js/analytics.js",
		);
		$this->template->set("main_css", $main_css);
		$this->template->set("js_up", $js_up);
		$this->template->set("title","Plagiarism Detection Software | " . APPNAME);
		$this->template->set("body_class","home-page");
		$this->template->load("home");
	}
}
