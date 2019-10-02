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
			alert(sid);
			return true;
		} else {
			alert("You must check api first");
			return false;
		}
	});

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