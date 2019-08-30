<div id="col1_top" class="sub_tabs">
	<?php if (isset($group_folder) && !empty($group_folder)): ?>
		<?= heading($group_folder["name"],2); ?>
	<?php else: ?>
		<?= heading("Iwae",2); ?>
	<?php endif ?>
	<ul class="navtab">
		<li class="<?= ($this->uri->segment(3) == "folders") ? 'active' : '' ?>">
			<?php if (isset($id) && !empty($id)): ?>
				<?= anchor(site_url("en_us/group/folders/".$id),"<span>Folders</span>"); ?>
			<?php else: ?>
				<?= anchor(site_url("en_us/group/folders/"),"<span>Folders</span>"); ?>
			<?php endif ?>
		</li>
		<li class="<?= ($this->uri->segment(3) == "edit") ? 'active' : '' ?>">
			<?php if (isset($id) && !empty($id)): ?>
				<?= anchor(site_url("en_us/group/edit/".$id),"<span>Settings</span>"); ?>
			<?php else: ?>
				<?= anchor(site_url("en_us/group/edit/"),"<span>Settings</span>"); ?>
			<?php endif ?>
		</li>
	</ul>
</div>