<!--//--><![CDATA[//><!--
document.getElementById('username').focus();

var curr_lang = 'en_us';

window.$loc = function( textKey, args ) {
	var pattern = localized_strings[textKey];

	if ( ! pattern ) return textKey;

	if ( ! args ) return pattern;

		return pattern.replace(/\[_(\d+)\]/g, function( match, substr ) {
			return args[ substr - 1 ];
		});

	}

//--><!]]>