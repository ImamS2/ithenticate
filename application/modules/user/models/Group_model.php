<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Group_model extends MY_Model
{
	protected $table = "groups";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}

	public function get_campus_lists($id = NULL)
	{
		Modules::load("Auth");
		$this->not_like(array("id_creator" => 0));
		$get = $this->get();

		$result_object = $get->result();

		foreach ($result_object as $result) {
			$id_group = $result->id;
			$result->count_users = $this->ion_auth->users($id_group)->num_rows();
			$admin_campus = $this->get_admin_kampus($id_group);
			if (count($admin_campus) > 0) {
				$result->admin_campus = $admin_campus[0];
				$result->base_quota_campus = $admin_campus[0]["quota"];
				$result->usage_quota_campus = $admin_campus[0]["usage_quota"];
				$result->limit_quota_campus = $admin_campus[0]["quota"] - $admin_campus[0]["usage_quota"];
			}
		}

		return $this;
	}

	public function get_user_campus($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$this->select(array($this->table . "." . $this->pk, $this->table . ".description as name"));
		$this->where(array("users_groups.user_id" => $id_user));
		$this->not_like(array($this->table. ".id_creator" => 0));
		$this->join($this->table,"id","group_id","users_groups");
		$this->limit(1);
		$this->get("users_groups");
		return $this;
	}

	public function get_admin_kampus($id_kampus = NULL)
	{
		if (empty($id_kampus)) {
			return $this;
		}

		$user_lists = $this->ion_auth->users($id_kampus)->result();
		$admin_kampus = array();
		foreach ($user_lists as $user) {
			if ($this->ion_auth->is_admin($user->id)) {
				foreach ($user as $key => $value) {
					$admin_kampus[0][$key] = $value;
				}
			}
		}
		return $admin_kampus;
	}

	public function add_campus()
	{
		$initial_group = $this->security->xss_clean($this->input->post("newgroup"));
		$namegroup = $this->security->xss_clean($this->input->post("namegroup"));
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$params = array(
			"name" => $initial_group,
			"description" => $namegroup,
			"id_creator" => $id,
		);
		if($this->insert($params)){
			return $this->db->insert_id();
		} else {
			return false;
		}
	}

	public function edit_campus($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$user_id = isset($user_id) ? $user_id : $this->session->userdata("user_id");
			$namegroup = $this->security->xss_clean($this->input->post("namegroup"));
			$description = $this->security->xss_clean($this->input->post("description"));
			$params = array(
				"name" => $namegroup,
				"description" => $description,
				"id_creator" => $user_id,
			);
			if (isset($params) && !empty($params)) {
				$this->where(array($this->pk=>$id));
				$edit_group = $this->update($params);
			} else {
				$edit_group = false;
			}
			return $edit_group;
		} else {
			return false;
		}
	}
}