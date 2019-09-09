<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Folder_model extends MY_Model
{
	protected $table = "folder";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
		Modules::load("group");
		$this->load->model("group/Group_folder_model");
	}

	public function get_folder_details($id_folder = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");

		if (empty($id_folder)) {
			$user_obj = $this->ion_auth->user($id);
			if ($user_obj->num_rows() > 0) {
				$userdata = $user_obj->row();
				$id_folder = $userdata->home_folder;
			}
		}

		$this->where(array($this->table.".".$this->pk => $id_folder));
		$this->get();

		return $this;
	}

	public function get_recent_uploads()
	{
		$id_user = $this->session->userdata("user_id");
		$where = array("id_user" => $id_user);

		$this->select("uploaded_on, name, count(file.id) as quantity, file.id_folder_awal");
		$this->group_by("uploaded_on,file.id_folder_awal");
		$this->order_by("uploaded_on","ASC");
		$this->join("file","id_folder_awal",$this->pk);
		$this->where($where);
		$this->get($this->table);
		return $this;
	}

	public function get_folder_upload_lists()
	{
		$id_user = $this->session->userdata("user_id");
		$group_folder_obj = $this->Group_folder_model->get_group_folders();
		if ($group_folder_obj->num_rows() > 0) {
			$group_folder = $group_folder_obj->result();
			foreach ($group_folder as $g_folder) {
				$id_induk = $g_folder->id;
				$subfolder_obj = $this->get_folders_by_induk($id_induk);
				if ($subfolder_obj->num_rows() > 0) {
					$subfolder = $subfolder_obj->result();
					$g_folder->subs = $subfolder;
				}
			}
		} else {
			$group_folder = $this;
		}
		return $group_folder;
	}

	public function get_folders_lists($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$trash_id = $this->Group_folder_model->get_data_trash()->row()->id;
		$this->where(array($this->table.".id_user" => $id_user, $this->table.".trashed !=" => $trash_id, $this->table.".id_induk != " => 0));
		// $this->not_like($this->table.".id_induk",0);
		// $this->not_like($this->table.".trashed",$trash_id);
		$this->get();

		return $this;
	}

	public function get_folders_by_induk($id_induk = NULL, $id = NULL)
	{
		if (empty($id_induk)) {
			return $this;
		}
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$get_group_folders = $this->Group_folder_model->get_group_folders($id_induk,$id);

		$this->response = $get_group_folders->response;
		return $this;
	}

	public function add_folder($name, $folder_group, $id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$name = isset($name) ? $name : NULL;
		$folder_group = isset($folder_group) ? $folder_group : NULL;

		$exclude_quotes = $this->security->xss_clean($this->input->post("exclude_quotes"));
		$exclude_biblio = $this->security->xss_clean($this->input->post("exclude_biblio"));
		$exclude_phrases = $this->security->xss_clean($this->input->post("exclude_phrases"));
		$limit_match_size = $this->security->xss_clean($this->input->post("limit_match_size"));
		$minimum_match_word_count = $this->security->xss_clean($this->input->post("minimum_match_word_count"));
		$exclude_small_matches = $this->security->xss_clean($this->input->post("exclude_small_matches"));
		$exclude_word_count = $this->security->xss_clean($this->input->post("exclude_word_count"));
		$exclude_percent = $this->security->xss_clean($this->input->post("exclude_percent"));
		$exclude_abstracts = $this->security->xss_clean($this->input->post("exclude_abstracts"));
		$exclude_methods = $this->security->xss_clean($this->input->post("exclude_methods"));
		$add_to_index = $this->security->xss_clean($this->input->post("add_to_index"));

		$exclude_quotes = (empty($exclude_quotes) && $exclude_quotes == "" ? 0 : $exclude_quotes);
		$exclude_biblio = (empty($exclude_biblio) && $exclude_biblio == "" ? 0 : $exclude_biblio);
		$exclude_phrases = (empty($exclude_phrases) && $exclude_phrases == "" ? 0 : $exclude_phrases);
		$limit_match_size = (empty($limit_match_size) && $limit_match_size == "" ? 0 : $limit_match_size);
		$minimum_match_word_count = (empty($minimum_match_word_count) && $minimum_match_word_count == "" ? 0 : $minimum_match_word_count);
		$exclude_small_matches = (empty($exclude_small_matches) && $exclude_small_matches == "" ? 0 : $exclude_small_matches);
		$exclude_word_count = (empty($exclude_word_count) && $exclude_word_count == "" ? 0 : $exclude_word_count);
		$exclude_percent = (empty($exclude_percent) && $exclude_percent == "" ? 0 : $exclude_percent);
		$exclude_abstracts = (empty($exclude_abstracts) && $exclude_abstracts == "" ? 0 : $exclude_abstracts);
		$exclude_methods = (empty($exclude_methods) && $exclude_methods == "" ? 0 : $exclude_methods);

		$params = array(
			"id_user" => $id,
			"id_induk" => $folder_group,
			"name" => $name,
			"description" => "",
			"trashed" => 0,
			"exclude_quotes" => $exclude_quotes,
			"exclude_biblio" => $exclude_biblio,
			"exclude_phrases" => $exclude_phrases,
			"limit_match_size" => $limit_match_size,
			"minimum_match_word_count" => $minimum_match_word_count,
			"exclude_small_matches" => $exclude_small_matches,
			"exclude_word_count" => $exclude_word_count,
			"exclude_percent" => $exclude_percent,
			"exclude_abstracts" => $exclude_abstracts,
			"exclude_methods" => $exclude_methods,
			"add_to_index" => $add_to_index,
			"created_at" => time(),
		);

		if ($this->insert($params)) {
			return $this->db->insert_id();
		}
		else
		{
			return FALSE;
		}
	}

	public function edit_folder($id_folder, $name)
	{
		$name = isset($name) ? $name : NULL;

		$exclude_quotes = $this->security->xss_clean($this->input->post("exclude_quotes"));
		$exclude_biblio = $this->security->xss_clean($this->input->post("exclude_biblio"));
		$exclude_phrases = $this->security->xss_clean($this->input->post("exclude_phrases"));
		$limit_match_size = $this->security->xss_clean($this->input->post("limit_match_size"));
		$minimum_match_word_count = $this->security->xss_clean($this->input->post("minimum_match_word_count"));
		$exclude_small_matches = $this->security->xss_clean($this->input->post("exclude_small_matches"));
		$exclude_word_count = $this->security->xss_clean($this->input->post("exclude_word_count"));
		$exclude_percent = $this->security->xss_clean($this->input->post("exclude_percent"));
		$exclude_abstracts = $this->security->xss_clean($this->input->post("exclude_abstracts"));
		$exclude_methods = $this->security->xss_clean($this->input->post("exclude_methods"));
		$add_to_index = $this->security->xss_clean($this->input->post("add_to_index"));

		$exclude_quotes = (empty($exclude_quotes) && $exclude_quotes == "" ? 0 : $exclude_quotes);
		$exclude_biblio = (empty($exclude_biblio) && $exclude_biblio == "" ? 0 : $exclude_biblio);
		$exclude_phrases = (empty($exclude_phrases) && $exclude_phrases == "" ? 0 : $exclude_phrases);
		$limit_match_size = (empty($limit_match_size) && $limit_match_size == "" ? 0 : $limit_match_size);
		$minimum_match_word_count = (empty($minimum_match_word_count) && $minimum_match_word_count == "" ? 0 : $minimum_match_word_count);
		$exclude_small_matches = (empty($exclude_small_matches) && $exclude_small_matches == "" ? 0 : $exclude_small_matches);
		$exclude_word_count = (empty($exclude_word_count) && $exclude_word_count == "" ? 0 : $exclude_word_count);
		$exclude_percent = (empty($exclude_percent) && $exclude_percent == "" ? 0 : $exclude_percent);
		$exclude_abstracts = (empty($exclude_abstracts) && $exclude_abstracts == "" ? 0 : $exclude_abstracts);
		$exclude_methods = (empty($exclude_methods) && $exclude_methods == "" ? 0 : $exclude_methods);

		$params = array(
			"name" => $name,
			"description" => "",
			"exclude_quotes" => $exclude_quotes,
			"exclude_biblio" => $exclude_biblio,
			"exclude_phrases" => $exclude_phrases,
			"limit_match_size" => $limit_match_size,
			"minimum_match_word_count" => $minimum_match_word_count,
			"exclude_small_matches" => $exclude_small_matches,
			"exclude_word_count" => $exclude_word_count,
			"exclude_percent" => $exclude_percent,
			"exclude_abstracts" => $exclude_abstracts,
			"exclude_methods" => $exclude_methods,
			"add_to_index" => $add_to_index,
			"processed_time" => time(),
		);

		$edit_folder = $this->edit_process($id_folder, $params);

		return $edit_folder;
	}

	public function edit_process($id_folder = NULL,$params = NULL)
	{
		if (isset($id_folder) && isset($params) && !empty($id_folder) && !empty($params)) {
			$this->where(array($this->pk=>$id_folder));
			$this->update($params);
			return $this;
		} else {
			return false;
		}
	}

	public function delete_folder($id_folder)
	{
		$get_data_trash_obj = $this->Group_folder_model->get_data_trash();
		// pre($get_data_trash_obj);
		if ($get_data_trash_obj->num_rows() > 0) {
			$data_trash = $get_data_trash_obj->row();
			$id_trash = $data_trash->id;

			$upload_param = array(
				"id_induk" => $id_trash,
			);

			if (isset($id_folder) && !empty($id_folder)) {
				$edit_process = $this->edit_process($id_folder,$upload_param);
				if ($edit_process) {
					return true;
				}
			} else {
				return false;
			}
		} else {
			return FALSE;
		}
	}
}