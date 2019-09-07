(function ($) {
	let cek_api_btn = $("#cek_api");
	let api_username = $("input[name=api_username]");
	let api_password = $("input[name=api_password]");
	let save_btn = $("#save_acc");
	let username;
	let password;
	let cek_login;
	let cek_group_folder;

	cek_api_btn.click(function(){
		if(api_username.val() !== ""){
			username = api_username.val();
		}
		if(api_password.val() !== ""){
			password = api_password.val();
		}
		if (username === undefined || password === undefined) {
			alert("Username or Password is empty");
		} else {
			cek_login = check_availablity();
			cek_login.done(function(cek_login_resp){
				if (cek_login_resp["login_result"] === true) {
					let sid = cek_login_resp["sid"];
					$("#save_acc").data("sid",sid);
					save_btn.show();
					alert("Account is Active");
				} else {
					if (cek_login_resp["login_result"] === null) {
						alert("Connection to iThenticate server is unreachable");
						return false;
					} else {
						alert(cek_login_resp["login_result"]);
						return false;
					}
				}
			}).fail(function(cek_login_resp){
				alert(cek_login_resp);
				return false;
			});
		}
	});

	save_btn.click(function(){
		let sid = $(this).data("sid");
		if (sid !== undefined) {
			cek_group_folder = group_folder_list(sid);
			cek_group_folder.always(function(cek_group_resp){
				// console.log(cek_group_resp);
				sid = cek_group_resp["sid"];
				id_group_folder_api = cek_group_resp["id_folder_group"];
				name_group_folder_api = cek_group_resp["name_folder_group"];
				cek_folder = folder_list(sid);
				cek_folder.done(function(cek_folder_resp){
					console.log(cek_folder_resp);
				}).fail(function(cek_folder_fail){
					alert(cek_folder_fail);
					return false;
				});
			}).fail(function(cek_group_fail){
				alert(cek_group_fail);
				return false;
			});
		} else {
			alert("You must check api first");
			return false;
		}
	});

	function folder_list(sid) {
		dataType = "json";
		data = {
			sid : sid,
			id_folder_group : id_group_folder_api,
		};
		url_request = baseURL + "api/ithenticate/folder_check";
		type = "POST";
		return ajax_request(type,url_request,data,dataType);
	}

	function group_folder_list(sid) {
		dataType = "json";
		data = {
			sid : sid,
			username : username,
			password : password,
		};
		url_request = baseURL + "api/ithenticate/group_folder_check";
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