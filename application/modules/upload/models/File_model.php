<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class File_model extends MY_Model
{
	protected $table = "file";
	protected $pk = "id";
	protected $use_api;
	protected $after_upload;
	protected $file_uploaded = array();

	function __construct()
	{
		parent::__construct();
		$use_api = $this->Settings_model->get_app_config("use_api")->row()->nilai;
		if ($use_api === "0") {
			$this->use_api = FALSE;
		} elseif ($use_api === "1") {
			$this->use_api = TRUE;
		}
		$after_upload = $this->ion_auth->user()->row()->after_upload;
		if ($after_upload === "0") {
			$this->after_upload = FALSE;
		} else {
			$this->after_upload = TRUE;
		}
	}

	public function get_files_by_folder($id_folder = NULL,$precompiled = FALSE)
	{
		if (empty($id_folder)) {
			$id_user = $this->session->userdata("user_id");
			$user_obj = $this->ion_auth->user($id_user);
			if ($user_obj->num_rows() === 1) {
				$userdata = $user_obj->row();
				$id_folder = $userdata->home_folder;
			} else {
				return false;
			}
		}

		$this->where(array($this->table.".id_folder" => $id_folder));
		if ($precompiled === FALSE) {
			$this->get();
		} else {
			$this->get($this->table,TRUE);
		}
		return $this;
	}

	public function get_files_detail_logs($uploaded_on = NULL)
	{
		$id_user = $this->session->userdata("user_id");

		if (isset($uploaded_on) && !empty($uploaded_on)) {
			$this->select($this->table.".*, folder.name as name_folder");
			$this->join("folder","id","id_folder_awal");
			$this->where(array("uploaded_on"=>$uploaded_on,"id_user"=>$id_user));
			$this->get($this->table);
		}
		return $this;
	}

	public function upload_file($field_upload, $upload_path)
	{
		if (isset($field_upload) && isset($upload_path) && !empty($field_upload) && !empty($upload_path)) {
			$upload_file = $this->upload($field_upload, $upload_path,"*",TRUE);
			if ($upload_file["return"] === FALSE) {
				return $upload_file["error"];
			} else {
				return $upload_file[$field_upload];
			}
		}
		return FALSE;
	}

	public function uploading_file($putaran = NULL)
	{
		$add_files = $this->add_file($putaran);
		$id_folder = $this->input->post("folder");
		foreach ($add_files as $data_file) {
			$file = $data_file["file"];
			$author_first = $data_file["author_first"];
			$author_last = $data_file["author_last"];
			$title = $data_file["title"];
			$file_type = $file["file_type"];
			$zip_type = $this->output->mimes["zip"];
			// pre($data_file);
			if(in_array($file_type, $zip_type)) {
				$extract_zip = $this->extract_zip_file($data_file);
			} else {
				if($this->use_api === true) {
					echo "gunakan api";
				}
				$this->file_save_db($data_file);
			}
		}

		$jml_file_upload = count($this->file_uploaded);
		if ($jml_file_upload < 2) {
			$this->session->set_flashdata("message",$jml_file_upload . " file was uploaded");
		} else {
			$this->session->set_flashdata("message",$jml_file_upload . " files was uploaded");
		}

		if ($this->after_upload === TRUE) {
			redirect("en_us/folder/".$id_folder,"refresh");
		} else {
			redirect("en_us/upload","refresh");
		}
	}

	public function upload_text()
	{
		$id_folder = $this->input->post("folder");
		$p_author_first = $this->input->post("author_first");
		$p_author_last = $this->input->post("author_last");
		$title = $this->input->post("title");
		$text = $this->input->post("text");
		$upload_path = isset($upload_path) ? $upload_path : "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "text" . DIRECTORY_SEPARATOR;
		$userdata = $this->ion_auth->user()->row();

		if (isset($p_author_first) && !empty($p_author_first)) {
			$author_first = $p_author_first;
		} else {
			$author_first = $userdata->first_name;
		}

		if (isset($p_author_last) && !empty($p_author_last)) {
			$author_last = $p_author_last;
		} else {
			$author_last = $userdata->last_name;
		}

		$file_name = $author_first . "_" . $author_last . "_";
		$file_raw = $file_name . time();
		$file_ext = ".txt";
		$file_text = $file_raw . $file_ext;
		$file_type = get_mime_by_extension($file_ext);


		if(write_file($upload_path.$file_text,$text)){
			$file_detail = get_file_info($upload_path.$file_text);
			if (!empty($file_detail) && (is_array($file_detail) || is_object($file_detail))) {
				$name_file = $file_detail["name"];
				$size_file = $file_detail["size"];
				$created_date_file = $file_detail["date"];
				$path_file = $file_detail["server_path"];
			}

			$file = array(
				"file_name" => $name_file,
				"file_ext" => $file_ext,
				"file_type" => $file_type,
				"file_path" => $upload_path,
				"raw_name" => $file_raw,
				"size_file" => $size_file,
			);
		}

		$data_file = array(
			"id_folder" => $id_folder,
			"uploaded_on" => time(),
			"author_first" => $author_first,
			"author_last" => $author_last,
			"title" => $file_raw,
			"file" => $file,
		);

		if (isset($data_file) && !empty($data_file)) {
			$this->file_save_db($data_file);
		}

		$jml_file_upload = count($this->file_uploaded);
		if ($jml_file_upload < 2) {
			$this->session->set_flashdata("message",$jml_file_upload . " file was uploaded");
		} else {
			$this->session->set_flashdata("message",$jml_file_upload . " files was uploaded");
		}

		if ($this->after_upload === TRUE) {
			redirect("en_us/folder/".$id_folder,"refresh");
		} else {
			redirect("en_us/upload","refresh");
		}
	}

	public function add_file($putaran = NULL, $upload_path = NULL)
	{
		$form_data = $this->input->post();
		// pre($form_data);
		$putaran = isset($putaran) ? $putaran : 1;
		$upload_path = isset($upload_path) ? $upload_path : "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR;
		$response = array();
		$userdata = $this->ion_auth->user()->row();
		$id_folder = $form_data["folder"];
		for ($i=1; $i <= $putaran ; $i++) {

			$author_first = $form_data["author_first_".$i];
			$author_last = $form_data["author_last_".$i];
			if (array_key_exists("title_".$i, $form_data)) {
				$title = $form_data["title_".$i];
			}
			$file = $form_data["fileuploader-list-file_".$i];
			$per_data = array();

			if (!empty($file) && isset($file)) {
				$upload_data = $this->upload_file("file_".$i, $upload_path);

				$per_data["file"] = $upload_data;
				$per_data["id_folder"] = $id_folder;
				$per_data["uploaded_on"] = time();

				if (isset($author_first) && !empty($author_first)) {
					$per_data["author_first"] = $author_first;
				} else {
					$per_data["author_first"] = $userdata->first_name;
				}

				if (isset($author_last) && !empty($author_last)) {
					$per_data["author_last"] = $author_last;
				} else {
					$per_data["author_last"] = $userdata->last_name;
				}

				if (isset($title) && !empty($title)) {
					$per_data["title"] = $title;
				} else {
					$per_data["title"] = $upload_data["raw_name"];
				}
			}
			if (isset($per_data) && !empty($per_data)) {
				array_push($response, $per_data);
			}
		}
		if (isset($response) && !empty($response)) {
			return $response;
		} else {
			return false;
		}
	}

	public function extract_zip_file($data, $upload_path = NULL)
	{
		$userdata = $this->ion_auth->user()->row();
		$author_first = $data["author_first"];
		$author_last = $data["author_last"];
		$id_folder = $data["id_folder"];
		$file_name = $data["file"]["file_name"];
		$raw_name = $data["file"]["raw_name"];
		$upload_path = isset($upload_path) ? $upload_path : "assets" . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR;
		$allowed_type = array("pdf", "txt", "docx", "doc");
		$file_lists = $this->unzip_file($upload_path.$file_name,$allowed_type,$upload_path.$raw_name);
		$response = array();
		if ((is_object($file_lists) || is_array($file_lists)) && !empty($file_lists)) {
			foreach ($file_lists as $file) {
				$per_data = array();
				// $dir_file = explode(DIRECTORY_SEPARATOR, $file);
				$file_name = pathinfo($file, PATHINFO_BASENAME);
				$ext_file = pathinfo($file, PATHINFO_EXTENSION);
				$file_inside_name = pathinfo($file, PATHINFO_FILENAME);
				$file_detail = get_file_info($upload_path.$raw_name.DIRECTORY_SEPARATOR.$file_name);
				$mime_file = get_mime_by_extension(".".$ext_file);
				if (!empty($file_detail) && (is_array($file_detail) || is_object($file_detail))) {
					$size_file = $file_detail["size"];
					$created_date_file = $file_detail["date"];
					$path_file = $file_detail["server_path"];
				}

				$file_list = array(
					"file_name" => $file_name,
					"file_type" => $mime_file,
					"file_path" => $upload_path.$raw_name.DIRECTORY_SEPARATOR,
					"full_path" => $path_file,
					"file_ext" => ".".$ext_file,
					"file_size" => $size_file,
				);

				if (isset($file_list) && !empty($file_list)) {
					$per_data["file"] = $file_list;
					$per_data["id_folder"] = $id_folder;
					$per_data["title"] = $file_inside_name;
					$per_data["zip_name"] = $raw_name;
					$per_data["uploaded_on"] = time();

					if (isset($author_first) && !empty($author_first)) {
						$per_data["author_first"] = $author_first;
					} else {
						$per_data["author_first"] = $userdata->first_name;
					}

					if (isset($author_last) && !empty($author_last)) {
						$per_data["author_last"] = $author_last;
					} else {
						$per_data["author_last"] = $userdata->last_name;
					}

				}

				if (isset($per_data) && !empty($per_data)) {
					array_push($response, $per_data);
				}
			}
		}
		if (isset($response) && !empty($response)) {
			foreach ($response as $data_file) {
				if($this->use_api === TRUE) {
					echo "gunakan api";
				}
				$this->file_save_db($data_file);
			}
			return $response;
		} else {
			return false;
		}
	}

	public function file_save_db($data_file = NULL)
	{
		$ready_input = array();
		if (isset($data_file) && !empty($data_file) && (is_array($data_file) || is_object($data_file))) {

			$file_detail = $data_file["file"];
			$file_name = $file_detail["file_name"];

			if (array_key_exists("client_name", $file_detail)) {
				$ori_name = $file_detail["client_name"];
				$title = $file_detail["client_name"];
			} else {
				$ori_name = $file_detail["file_name"];
				$title = $file_detail["file_name"];
			}

			$file_path = $file_detail["file_path"];
			$file_type = $file_detail["file_type"];
			$id_folder = $data_file["id_folder"];
			$uploaded_on = $data_file["uploaded_on"];
			$author_first = $data_file["author_first"];
			$author_last = $data_file["author_last"];

			if(array_key_exists("zip_name", $data_file) === TRUE) {
				$zip_name = $data_file["zip_name"];
			} else {
				$zip_name = "n/a";
			}

			$ready_input = array(
				"id_folder" => $id_folder,
				"id_folder_awal" => $id_folder,
				"uploaded_on" => $uploaded_on,
				"author_first" => $author_first,
				"author_last" => $author_last,
				"title" => $title,
				"zip_name" => $zip_name,
				"mime/type" => $file_type,
				"is_pending" => 1,
				"path_folder" => $file_path,
				"data_name" => $file_name,
				"ori_name" => $ori_name,
			);
		}
		if (isset($ready_input) && !empty($ready_input)) {
			$this->insert($ready_input);
			array_push($this->file_uploaded, $ready_input);
		}
		return $this;
	}

	public function edit_file($id_file = NULL,$update_val = NULL)
	{
		if (isset($id_file) && isset($update_val) && !empty($id_file) && !empty($update_val)) {
			$this->where(array($this->pk=>$id_file));
			$this->update($update_val);
		}
		return $this;
	}
}