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
		$file_detail_obj = $this->get_file($id);
		if ($file_detail_obj->num_rows() > 0) {
			$file_detail = $file_detail_obj->row();
			$this->load->model("folder/Folder_model");
			$folder_detail_obj = $this->Folder_model->get_folder_details($file_detail->id_folder);
			if ($folder_detail_obj->num_rows() > 0) {
				$folder_detail = $folder_detail_obj->row();
				$userdata = $this->ion_auth->user($folder_detail->id_user)->row();
			}
		} else {
			$userdata = $this->ion_auth->user()->row();
		}

		if (isset($id) && !empty($id)) {
			$upload_path = "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "report";
			$upload_pdf_path = $upload_path . DIRECTORY_SEPARATOR . "pdf" . DIRECTORY_SEPARATOR . "_" . $userdata->id;
			$upload_html_path = $upload_path . DIRECTORY_SEPARATOR . "html" . DIRECTORY_SEPARATOR . "_" . $userdata->id;
			if (!file_exists($upload_pdf_path)) {
				mkdir($upload_pdf_path);
			}
			if (!file_exists($upload_html_path)) {
				mkdir($upload_html_path);
			}
			$pdf_report = $this->upload("file_pdf", $upload_pdf_path,"pdf");
			pre($pdf_report);
			$html_report = $this->upload("file_html", $upload_html_path,"html");
			pre($html_report);
			$params = array(
				"is_pending" => $is_pending,
				"percent_match" => $percent_match,
				"words" => $words,
				"status" => $status,
			);
			if ($pdf_report !== false || $html_report !== false) {
				if (array_key_exists("file_pdf", $pdf_report)) {
					$file_pdf_report = $pdf_report["file_pdf"];
					if (array_key_exists("file_name", $file_pdf_report)) {
						$report_pdf_name = $file_pdf_report["file_name"];
					}
				}
				if (array_key_exists("file_html", $html_report)) {
					$file_html_report = $html_report["file_html"];
					if (array_key_exists("file_name", $file_html_report)) {
						$report_html_name = $file_html_report["file_name"];
					}
				}
				if (isset($file_pdf_report) && !empty($file_pdf_report)) {
					if (isset($report_pdf_name) && !empty($report_pdf_name)) {
						$params["report_name_pdf"] = $report_pdf_name;
					}
				}
				if (isset($file_html_report) && !empty($file_html_report)) {
					if (isset($report_html_name) && !empty($report_html_name)) {
						$params["report_name_html"] = $report_html_name;
					}
				}
			}
			$this->where(array($this->pk=>$id));
			return $this->update($params);
		} else {
			return false;
		}
	}
}