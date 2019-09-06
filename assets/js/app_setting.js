(function ($) {
	let use_api_check_button = $("input[name=use_api]");
	let table_api = $("#Table_num_1");
	let cek_api_btn = $(".cek_api");
	let activate_btn = $(".activate");
	let username;
	let password;
	let id_group_folder_api;
	let get_acc;
	let cek_login;

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
		// console.log(get_acc);
		get_acc.done(function(get_acc_resp){
			// console.log(get_acc_resp);
			let key_api_username = "api_username" in get_acc_resp;
			let key_api_password = "api_password" in get_acc_resp;
			if (key_api_username === true && key_api_password === true) {
				username = get_acc_resp["api_username"];
				password = get_acc_resp["api_password"];
				// console.log(username);
				// console.log(password);
				cek_login = check_availablity();
				cek_login.done(function(cek_login_resp){
					// console.log(cek_login_resp);
					let key_login_result = "login_result" in cek_login_resp;
					if (key_login_result === true) {
						if (cek_login_resp["login_result"] !== true) {
							if (cek_login_resp["login_result"] === null) {
								alert("Connection to iThenticate server is unreachable");
								return false;
							} else {
								alert(cek_login_resp["login_result"]);
								return false;
							}
						} else {
							return true;
						}
					}
				}).fail(function(cek_login_fail){
					alert(cek_login_fail);
					return false;
				});
			}
		}).fail(function(get_acc_fail){
			alert(get_acc_fail);
			return false;
		});
	});

	activate_btn.click(function(){
		let acc_id = $(this).data("id");
		console.log(get_acc);
	});

	function get_account(id) {
		return $.ajax({
			type : "POST",
			url : baseURL + "api/ithenticate/get_account",
			data : {
				id : id,
			},
			dataType:"json",
		});
	}

	function check_availablity() {
		return $.ajax({
			type : "POST",
			url : baseURL + "api/ithenticate/check_login_api",
			data : {
				username: username,
				password: password,
			},
			dataType:"json",
		});
	}
})(jQuery);