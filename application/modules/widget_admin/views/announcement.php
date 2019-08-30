<?php if (isset($announcement) && !empty($announcement) ): ?>
	<div class="announcements_group">
		<div class="system_announcement">
			<p>
				<?= $announcement ?>
			</p>
			<?= anchor(site_url("en_us/announcement/clear"),"Remove",array("class"=>"close","title"=>"Remove this announcement")); ?>
		</div>
		<div class="clear"></div>
	</div>
<?php endif ?>