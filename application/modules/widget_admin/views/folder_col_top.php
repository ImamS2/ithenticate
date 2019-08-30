<div id="col1_top" class="sub_tabs">
	<?php if (isset($folder) && !empty($folder)): ?>
		<?= heading($folder["name"],2); ?>
	<?php else: ?>
		<?= heading("Iwae",2); ?>
	<?php endif ?>
	<ul class="navtab">
		<?php if (isset($id) && !empty($id)): ?>
			<li class="<?= ($this->uri->segment(3) == $id || ($id == $temp_id && $this->uri->segment(3) != "sharing" && $this->uri->segment(3) != "settings")) ? "active" : "" ?>">
				<a href="<?= site_url("en_us/folder/".$id) ?>">
					<span>Documents</span>
				</a>
			</li>
		<?php endif ?>
		<?php if (isset($folder) && !empty($folder) && $is_trash === FALSE ): ?>
			<?php if ($this->ion_auth->user()->row()->id == $folder["id_user"]): ?>
			<li class="<?= ($this->uri->segment(3) == "sharing") ? "active" : "" ?>">
				<a href="<?= site_url("en_us/folder/sharing/".$id) ?>">
					<span>Sharing</span>
				</a>
			</li>
			<li class="<?= ($this->uri->segment(3) == "settings") ? "active" : "" ?>">
				<a href="<?= site_url("en_us/folder/settings/".$id) ?>">
					<span>Settings</span>
				</a>
			</li>
			<?php endif ?>
		<?php endif ?>
	</ul>
</div>