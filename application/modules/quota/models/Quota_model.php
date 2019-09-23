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

	private function change_usage_quota_user($amount = NULL, $id_user = NULL)
	{
		if (isset($amount) && !empty($amount)) {
			$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
			$user_obj = $this->ion_auth->user($id_user);
			if ($user_obj->num_rows()) {
				$userdata = $user_obj->row();
				$params = array("usage_quota"=>$amount);
				$update = $this->ion_auth->update($id_user,$params);
				if ($update) {
					return true;
				}
			}
		}
		return false;
	}

	public function reduce_quota_user($amount = NULL, $id_user = NULL)
	{
		if (isset($amount) && !empty($amount)) {
			$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
			$quota_user = $this->get_user_quota($id_user);
			$new_usage_quota_user = $quota_user->usage_quota_awal + $amount;
			$base_quota_user = $quota_user->base_quota;
			if ($base_quota_user >= $new_usage_quota_user) {
				// pre("masih mencukupi");
				$proses_pengurangan = $this->change_usage_quota_user($amount,$id_user);
				if ($proses_pengurangan === TRUE) {
					return true;
				}
			}
		}
		return false;
	}

	public function add_check_user($user_data = [], $bool_reduce = TRUE)
	{
		if (isset($user_data) && !empty($user_data)) {
			$usage_amount = 0;
			$groups_data = array();
			foreach ($user_data as $pre_user) {
				if (!empty($pre_user)) {
					// pre($pre_user);
					if (array_key_exists("quota", $pre_user)) {
						$quota_per_user = $pre_user["quota"];
						$usage_amount += $quota_per_user;
					}
					if (array_key_exists("groups", $pre_user)) {
						$pre_user_groups = $pre_user["groups"];
						$groups_data = $pre_user_groups;
					}
				}
			}
			// pre($usage_amount);
			// pre($groups_data);
			$admin_campus_x = array();
			$this->load->model("user/Group_model");
			foreach ($groups_data as $campus) {
				$admin_campus_data = $this->Group_model->get_admin_kampus($campus);
				if (!empty($admin_campus_data)) {
					$admin_campus_x = $admin_campus_data[0];
				}
			}
			if ($bool_reduce === TRUE) {
				// pre("cek dulu cukup tidak untuk dikurangi dari kuota admin");
				// pre("kurangi admin");
				$id_admin_x = $admin_campus_x["id"];
				$pengurangan_kuota_admin = $this->reduce_quota_user($usage_amount,$id_admin_x);
				if ($pengurangan_kuota_admin === TRUE) {
					return true;
				}
			}
			return true;
		}
		return false;
	}
}