(function ($) {

	let form_edit = $("#form0");
	let btn_confirm = $(".confirmation");

	// form_edit.disableAutoFill({
	// 	passwordField: ".password",
	// 	randomizeInputName: false,
	// 	submitButton: ".submit",
	// });

	btn_confirm.click(function(){
		let limit_left = $(this).data("limit_left");
		let link = $(this).data("link");
		let confirm_text = $(this).data("confirm_text");
		let r = confirm("Sisa Kuota User ini : " + limit_left + "\n" + confirm_text);
		if (r == true)
		{
			window.location = link;
		}
	});

})(jQuery);