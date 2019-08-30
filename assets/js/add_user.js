(function ($) {

	let campus = $("#form317group");
	let form_add = $("#form0");
	let submit_btn = $(".submit");
	let form_password = $("input[name=\"password\"]");
	let form_password_chk = $("input[name=\"password_chk\"]");
	let form_quota = $("input[name=\"quota\"]");
	let validation;
	let quota;
	$("div .Expired").hide("fast");
	if (administrator == true) {
		$("div .Quota").hide("fast");
	}

	campus.change(function(event){
		id_kampus = $(this).val();
		validation = $.ajax({
			type : "POST",
			url : baseURL + "en_us/user/cek_admin_kampus",
			data : {
				id_kampus: id_kampus,
			},
			dataType:"json",
			success : function (response){
				// console.log(response.length);
				if (response.length === undefined) {
					$("#id_set_administrator").prop("checked",false);
					$("#permisi").hide("slow");
					$("div .Quota").hide("slow");
					$("div .Expired").hide("slow");
				} else {
					if (response.length > 0){
						// console.log("sudah ada adminnya");
						$("#id_set_administrator").prop("checked",false);
						$("#permisi").hide("slow");
					} else {
						// console.log("belum ada adminnya");
						$("#id_set_administrator").prop("checked",true);
						$("#permisi").show("slow");
					}
					$("div .Quota").show("slow");
				}
			},
		});
	});

	form_quota.blur(function(event){
		if (administrator == true) {
			let id_kampus = campus.val();
		}
		let quota_val = form_quota.val();
		if($.isNumeric(quota_val)){
			quota = parseInt(quota_val);
		} else {
			quota = 0;
		}
		console.log(id_kampus);
		validation = $.ajax({
			type : "POST",
			url : baseURL + "en_us/user/cek_admin_kampus",
			data : {
				id_kampus: id_kampus,
			},
			dataType:"json",
			success : function (response){
				if (response.length === undefined) {
					$("div .Expired").hide("slow");
				} else {
					$("div .Expired").show("slow");
				}
			},
		});
		event.preventDefault();
	});

	form_add.disableAutoFill({
		passwordField: ".password",
		randomizeInputName: false,
		submitButton: ".submit",
		callback: checkForm(),
	});

	function checkForm(){
		submit_btn.click(function(event){
			let isi_pass = form_password.val();
			let isi_pass_chk = form_password_chk.val();
			// console.log(id_kampus);
			if (!id_kampus.trim()) {
				alert("no id_kampus");
				return false;
			} else {
				// alert("ada id_kampus");
				let quota_val = form_quota.val();
				if (!quota_val.trim()) {
					// alert("no quota_val");
					return false;
				} else {
					if($.isNumeric(quota_val)){
						quota = parseInt(quota_val);
					} else {
						quota = 0;
					}
					let responseJSON = validation["responseJSON"];
					// console.log(responseJSON);
					if (responseJSON !== undefined) {
						if (responseJSON.length == 1) {
							let response = responseJSON[0];
							let quota_awal = parseInt(response["quota"]);
							let usage_quota = parseInt(response["usage_quota"]);
							let new_usage_quota = quota + usage_quota;
							// console.log(quota_awal);
							// console.log(usage_quota);
							// console.log(quota);
							// console.log(new_usage_quota);
							if (new_usage_quota > quota_awal) {
								// alert("quota is not enough");
								return false;
							} else {
								if (isi_pass !== isi_pass_chk) {
									// alert("Password doesn't match");
									return false;
								}
								if (isi_pass == "") {
									// alert("Password must be filled");
									form_password.focus();
									return false;
								}
								if (isi_pass_chk == "") {
									// alert("Check Password must be filled");
									return false;
								}
								// alert("masih terjangkau");
								return true;
							}
						} else {
							if (isi_pass !== isi_pass_chk) {
								// alert("Password doesn't match");
								return false;
							}
							if (isi_pass == "") {
								// alert("Password must be filled");
								form_password.focus();
								return false;
							}
							if (isi_pass_chk == "") {
								// alert("Check Password must be filled");
								return false;
							}
							// alert("no admin kampus");
							return true;
						}
					} else {
						// alert("response undefined");
						return false;
					}
				}
			}
			return false;
		});
	}
})(jQuery);