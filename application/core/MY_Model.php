<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
* 
*/
class MY_Model extends CI_Model
{
	protected $_table;
	protected $_page;
	protected $_var_page;
	protected $_limit;
	protected $_offset;
	protected $_distinct;
	protected $_order_by;
	protected $_order;
	protected $_where = [];
	protected $_group;
	protected $_select = [];
	protected $_not_like = [];
	protected $_join = [];
	protected $response;
	protected $per_page;

	function __construct()
	{
		parent::__construct();
		$this->load->library(array("form_validation"));
		$this->load->database();
	}

	public function render_page($page = "" ,$var_page = [] ,$var_template = [])
	{
		if (isset($page) && !empty($page)) {
			$this->_page = $page;
		}
		if (isset($var_page) && !empty($var_page) && (is_object($var_page) || is_array($var_page))) {
			$this->_var_page = $var_page;
		}
		if (isset($var_template) && !empty($var_template) && (is_object($var_template) || is_array($var_template))) {
			foreach ($var_template as $key => $value) {
				$this->template->set($key,$value);
			}
		}
		if (!empty($this->_page) && !empty($this->_var_page)) {
			$this->template->load($this->_page,$this->_var_page);
		}
	}

	public function where($where, $value = NULL)
	{
		if (!is_array($where))
		{
			$where = [$where => $value];
		}

		$this->_where = $where;

		return $this;
	}

	public function group_by($group_by = NULL)
	{
		if (isset($group_by) && !empty($group_by)) {
			$this->_group = $group_by;
		}
		return $this;
	}

	public function order_by($by, $order='desc')
	{
		$this->_order_by = $by;
		$this->_order    = $order;

		return $this;
	}

	public function limit($limit)
	{
		$this->_limit = $limit;
		return $this;
	}

	public function distinct()
	{
		$this->_distinct = TRUE;
		return $this;
	}

	public function not_like($field,$value = NULL)
	{
		if (is_array($field) && is_null($value)) {
			$this->_not_like = $field;
		} elseif (!is_array($field)) {
			$_field = [$field => $value];
			$this->_not_like += $_field;
		}

		return $this;
	}

	public function join($table_2,$key_2,$key_1,$table_1 = NULL)
	{
		$temp_join = array();
		if (isset($table_1) && !empty($table_1)) {
			$temp_join["table_1"] = $table_1;
		} else {
			$temp_join["table_1"] = $this->table;
		}

		$temp_join["table_2"] = $table_2;
		$temp_join["key_1"] = $key_1;
		$temp_join["key_2"] = $key_2;
		array_push($this->_join,$temp_join);

		return $this;
	}

	public function union($query_t1, $query_t2, $type = FALSE, $precompiled = FALSE)
	{
		if (isset($query_t1) && !empty($query_t1) && isset($query_t2) && !empty($query_t2)) {
			$run_query = $query_t1;
			if ($type === FALSE) {
				$run_query .= " UNION ";
			} else {
				$run_query .= " UNION ALL ";
			}
			$run_query .= $query_t2;
			if (isset($this->_limit) && isset($this->_offset)) {
				$run_query .= " LIMIT " . $this->_offset . " , " . $this->_limit;

				$this->_limit = NULL;
				$this->_offset = NULL;

			} elseif (isset($this->_limit)) {
				$run_query .= " LIMIT " . $this->_limit;
				// $this->db->limit($this->_limit);

				$this->_limit = NULL;
			}
			if ($precompiled === FALSE) {
				$this->response = $this->db->query($run_query);
			} else {
				$this->response = $run_query;
			}
		}
		return $this;
	}

	public function offset($offset)
	{
		$this->_offset = $offset;
		return $this;
	}

	public function select($select = NULL)
	{
		if (isset($select) && !empty($select)) {
			$this->_select[] = $select;
		} else {
			$this->select = [];
		}

		return $this;
	}

	public function row()
	{
		if (!empty($this->response)) {
			$row = $this->response->row();
		} else {
			$row = NULL;
		}
		return $row;
	}

	public function row_array()
	{
		if (!empty($this->response)) {
			$row = $this->response->row_array();
		} else {
			$row = NULL;
		}
		return $row;
	}

	public function result()
	{
		if (!empty($this->response)) {
			$result = $this->response->result();
		} else {
			$result = NULL;
		}
		return $result;
	}

