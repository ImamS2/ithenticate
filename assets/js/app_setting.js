(function ($) {
	let use_api_check_button = $("input[name=use_api]");
	let table_api = $("#Table_num_1");
	let cek_api_btn = $(".cek_api");
	let activate_btn = $(".activate");
	let username;
	let password;
	let id_group_folder_api;
	let ajax_req;
	let get_acc;
	let cek_login;
	let cek_group_folder;

	$(document).ready(function(){
		let checked_value = $("input[name=use_api]:checked").val();
		show_hide_table_api(checked_value);
	});
	
	use_api_check_button.click(function(){
		let checked_value = $("input[name=use_api]:checked").val();
		// console.log(checked_value == 1);
		show_hide_table_api(checked_value,"slow");
	});

	function show_hide_table_api(checked_value,speed) {
		if (checked_value == 1) {
			table_api.show(speed);
		} else {
			table_api.hide(speed);
		}
	}

	cek_api_btn.click(function(){
		let acc_id = $(this).data("id");
		get_acc = get_account(acc_id);
		get_acc.done(function(get_acc_resp){
			username = get_acc_resp["api_username"];
			password = get_acc_resp["api_password"];
			id_group_folder_api = get_acc_resp["id_group_folder_api"];
			cek_login = check_availablity();
			cek_login.done(function(cek_login_resp){
				if (cek_login_resp["login_result"] === true) {
					let sid = cek_login_resp["sid"];
					btn_selector = "#active_" + acc_id;
					$(btn_selector).data("id_group_folder",id_group_folder_api);
					$(btn_selector).data("sid",sid);
					alert("Account is active");
					return true;
				} else {
					if (cek_login_resp["login_result"] === null) {
						alert("Connection to iThenticate server is unreachable");
						return false;
					} else {
						alert(cek_login_resp["login_result"]);
						return false;
					}
				}
			}).fail(function(cek_login_fail){
				alert(cek_login_fail);
				return false;
			});
		}).fail(function(get_acc_fail){
			alert(get_acc_fail);
			return false;
		});
	});

	activate_btn.click(function(){
		let acc_id = $(this).data("id");
		let sid = $(this).data("sid");
		let id_folder_group = $(this).data("id_group_folder");
		if (sid !== undefined) {
			cek_group_folder = group_folder_list(sid,id_folder_group);
			cek_group_folder.done(function(cek_group_resp){
				console.log(cek_group_resp);
			}).fail(function(cek_group_fail){
				alert(cek_group_fail);
				return false;
			});
		} else {
			alert("You must check api first");
			return false;
		}
	});

	function group_folder_list(sid, id_folder_group) {
		dataType = "json";
		data = {
			sid : sid,
			username : username,
			id_folder_group : id_folder_group,
		};
		url_request = baseURL + "api/ithenticate/group_folder_check";
		type = "POST";
		return ajax_request(type,url_request,data,dataType);
	}

	function get_account(id) {
		dataType = "json";
		data = {
			id : id
		};
		url_request = baseURL + "api/ithenticate/get_account";
		type = "POST";
		return ajax_request(type,url_request,data,dataType);
	}

	function check_availablity() {
		dataType = "json";
		data = {
			username: username,
			password: password,
		};
		url_request = baseURL + "api/ithenticate/check_login_api";
		type = "POST";
		return ajax_request(type,url_request,data,dataType);
	}

	function ajax_request(type,url_request,data,dataType) {
		return $.ajax({
			type : type,
			url : url_request,
			data : data,
			dataType : dataType,
		});
	}
})(jQuery);