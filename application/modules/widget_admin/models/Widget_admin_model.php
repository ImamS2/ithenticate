<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Widget_admin_model extends MY_Model
{
	protected $trash = "Trash";
	protected $_lists = [];
	function __construct()
	{
		parent::__construct();
		// Modules::load("Group");
		// Modules::load("Folder");
	}

	public function primary_browse_folder($id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$this->load->model("group/Group_folder_model");
		$this->load->model("folder/Folder_model");
		$group_folders_lists = $this->Group_folder_model->get_group_folders()->result_array();
		foreach ($group_folders_lists as $folders) {
			if ($folders["name"] !== $this->trash) {
				$folders["subs"] = $this->Folder_model->get_folders_by_induk($folders["id"])->result_array();
			}
			array_push($this->_lists, $folders);
		}
		return $this->_lists;
	}

	public function user_browse_folder($id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$this->load->model("user/Group_model");
		$campus_lists = $this->Group_model->get_campus_lists()->result();
		foreach ($campus_lists as $folders) {
			$user_on_campus = $this->ion_auth->users($folders->id);
			if ($user_on_campus->num_rows() > 0) {
				$folders->users = $user_on_campus->result();
				array_push($this->_lists, $folders);
			}
		}
		return $this->_lists;
	}
}