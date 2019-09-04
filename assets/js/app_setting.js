(function ($) {
	let use_api_check_button = $("input[name=use_api]");
	let table_api = $("#Table_num_1");
	let cek_api_btn = $(".cek_api");
	let username;
	let password;
	let id_group_folder_api;

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
		get_account(acc_id);
	});

	function get_account(id) {
		$.ajax({
			type : "POST",
			url : baseURL + "api/ithenticate/get_account",
			data : {
				id : id,
			},
			dataType:"json",
			success : function (response){
				// console.log(response);
				username = response["api_username"];
				password = response["api_password"];
				id_group_folder_api = response["id_group_folder_api"];
				check_availablity(id);
			},
		});
	}

	function check_availablity(id) {
		$.ajax({
			type : "POST",
			url : baseURL + "api/ithenticate/check_login_api",
			data : {
				id : id,
				username: username,
				password: password,
				id_group_folder_api : id_group_folder_api,
			},
			dataType:"json",
			success : function (response){
				console.log(response);
				let key_login_result = "login_result" in response;
				let key_id_group_folder = "id_group_folder_api" in response;
				let key_name_group_folder = "name_group_folder_api" in response;
				if (key_login_result === true) {
					if (response["login_result"] === true) {
						alert("lakukan cek group");
					} else {
						alert(response["login_result"]);
					}
					// if (response["login_result"] != null) {
					// 	console.log("connection established");
					// 	if (key_id_group_folder === true && key_name_group_folder === true) {
					// 		// if(response["login_result"].length == 1) {
					// 		// 	let group_api = login_result[0];
					// 		// }
					// 		name_group = response["name_group_folder_api"];
					// 		id_group = response["id_group_folder_api"];
					// 		let text_group = id_group + " - " + name_group;
					// 		console.log(text_group);
					// 		let group_api_selected = "#group_api_" + id;
					// 		let group_api_text = $(group_api_selected);
					// 		group_api_text.text(text_group);
					// 	} else {
					// 		alert(response["login_result"]);
					// 	}
					// } else {
					// 	alert("connection to iThenticate server is interupted");
					// }
				}
			},
		});
	}
})(jQuery);