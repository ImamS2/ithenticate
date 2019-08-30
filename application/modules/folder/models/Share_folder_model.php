<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Share_folder_model extends MY_Model
{
	protected $table = "share_folder";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}

	public function get_shared_users($id_folder = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		if (empty($id_folder)) {
			$user_obj = $this->ion_auth->user($id);
			if ($user_obj->num_rows() > 0) {
				$userdata = $user_obj->row();
				$id_folder = $userdata->home_folder;
			}
		}
		$this->select("*");
		$this->where(array("id_folder"=>$id_folder));
		$this->get();
		return $this;
	}

	public function get_shared_users_lists($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$this->select("users.first_name, users.last_name, users.id as shared_id_user");
		$this->join("folder","id","id_folder");
		$this->join("users","id","id_user","folder");
		$this->group_by("folder.id_user");
		$this->where(array($this->table.".id_user"=>$id_user));
		$this->get();
		return $this;
	}

	public function get_shared_users_folders($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$this->select("folder.*");
		$this->join("folder","id","id_folder");
		$this->where(array($this->table.".id_user"=>$this->session->userdata("user_id"),"folder.id_user"=>$id_user));
		$this->get($this->table);
		return $this;
	}

	public function add_batch_shared_users($add_shared_user = NULL)
	{
		if (isset($add_shared_user) && !empty($add_shared_user) && (is_array($add_shared_user) || is_object($add_shared_user))) {
			$proses_add_batch = $this->insert_batch($add_shared_user);
			if ($proses_add_batch !== false) {
				return true;
			} else {
				return false;
			}
		}
	}

	public function add_share_folders($id_folder = NULL)
	{
		if (isset($id_folder) && !empty($id_folder)) {
			$_id_user = $this->security->xss_clean($this->input->post('_id_user'));
			$user_lists = json_decode($_id_user);
			$add_shared_user = array();
			foreach ($user_lists as $id_user) {
				$shared_users =  array(
					"id_folder"=> $id_folder,
					"id_user" => $id_user,
				);
				array_push($add_shared_user, $shared_users);
			}
			$jumlah_user_shared = count($add_shared_user);
			// var_dump($jumlah_user_shared > 0);
			// exit();
			$delete_shared_lama = $this->delete_shared_folder($id_folder);
			if ($delete_shared_lama === false) {
				return false;
			}
			if ($jumlah_user_shared > 0) {
				$tambah_batch_shared = $this->add_batch_shared_users($add_shared_user);
				if ($tambah_batch_shared !== false) {
					return $this->db->insert_id();
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}

	public function delete_shared_folder($id_folder = NULL)
	{
		if (isset($id_folder) && !empty($id_folder)) {
			$get_folder = $this->get_shared_users($id_folder);
			if ($get_folder->num_rows() > 0) {
				return $this->delete("id_folder",$id_folder);
			}
		} else {
			return false;
		}
	}
}