	public function result_array()
	{
		if (!empty($this->response)) {
			$result = $this->response->result_array();
		} else {
			$result = NULL;
		}
		return $result;
	}

	public function num_rows()
	{
		if (!empty($this->response)) {
			$result = $this->response->num_rows();
		} else {
			$result = NULL;
		}
		return $result;
	}

	public function get($table = NULL, $precompiled = NULL)
	{
		if (isset($table) && !empty($table)) {
			$this->_table = $table;
		} else {
			$this->_table = $this->table;
		}

		if (isset($this->_select) && !empty($this->_select)) {
			foreach ($this->_select as $select) {
				$this->db->select($select);
			}
			$this->_select = [];
		} else {
			$this->db->select($this->_table.".*");
		}

		if (isset($this->_distinct) && !empty($this->_distinct)) {
			$this->db->distinct();
		}

		if (isset($this->_limit) && isset($this->_offset)) {
			$this->db->limit($this->_limit,$this->_offset);

			$this->_limit = NULL;
			$this->_offset = NULL;

		} elseif (isset($this->_limit)) {
			$this->db->limit($this->_limit);

			$this->_limit = NULL;
		}

		if (isset($this->_where) && !empty($this->_where)) {
			$this->db->where($this->_where);

			$this->_where = [];
		}

		if (isset($this->_join) && !empty($this->_join)) {
			foreach ($this->_join as $join) {
				$this->db->join($join["table_2"], $join["table_1"] . "." . $join["key_1"] . "=" . $join["table_2"] . "." . $join["key_2"] );
			}

			$this->_join = [];
		}

		if (isset($this->_not_like) && !empty($this->_not_like)) {
			$this->db->not_like($this->_not_like);

			$this->_not_like = [];
		}

		if (isset($this->_order_by) && isset($this->_order) ) {
			$this->db->order_by($this->_order_by,$this->_order);

			$this->_order = NULL;
			$this->_order_by = NULL;
		}

		if (isset($this->_group) && !empty($this->_group)) {
			$this->db->group_by($this->_group);
			$this->_group = NULL;
		}

		if (isset($precompiled) && !empty($precompiled)) {
			$this->response = $this->db->get_compiled_select($this->_table);
		} else {
			$this->response = $this->db->get($this->_table);
		}

		return $this;
	}

	public function insert($params, $value = NULL)
	{
		if (isset($params) && !empty($params) && (is_object($params) || is_array($params)) && empty($value)) {

			$this->db->insert($this->table,$params);
			return $this->db->insert_id();

		} elseif (isset($params) && isset($value) && !empty($params) && !empty($value) && is_string($params)) {

			$this->db->insert($this->table,array($params => $value));
			return $this->db->insert_id();

		} else {
			return false;
		}
	}

	public function insert_batch($batch_data)
	{
		if (isset($batch_data) && !empty($batch_data) && (is_object($batch_data) || is_array($batch_data))) {
			$this->db->insert_batch($this->table,$batch_data);
			return $this->db->insert_id();
		} else {
			return false;
		}
	}

	public function update($params, $value = NULL)
	{
		if (isset($this->_where) && !empty($this->_where)) {

			$this->db->where($this->_where);

			if (isset($params) && !empty($params) && (is_object($params) || is_array($params)) && empty($value)) {

				return $this->db->update($this->table,$params);

			} elseif (isset($params) && isset($value) && !empty($params) && !empty($value) && is_string($params)) {

				return $this->db->update($this->table,array($params => $value));

			} else {
				return false;
			}

			$this->_where = [];
		} else {
			return false;
		}
	}

	public function delete($key,$id)
	{
		return $this->db->delete($this->table,array($key=>$id));
	}

