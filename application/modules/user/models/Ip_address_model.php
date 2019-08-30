<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Ip_address_model extends MY_Model
{
	protected $table = "ip_address";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}

	public function check_ip_address($id_group = NULL, $ip_address = NULL)
	{
		if (empty($ip_address)) {
			$ip_address = $this->input->ip_address();
		}
		if( ! $this->ion_auth->in_group("cho admin") ) {
			$this->load->model("Group_model");
			$universitas = $this->Group_model->get_user_campus()->row();
			$id_group = $universitas->id;
			$this->where(array($this->table.".id_group" => $id_group));
			$this->get();
			if ($this->num_rows() > 0) {
				foreach ($this->result() as $whitelist) {
					$start_ip = $whitelist->start_ip;
					$end_ip = $whitelist->end_ip;
					if (empty($end_ip) || $end_ip == NULL || $end_ip == "" ) {
						if ($start_ip == $ip_address) {
							return true;
						}
					} else {
						$ip_ranged = ip_range($start_ip,$end_ip);
						if (in_array($ip_address, $ip_ranged))
						{
							return true;
						}
					}
				}
			} else {
				return true;
			}
			return false;
		}
	}

	public function get_ip_address_lists()
	{
		$this->get($this->table);
		return $this;
	}

	public function get_ip_address($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$this->where(array($this->pk => $id));
			$this->get($this->table);
		}
		return $this;
	}

	public function ip_whitelist_form_rules()
	{
		$this->form_validation->set_rules("group_campus","Group Name","required");
		$this->form_validation->set_rules("start_ip","Start IP Address","required|valid_ip");
		$this->form_validation->set_rules("end_ip","End IP Address","valid_ip");
	}

	public function ip_whitelist_form_value()
	{
		$group_campus = $this->security->xss_clean($this->input->post("group_campus"));
		$start_ip = $this->security->xss_clean($this->input->post("start_ip"));
		$end_ip_temp = $this->security->xss_clean($this->input->post("end_ip"));
		$end_ip = ((empty($end_ip_temp) || $end_ip_temp == "") ? NULL : $end_ip_temp );

		$params = array(
			"id_group" => $group_campus,
			"start_ip" => $start_ip,
			"end_ip" => $end_ip,
		);
		return $params;
	}

	public function add_ip_whitelist()
	{
		$params = $this->ip_whitelist_form_value();
		if ($this->insert($params)) {
			return $this->db->insert_id();
		} else {
			return false;
		}
	}

	public function edit_ip_whitelist($id = NULL)
	{
		$update_ip = $this->ip_whitelist_form_value();
		if (isset($id) && !empty($id)) {
			if (isset($update_ip) && !empty($update_ip)) {
				$this->where(array($this->pk=>$id));
				$edit_ip_whitelist = $this->update($update_ip);
			} else {
				$edit_ip_whitelist = false;
			}
			return $edit_ip_whitelist;
		} else {
			return false;
		}
	}

	public function delete_ip_whitelist($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			return $this->delete($this->pk,$id);
		}
		return false;
	}
}