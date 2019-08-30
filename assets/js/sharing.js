(function ($) {
	// var user_list = jQuery.parseJSON(user_lists);
	// for (var i = 0; i < user_list.length; i++) {
	// 	var user_id = user_list[i]['id'];
	// }
	$(document).ready(function(){
		$('input.Multiple').click(function(){
			var id_user_lists = [];
			$.each($("input[name='shared_with']:checked"),function(){
				id_user_lists.push($(this).val());
			});
			$("#id_user").val(JSON.stringify(id_user_lists));
		});
		var id_user_lists = [];
		$.each($("input[name='shared_with']:checked"),function(){
			id_user_lists.push($(this).val());
		});
		$("#id_user").val(JSON.stringify(id_user_lists));
	});
})(jQuery);