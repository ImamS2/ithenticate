(function($) {

$.ajaxSetup({cache: false});

$(document).ready(function() {

	var currentURL = window.location.href;

	var getVariables = currentURL.split('?q=')[1];
        getVariables = decodeURIComponent(getVariables);
        getVariables = getVariables.replace(/[^\w\s]/gi, '');
	var newURL = 'http://app.ithenticate.com/searchApp/index.php?keyword=';
	newURL += getVariables;

	if (getVariables == undefined ) {
		var newURL = 'http://app.ithenticate.com/searchApp/index.php';
	}

	$('#searchApp').attr('src', newURL);

});

})(jQuery);