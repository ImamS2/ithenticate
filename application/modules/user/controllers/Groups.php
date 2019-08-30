<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Groups_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_2colh");
	}
}

/**
* 
*/
class Groups extends Groups_Controller
{
	function __construct()
	{
		Modules::load("auth");
		if ($this->ion_auth->in_group("cho admin")) {
			parent::__construct();
			$this->load->model(array("Group_model"));
			$this->template->set("message",$this->session->flashdata("message"));
			$additional_js = array(
				'js/account.js',
			);
			$this->main_js = array_push_values($this->main_js,$additional_js);
		} else {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us/user","refresh");
		}
	}

	public function index()
	{
		$groups = $this->Group_model->get_campus_lists();
		$this->data["count_groups"] = $groups->num_rows();
		$this->data["groups"] = $groups->result_array();
		$main_css = $this->main_css;
		$main_js = $this->main_js;
		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Group Management",
		);
		$this->Group_model->render_page("group",$this->data,$_template);
	}

	public function add()
	{
		$this->form_validation->set_rules("newgroup","Initial Group","required|max_length[20]|trim");
		$this->form_validation->set_rules("namegroup","Nama Group","required|max_length[500]|trim");

		if ($this->form_validation->run() === TRUE) {

			$namegroup = $this->security->xss_clean($this->input->post("namegroup"));
			$group_create = $this->Group_model->add_campus();

			if ($group_create) {
				$this->session->set_flashdata("message","Campus ". $namegroup . " successfully created");
			} else {
				$this->session->set_flashdata("message","Campus ". $namegroup . " failed created");
			}

			redirect("en_us/user/groups","refresh");

		} else {
			$this->index();
		}
	}

	public function edit($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$this->data["id"] = $id;
			$group = $this->ion_auth->group($id);
			if (isset($group->row()->id)) {
				$this->data["group"] = $group->row();
				$this->form_validation->set_rules('namegroup','Name Group','required|max_length[500]|trim');

				if ($this->form_validation->run() === TRUE) {

					$o_name = $group->row()->name;
					$namegroup = $this->security->xss_clean($this->input->post('namegroup'));

					$group_edit = $this->Group_model->edit_campus($id);

					if ($group_edit) {
						$this->session->set_flashdata("message","Campus ". $o_name . " successfully updated to " . $namegroup);
					} else {
						$this->session->set_flashdata("message","Campus ". $o_name . " failed updated");
					}

					redirect("en_us/user/groups","refresh");

				} else {
					$main_css = $this->main_css;
					$main_js = $this->main_js;
					$_template = array(
						"main_css" => $main_css,
						"main_js" => $main_js,
						"title" => "Update Group",
					);
					$this->Group_model->render_page("group_edit",$this->data,$_template);
				}
			} else {
				$this->session->set_flashdata("message","ID Group Not Found");
				redirect("en_us/user/groups","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID must be set");
			redirect("en_us/user/groups","refresh");
		}
	}

	public function delete($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$users = $this->ion_auth->users($id);
			$group = $this->ion_auth->group($id);
			if ($users->num_rows() < 1) {
				$group_delete = $this->ion_auth->delete_group($id);
				if ($group_delete) {
					$this->session->set_flashdata("message","Group " . $group->row()->name . " successfully deleted");
					redirect("en_us/user/groups","refresh");
				}
			} else {
				$this->session->set_flashdata("message","Group must haven't user anymore");
				redirect("en_us/user/groups","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID must be set");
			redirect("en_us/user/groups","refresh");
		}
	}
}