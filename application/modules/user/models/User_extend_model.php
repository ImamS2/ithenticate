<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class User_extend_model extends MY_Model
{
	protected $pre_user_data = array();
	protected $email_to;
	protected $email_subject;
	protected $email_msg;
	function __construct()
	{
		parent::__construct();
	}

	public function add_rules()
	{
		$this->form_validation->set_rules("user_id","User ID","is_natural|is_unique[users.id]");
		$this->form_validation->set_rules("first_name","First Name","required|max_length[500]|trim");
		$this->form_validation->set_rules("last_name","Last Name","required|max_length[500]|trim");
		$this->form_validation->set_rules("email","Email","required|valid_email|max_length[128]|trim|is_unique[users.email]");
		$this->form_validation->set_rules("expireduser","Expired User","required|is_natural_no_zero");
		$this->form_validation->set_rules("quota","Quota","required|numeric");
		$this->form_validation->set_rules("group_campus","Reporting Group","required");
	}

	public function edit_restriction($id, $user = NULL)
	{
		$user = isset($user) ? $user : $this->ion_auth->user($id);
		$this->load->model("Group_model");
		if ($user->num_rows() < 1) {
			$this->session->set_flashdata("message","ID User Not Found");
			redirect("en_us/user","refresh");
		}
		if ( ! $this->ion_auth->in_group("cho admin")) {
			$universitas_user = $this->Group_model->get_user_campus()->row();
			if ($this->ion_auth->in_group("cho admim",$id)) {
				$this->session->set_flashdata("message","You are not allowed to edit this user");
				redirect("en_us/user","refresh");
			}
			if (!$this->ion_auth->in_group($universitas_user->id,$id)) {
				$this->session->set_flashdata("message","You are not allowed to edit this user");
				redirect("en_us/user","refresh");
			}
		}
	}

	public function edit_rules()
	{
		$this->form_validation->set_rules("first_name","First Name","required|max_length[500]|trim");
		$this->form_validation->set_rules("last_name","Last Name","required|max_length[500]|trim");
		$this->form_validation->set_rules("email","Email","required|valid_email|max_length[128]|trim");

		if ($this->input->post("password"))
		{
			$this->form_validation->set_rules("password","Password","required|matches[password_chk]|min_length[" . $this->config->item("min_password_length", "ion_auth") . "]");
			$this->form_validation->set_rules("password_chk","Password Confirm","required");
		}
	}

	public function add_single_user()
	{
		$pre_user_data = array();
		$groups = array();

		$user_id = $this->security->xss_clean($this->input->post("user_id"));
		$email = $this->security->xss_clean($this->input->post("email"));
		$first_name = $this->security->xss_clean($this->input->post("first_name"));
		$last_name = $this->security->xss_clean($this->input->post("last_name"));
		$qty_expired = $this->security->xss_clean($this->input->post("expireduser"));
		$quota = $this->security->xss_clean($this->input->post("quota"));
		$set_administrator = $this->security->xss_clean($this->input->post("set_administrator"));
		$group_campus = $this->security->xss_clean($this->input->post("group_campus"));
		$phone = $this->security->xss_clean($this->input->post("phone"));
		$password_length = $this->config->item("min_password_length", "ion_auth");
		$password = generateRandomString($password_length);

		$expireduser = strtotime(date("Y-m-d",strtotime("+ ".$qty_expired." month")));

		array_push($groups, $group_campus);

		$id_group_members = $this->ion_auth->where(["name" => $this->config->item("default_group", "ion_auth")])->groups()->row()->id;
		$id_group_admin = $this->ion_auth->where(["name" => $this->config->item("admin_group", "ion_auth")])->groups()->row()->id;

		if ($set_administrator == 1) {
			array_push($groups, $id_group_admin);
			$bool_reduce = FALSE;
		} else {
			array_push($groups, $id_group_members);
			$bool_reduce = TRUE;
		}

		$user_data = array(
			"id" => $user_id,
			"first_name" => $first_name,
			"last_name" => $last_name,
			"expired_at" => $expireduser,
			"quota" => $quota,
			"phone" => ((empty($phone) || $phone == "") ? NULL : $phone),
			"email" => $email,
			"password" => $password,
		);

		$field_upload = "photo";
		$upload_path = "assets" . DIRECTORY_SEPARATOR . "images" . DIRECTORY_SEPARATOR . "users";
		$upload_user_photo = $this->upload_image($field_upload,$upload_path);
		if ($upload_user_photo === FALSE) {
			$user_data["profile_pic"] = "no_photo_large.png";
		} else {
			$user_data["profile_pic"] = $upload_user_photo;
		}

		$pre_user_data = $user_data;
		$pre_user_data["groups"] = $groups;

		$this->load->model("quota/Quota_model");
		array_push($this->pre_user_data, $pre_user_data);
		// array_push($this->pre_user_data, $pre_user_data);
		$cek_user = $this->Quota_model->add_check_user($this->pre_user_data,$bool_reduce);
		if ($cek_user === TRUE) {
			$this->add_user_process($this->pre_user_data);
		}
	}

	public function add_list_users($sheet)
	{
		$header_row = $sheet[1];
		$count_cols = count($header_row);
		$jumlah_data = count($sheet) - 1;
		$header_text = array();

		foreach ($header_row as $header) {
			$get_require = explode("*", $header);
			array_push($header_text, $get_require[0]);
		}

		if ($jumlah_data > 0) {
			for ($i=2; $i <= $jumlah_data + 1 ; $i++) { 
				$row_user_data = $sheet[$i];
				$pre_user_data = array();
				$user_data = array();
				$groups = array();
				foreach ($row_user_data as $key => $value) {
					$index = alphabet_to_number($key) - 1;
					$key_user = underscore($header_text[$index]);
					switch ($key_user) {
						case "expired":
							$time_expired_user = 0;
							if (!empty($value)) {
								$time_expired_user = strtotime("+ ".$value." month");
							}
							$user_data["expired_at"] = $time_expired_user;
							break;

						case "user_id":
							$cek_user = $this->ion_auth->user($value)->num_rows();
							if ($cek_user > 0) {
								$user_data["id"] = NULL;
							} else {
								$user_data["id"] = $value;
							}
							break;

						default:
							$user_data[$key_user] = $value;
							break;
					}
				}
				$id_group_members = $this->ion_auth->where(["name" => $this->config->item("default_group", "ion_auth")])->groups()->row()->id;
				array_push($groups, $id_group_members);

				$get_univ = $this->Group_model->get_user_campus()->row();
				if (isset($get_univ) && !empty($get_univ) && (is_array($get_univ) || is_object($get_univ))) {
					$id_univ = $get_univ->id;
					array_push($groups, $id_univ);
				}
				$email = $user_data["email"];
				$password_length = $this->config->item("min_password_length", "ion_auth");
				$password = generateRandomString($password_length);
				$user_data["password"] = $password;
				$pre_user_data = $user_data;
				$pre_user_data["groups"] = $groups;
				array_push($this->pre_user_data, $pre_user_data);
			}
			pre($this->pre_user_data);
			$this->load->model("quota/Quota_model");
			$this->Quota_model->add_check_user($this->pre_user_data);
		} else {
			return false;
		}
	}

	public function add_user_process($userdata)
	{
		$userdata = isset($userdata) ? $userdata : $this->pre_user_data;
		if (isset($userdata) && !empty($userdata)) {
			pre("lakukan registrasi");
			foreach ($userdata as $pre_add_user) {
				if (array_key_exists("email", $pre_add_user)) {
					$email = $pre_add_user["email"];
					pre($email);
					unset($pre_add_user["email"]);
				}
				if (array_key_exists("password", $pre_add_user)) {
					$password = $pre_add_user["password"];
					pre($password);
					unset($pre_add_user["password"]);
				}
				if (array_key_exists("groups", $pre_add_user)) {
					$groups = $pre_add_user["groups"];
					pre($groups);
					unset($pre_add_user["groups"]);
				}
				pre($pre_add_user);
				// $reg_data = $this->ion_auth->register($email,$password,$email,$pre_user_data,$groups);
				// pre($regis_data);
				// if (!empty($reg_data)) {
				// 	$this->email_to = $email;
				// 	$new_IdUser = $reg_data["id"];
				// 	$new_userdata = $this->ion_auth->user($new_IdUser)->row_array();
				// 	$reg_data["userdata"] = $new_userdata;
				// 	$this->email_subject = "Welcome to " . APPNAME;
				// 	$this->email_msg = $this->load->view("activate", $reg_data, TRUE);
				// 	pre($this->email_msg);
				// 	$this->create_user_trash($new_IdUser);
				// }
			}
		} else {
			return false;
		}
	}

	public function create_user_trash($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$this->load->model("group/Group_folder_model");
		$user_trash = $this->Group_folder_model->get_data_trash($id_user);
		$count_user_trash = $user_trash->num_rows();
		if ($count_user_trash < 1) {
			$make_trash = $this->Group_folder_model->add_group_folder("Trash",$id_user);
			if ($make_trash) {
				$this->create_group_home_folder($id_user);
			} else {
				$this->session->set_flashdata("message","Failed to make Trash");
				redirect("en_us/user","refresh");
			}
		} else {
			$this->session->set_flashdata("message","You already have a trash folder");
			redirect("en_us/user","refresh");
		}
	}

	public function create_group_home_folder($id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$this->load->model("group/Group_folder_model");
		$group_folders = $this->Group_folder_model->get_group_folders(0,$id_user);
		$count_group_folders = $group_folders->num_rows();
		if ($count_group_folders < 1) {
			$make_my_doc = $this->Group_folder_model->add_group_folder("My Documents",$id_user);
			if ($make_my_doc) {
				$this->create_home_folder($make_my_doc, $id_user);
			} else {
				$this->session->set_flashdata("message","Failed to make Group Folder");
				redirect("en_us/user","refresh");
			}
		} else {
			$this->session->set_flashdata("message","You already have a Group Folder");
			redirect("en_us/user","refresh");
		}
	}

	public function create_home_folder($id_document, $id_user = NULL)
	{
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		$this->load->model("group/Group_folder_model");
		$this->load->model("folder/Folder_model");
		if (isset($id_document) && !empty($id_document)) {
			$folders = $this->Group_folder_model->get_group_folders($id_document,$id_user);
			$count_folders = $folders->num_rows();
			if ($count_folders < 1) {
				$make_my_folder = $this->Folder_model->add_folder("My Folders",$id_document,$id_user);
				if ($make_my_folder) {
					$this->set_home_folder($make_my_folder,$id_user);
				} else {
					$this->session->set_flashdata("message","Failed to make My Folder");
					redirect("en_us/user","refresh");
				}
			} else {
				$this->session->set_flashdata("message","You already have a My Documents");
				redirect("en_us/user","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID Group Folder cannot empty");
			redirect("en_us/user","refresh");
		}
	}

	public function set_home_folder($id_folder, $id_user = NULL)
	{
		$this->load->model("Group_model");
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		if (isset($id_folder) && !empty($id_folder)) {
			$user_data = array();
			$user_data["home_folder"] = $id_folder;
			$set_home_folder = $this->ion_auth->update($id_user, $user_data);
			if ($set_home_folder) {
				email_ithen($this->email_to, $this->email_subject, $this->email_msg);
			} else {
				$this->session->set_flashdata("message","Failed to set home folder");
				redirect("en_us/user","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID Folder cannot empty");
			redirect("en_us/user","refresh");
		}
	}
}