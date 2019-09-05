(function ($) {
	let cek_api_btn = $("#cek_api");
	let api_username = $("input[name=api_username]");
	let api_password = $("input[name=api_password]");
	let save_btn = $("#save_acc");
	let username;
	let password;
	cek_api_btn.click(function(event){
		if(api_username.val() !== ""){
			username = api_username.val();
		}
		if(api_password.val() !== ""){
			password = api_password.val();
		}
		if (username === undefined || password === undefined) {
			alert("Username or Password is empty");
		} else {
			check_availablity();
		}
	});

	function check_availablity() {
		$.ajax({
			type : "POST",
			url : baseURL + "api/ithenticate/check_login_api",
			data : {
				username: username,
				password: password,
			},
			dataType:"json",
			success : function (response){
				console.log(response);
				let key_login_result = "login_result" in response;
				if (key_login_result === true) {
					if (response["login_result"] === true) {
						// alert("muncul tombol save");
						save_btn.show();
					} else {
						if (response["login_result"] === null) {
							alert("Connection to iThenticate server is unreachable");
						} else {
							alert(response["login_result"]);
						}
					}
				}
			},
		});
	}
})(jQuery);