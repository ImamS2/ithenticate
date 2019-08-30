jQuery(document).ready(function() {
	var captions = {
		button: function(options) { return options.limit == 1 ? 'Choose File' : 'Choose Files'; },
		feedback: function(options) { return options.limit == 1 ? 'Choose file to upload' : 'Choose files to upload'; },
		feedback2: function(options) { return options.length + ' ' + (options.length > 1 ? 'files were chosen' : 'file was chosen'); },
		removeConfirmation: 'Are you sure you want to remove this file?',
		errors: {
			filesLimit: 'Only ${limit} files are allowed to be uploaded.',
			fileSize: '${name} exceeds the maximum file size. Please choose a file up to ${fileMaxSize} MB.',
			fileName: 'File with the name ${name} is already selected.',
			folderUpload: 'Uploading folders is not supported.'
		}
	};

	// Comparison documents
	jQuery('.j-uploader-multiple [name=file_2]')
	.addClass('j-uploader-field')
	.fileuploader({
		limit: 5,
		showThumbs: true,
		addMore: true,
		captions: captions,
		fileMaxSize: 100,
		afterSelect: function(listEl, parentEl, newInputEl, inputEl) {
			jQuery(parentEl).parents('div.has-error').children('ul.help-block').fadeOut();
		}
	});

	// Other file upload fields
	jQuery('.File.form-control')
	.not('.j-uploader-field')
	.fileuploader({
		limit: 1,
		showThumbs: true,
		captions: captions,
		fileMaxSize: 100,
		afterSelect: function(listEl, parentEl, newInputEl, inputEl) {
			jQuery(parentEl).parents('div.has-error').children('ul.help-block').fadeOut();
		}
	});

});
// function click_addbutton()
// {
// 	alert('imam');
// 	console.log($('#form0'));
// }