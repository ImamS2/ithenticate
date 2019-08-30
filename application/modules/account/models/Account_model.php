<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class Account_model extends MY_Model
{
	function __construct()
	{
		parent::__construct();
	}

	public function _account_rules()
	{
		$this->form_validation->set_rules("form_first_name","First Name","required|max_length[500]|trim");
		$this->form_validation->set_rules("form_last_name","Last Name","required|max_length[500]|trim");
		$this->form_validation->set_rules("form_email","Email","required|valid_email|max_length[128]|trim");
		$this->form_validation->set_rules("form_password", "Password", "max_length[32]");
		$this->form_validation->set_rules("form_password_chk", "Password Check", "max_length[32]|matches[form_password]");
	}

	public function upload_photo($field_upload, $path_upload, $user_id = NULL)
	{
		$user_id = isset($user_id) ? $user_id : $this->session->userdata("user_id");
		$config["upload_path"] = $path_upload;
		$config["allowed_types"] = "gif|jpg|png|jpeg|bmp";
		$config["encrypt_name"] = TRUE;

		$this->load->library("upload", $config);

		if(!empty($_FILES[$field_upload]["name"]))
		{
			if ($this->upload->do_upload($field_upload))
			{
				$gbr = $this->upload->data();
				$config["image_library"] = "gd2";
				$profile_pic = $gbr["raw_name"].$gbr["file_ext"];
				$foto_path = $path_upload.$profile_pic;
				$config["source_image"] = $foto_path;
				$config["create_thumb"] = FALSE;
				$config["maintain_ratio"] = FALSE;
				$config["width"] = 107;
				$config["height"] = 99;
				$config["new_image"]= $foto_path;
				$this->load->library("image_lib", $config);
				$this->image_lib->resize();
				return $profile_pic;
			}
		}
		return false;
	}

	public function account_update()
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$email = $this->security->xss_clean($this->input->post("form_email"));
		$first_name = $this->security->xss_clean($this->input->post("form_first_name"));
		$last_name = $this->security->xss_clean($this->input->post("form_last_name"));
		$password = ( empty($this->input->post("form_password")) && $this->input->post("form_password") == "" ? $this->input->post("form_old_password") : $this->input->post("form_password") );

		$path_upload = "assets/images/users/";
		$field_upload = "form_photo";
		$upload_photo = $this->upload_image($field_upload, $path_upload);

		$user_data = array(
			"first_name" => $first_name,
			"last_name" => $last_name,
			"email" => $email,
			"password" => $password,
		);

		if ($upload_photo !== FALSE) {
			$profile_pic = array("profile_pic"=>$upload_photo);
			foreach ($profile_pic as $key => $value) {
				$user_data[$key] = $value;
			}
		}

		$update = $this->ion_auth_model->update($id,$user_data);
		$this->session->set_flashdata("message",$this->ion_auth->messages());
		return true;
	}
}