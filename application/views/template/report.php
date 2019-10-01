<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="default" />
		<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<style>
		.ellipsis {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			-o-text-overflow: ellipsis; /* required for Opera */
			-ms-text-overflow: ellipsis;   /* required for IE8, allegedly */
			-moz-binding: url('/mozxml/ellipsis.xml'); /* http://mattsnider.com/css/css-string-truncation-with-ellipsis/ */
		}
		</style>
		<link rel="apple-touch-icon" href="<?= base_url("assets/images/sproutcore-logo.png"); ?>">
		<link rel="apple-touch-startup-image" media="screen and (orientation:portrait)" href="<?= base_url("assets/images/sproutcore-startup-portrait.png"); ?>" />
		<link rel="apple-touch-startup-image" media="screen and (orientation:landscape)" href="<?= base_url("assets/images/sproutcore-startup-landscape.png") ?>" />

		<title><?= (isset($title) && !empty($title)) ? APPNAME . " | " . $title : "" ; ?></title>

		<link rel="stylesheet" type="text/css" href="<?= base_url("assets/css/stylesheet-packed.css"); ?>">
		<link rel="stylesheet" type="text/css" href="<?= base_url("assets/css/stylesheet.css"); ?>">
		<link rel="stylesheet" type="text/css" href="<?= base_url("assets/css/r-stylesheet.css"); ?>">

	</head>

	<body class="sc-theme focus box-shadow border-rad safari windows en_us sc-focus" cz-shortcut-listen="true">
		<!-- <div id="loading">
			<p class="loading">Loading...<p>

			<style type="text/css" media="screen">
				/* loading */
				.waiting { 
					position: absolute; 
					left: 0;
					right: 0;
				}

				.waiting.navbar {
					height: 20px;
					top: 0;
				}

				.waiting.infobar {
					height: 60px;
					top: 20px;
				}

				.sc-theme #loading p.loading {
					background-color: #ddd;
					text-align: center;
					top: 50%;
					font-size: 18px;
					color: #333;
					border-top: 0;
					text-shadow: 1px 1px 0 #fff;
				}

				.sc-theme #loading {
					background: #ddd;
				}

			</style>
			<div class="waiting navbar"> </div>
			<div class="waiting infobar"> </div>
			<p class="loading">Loading Document Viewer...</p>
		</div> -->
		<?= $contents ?>
	</body>
</html>