(function ($) {
	let cek_api_btn = $("#cek_api");
	let api_username = $("input[name=api_username]");
	let api_password = $("input[name=api_password]");
	let username;
	let password;
	cek_api_btn.click(function(event){
		if(api_username.val() !== ""){
			username = api_username.val();
		}
		if(api_password.val() !== ""){
			password = api_password.val();
		}
		check_availablity();
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
				let key_id_group_folder = "id_group_folder_api" in response;
				if (key_login_result === true) {
					if (response["login_result"] !== null) {
						console.log("connection established");
						if (key_id_group_folder === true) {
							console.log("update id folder");
						}
					} else {
						console.log("connection interupted");
					}
				}
			},
		});
	}
})(jQuery);