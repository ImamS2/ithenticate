<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Group_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_3colh");
	}
}

/**
* 
*/
class Group extends Group_Controller
{
	function __construct()
	{
		parent::__construct();
		Modules::load("Folder");
		$this->load->model(array("Group_folder_model","Folder_model"));
		$folder_view_js = array(
			'js/account.js',
			'js/document_manager.js',
		);
		$this->main_js = array_push_values($this->main_js,$folder_view_js);
	}

	public function folders($id = NULL)
	{
		$this->template->set("message",$this->session->flashdata("message"));
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "folder");

		if (!empty($id) && isset($id)) {
			$this->data["id"] = $id;
			if ($this->input->get("per_page")) {
				$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
			} else {
				$start = 0;
			}
			$get_folder_details = $this->Folder_model->get_folder_details($id)->row_array();
			if ($get_folder_details["id_user"] !== $this->session->userdata("user_id")) {
				$this->session->set_flashdata("message","You are not allowed to view this folder");
				redirect("en_us","refresh");
			}
			$subfolder = $this->Group_folder_model->get_group_folders($id);
			$this->data["count_folder"] = $subfolder->num_rows();
			$this->data["pagination"] = $this->Group_folder_model->pagination($this->data["count_folder"]);
			if ($this->data["count_folder"] > 0) {
				$this->data["folders"] = $this->Group_folder_model->limit($this->data["userdata"]->document_per_page)->offset($start)->get_group_folders($id)->result_array();
			}
			$folder_view_js = array(
				"js/folder_view.js",
			);
			$this->main_js = array_push_values($this->main_js,$folder_view_js);
			$this->data["list"] = array(
				anchor(site_url("en_us/folder/new_folder/"),"Create a folder"),
				anchor(site_url("en_us/group/remove/"),"Remove this empty group"),
			);
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Group : ". $get_folder_details["name"] ,
			);
			$this->Group_folder_model->render_page("index",$this->data,$_template);
		} else {
			$this->session->set_flashdata("message","ID Group Folder must be set");
			redirect("en_us","refresh");
		}
	}

	public function edit($id = NULL)
	{
		$this->form_validation->set_rules('name','Nama Grup Folder','required|max_length[500]|trim');
		$this->template->set("message",$this->session->flashdata("message"));
		if (!empty($id) && isset($id)) {
			$this->data["group_folder"] = $this->Folder_model->get_folder_details($id)->row_array();
			if ($this->form_validation->run() === TRUE) {
				$name = $this->security->xss_clean($this->input->post('name'));
				$o_name = $this->data["group_folder"]["name"];
				$edit_gf = $this->Group_folder_model->edit_group_folder($id,$name);
				if ($edit_gf) {
					$this->session->set_flashdata("message","Group Folder " . $o_name . " has been updated to " . $name);
				} else {
					$this->session->set_flashdata("message","Group Folder " . $o_name . " failed to updated");
				}
				redirect("en_us/group/folders/".$id,"refresh");
			} else {
				$this->data["id"] = $id;
				$main_css = $this->main_css;
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Update Group : ". $this->data["group_folder"]["name"],
				);
				$this->Group_folder_model->render_page("edit",$this->data,$_template);
			}
		} else {
			if ($this->form_validation->run() === TRUE) {
				$name = $this->security->xss_clean($this->input->post('name'));
				$add_gf = $this->Group_folder_model->add_group_folder($name);
				if ($add_gf) {
					$this->session->set_flashdata("message","Group Folder " . $name . " has been created");
				} else {
					$this->session->set_flashdata("message","Group Folder " . $name . " failed to created");
				}
				redirect("en_us/folder","refresh");
			} else {
				$main_css = $this->main_css;
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Create Group",
				);
				$this->Group_folder_model->render_page("add",$this->data,$_template);
			}
		}
	}

	public function remove($id = NULL)
	{
		if (!empty($id) && isset($id)) {
			$this->data["id"] = $id;
			$group_folder_lists = $this->Group_folder_model->get_group_folders($id);
			$group_folder = $this->Folder_model->get_folder_details($id)->row();
			$jumlah_gf_lists = $group_folder_lists->num_rows();
			if ($jumlah_gf_lists > 0) {
				$this->session->set_flashdata("message","Group Folder " . $group_folder->name . " cannot deleted, because has subfolder in there");
			} else {
				if ($this->Group_folder_model->delete_group_folder($id)) {
					$this->session->set_flashdata("message","Group Folder " . $group_folder->name . " was deleted");
				}
			}
		} else {
			$this->session->set_flashdata("message","ID Group Folder must be set");
		}
		redirect("en_us","refresh");
	}
}