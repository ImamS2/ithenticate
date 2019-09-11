<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Account_campus_model extends MY_Model
{
	protected $table = "account_campus";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}

	public function add_account($params = NULL)
	{
		if (isset($params) && !empty($params)) {
			if($this->insert($params)){
				return $this->db->insert_id();
			} else {
				return false;
			}
		}
	}

	public function get_account_campus($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
	}
}