<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Quota_model extends MY_Model
{
	function __construct()
	{
		parent::__construct();
		Modules::load("Auth");
	}

	public function get_user_quota($id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$quota_user = new stdClass();
		if ($this->ion_auth->in_group("cho admin",$id)) {
			$this->load->model("settings/Settings_model");
			$use_api_val = $this->Settings_model->get_app_config("use_api")->row()->nilai;
			if ($use_api_val === "0") {
				$use_api = FALSE;
			} elseif ($use_api_val === "1") {
				$use_api = TRUE;
			}
			if ($use_api === TRUE) {
				$api_itenticate = Modules::load("api/Ithenticate");
				if (!empty($api_itenticate) && isset($api_itenticate)) {
					$account_data = $api_itenticate->account_get();
					if (!empty($account_data) && isset($account_data)) {
						$base_quota = $account_data->report_limit;
						$usage_quota_awal = $account_data->report_count;
						$sisa_quota_awal = $base_quota - $usage_quota_awal;
					}
				}
			}
			$quota_user->base_quota = isset($base_quota) ? $base_quota : 0;
			$quota_user->usage_quota_awal = isset($usage_quota_awal) ? $usage_quota_awal : 0;
			$quota_user->sisa_quota_awal = isset($sisa_quota_awal) ? $sisa_quota_awal : 0;
		} else {
			$userdata = $this->ion_auth->user($id)->row();
			if (isset($userdata) && !empty($userdata)) {
				$base_quota = $userdata->quota;
				$usage_quota_awal = $userdata->usage_quota;
				$sisa_quota_awal = $base_quota - $usage_quota_awal;

				$quota_user->base_quota = $base_quota;
				$quota_user->usage_quota_awal = $usage_quota_awal;
				$quota_user->sisa_quota_awal = $sisa_quota_awal;
			}
		}
		return $quota_user;
	}

	public function kurangi_quota($amount = NULL, $id = NULL)
	{
		if (isset($amount) && !empty($amount)) {
			$id = isset($id) ? $id : $this->session->userdata("user_id");
			$userdata = $this->ion_auth->user($id)->row();
			$usage_quota_awal = $userdata->usage_quota;
			$base_quota = $userdata->quota;
			$usage_quota_akhir = $usage_quota_awal + $amount;
			if ($base_quota >= $usage_quota_akhir) {
				$params_edit = array("usage_quota"=>$usage_quota_akhir);
				$this->ion_auth->update($id,$params_edit);
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function tambah_quota($amount = NULL, $id = NULL)
	{
		if (isset($amount) && !empty($amount)) {
			$id = isset($id) ? $id : $this->session->userdata("user_id");
			$userdata = $this->ion_auth->user($id)->row();
			$usage_quota_awal = $userdata->usage_quota;
			$base_quota = $userdata->quota;
			$usage_quota_akhir = $usage_quota_awal - $amount;
			if ($usage_quota_akhir >= 0) {
				$params_edit = array("usage_quota"=>$usage_quota_akhir);
				$this->ion_auth->update($id,$params_edit);
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function tambah_usage_admin($amount = NULL, $id_new_user = NULL, $id_admin = NULL)
	{
		if (isset($amount) && isset($id_new_user) && !empty($amount) && !empty($id_new_user)) {
			$this->load->model("user/Group_model");
			$user_campus = $this->Group_model->get_user_campus($id_new_user)->row();
			$admin_kampus = $this->Group_model->get_admin_kampus($user_campus->id);
			$id_admin = isset($id_admin) ? $id_admin : $admin_kampus["id"];
			$usage_admin = $admin_kampus["usage_quota"];
			if ($amount <= $usage_admin) {
				$new_usage_admin = $usage_admin + $amount;
				$this->kurangi_quota($new_usage_admin,$id_admin);
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function kurangi_usage_admin($amount = NULL, $id_new_user = NULL, $id_admin = NULL)
	{
		if (isset($amount) && isset($id_new_user) && !empty($amount) && !empty($id_new_user)) {
			$this->load->model("user/Group_model");
			$user_campus = $this->Group_model->get_user_campus($id_new_user)->row();
			$admin_kampus = $this->Group_model->get_admin_kampus($user_campus->id);
			$id_admin = isset($id_admin) ? $id_admin : $admin_kampus["id"];
			$usage_admin = $admin_kampus["usage_quota"];
			if ($amount >= 0) {
				$new_usage_admin = $usage_admin - $amount;
				$this->tambah_quota($new_usage_admin,$id_admin);
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}