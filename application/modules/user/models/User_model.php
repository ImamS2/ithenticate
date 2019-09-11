<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class User_model extends MY_Model
{
	protected $table = "users";
	protected $pk = "id";
	protected $photo;
	protected $list;
	protected $upload_path_file;
	protected $add_reduce;

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
			$this->add_reduce = FALSE;

		} else {

			array_push($groups, $id_group_members);
			$this->add_reduce = TRUE;
		}

		$user_data = array(
			"id" => $user_id,
			"first_name" => $first_name,
			"last_name" => $last_name,
			"expired_at" => $expireduser,
			"quota" => $quota,
			"phone" => ((empty($phone) || $phone == "") ? NULL : $phone),
		);

		$this->photo = TRUE;
		$newIdUser = $this->ion_auth->register($email,$password,$email,$user_data,$groups);
		if ($newIdUser) {
			$this->create_user_trash($newIdUser);
		} else {
			return false;
		}
	}

	public function user_import_list($data)
	{
		$this->add_reduce = TRUE;
		$filename = "import_name_".$data["userdata"]->id;
		$upload_path = "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR;
		$this->upload_path_file = $upload_path;
		$lib_excel_reader = APPPATH."modules" . DIRECTORY_SEPARATOR . "user" . DIRECTORY_SEPARATOR . "third_party" . DIRECTORY_SEPARATOR . "PHPExcel" . DIRECTORY_SEPARATOR . "PHPExcel.php";
		$sheet = excel_reader($lib_excel_reader, $upload_path, $filename);
		$header_row = $sheet[1];
		$count_cols = count($header_row);
		$jumlah_data = count($sheet) - 1;
		$header_text = array();
		$this->list = TRUE;

		foreach ($header_row as $header) {
			$get_require = explode("*", $header);
			array_push($header_text, $get_require[0]);
		}

		if ($jumlah_data > 0) {
			$usage_quota = $data["userdata"]->usage_quota;
			for ($i=2; $i <= $jumlah_data + 1 ; $i++) { 
				$row_user_data = $sheet[$i];
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
				$newIdUser = $this->ion_auth->register($email,$password,$email,$user_data,$groups);
				if ($newIdUser) {
					$this->create_user_trash($newIdUser);
				} else {
					return false;
				}
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

	public function set_home_folder($id_folder, $id_user = NULL, $photo = NULL, $list = NULL)
	{
		$photo = isset($photo) ? $photo : $this->photo;
		$this->load->model("Group_model");
		$id_user = isset($id_user) ? $id_user : $this->session->userdata("user_id");
		if (isset($id_folder) && !empty($id_folder)) {
			$user_data = array();
			if ($photo != FALSE) {
				$upload_photo = $this->upload_image("photo","assets/images/users/");
				if ($upload_photo) {
					$user_data["profile_pic"] = $upload_photo;
				}
			}
			$user_data["home_folder"] = $id_folder;
			$set_home_folder = $this->ion_auth->update($id_user, $user_data);
			if ($list != FALSE) {
				$get_univ = $this->Group_model->get_user_campus($id_user)->row();
				$id_kampus = $get_univ->id;

				$get_admin_kampus = $this->Group_model->get_admin_kampus($id_kampus)[0];
				if (count($get_admin_kampus) > 0) {
					unlink($this->upload_path_file . "import_name_" . $get_admin_kampus["id"] . ".xlsx");
				}
			}
			if ($set_home_folder) {
				pre("ter set");
			} else {
				$this->session->set_flashdata("message","Failed to set home folder");
				redirect("en_us/user","refresh");
			}
		} else {
			$this->session->set_flashdata("message","ID Folder cannot empty");
			redirect("en_us/user","refresh");
		}
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
						// pre("ini admin kampus");
						if ($this->ion_auth->users($id_univ)->num_rows() > 1) {
							$this->session->set_flashdata("message","Delete the members first");
							redirect("en_us/user","refresh");
						}
					} else {
						$this->session->set_flashdata("message","You cannot delete this user.");
						redirect("en_us/user","refresh");
					}
				} else {
					// pre("ini member kampus");
					// pre($limit_left_user_object);
					if ($limit_left_user_object > 0) {
						// pre($get_admin_kampus);
						$new_usage_admin = $usage_admin - $limit_left_user_object;
						// pre($new_usage_admin);
						$quota_admin = array("usage_quota" => $new_usage_admin);
						$update_quota_admin = $this->ion_auth->update($get_admin_kampus["id"],$quota_admin);
					}
				}

				$group_folders = $this->Group_folder_model->get_group_folders(0,$id,TRUE,"user");
				// pre($group_folders);
				$count_group_folders = $group_folders->num_rows();
				if ($count_group_folders > 0) {
					$folders = $group_folders->result();
					foreach ($folders as $folder) {
						$id_folder = $folder->id;
						$name_folder = $folder->name;
						$edit_folder = $this->Group_folder_model->edit_group_folder($id_folder, $name_folder, 0);
					}
				}
				// exit();

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