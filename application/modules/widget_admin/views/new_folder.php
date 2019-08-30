<div class="side_container new_folder">
	<?= heading("New Folder",2); ?>
	<?php
		$list = array(
			anchor(site_url("en_us/folder/create_folder"),"<span>New Folder</span>"),
			anchor(site_url("en_us/group/edit"),"<span>New Folder Group</span>"),
		);
	?>
	<?= ul($list); ?>
</div>