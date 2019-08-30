<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Settings_model extends MY_Model
{
	protected $table = "app_config";
	protected $pk = "id";
	function __construct()
	{
		parent::__construct();
	}

	public function update_general($id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$default_folder = $this->security->xss_clean($this->input->post('default_folder'));
		$num_items_to_display = $this->security->xss_clean($this->input->post('num_items_to_display'));
		$folder_after_upload = $this->security->xss_clean($this->input->post('folder_after_upload'));

		$params = array(
			'document_per_page' => $num_items_to_display,
			'after_upload' => $folder_after_upload,
			'home_folder' => $default_folder,
		);

		$update = $this->ion_auth->update($id,$params);

		if ($update)
		{
			$this->session->set_flashdata("message",$this->ion_auth->messages());
			return true;
		}
	}

	public function update_document($id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$alert_threshold = $this->security->xss_clean($this->input->post('alert_threshold'));
		$params = array(
			'score_change' => $alert_threshold,
		);

		$update = $this->ion_auth->update($id,$params);
		if ($update)
		{
			$this->session->set_flashdata("message",$this->ion_auth->messages());
			return true;
		}
	}

	public function get_app_config($param_config = NULL)
	{
		if (isset($param_config) && !empty($param_config)) {
			$this->where(array("param_config" => $param_config));
			$this->limit(1);
		}
		$this->get();
		return $this;
	}

	public function get_manual()
	{
		$use_api = $this->get_app_config("use_api")->row();
		$id = $use_api->id;
		$this->where(array($this->pk=>$id));
		$edit = $this->update(array("nilai"=>0));
		if ($edit) {
			return true;
		} else {
			return false;
		}
	}

	public function get_automatic()
	{
		$use_api = $this->get_app_config("use_api")->row();
		$id = $use_api->id;
		$this->where(array($this->pk=>$id));
		$edit = $this->update(array("nilai"=>1));
		if ($edit) {
			return true;
		} else {
			return false;
		}
	}

	public function update_app_setting()
	{
		$o_maintenance = $this->Settings_model->get_app_config("maintenance")->row()->nilai;
		$o_use_api = $this->Settings_model->get_app_config("use_api")->row()->nilai;
		$o_email = $this->Settings_model->get_app_config("email_notif_admin")->row()->nilai;
		$o_telegram = $this->Settings_model->get_app_config("telegram_notif_admin")->row()->nilai;
		
		$maintenance = $this->security->xss_clean($this->input->post('maintenance'));
		$use_api = $this->security->xss_clean($this->input->post('use_api'));
		$email = $this->security->xss_clean($this->input->post('email'));
		$telegram = $this->security->xss_clean($this->input->post('telegram'));
		$nilai_ubah = array();
		
		if ($maintenance !== $o_maintenance) {
			$key = array("param_config" => "maintenance");
			$params = array("nilai" => $maintenance);
			$this->where($key);
			$edit_maintenance = $this->update($params);
			if ($edit_maintenance) {
				$nilai_ubah["edit_maintenance"] = TRUE;
			} else {
				$nilai_ubah["edit_maintenance"] = FALSE;
			}
		}

		if ($use_api !== $o_use_api) {
			$key = array("param_config" => "use_api");
			$params = array("nilai" => $use_api);
			$this->where($key);
			$edit_api = $this->update($params);
			if ($edit_api) {
				$nilai_ubah["edit_api"] = TRUE;
			} else {
				$nilai_ubah["edit_api"] = FALSE;
			}
		}

		if ($email !== $o_email) {
			$key = array("param_config" => "email_notif_admin");
			$params = array("nilai" => $email);
			$this->where($key);
			$edit_email = $this->update($params);
			if ($edit_email) {
				$nilai_ubah["edit_email"] = TRUE;
				// $this->session->set_flashdata("message","APP Setting was successfully updated");
			} else {
				$nilai_ubah["edit_email"] = FALSE;
				// $this->session->set_flashdata("message","APP Setting was unsuccessfully updated");
			}
		}

		if ($telegram !== $o_telegram) {
			$key = array("param_config" => "telegram_notif_admin");
			$params = array("nilai" => $telegram);
			$this->where($key);
			$edit_telegram = $this->update($params);
			if ($edit_telegram) {
				$nilai_ubah["edit_telegram"] = TRUE;
				// $this->session->set_flashdata("message","APP Setting was successfully updated");
			} else {
				$nilai_ubah["edit_telegram"] = FALSE;
				// $this->session->set_flashdata("message","APP Setting was unsuccessfully updated");
			}
		}

		// pre($nilai_ubah);
		// exit();

		if (isset($nilai_ubah) && !empty($nilai_ubah)) {
			return true;
		} else {
			return false;
		}
	}
}