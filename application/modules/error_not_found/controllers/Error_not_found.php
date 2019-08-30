<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Error_not_found extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		if(!empty($this->session->has_userdata("user_id")) == TRUE){
			// pre("sudah login");
			echo Modules::run("Error_not_found/Error_admin/e_404");
		} else {
			// pre("belum login");
			echo Modules::run("Error_not_found/Error_front/e_404");
		}
	}
}