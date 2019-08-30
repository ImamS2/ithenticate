<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class User_file_model extends MY_Model
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

	public function get_file_by_user($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");

		$this->load->model("Group/Group_folder_model");
		$trash_id = $this->Group_folder_model->get_data_trash()->row()->id;

		$this->select($this->table.".*, folder.id_user, folder.trashed, folder.id_induk, folder.name");
		$this->join("folder","id","id_folder");
		$this->where(array("folder.id_user" => $id_user, "folder.trashed !=" => $trash_id, "folder.id_induk != " => 0));
		$this->get($this->table);

		return $this;
	}

	public function edit_file_rule()
	{
		$this->form_validation->set_rules("percent_match","Percent Match","trim|is_natural|less_than_equal_to[100]");
		$this->form_validation->set_rules("status","Status","trim");
		$this->form_validation->set_rules("words","Word Count","trim|is_natural");
		$this->form_validation->set_rules("is_pending","Pending","required|trim|is_natural");
	}

	public function edit_file($id = NULL)
	{
		$percent_match = $this->security->xss_clean($this->input->post("percent_match"));
		$status = $this->security->xss_clean($this->input->post("status"));
		$words = $this->security->xss_clean($this->input->post("words"));
		$is_pending = $this->security->xss_clean($this->input->post("is_pending"));
		if (isset($id) && !empty($id)) {
			// $upload_path = "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR;
			// $pdf_report = $this->upload("file_pdf", $upload_path . "pdf" . DIRECTORY_SEPARATOR);
			// $html_report = $this->upload("file_html", $upload_path . "html" . DIRECTORY_SEPARATOR);
			$params = array(
				"is_pending" => $is_pending,
				"percent_match" => $percent_match,
				"words" => $words,
				"status" => $status,
			);
			$this->where(array($this->pk=>$id));
			return $this->update($params);
		} else {
			return false;
		}
	}
}