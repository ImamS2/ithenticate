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
		$this->load->model("user/Group_model");
		$user_campus = $this->Group_model->get_user_campus($id_new_user)->row();
		$id_campus = $user_campus->id;
		$this->load->model("api/Api_account_model");
		$acc_active = $this->Api_account_model->where(array("active"=>1))->limit(1)->get();
		if ($acc_active->num_rows() === 1) {
			$id_acc = $acc_active->row()->id;
			$this->where(array("id_campus"=>$id_campus,"id_account"=>$id_acc));
		} else {
			$this->where(array("id_campus"=>$id_campus));
		}
		$this->get();
		return $this;
	}
}