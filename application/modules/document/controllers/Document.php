<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Document extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->load->model("Document_model");
	}

	public function edit($id_file)
	{
		if (isset($id_file) && !empty($id_file)) {
			$file_obj = $this->Document_model->get_file($id_file);
			if ($file_obj->num_rows() === 1) {
				$file_detail = $file_obj->row_array();
				$this->data["file"] = $file_detail;
				$this->data["id"] = $id_file;
				$id_folder = $file_detail["id_folder"];
				$home_folder = $this->data["userdata"]->home_folder;
				$this->Document_model->edit_doc_rules();
				if ($this->form_validation->run() === TRUE) {
					$edit_doc = $this->Document_model->edit_doc($id_file);
					if ($edit_doc !== FALSE) {
						$this->session->set_flashdata("message","Successfully Updated Document");
					} else {
						$this->session->set_flashdata("message","Failed Updated Document");
					}
					if ($id_folder == $home_folder) {
						redirect("en_us/","refresh");
					} else {
						redirect("en_us/folder/".$id_folder,"refresh");
					}
				} else {
					$main_css = $this->main_css;
					$main_js = $this->main_js;
					$_template = array(
						"main_css" => $main_css,
						"main_js" => $main_js,
						"title" => "File : " . $file_detail["title"],
					);
					$this->Document_model->render_page("edit",$this->data,$_template);
				}
			} else {
				$this->session->set_flashdata("message","ID File not found");
				redirect("en_us","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID File must be set");
			redirect("en_us","refresh");
		}
	}

	public function trash($id_file)
	{
		if (isset($id_file) && !empty($id_file)) {
			$file_obj = $this->Document_model->get_file($id_file);
			if ($file_obj->num_rows() === 1) {
				$file_detail = $file_obj->row();
				$file_title = $file_detail->title;
				$delete_doc = $this->Document_model->delete_doc($id_file);
				if ($delete_doc !== FALSE) {
					$this->session->set_flashdata("message","File " . $file_title . " has been deleted");
				} else {
					$this->session->set_flashdata("message","File " . $file_title . " failed to deleted");
				}
				if ($this->data["userdata"]->home_folder === $file_detail->id_folder) {
					redirect("en_us","refresh");
				} else {
					redirect("en_us/folder/".$file_detail->id_folder,"refresh");
				}
			} else {
				$this->session->set_flashdata("message","ID File not found");
				redirect("en_us","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID File must be set");
			redirect("en_us","refresh");
		}
	}
}