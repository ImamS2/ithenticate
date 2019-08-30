<?php if ($is_trash === FALSE): ?>
<div class="side_container info">
	<div class="item">
		<?= heading("Folder Info",2); ?>
	</div>
	<dl class="item">
		<dt>Name:</dt>
		<dd><?= (isset($folder) && !empty($folder) && (is_array($folder) || is_object($folder)) ? $folder["name"] : ""); ?></dd>
		<dt>Shared with:</dt>
		<dd>
			<a href="<?= site_url("en_us/folder/sharing/").$folder["id"] ?>">
				<?php if (isset($shared_users) && count($shared_users) > 0): ?>
					<?= format_ribuan(count($shared_users)) ?> users
				<?php else: ?>
					nobody
				<?php endif ?>
			</a>
		</dd>
	</dl>
	<div class="clear"></div>
</div>
<?php endif ?>