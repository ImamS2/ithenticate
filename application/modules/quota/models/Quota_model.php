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

	public function add_check_user($user_data = [])
	{
		if (isset($user_data) && !empty($user_data)) {
			$usage_amount = 0;
			foreach ($user_data as $pre_user) {
				if (!empty($pre_user)) {
					pre($pre_user);
					if (array_key_exists("quota", $pre_user)) {
						$quota_per_user = $pre_user["quota"];
						$usage_amount += $quota_per_user;
					}
				}
			}
			pre($usage_amount);
		} else {
			return false;
		}
	}
}