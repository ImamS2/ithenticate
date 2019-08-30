<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Trash extends Folder
{
	function __construct()
	{
		parent::__construct();
		$trash_obj = $this->Group_folder_model->get_data_trash();
		if ($trash_obj->num_rows() === 1) {
			$trash = $trash_obj->row();
			$this->data["id"] = $trash->id;
		}
		$this->load->model("Trash_model");
	}

	public function trashbin()
	{
		$this->template->set_template("template" . DIRECTORY_SEPARATOR . "folder");

		if ($this->input->get("per_page")) {
			$start = ($this->input->get("per_page")-1)*$this->data["userdata"]->document_per_page;
		} else {
			$start = 0;
		}

		$this->data["score_change"] = $this->data["userdata"]->score_change;

		$trash_contents = $this->Trash_model->get_trash_content();

		$this->data["count_isi_trash"] = $trash_contents->num_rows();
		$this->data["pagination"] = $this->Trash_model->pagination($this->data["count_isi_trash"]);

		if ($this->data["count_isi_trash"] > 0) {
			$this->data["isi_trash"] = $this->Trash_model->get_trash_content($this->data["userdata"]->document_per_page,$start)->result_array();
		}

		$folder_view_js = array(
			"js/account.js",
			"js/document_manager.js",
			"js/folder_view.js",
		);

		$this->main_js = array_push_values($this->main_js,$folder_view_js);

		$this->data["folder"] = $this->Folder_model->get_folder_details($this->data["id"])->row_array();

		$main_css = $this->main_css;
		$main_js = $this->main_js;

		$_template = array(
			"main_css" => $main_css,
			"main_js" => $main_js,
			"title" => "Folder : ". $this->data["folder"]["name"],
		);

		$this->Folder_model->render_page("trashbin",$this->data,$_template);
	}
}