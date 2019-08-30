function set_disabled() {
	if ($('ex_by_per1').checked) {
		$('id_exclude_word_count').disabled = true;
		$('id_exclude_percent').disabled = false;
		$('id_exclude_percent').focus();
	} else {
		$('id_exclude_word_count').disabled = false;
		$('id_exclude_word_count').focus();
		$('id_exclude_percent').disabled = true;
	}
}

function show_hide_limit_match_size() {
	$('limit_match_size').style.display = $('id_limit_match_size').checked ?
		'block' :
		'none';
}

function show_hide_exclude_small_matches() {
	$('exclude_small_matches').style.display = $('id_exclude_small_matches').checked ?
		'block' :
		'none';
}



function initForm() {
	YAHOO.util.Event.on('id_exclude_small_matches', 'click', show_hide_exclude_small_matches);
	YAHOO.util.Event.on('id_limit_match_size', 'click', show_hide_limit_match_size);
	YAHOO.util.Event.on('id_exclude_by_percent', 'click', set_disabled);
	show_hide_exclude_small_matches();
	show_hide_limit_match_size();
	set_disabled();
}


YAHOO.util.Event.onDOMReady(initForm);