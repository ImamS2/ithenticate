<div id="submit_links" class="side_container submit_file">
	<div class="item">
		<?= heading("Submit a document",2); ?>
	</div>
	<?php if (isset($limit_quota_left)): ?>
	<p class="remaining_units"><?= format_ribuan($limit_quota_left) ?> Documents remaining</p>
	<?php endif ?>
	<?= ul($list,array("class" => "item")); ?>
	<?php if ($this->uri->segment(3) !== "recent"): ?>
	<dl class="item">
		<dt>View:</dt>
		<dd>
			<?= anchor(site_url("en_us/upload/recent"),"Recent Upload"); ?>
		</dd>
	</dl>
	<?php endif ?>
</div>