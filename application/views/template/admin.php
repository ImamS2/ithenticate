<!DOCTYPE html>
<html lang="en-us">
	<head>
		<title><?= (isset($title) && !empty($title)) ? APPNAME . " | " . $title : "" ; ?></title>
		<?php if (isset($icon) && file_exists($icon)): ?>
			<link rel="shorcut icon" href="<?= site_url($icon) ?>">
		<?php endif ?>
		<?php if (isset($main_css) && is_array($main_css)): ?>
			<?php foreach ($main_css as $css): ?>
				<link rel="stylesheet" type="text/css" href="<?= site_url('assets/'.$css) ?>" media="all">
			<?php endforeach ?>
		<?php endif ?>
	</head>
	<body id="ithenticate_cms" class="<?= (isset($body_class) && !empty($body_class)) ? $body_class : "" ?>" cz-shortcut-listen="true">
		<?= Modules::run("widget_admin/nav_tab");?>
		<?= Modules::run("widget_admin/header");?>
		<?= Modules::run("widget_admin/announcement");?>
		<div id="toolbar_wrapper">
			<div id="toolbar">
			</div>
		</div>
		<div id="main_content">
			<?= $contents ?>
		</div>
		<?= Modules::run("widget_admin/footer");?>
	</body>
</html>