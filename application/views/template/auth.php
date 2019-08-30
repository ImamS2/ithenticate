<!DOCTYPE html>
<html lang="en-us">
<head>
	<meta charset="utf-8">
	<title> <?= (isset($title) && !empty($title) && isset($subtitle) && !empty($subtitle)) ? $title . $subtitle . "| " . APPNAME : "" ; ?> </title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet">
	<?php if (isset($icon) && file_exists($icon)): ?>
		<link rel="shorcut icon" href="<?= site_url($icon) ?>">
	<?php endif ?>
	<?php if(isset($main_css) && is_array($main_css)) : foreach ($main_css as $css): ?>
		<link rel="stylesheet" type="text/css" href="<?= base_url('assets/'.$css)?>" media="all">
	<?php endforeach; endif; ?>
</head>
<body>
	<div id="header">
		<div class="container">
			<a href="<?= base_url() ?>" id="ithenticate-logo">iThenticate</a>
		</div>
	</div>
	<?= $contents ?>
	<div id="footer">
		<div class="container">
			<a href="http://www.ithenticate.com/privacy-pledge">Privacy Pledge</a> |
			<a href="http://www.ithenticate.com/usage-policy">Usage Policy</a> |
			<a href="mailto:ithsupport@ithenticate.com">Support</a> |
			<a href="http://www.ithenticate.com/blog/">Blog</a> |
			<a href="http://www.ithenticate.com/contact-us">Contact</a>
			<span class="pull-right">Copyright &copy; 1998-<?= date('Y') ?> <a href="http://www.turnitin.com/" target="_blank">Turnitin, LLC</a>. All rights reserved.</span>
		</div>
	</div>
	<?php if(isset($main_js) && is_array($main_js)) : foreach ($main_js as $js): ?>
		<script type="text/javascript" src="<?= base_url('assets/'.$js)?>"></script>
	<?php endforeach; endif; ?>
</body>
</html>