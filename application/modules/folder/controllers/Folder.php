<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Folder_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		Modules::load("Upload");
		Modules::load("Group");
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_3colh");
	}
}

/**
* 
*/
class Folder extends Folder_Controller
{
	protected $_trash;
	function __construct()
	{
		parent::__construct();
		$this->load->model("Folder_model");
		$this->load->model("File_model");
		$this->load->model("Group_folder_model");

		$trash_obj = $this->Group_folder_model->get_data_trash();
		if ($trash_obj->num_rows() === 1) {
			$trash = $trash_obj->row();
			$this->data["trash"] = $trash;
			$this->_trash = $trash;
		}
	}

	public function index($id = NULL)
	{
		$this->load->model("Share_folder_model");
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "folder");

		if (!empty($id) || isset($id)) {
			$this->data["id"] = $id;
		} else {
			$this->data["id"] = $this->data["userdata"]->home_folder;
		}

		if ($this->_trash->id === $this->data["id"]) {
			echo Modules::run("Folder/Trash/trashbin");
		} else {
			if ($this->input->get("per_page")) {
				$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
			} else {
				$start = 0;
			}

			$folder_view_js = array(
				"js/account.js",
				"js/document_manager.js",
				"js/folder_view.js",
			);
			$this->main_js = array_push_values($this->main_js,$folder_view_js);

			$main_css = $this->main_css;
			$main_js = $this->main_js;

			$folder_details = $this->Folder_model->get_folder_details($this->data["id"])->row_array();

			$get_shared_users_obj = $this->Share_folder_model->get_shared_users($id);
			$shared_users = array();
			if($get_shared_users_obj->num_rows() > 0) {
				$get_shared_users = $get_shared_users_obj->result();
				foreach ($get_shared_users as $shared) {
					array_push($shared_users, $shared->id_user);
				}
			}
			if(in_array($this->session->userdata("user_id"), $shared_users) === FALSE){
				if($folder_details["id_user"] !== $this->session->userdata("user_id")){
					$this->session->set_flashdata("message","You are not allowed to view this folder");
					redirect("en_us","refresh");
				}
			}

			$this->data["folder"] = $folder_details;
			$files_list = $this->File_model->get_files_by_folder($this->data["id"]);

			$this->data["count_file"] = $files_list->num_rows();
			$this->data["pagination"] = $this->Folder_model->pagination($this->data["count_file"]);

			if ($this->data["count_file"] > 0) {
				$this->data["files_list"] = $this->File_model->limit($this->data["userdata"]->document_per_page)->offset($start)->get_files_by_folder($this->data["id"])->result_array();
			}

			$this->data["score_change"] = $this->data["userdata"]->score_change;

			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Folder : ". $this->data["folder"]["name"] ,
			);
			$this->Folder_model->render_page("index",$this->data,$_template);
		}
	}

	public function create_folder()
	{
		$this->add();
	}

	public function new_folder($id = NULL)
	{
		$this->add($id);
	}

	public function settings($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$this->data["id"] = $id;
			$get_folder_details = $this->Folder_model->get_folder_details($id);
			$this->data["folder"] = $get_folder_details->row_array();

			$this->data["update_setting_btn"] = array(
				"class" => "btn btn-primary",
				"value" => "Update Setting",
			);

			$this->form_validation->set_rules("name","Nama Folder","required|max_length[500]|trim");

			if ($this->form_validation->run() === TRUE) {
				$name = $this->security->xss_clean($this->input->post("name"));
				$o_name = $this->data["folder"]["name"];
				$edit_folder = $this->Folder_model->edit_folder($id,$name);
				if ($edit_folder) {
					$this->session->set_flashdata("message","Folder " . $o_name . " has been updated to " . $name);
				} else {
					$this->session->set_flashdata("message","Folder " . $o_name . " failed to updated");
				}
				redirect("en_us/folder/".$id,"refresh");
			} else {
				$folder_edit_js = array(
					"js/document_manager.js",
					"js/folder_add.js",
				);

				$folder_edit_css = array(
					"css/folder_custom.css",
				);

				$this->main_css = array_push_values($this->main_css,$folder_edit_css);
				$this->main_js = array_push_values($this->main_js,$folder_edit_js);

				$main_css = $this->main_css;
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Setting Folder : ",
				);
				$this->Folder_model->render_page("setting",$this->data,$_template);
			}
		} else {
			$this->session->set_flashdata("message","ID Folder must be set");
			redirect("en_us/","refresh");
		}
	}

	public function sharing($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$this->load->model("Share_folder_model");
			$folder = $this->Folder_model->limit(1)->get_folder_details($id);
			if ($folder->num_rows() > 0) {
				$folder_details = $folder->row();
				$this->data["folder"] = $folder_details;
				$this->data["id"] = $id;

				$shared_users_obj = $this->Share_folder_model->get_shared_users($id);
				if ($shared_users_obj->num_rows() > 0) {
					$shared_users = $shared_users_obj->result();
					// pre($shared_users);
					$shared_user_list = array();
					$i = 0;
					foreach ($shared_users as $shared_user) {
						$id_shared_user = $shared_user->id_user;
						$shared_user_list[$i] = $id_shared_user;
						$i++;
					}
					$this->data["shared_users"] = $shared_user_list;
				}

				if (isset($this->data["universitas"]) && !empty($this->data["universitas"])) {
					$universitas = $this->data["universitas"];
					// pre($this->session);
					$users_campus_obj = $this->ion_auth->where(array("users.id != "=>$this->session->userdata("user_id")))->users($universitas->id);
					if ($users_campus_obj->num_rows() > 0) {
						$users_campus = $users_campus_obj->result();
						$this->data["user_lists"] = $users_campus;
					}
				}

				$this->form_validation->set_rules("_id_user","ID User","required");

				if ($this->form_validation->run() === TRUE) {
					$add_share_folders = $this->Share_folder_model->add_share_folders($id);
					if ($add_share_folders !== false) {
						$this->session->set_flashdata("message","Folder " . $folder_details->name . " has successfully shared");
					} else {
						$this->session->set_flashdata("message","Folder " . $folder_details->name . " failed to shared ");
					}
					redirect("en_us/folder/".$id,"refresh");
				} else {
					$this->data["share_update_btn"] = array(
						"class" => "btn btn-primary",
						"value" => "Update Sharing",
					);
					$this->data["sharing_form"] = array(
						"id" => "form0",
						"class" => "__validate",
					);
					$this->data["hidden_sharing"] = array(
						"token" => "",
					);

					$folder_sharing_css = array(
						"css/folder_custom.css",
					);
					$folder_sharing_js = array(
						"js/folder_add.js",
						"js/document_manager.js",
						"js/account.js",
						"js/sharing.js",
					);

					$this->main_css = array_push_values($this->main_css,$folder_sharing_css);
					$this->main_js = array_push_values($this->main_js,$folder_sharing_js);

					$main_css = $this->main_css;
					$main_js = $this->main_js;
					$_template = array(
						"main_css" => $main_css,
						"main_js" => $main_js,
						"title" => "Share Folder : ",
					);
					$this->Folder_model->render_page("sharing",$this->data,$_template);
				}
			} else {
				$this->session->set_flashdata("message","ID Folder not found");
				redirect("en_us/","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID Folder must be set");
			redirect("en_us/","refresh");
		}
	}

	public function add($id = NULL)
	{
		$get_group_folders = $this->Group_folder_model->get_group_folders();
		$count_group_folders = $get_group_folders->num_rows();
		$this->data["count_group_folders"] = $count_group_folders;

		if ($count_group_folders > 1) {
			$this->data["group_folders"] = $get_group_folders->result_array();
		} elseif ($count_group_folders === 1) {
			$this->data["group_folders"] = $get_group_folders->row_array();
		} elseif ($count_group_folders < 1) {
			$this->session->set_flashdata("message","Make Group Folder at least 1");
			redirect("en_us","refresh");
		}

		if (!empty($id) || isset($id)) {
			$this->data["id"] = $id;
		}

		$this->form_validation->set_rules("name","Nama Folder","required|max_length[500]|trim");
		$this->form_validation->set_rules("folder_group","Nama Grup Folder","required");

		if ($this->form_validation->run() === TRUE) {
			$name = $this->security->xss_clean($this->input->post("name"));
			$folder_group = $this->security->xss_clean($this->input->post("folder_group"));

			$add_folder = $this->Folder_model->add_folder($name,$folder_group);
			if ($add_folder) {
				$this->session->set_flashdata("message","Folder " . $name . " was created");
			} else {
				$this->session->set_flashdata("message","Folder " . $name . " unable to created");
			}
			redirect("en_us/","refresh");
		} else {
			$folder_add_js = array(
				"js/document_manager.js",
				"js/folder_add.js",
			);

			$folder_add_css = array(
				"css/folder_custom.css",
			);

			$this->main_css = array_push_values($this->main_css,$folder_add_css);
			$this->main_js = array_push_values($this->main_js,$folder_add_js);

			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Create Folder",
			);
			$this->Folder_model->render_page("add",$this->data,$_template);
		}
	}

	public function users($id_user)
	{
		$this->load->model("Share_folder_model");
		if (isset($id_user) && !empty($id_user)) {
			$this->template->set_template("template" . DIRECTORY_SEPARATOR . "folder");
			if ($this->input->get("per_page")) {
				$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
			} else {
				$start = 0;
			}
			$this->data["i"] = 0;
			$folder_list_obj = $this->Share_folder_model->get_shared_users_folders($id_user);

			$this->data["count_folder"] = $folder_list_obj->num_rows();
			$this->data["pagination"] = $this->Folder_model->pagination($this->data["count_folder"]);

			if ($folder_list_obj->num_rows() > 0) {
				$folder_list = $this->Share_folder_model->limit($this->data["userdata"]->document_per_page)->offset($start)->get_shared_users_folders($id_user)->result();
				$this->data["folders"] = $folder_list;
			}
			$folder_view_js = array(
				"js/account.js",
				"js/document_manager.js",
				"js/folder_view.js",
			);
			$this->main_js = array_push_values($this->main_js,$folder_view_js);
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Folder : ",
			);
			$this->Folder_model->render_page("users_shared",$this->data,$_template);
		} else {
			$this->session->set_flashdata("message","ID User must be set");
			redirect("en_us/","refresh");
		}
	}

	public function delete($id_folder = NULL)
	{
		if (isset($id_folder) && !empty($id_folder)) {
			$folder_details = $this->Folder_model->get_folder_details($id_folder);
			if ($folder_details->num_rows() > 0) {
				$folder = $folder_details->row();
				$id = $folder->id;
				$name = $folder->name;
				if ($this->data["userdata"]->home_folder !== $id) {
					$delete_folder = $this->Folder_model->delete_folder($id_folder);
					if ($delete_folder !== FALSE) {
						$this->session->set_flashdata("message","Folder " . $name . " has been deleted");
					} else {
						$this->session->set_flashdata("message","Folder " . $name . " failed to deleted");
					}
					redirect("en_us","refresh");
				} else {
					$this->session->set_flashdata("message","You cannot delete home folder before you unset it.");
					redirect("en_us","refresh");
				}
			} else {
				$this->session->set_flashdata("message","ID Folder not found");
				redirect("en_us","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID Folder must not empty");
			redirect("en_us","refresh");
		}
	}
}