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
		<div>
			<?= Modules::run("widget_admin/nav_tab");?>
			<?= Modules::run("widget_admin/header");?>
			<?= Modules::run("widget_admin/announcement");?>
			<form id="toolbar_form" method="post" action="<?= site_url("") ?>">
				<div id="toolbar_wrapper">
					<div id="toolbar">
					</div>
				</div>
				<div id="main_content">
					<div id="column_wrapper">
						<div id="column_wrapper_inner">
							<?= $contents ?>
						</div>
					</div>
					<div id="column_two">
						<?= Modules::run("widget_admin/user_folder_directory");?>
					</div>
					<div class="clear"></div>
				</div>
			</form>
			<?= Modules::run("widget_admin/footer");?>
		</div>
	</body>
</html>