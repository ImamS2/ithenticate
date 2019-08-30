<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class En_us extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$this->load->library("session");
		$this->session->set_flashdata("message",$this->session->userdata("message"));
		redirect("en_us/folder","refresh");
	}
}