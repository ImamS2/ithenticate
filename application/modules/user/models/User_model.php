<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class User_model extends MY_Model
{
	protected $table = "users";
	protected $pk = "id";
	protected $upload_path_file;

	function __construct()
	{
		parent::__construct();
		$this->load->model("User_extend_model");
	}

	public function add_user()
	{
		$groups = [];

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
		} else {
			array_push($groups, $id_group_members);
		}

		// upload foto

		$user_data = array(
			"id" => $user_id,
			"first_name" => $first_name,
			"last_name" => $last_name,
			"expired_at" => $expireduser,
			"quota" => $quota,
			"phone" => ((empty($phone) || $phone == "") ? NULL : $phone),
		);

		// $newIdUser = $this->ion_auth->register($email,$password,$email,$user_data,$groups);
		// if ($newIdUser) {
		// 	$this->User_extend_model->create_user_trash($newIdUser);
		// } else {
		// 	return false;
		// }
	}

	public function user_import_list($data)
	{
		$filename = "import_name_".$data["userdata"]->id;
		$upload_path = "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR;
		$this->upload_path_file = $upload_path;
		$lib_excel_reader = APPPATH."modules" . DIRECTORY_SEPARATOR . "user" . DIRECTORY_SEPARATOR . "third_party" . DIRECTORY_SEPARATOR . "PHPExcel" . DIRECTORY_SEPARATOR . "PHPExcel.php";
		$sheet = excel_reader($lib_excel_reader, $upload_path, $filename);
		$this->User_extend_model->add_list_users($sheet);
	}

	public function edit_user($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$email = $this->security->xss_clean($this->input->post("email"));
			$first_name = $this->security->xss_clean($this->input->post("first_name"));
			$last_name = $this->security->xss_clean($this->input->post("last_name"));
			$expireduser = $this->security->xss_clean($this->input->post("expireduser"));
			$quota = $this->security->xss_clean($this->input->post("quota"));
			$phone = $this->security->xss_clean($this->input->post("phone"));

			$user_edit = $this->ion_auth->user($id)->row();

			$user_data = array(
				"first_name" => $first_name,
				"last_name" => $last_name,
				"email" => $email,
				"phone" => ((empty($phone) || $phone == "") ? NULL : $phone),
			);

			if ($this->ion_auth->user()->row() == $user_edit) {
				$expireduser = $user_edit->expired_at;
				$user_data["expired_at"] = $expireduser;
			} else {
				$user_data["expired_at"] = strtotime($expireduser);
			}

			if ($this->input->post("password")) {
				$password = $this->security->xss_clean($this->input->post("password"));
				$user_data["password"] = $password;
			}

			if (!$this->ion_auth->in_group("cho admin",$id)) {

				if ($quota !== $user_edit->quota) {
					if ($this->ion_auth->user()->row() != $user_edit) {
						$selisih = $quota - $user_edit->quota;
					} else {
						$selisih = $user_edit->quota;
						$quota = $user_edit->quota;
						$expireduser = $user_edit->expired_at;
					}
					$get_univ = $this->Group_model->get_user_campus($id)->row();
					$id_univ = $get_univ->id;
					$get_admin_kampus = $this->Group_model->get_admin_kampus($id_univ)[0];
					$usage_admin = $get_admin_kampus["usage_quota"];
					$base_quota_admin = $get_admin_kampus["quota"];
					$user_usage_quota = $user_edit->usage_quota;
					if ($user_edit->id === $get_admin_kampus["id"]) {
						if ($selisih >= 1) {
							$user_data["quota"] = $quota;
						} elseif ($selisih < 0) {
							if ($usage_admin <= $quota) {
								$user_data["quota"] = $quota;
							} else {
								$this->session->set_flashdata("message","Quota cannot be reduced");
								redirect("en_us/user","refresh");
							}
						}
					} else {
						$new_usage_quota = $usage_admin + $selisih;
						if ($selisih >= 1) {
							if ($new_usage_quota <= $base_quota_admin) {
								$user_data["quota"] = $quota;
								$this->ion_auth->update($get_admin_kampus["id"],array("usage_quota"=>$new_usage_quota));
							} else {
								$this->session->set_flashdata("message","Quota cannot be added");
								redirect("en_us/user","refresh");
							}
						} elseif ($selisih < 0) {
							if ($user_usage_quota <= $quota) {
								$user_data["quota"] = $quota;
								$this->ion_auth->update($get_admin_kampus["id"],array("usage_quota"=>$new_usage_quota));
							} else {
								$this->session->set_flashdata("message","Quota cannot be reduced");
								redirect("en_us/user","refresh");
							}
						}
					}
				}

				if((strtotime(date("Y-m-d H:i:s")) > strtotime($expireduser)) && (strtotime(date("Y-m-d H:i:s")) >= $expireduser)) {
					$user_data["active"] = 0;
				} else {
					$user_data["active"] = 1;
				}
			}

			$upload_photo = $this->upload_image("photo","assets" . DIRECTORY_SEPARATOR . "images" . DIRECTORY_SEPARATOR . "users" . DIRECTORY_SEPARATOR);
			if ($upload_photo) {
				$user_data["profile_pic"] = $upload_photo;
			}

			if (isset($user_data) && !empty($user_data)) {
				$update_user = $this->ion_auth->update($id,$user_data);
				if ($update_user) {
					return true;
				}
			}
		}
		return false;
	}

	public function delete_user($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			if (! $this->ion_auth->in_group("cho admin",$id)) {
				$user = $this->ion_auth->user($id);
				$user_object = $user->row();

				$user_usage_quota = $user_object->usage_quota;
				$user_base_quota = $user_object->quota;
				$limit_left_user_object = $user_base_quota - $user_usage_quota;

				$get_univ = $this->Group_model->get_user_campus($id)->row();
				$id_univ = $get_univ->id;
				$get_admin_kampus = $this->Group_model->get_admin_kampus($id_univ)[0];

				$base_quota_admin = $get_admin_kampus["quota"];
				$usage_admin = $get_admin_kampus["usage_quota"];

				if ($id === $get_admin_kampus["id"]) {
					if ($this->ion_auth->in_group("cho admin")) {
						if ($this->ion_auth->users($id_univ)->num_rows() > 1) {
							$this->session->set_flashdata("message","Delete the members first");
							redirect("en_us/user","refresh");
						}
					} else {
						$this->session->set_flashdata("message","You cannot delete this user.");
						redirect("en_us/user","refresh");
					}
				} else {
					if ($limit_left_user_object > 0) {
						$new_usage_admin = $usage_admin - $limit_left_user_object;
						$quota_admin = array("usage_quota" => $new_usage_admin);
						$update_quota_admin = $this->ion_auth->update($get_admin_kampus["id"],$quota_admin);
					}
				}

				$group_folders = $this->Group_folder_model->get_group_folders(0,$id,TRUE,"user");
				$count_group_folders = $group_folders->num_rows();
				if ($count_group_folders > 0) {
					$folders = $group_folders->result();
					foreach ($folders as $folder) {
						$id_folder = $folder->id;
						$name_folder = $folder->name;
						$edit_folder = $this->Group_folder_model->edit_group_folder($id_folder, $name_folder, 0);
					}
				}

				if($this->ion_auth->delete_user($id)) {
					return true;
				}
			} else {
				$this->session->set_flashdata("message","You cannot delete this user.");
				redirect("en_us/user","refresh");
			}
		}
		return false;
	}

	public function banned_user($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			if (! $this->ion_auth->in_group("cho admin",$id)) {
				$data = array("active" => FALSE);
				if ($this->ion_auth->update($id,$data)) {
					return true;
				}
			} else {
				$this->session->set_flashdata("message","You cannot banned this user.");
				redirect("en_us/user","refresh");
			}
		}
		return false;
	}

	public function activated_user($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			if (! $this->ion_auth->in_group("cho admin",$id)) {
				$data = array("active" => TRUE );
				if ($this->ion_auth->update($id,$data)) {
					return true;
				}
			} else {
				$this->session->set_flashdata("message","You cannot activated this user.");
				redirect("en_us/user","refresh");
			}
		}
		return false;
	}

	public function upload_users($field_upload, $upload_path, $filename)
	{
		if (isset($field_upload) && isset($upload_path) && isset($filename) && !empty($field_upload) && !empty($upload_path) && !empty($filename)) {

			$allowed_types = isset($allowed_types) ? $allowed_types : "xlsx";
			$max_size = "10000";
			$upload_users = $this->upload($field_upload, $upload_path, $allowed_types, FALSE, $max_size, $filename, TRUE);
			return $upload_users;
		}
		return FALSE;
	}
}