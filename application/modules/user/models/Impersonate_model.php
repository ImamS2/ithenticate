<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Impersonate_model extends MY_Model
{
	function __construct()
	{
		parent::__construct();
		$this->identity_column = $this->config->item("identity", "ion_auth");
	}

	public function impersonate($id)
	{
		$admin = $this->ion_auth->in_group("cho admin");
		if ($admin === FALSE) {
			return false;
		}
		$user_obj = $this->ion_auth->user($id);
		if ($user_obj->num_rows() === 1) {
			$userdata = $user_obj->row();
			$session_data = array(
				"identity"				=> $userdata->{$this->identity_column},
				$this->identity_column	=> $userdata->{$this->identity_column},
				"email"					=> $userdata->email,
				"user_id"				=> $userdata->id, //everyone likes to overwrite id so we will use user_id
				"old_last_login"		=> $userdata->last_login,
				"last_check"			=> time(),
				"impersonate"			=> TRUE,
			);
			// pre($session_data);

			$this->session->set_userdata($session_data);
			return true;
		} else {
			return false;
		}
	}

	public function back_to_admin()
	{
		$user_obj = $this->ion_auth->users("cho admin");
		if ($user_obj->num_rows() === 1) {
			$userdata = $user_obj->row();
			$session_data = array(
				"identity"				=> $userdata->{$this->identity_column},
				$this->identity_column	=> $userdata->{$this->identity_column},
				"email"					=> $userdata->email,
				"user_id"				=> $userdata->id, //everyone likes to overwrite id so we will use user_id
				"old_last_login"		=> $userdata->last_login,
				"last_check"			=> time(),
			);
			// pre($session_data);

			$this->session->set_userdata($session_data);
			$this->session->unset_userdata("impersonate");
			return true;
		} else {
			return false;
		}
	}
}