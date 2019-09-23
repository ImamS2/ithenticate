<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class User_Controller extends Admin_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "admin");
		$this->template->set("body_class","template layout_3_2colh");
		// pre($this->data["userdata"]);
		// cek_password_default($this->data["userdata"]);
	}
}

/**
* 
*/
class User extends User_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->load->model("User_model");
		$this->load->model("User_extend_model");
		$this->load->model("Group_model");
		$this->template->set("message",$this->session->flashdata("message"));
		$additional_js = array(
			"js/account.js",
			"js/jquery_fileuploader.js",
			"js/jquery.disableAutoFill.min.js",
			"js/upload_one.js",
		);
		$this->main_js = array_push_values($this->main_js,$additional_js);
	}

	public function password_reset($code = NULL, $id = NULL)
	{
		$id = isset($id) ? $id : $this->session->userdata("user_id");
		$this->data["id"] = $id;
		if (empty($code)) {
			redirect("en_us/logout","refresh");
		}
		$this->data["code"] = $code;
		$userdata = $this->ion_auth->user($id)->row();
		if (!empty($userdata->activation_code) || !empty($userdata->activation_selector)) {
			$this->form_validation->set_rules("old_password","Old Password","required");
			$this->form_validation->set_rules("password","Password","required|matches[password_chk]|min_length[" . $this->config->item("min_password_length", "ion_auth") . "]");
			$this->form_validation->set_rules("password_chk","Password Confirm","required");
			if ($this->form_validation->run() === TRUE) {
				$old_pass = $this->security->xss_clean($this->input->post("old_password"));
				$new_pass = $this->security->xss_clean($this->input->post("password"));
				$new_pass_chk = $this->security->xss_clean($this->input->post("password_chk"));
				$identity = $this->session->userdata("identity");
				$ubah_pass = $this->ion_auth->change_password($identity,$old_pass,$new_pass);
				if ($ubah_pass) {
					$this->ion_auth->activate($id,$code);
					$this->session->set_flashdata("message","Successfully changed password");
					redirect("en_us","refresh");
				} else {
					$this->session->set_flashdata("message","Password doesn't match, please check again");
					redirect("en_us/user/password_reset","refresh");
				}
			} else {
				$main_css = $this->main_css;
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Password Reset",
				);
				$this->User_model->render_page("password_reset",$this->data,$_template);
			}
		} else {
			$this->session->set_flashdata("message","You are old user");
			redirect("en_us","refresh");
		}
	}

	public function access_user()
	{
		if ($this->ion_auth->is_admin()) {
			return true;
		} else {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us","refresh");
		}
	}

	public function index()
	{
		if ($this->access_user() === TRUE) {

			if ($this->input->get("per_page")) {
				$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
			} else {
				$start = 0;
			}

			if ($this->ion_auth->is_admin() && $this->ion_auth->in_group("cho admin")) {
				$users_lists = $this->ion_auth->users();
				$this->data["count_file"] = $users_lists->num_rows();
				$this->data["pagination"] = $this->User_model->pagination($this->data["count_file"]);
				if ($this->data["count_file"] > 0) {
					$this->data["users_lists"] = $this->ion_auth->limit($this->data["userdata"]->document_per_page)->offset($start)->users()->result_array();
				}
			} elseif ($this->ion_auth->is_admin() && !$this->ion_auth->in_group("cho admin")) {
				$universitas = $this->Group_model->get_user_campus()->row();
				$users_lists = $this->ion_auth->users($universitas->id);
				$this->data["count_file"] = $users_lists->num_rows();
				$this->data["pagination"] = $this->User_model->pagination($this->data["count_file"]);
				if ($this->data["count_file"] > 0) {
					$this->data["users_lists"] = $this->ion_auth->limit($this->data["userdata"]->document_per_page)->offset($start)->users($universitas->id)->result_array();
				}
			}
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "User Management",
			);
			$this->User_model->render_page("user",$this->data,$_template);
		}
	}

	public function add()
	{
		if ($this->access_user() === TRUE) {

			$this->User_extend_model->add_rules();

			if ($this->form_validation->run() === TRUE) {
				$first_name = $this->security->xss_clean($this->input->post("first_name"));
				$last_name = $this->security->xss_clean($this->input->post("last_name"));
				$add_user = $this->User_model->add_user();
				// pre($add_user);
				if ($add_user !== FALSE) {
					$this->session->set_flashdata("message","User ". $first_name . " " . $last_name . " successfully created");
				} else {
					$this->session->set_flashdata("message","User ". $first_name . " " . $last_name . " failed created");
				}
				redirect("en_us/user","refresh");
			} else {
				if ($this->ion_auth->in_group("cho admin")) {
					$universitas = $this->Group_model->get_campus_lists();
					$this->data["groups"] = $universitas->result();
				} else {
					$universitas = $this->Group_model->get_user_campus()->row();
					$this->data["id_campus"] = $universitas->id;
				}
				$additional_js = array(
					"js/add_user.js",
				);
				$this->main_js = array_push_values($this->main_js,$additional_js);
				$main_css = $this->main_css;
				$main_js = $this->main_js;
				$_template = array(
					"main_css" => $main_css,
					"main_js" => $main_js,
					"title" => "Create a User",
				);
				$this->User_model->render_page("user_add",$this->data,$_template);
			}
		}
	}

	public function add_list()
	{
		if ($this->access_user() === TRUE) {
			if ($this->ion_auth->in_group("cho admin")) {
				$this->session->set_flashdata("message","Access Forbidden");
				redirect("en_us/user","refresh");
			}
			$filename = "import_name_".$this->data["userdata"]->id;
			$field_upload = "users";
			$upload_path = "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR;
			if (!empty($_FILES[$field_upload]["name"])) {
				$upload_user_lists = $this->User_model->upload_users($field_upload, $upload_path, $filename);
				if ($upload_user_lists["return"] !== FALSE) {
					$lib_excel_reader = APPPATH."modules" . DIRECTORY_SEPARATOR . "user" . DIRECTORY_SEPARATOR . "third_party" . DIRECTORY_SEPARATOR . "PHPExcel" . DIRECTORY_SEPARATOR . "PHPExcel.php";
					$sheet = excel_reader($lib_excel_reader, $upload_path, $filename);
					$header_row = $sheet[1];
					$header_var = array();
					$header_text = array();
					foreach ($header_row as $header) {
						$var_head = array();
						$get_require = explode("*", $header);
						$var_head["header"] = $get_require[0];
						array_push($header_text, $get_require[0]);
						if(array_key_exists(1, $get_require)){
							$var_head["required"] = TRUE;
						} else {
							$var_head["required"] = FALSE;
						}
						$var_head["var_key"] = underscore($get_require[0]);
						array_push($header_var, $var_head);
					}
					$this->data["header_row"] = $header_var;
					$quota_key = array_search("Quota", $header_text);
					$this->data["quota_key"] = $quota_key;
					$this->data["count_cols"] = count($header_row);
					$jumlah_data = count($sheet) - 1;
					$this->data["jumlah_data"] = $jumlah_data;
					$user_pre_add_lists = array();
					$this->data["alternate"] = 0;
					$this->data["kosong"] = 0;
					$total_quota_users = 0;
					for ($i=2; $i <= $jumlah_data + 1 ; $i++) {
						$row_user_data = $sheet[$i];
						$user_data = array();
						foreach ($row_user_data as $key => $value) {
							$nilai = array();
							$index = alphabet_to_number($key) - 1;
							$key_user = underscore($header_text[$index]);
							$nilai["value"] = $value;
							foreach ($header_var as $head) {
								if($head["var_key"] === $key_user){
									$nilai["required"] = $head["required"];
								}
							}
							switch ($key_user) {
								case "user_id":
									$user_temp_id = $nilai["value"];
									if (isset($user_temp_id) && !empty($user_temp_id)) {
										$cek_user = $this->ion_auth->user($user_temp_id);
										if ($cek_user->num_rows() > 0) {
											$nilai["false"] = TRUE;
										}
									}
									break;

								case "expired":
									if (!empty($nilai["value"])) {
										$expired_user = $nilai["value"];
										$tgl_expired_user = "";
										if (!empty($expired_user)) {
											$tgl_expired_user = longdate_indo(date("Y-m-d",strtotime("+".$expired_user."month")));
											unset($nilai["value"]);
										}
										$nilai["value"] = $tgl_expired_user;
									}
									break;

								case "quota":
									$quota_user = $nilai["value"];
									$total_quota_users += intval($quota_user);
									break;

								case "email":
									$email = $nilai["value"];
									if (!filter_var($email,FILTER_VALIDATE_EMAIL)) {
										$nilai["false"] = TRUE;
									}
									if ($this->ion_auth->email_check($email)) {
										$nilai["false"] = TRUE;
									}
									break;
								
								default:
									break;
							}
							$user_data[$key_user] = $nilai;
						}
						// pre($user_data);
						array_push($user_pre_add_lists, $user_data);
						// $user_pre_add_lists[$i - 2] = $sheet[$i];
					}

					$this->data["user_lists"] = $user_pre_add_lists;
					$this->data["total_quota"] = $total_quota_users;
				} else {
					$this->data["upload_error"] = $upload_user_lists["error"];
				}
			}
			$this->data["limit_quota_left"] = $this->data["limit_quota"];
			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Add User Lists",
			);
			$this->User_model->render_page("user_add_list",$this->data,$_template);
		}
	}

	public function import_list()
	{
		if ($this->access_user() === TRUE) {
			if ($this->ion_auth->in_group("cho admin")) {
				$this->session->set_flashdata("message","Access Forbidden");
				redirect("en_us/user","refresh");
			}
			$user_import = $this->User_model->user_import_list($this->data);
			// pre($user_import);
			if ($user_import !== FALSE) {
				$this->session->set_flashdata("message","Users successfully created");
			} else {
				$this->session->set_flashdata("message","Users failed created");
			}
			redirect("en_us/user","refresh");
		}
	}

	public function edit($id = NULL)
	{
		if ($this->access_user() === TRUE) {
			if (!empty($id) && isset($id)) {

				$user = $this->ion_auth->user($id);
				$user_data = $user->row();
				$this->User_extend_model->edit_restriction($id);
				$this->data["id"] = $id;
				$this->User_extend_model->edit_rules();

				if ($this->form_validation->run() === TRUE) {
					$first_name = $this->security->xss_clean($this->input->post("first_name"));
					$last_name = $this->security->xss_clean($this->input->post("last_name"));
					$edit_user = $this->User_model->edit_user($id);
					if ($edit_user) {
						$this->session->set_flashdata("message","User ". $first_name . " " . $last_name . " successfully updated");
					} else {
						$this->session->set_flashdata("message","User ". $first_name . " " . $last_name . " failed updated");
					}
					redirect("en_us/user","refresh");
				} else {

					$additional_js = array(
						"js/jquery-ui.min.js",
						"js/date_init.js",
						"js/edit_user.js",
					);
					$additional_css = array(
						"css/jquery-ui.min.css",
						"css/jquery-ui.theme.min.css",
					);
					$this->main_css = array_push_values($this->main_css,$additional_css);
					$this->main_js = array_push_values($this->main_js,$additional_js);
					$this->data["user"] = $user_data;
					$this->data["limit_left"] = $user_data->quota - $user_data->usage_quota;
					$this->data["user_is_admin"] = $this->ion_auth->is_admin($id);
					$universitas_user = $this->Group_model->get_user_campus($id)->row();

					if (isset($universitas_user) && !empty($universitas_user)) {
						$user_on_campus = $this->ion_auth->users($universitas_user->id);
						$this->data["jumlah_mhs"] = $user_on_campus->num_rows();
					}

					$main_css = $this->main_css;
					$main_js = $this->main_js;
					$_template = array(
						"main_css" => $main_css,
						"main_js" => $main_js,
						"title" => "Update User ". $user_data->first_name . " " . $user_data->last_name,
					);

					$this->User_model->render_page("user_edit",$this->data,$_template);
				}
			} else {
				$this->session->set_flashdata("message","ID User must be set");
				redirect("en_us/user","refresh");
			}
		}
	}

	public function delete($id = NULL)
	{
		if ($this->access_user() === TRUE) {
			if (isset($id) && !empty($id)) {

				$user = $this->ion_auth->user($id);
				$user_data = $user->row();

				$delete_user = $this->User_model->delete_user($id);
				$first_name = $user_data->first_name;
				$last_name = $user_data->last_name;

				if ($delete_user) {
					$this->session->set_flashdata("message",$first_name . " " . $last_name . " was successfully deleted");
				} else {
					$this->session->set_flashdata("message",$first_name . " " . $last_name . " was failed deleted");
				}

				redirect("en_us/user","refresh");

			} else {
				$this->session->set_flashdata("message","ID User must be set");
				redirect("en_us/user","refresh");
			}
		}
	}

	public function report()
	{
		if ($this->ion_auth->in_group("cho admin")) {
			$this->template->set("message",$this->session->flashdata("message"));
			$group_reports = $this->Group_model->get_campus_lists()->result();
			$group_reporting = array();
			$total_awal = 0;
			$total_pakai = 0;
			foreach ($group_reports as $group_report) {
				if (array_key_exists("admin_campus", $group_report)) {
					$campus = new stdClass;
					foreach ($group_report as $key => $value) {
						$campus->$key = $value;
						switch ($key) {
							case "base_quota_campus":
								$total_awal += $value;
								break;

							case "usage_quota_campus":
								$total_pakai += $value;
								break;
							
							default:
								break;
						}
					}
					array_push($group_reporting, $campus);
				}
			}

			$sisa_total = $total_awal - $total_pakai;
			$this->data["total_awal"] = $total_awal;
			$this->data["total_pakai"] = $total_pakai;
			$this->data["sisa_total"] = $sisa_total;
			$this->data["report_lists"] = $group_reporting;
			$this->data["alternate"] = 0;

			if ($this->data["use_api"] === TRUE) {
				$ithenticate = Modules::load("api/Ithenticate");
				$account_get = $ithenticate->account_get();
				if (!empty($account_get)) {
					$this->data["actual_quota"] = $account_get;
				}
			}

			$main_css = $this->main_css;
			$main_js = $this->main_js;
			$_template = array(
				"main_css" => $main_css,
				"main_js" => $main_js,
				"title" => "Report Quota Usage",
			);

			$this->User_model->render_page("report",$this->data,$_template);
		} else {
			$this->session->set_flashdata("message","Access Forbidden");
			redirect("en_us/user","refresh");
		}
	}

	public function banned($id = NULL)
	{
		if ($this->access_user() === TRUE) {
			if (isset($id) && !empty($id)) {

				$user = $this->ion_auth->user($id);
				$user_data = $user->row();

				$banned_user = $this->User_model->banned_user($id);
				$first_name = $user_data->first_name;
				$last_name = $user_data->last_name;

				if ($banned_user) {
					$this->session->set_flashdata("message",$first_name . " " . $last_name . " was successfully banned");
				} else {
					$this->session->set_flashdata("message",$first_name . " " . $last_name . " was failed banned");
				}

				redirect("en_us/user","refresh");

			} else {
				$this->session->set_flashdata("message","ID User must be set");
				redirect("en_us/user","refresh");
			}
		}
	}

	public function activated($id = NULL)
	{
		if ($this->access_user() === TRUE) {
			if (isset($id) && !empty($id)) {

				$user = $this->ion_auth->user($id);
				$user_data = $user->row();

				$activated_user = $this->User_model->activated_user($id);
				$first_name = $user_data->first_name;
				$last_name = $user_data->last_name;

				if ($activated_user) {
					$this->session->set_flashdata("message",$first_name . " " . $last_name . " was successfully activated");
				} else {
					$this->session->set_flashdata("message",$first_name . " " . $last_name . " was failed activated");
				}

				redirect("en_us/user","refresh");

			} else {
				$this->session->set_flashdata("message","ID User must be set");
				redirect("en_us/user","refresh");
			}
		}
	}

	public function impersonate($id = NULL)
	{
		if (isset($id) && !empty($id)) {
			$this->load->model("Impersonate_model");
			$impersonate = $this->Impersonate_model->impersonate($id);
			// pre($impersonate);
			if ($impersonate === FALSE) {
				$this->session->set_flashdata("message","Impersonate failed");
			} else {
				$this->session->set_flashdata("message","Impersonate success");
			}
			redirect("en_us","refresh");
		} else {
			return false;
		}
	}

	public function cek_admin_kampus()
	{
		$postData = $this->input->post();
		$response = $this->Group_model->get_admin_kampus($postData["id_kampus"]);
		$data = $response;
		echo json_encode($data);
	}
}