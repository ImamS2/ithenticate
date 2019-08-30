<!DOCTYPE html>
<html>
	<head>
		<title>
			<?= isset($title) ? $title : "" ?>
		</title>
		<?php if (isset($icon) && file_exists($icon)): ?>
			<link rel="shorcut icon" href="<?= site_url($icon) ?>">
		<?php endif ?>
	</head>
</html>