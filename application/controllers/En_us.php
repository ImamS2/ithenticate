<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class En_us extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$this->load->library("session");
		$this->session->set_flashdata("message",$this->session->userdata("message"));
		// Modules::load("Auth");
		// $userdata = $this->ion_auth->user()->row();
		// $act_code = $userdata->activation_code;
		// $act_sel = $userdata->activation_selector;
		// if (!empty($act_code) || !empty($act_sel)) {
		// 	redirect("en_us/user/password_reset","refresh");
		// } else {
			redirect("en_us/folder","refresh");
		// }
	}
}