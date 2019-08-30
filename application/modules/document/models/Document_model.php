<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Document_model extends MY_Model
{
	protected $table = "file";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}

	public function get_file($id_file = NULL)
	{
		if (isset($id_file) && !empty($id_file)) {
			$this->select($this->table.".*, folder.name as folder_name");
			$this->join("folder","id","id_folder");
			$this->where(array($this->table.".".$this->pk=>$id_file));
			$this->get();
		}
		return $this;
	}

	public function edit_doc_rules()
	{
		$this->form_validation->set_rules("title","Title","required|max_length[500]|trim");
		$this->form_validation->set_rules("author_first","Author First","required|max_length[500]|trim");
		$this->form_validation->set_rules("author_last","Author Last","required|max_length[500]|trim");
	}

	public function edit_doc($id_file = NULL)
	{
		$this->load->model("Upload/File_model");
		$title = $this->security->xss_clean($this->input->post("title"));
		$author_first = $this->security->xss_clean($this->input->post("author_first"));
		$author_last = $this->security->xss_clean($this->input->post("author_last"));
		$upload_param = array(
			"title" => $title,
			"author_first" => $author_first,
			"author_last" => $author_last,
		);
		if (isset($id_file) && !empty($id_file)) {
			$edit_process = $this->File_model->edit_file($id_file,$upload_param);
			if ($edit_process) {
				return true;
			}
		} else {
			return false;
		}
	}

	public function delete_doc($id_file = NULL)
	{
		$this->load->model("Upload/File_model");
		$this->load->model("Group/Group_folder_model");
		$get_data_trash_obj = $this->Group_folder_model->get_data_trash();
		if ($get_data_trash_obj->num_rows() > 0) {
			$data_trash = $get_data_trash_obj->row();
			$id_trash = $data_trash->id;

			$upload_param = array(
				"id_folder" => $id_trash,
			);

			if (isset($id_file) && !empty($id_file)) {
				$edit_process = $this->File_model->edit_file($id_file,$upload_param);
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