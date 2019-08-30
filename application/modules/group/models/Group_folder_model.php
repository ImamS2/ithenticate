<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Group_folder_model extends MY_Model
{
	protected $table = "folder";
	protected $trash = "Trash";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}

	public function get_group_folders($id_induk = 0, $id = NULL, $trash = FALSE, $precompiled = FALSE, $only_by = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$this->order_by($this->table.".id", "asc");
		if ($trash === FALSE) {
			$this->not_like($this->table.".name",$this->trash);
		}
		switch ($only_by) {
			case "user":
				$this->where(array($this->table.".id_user" => $id));
				break;
			
			default:
				$this->where(array($this->table.".id_user" => $id,$this->table.".id_induk"=>$id_induk));
				break;
		}
		if ($precompiled === FALSE) {
			$this->get($this->table);
		} else {
			$this->get($this->table,TRUE);
		}
		return $this;
	}

	public function get_data_trash($id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");

		$this->order_by($this->table.".id", "asc");
		$this->limit(1);
		$this->where(array($this->table.".id_user" => $id, $this->table.".id_induk"=> 0, $this->table.".name" => $this->trash));

		$this->get();
		return $this;
	}

	public function add_group_folder($name,$id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$name = isset($name) ? $name : NULL;
		$params = array(
			"id_user" => $id,
			"id_induk" => 0,
			"name" => $name,
			"trashed" => 0,
			"description" => "",
			"exclude_quotes" => 0,
			"exclude_biblio" => 0,
			"exclude_phrases" => 0,
			"limit_match_size" => 0,
			"minimum_match_word_count" => 0,
			"exclude_small_matches" => 0,
			"exclude_word_count" => 0,
			"exclude_percent" => 0,
			"exclude_abstracts" => 0,
			"exclude_methods" => 0,
			"add_to_index" => 0,
			"created_at" => time(),
		);
		if ($this->insert($params)) {
			return $this->db->insert_id();
		} else {
			return FALSE;
		}
	}

	public function edit_group_folder($id_folder, $name, $id_user = NULL)
	{
		if (isset($id_folder) && isset($name) && !empty($id_folder) && !empty($name)) {
			$this->where(array($this->pk=>$id_folder));
			$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
			$edit_gf = $this->update(array("name"=>$name, "id_user"=>$id_user));
		} else {
			$edit_gf = FALSE;
		}

		return $edit_gf;
	}

	public function delete_group_folder($id)
	{
		return $this->delete($this->pk,$id);
	}
}