<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Ip_whitelist_controller extends Admin_Controller
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
class Ip_whitelist extends Ip_whitelist_controller
{
	function __construct()
	{
		Modules::load("Auth");
		if ($this->ion_auth->in_group("cho admin")) {
			parent::__construct();
			$this->load->model(array("Group_model","Ip_address_model"));
			$this->template->set("message",$this->session->flashdata("message"));
			$additional_js = array(
				'js/ipv4_input.min.js',
				'js/account.js',
			);
			$this->main_js = array_push_values($this->main_js,$additional_js);
			$additional_css = array(
				'css/ipv4_input.css',
			);
			$this->main_css = array_push_values($this->main_css,$additional_css);
		} else {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us/user","refresh");
		}
	}

	public function index()
	{
		$groups = $this->Group_model->get_campus_lists();
		if ($groups->num_rows() > 0) {
			$this->data["groups"] = $groups->result();
		}
		$ip_whitelist = $this->Ip_address_model->get_ip_address_lists();
		$count_ip = $ip_whitelist->num_rows();
		if ($count_ip > 0) {
			$this->data["count_ip"] = $count_ip;
			$this->data["ip_whitelists"] = $ip_whitelist->result();
		}

		$additional_js = array(
			'js/ipv4_init.js',
		);
		$this->main_js = array_push_values($this->main_js,$additional_js);

		$main_css = $this->main_css;
		$main_js = $this->main_js;
		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "IP Whitelist Management",
		);
		$this->Ip_address_model->render_page("ip_whitelist",$this->data,$_template);
	}

	public function add()
	{
		$this->Ip_address_model->ip_whitelist_form_rules();

		if ($this->form_validation->run() === TRUE) {

			$add_process = $this->Ip_address_model->add_ip_whitelist();
			if ($add_process !== FALSE) {
				$this->session->set_flashdata("message","IP Whitelist successfully added");
			} else {
				$this->session->set_flashdata("message","IP Whitelist failed added");
			}
			redirect("en_us/user/ip_whitelist","refresh");

		} else {
			$this->index();
		}
	}

	public function edit($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$ip_whitelist = $this->Ip_address_model->get_ip_address($id);
			// pre($ip_whitelist);
			if ($ip_whitelist->num_rows() > 0) {
				$this->data["ip_whitelist"] = $ip_whitelist->row_array();
				$groups = $this->Group_model->get_campus_lists();
				if ($groups->num_rows() > 0) {
					$this->data["groups"] = $groups->result();
				}

				$this->Ip_address_model->ip_whitelist_form_rules();

				if ($this->form_validation->run() === TRUE) {

					$edit_process = $this->Ip_address_model->edit_ip_whitelist($id);
					if ($edit_process !== FALSE) {
						$this->session->set_flashdata("message","IP Whitelist successfully updated");
					} else {
						$this->session->set_flashdata("message","IP Whitelist failed updated");
					}
					redirect("en_us/user/ip_whitelist","refresh");

				} else {
					$this->data["id"] = $id;

					$additional_js = array(
						'js/ipv4_edit.js',
					);
					$this->main_js = array_push_values($this->main_js,$additional_js);

					$main_css = $this->main_css;
					$main_js = $this->main_js;

					$_template = array(
						"main_js" => $main_js,
						"main_css" => $main_css,
						"title" => "Update IP Whitelist",
					);

					$this->Ip_address_model->render_page("ip_whitelist_edit",$this->data,$_template);
				}
			} else {
				$this->session->set_flashdata("message","Data IP Whitelist not found");
				redirect("en_us/user/ip_whitelist","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID IP Whitelist must be set");
			redirect("en_us/user/ip_whitelist","refresh");
		}
	}

	public function delete($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$ip_whitelist = $this->Ip_address_model->get_ip_address($id);
			if ($ip_whitelist->num_rows() > 0) {
				$delete_process = $this->Ip_address_model->delete_ip_whitelist($id);
				if ($delete_process !== FALSE) {
					$this->session->set_flashdata("message","IP Whitelist successfully deleted");
				} else {
					$this->session->set_flashdata("message","IP Whitelist failed deleted");
				}
				redirect("en_us/user/ip_whitelist","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID IP Whitelist must be set");
			redirect("en_us/user/ip_whitelist","refresh");
		}
	}
}