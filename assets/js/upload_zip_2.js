/*
var initLoadingPanel = function() {
	myPanel = new iThenticate.LoadingPanel('progress');
	// KNOWN ISSUE: safari bug prevents us from dynamically updating progress
	if (IP.Util.usingSafari()) {
		myPanel.setBody('<img src="' + base_url + 'assets/images/spinner.gif">');
	}
	myPanel.render(document.body);


	aborted_msg = "Upload failed to complete";
	stalled_msg = "Upload seems stalled.  Click cancel stop or OK to continue waiting.";
};

YAHOO.util.Event.onDOMReady(initLoadingPanel);
*/
var showPanel = function() {
	// KNOWN ISSUE: safari bug prevents us from dynamically updating progress
	if (!IP.Util.usingSafari()) {
		startEmbeddedProgressBar($('form0'));
	}
	myPanel.show();
};


IP.control.FormValidator.OverrideValidationProfiles = {
	form0: {
		validCallback: showPanel
	}
}


var curr_lang = 'en_us';

window.$loc = function(textKey, args) {
	var pattern = localized_strings[textKey];

	if (!pattern) return textKey;

	if (!args) return pattern;

	return pattern.replace(/\[_(\d+)\]/g, function(match, substr) {
		return args[substr - 1];
	});

}