(function ($) {
	$("#start_ip").ipv4_input("value",start_ip);
	if (end_ip !== ""){
		$("#end_ip").ipv4_input("value",end_ip);
	} else {
		$("#end_ip").ipv4_input();
	}
	$("#start_ip").find(".ipv4-cell").blur(function(){
		// console.log($("#start_ip").ipv4_input("value"));
		if ($("#start_ip").ipv4_input("value") !== "...") {
			$("#input_start_ip").val($("#start_ip").ipv4_input("value"));
		} else {
			$("#input_start_ip").val("");
		}
	});
	$("#end_ip").find(".ipv4-cell").blur(function(){
		// console.log($("#end_ip").ipv4_input("value"));
		if ($("#end_ip").ipv4_input("value") !== "...") {
			$("#input_end_ip").val($("#end_ip").ipv4_input("value"));
		} else {
			$("#input_end_ip").val("");
		}
	});
})(jQuery);