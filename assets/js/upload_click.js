let putaran=1;

(function ($) {
	let tambah_form_file_btn = $("#addButton");
	let test_btn = $("#test");
	let container_progress_upload = $("#progress_c");
	let progress_upload = $("#progress")
	let upload_btn = $("input[value=Upload]");
	let form_folder_select = $("#form317folder");
	let form_pasted_text = $("#form52text");
	let id_folder;
	// console.log(after_upload);

	tambah_form_file_btn.click(function(){
		putaran++;
		$("#putaran").val(putaran);
		if (putaran === max_loop) {
			$(this).hide();
		}
	});

	jQuery.fn.center = function () {

		$(this).css({
			"position" : "fixed",
			"left" : "50%",
			"top" : "50%",
			"margin-left" : -this.outerWidth() / 2 + "px",
			"margin-top" : -this.outerHeight() / 2 + "px",
		});

		return this;
	};

	function redirect_link(link) {
		return window.location = link;
	}

	function upload_progress() {
		container_progress_upload.before("<div id=\"overlay\"></div>");
		let base_overlay = $("#overlay");
		base_overlay.show();
		progress_upload.css({
			"visibility" : "visible",
		});
		progress_upload.center();
		return true;
	};

	upload_btn.click(function(){
		id_folder = form_folder_select.val();
		let file_temp = new Array();
		let upload_type = $(this).data("uploadType");

		for (var i = 1; i <= putaran; i++) {
			let field_upload_file_form = $("input[name = fileuploader-list-file_" + i + "]");
			let field_name = field_upload_file_form.attr("name");
			let field_upload_file = field_upload_file_form.val();
			// console.log(field_upload_file);
			if (field_upload_file != "" && field_upload_file != "[]") {
				file_temp.push(field_upload_file);
			}
		}

		if (id_folder != "") {
			if (upload_type === "paste") {
				let pasted_txt_val = form_pasted_text.val();
				if (pasted_txt_val != "") {
					upload_progress();
				} else {
					alert("Upload form must not empty");
					return false;
				}
			} else {
				if (file_temp.length > 0) {
					upload_progress();
				} else {
					alert("Upload form must not empty");
					return false;
				}
			}
		} else {
			alert("ID Folder must be set");
			return false;
		}
	});

})(jQuery);