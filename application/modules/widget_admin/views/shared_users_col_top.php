<div id="col1_top" class="sub_tabs">
	<?php if (isset($shared_users) && !empty($shared_users)): ?>
		<?= heading($shared_users->first_name . " " . $shared_users->last_name,2); ?>
	<?php else: ?>
		<?= heading("Iwae",2); ?>
	<?php endif ?>
	<ul class="navtab">
		<li class="<?= ($this->uri->segment(3) == "users") ? "active" : "" ?>">
			<?php if (isset($id) && !empty($id)): ?>
				<?= anchor(site_url("en_us/folder/users/".$id),"<span>Folders</span>"); ?>
			<?php else: ?>
				<?= anchor(site_url("en_us/folder/users/"),"<span>Folders</span>"); ?>
			<?php endif ?>
		</li>
	</ul>
</div>