	public function pagination($total_rows, $max_page = NULL, $base_url = NULL, $per_page = NULL)
	{
		$this->load->library(array("pagination","ion_auth"));

		$this->per_page = $this->ion_auth->user()->row()->document_per_page;
		$base_url = isset($base_url) ? $base_url : current_url();
		$per_page = isset($per_page) ? $per_page : intval($this->per_page);
		$max_page = isset($max_page) ? $max_page : ceil(intval($total_rows)/intval($per_page));

		$config["base_url"] = $base_url;
		$config["total_rows"] = intval($total_rows);
		
		$config["per_page"] = intval($per_page);
		$config["num_links"] = 0;
		$config["use_page_numbers"] = TRUE;
		$config["page_query_string"] = TRUE;
		$config["reuse_query_string"] = TRUE;
		$config["prefix"] = "";
		$config["suffix"] = "";
		$config["display_pages"] = TRUE;
		$config["full_tag_open"] = "<div class=\"pager\">";
		$config["first_link"] = " ";
		$config["last_link"] = " ";
		$config["next_link"] = "Next";
		$config["prev_link"] = "Prev";
		$config["cur_tag_open"] = "Page ";
		$config["num_tag_open"] = " ";
		$config["next_tag_open"] = " ";
		$config["prev_tag_open"] = " ";
		$config["full_tag_close"] = "</div>";
		$config["cur_tag_close"] = " of " . $max_page;
		$config["num_tag_close"] = " ";
		$config["next_tag_close"] = " ";
		$config["prev_tag_close"] = " ";

		$this->pagination->initialize($config);
		$pagination = $this->pagination->create_links();
		if ($config["total_rows"] > $per_page)
		{
			return $pagination;
		}
		else
		{
			return "<div class=\"pager\">Page 1 of 1</div>";
		}
	}

	public function upload($field_upload, $upload_path, $allowed_types = "*", $encrypt_name = FALSE, $max_size = "0", $filename = "", $overwrite = FALSE)
	{
		if (isset($field_upload) && isset($upload_path) && !empty($field_upload) && !empty($upload_path)) {

			$config["upload_path"] = $upload_path;
			$config["allowed_types"] = $allowed_types;
			$config["encrypt_name"] = $encrypt_name;
			$config["overwrite"] = $overwrite;
			$config["file_name"] = $filename;
			$config["max_size"] = $max_size;

			$this->load->library("upload", $config);

			if(!empty($_FILES[$field_upload]["name"])) {
				if ($this->upload->do_upload($field_upload)) {
					$data = $this->upload->data();
					$return = array(
						"return" => TRUE,
						$field_upload => $data,
						"error" => "",
					);
				} else {
					$data = $this->upload->display_errors();
					$return = array(
						"return" => FALSE,
						$field_upload => "",
						"error" => $data,
					);
				}
				return $return;
			}
		}
		return FALSE;
	}

	public function upload_image($field_upload, $upload_path, $allowed_types = NULL, $encrypt_name = NULL)
	{
		if (isset($field_upload) && isset($upload_path) && !empty($field_upload) && !empty($upload_path)) {

			$allowed_types = isset($allowed_types) ? $allowed_types : "gif|jpg|png|jpeg|bmp";
			$encrypt_name = isset($encrypt_name) ? $encrypt_name : TRUE;
			$upload_file = $this->upload($field_upload, $upload_path, $allowed_types, $encrypt_name);

			if ($upload_file["return"] !== FALSE) {
				$config["image_library"] = "gd2";
				$image_file = $upload_file[$field_upload]["raw_name"] . $upload_file[$field_upload]["file_ext"];
				$image_path = $upload_file[$field_upload]["file_path"] . $image_file;
				$config["source_image"] = $image_path;
				$config["create_thumb"] = FALSE;
				$config["maintain_ratio"] = FALSE;
				$config["width"]= 107;
				$config["height"]= 99;
				$config["new_image"]= $image_path;
				$this->load->library("image_lib", $config);
				if ($this->image_lib->resize()) {
					return $image_file;
				}
			}
		}
		return FALSE;
	}

	public function unzip_file($file_path, $allowed_types = NULL, $upload_path = NULL )
	{
		if (isset($file_path) && !empty($file_path)) {
			$this->load->library("unzip");
			// Optional: Only take out these files, anything else is ignored
			if (isset($allowed_types) && !empty($allowed_types)) {
				if (is_array($allowed_types) || is_object($allowed_types)) {
					$this->unzip->allow($allowed_types);
				} elseif (is_string($allowed_types)) {
					$this->unzip->allow(array($allowed_types));
				}
					// $this->unzip->allow(array("pdf", "txt", "docx", "doc"));
			}
			$file_lists = $this->unzip->extract($file_path,$upload_path);
			return $file_lists;
		} else {
			return false;
		}
	}
}