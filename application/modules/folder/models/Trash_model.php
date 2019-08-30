<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Trash_model extends MY_Model
{
	protected $table = "folder";
	protected $pk = "id";
	protected $id_trash;

	function __construct()
	{
		parent::__construct();
		$trash_obj = $this->Group_folder_model->get_data_trash();
		if ($trash_obj->num_rows() === 1) {
			$trash = $trash_obj->row();
			$this->id_trash = $trash->id;
		}
	}

	// pre($this->db->query("SELECT id FROM folder WHERE id_induk = " . $id_trash . " UNION SELECT id FROM file WHERE id_folder = " . $id_trash . "")->result());
	private function get_file_trashed($precompiled = FALSE)
	{
		$this->select("id,title,processed_time,author_first,author_last,is_pending,percent_match,words,uploaded_on");
		$this->where(array("file.id_folder" => $this->id_trash));
		if ($precompiled === FALSE) {
			$this->get("file");
		} else {
			$this->get("file",TRUE);
		}
		return $this;
	}

	private function get_folder_trashed($precompiled = FALSE)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$this->select("id,name,processed_time,description,exclude_quotes,add_to_index,exclude_small_matches,exclude_biblio,exclude_phrases");
		$this->where(array($this->table.".id_user" => $id,$this->table.".id_induk"=>$this->id_trash));
		if ($precompiled === FALSE) {
			$this->get($this->table);
		} else {
			$this->get($this->table,TRUE);
		}
		return $this;
	}

	public function get_trash_content($limit = NULL, $start = NULL)
	{
		$folder = $this->get_folder_trashed(TRUE);
		if (isset($limit) && !empty($limit) && isset($start) && !empty($start)) {
			$this->limit($limit);
			$this->offset($start);
		} elseif (isset($limit) && !empty($limit)) {
			$this->limit($limit);
		}
		$union = $this->union($folder->response,$this->get_file_trashed(TRUE)->response);
		return $union;
	}
}