<div id="column_wrapper">
	<div id="column_one">
		<div class="general_header">
			<h2 class="folder_icon">Recent Uploads</h2>
			<a href="<?= site_url("en_us/folder")?>">
				<strong>Return to Folders</strong>
			</a>
			<div class="clear"></div>
		</div>
		<div id="col1_bot">
			<div id="docsTable" class="stdtbl">
				<table class="standard_table">
					<thead>
						<tr>
							<th>File name</th>
							<th>From Zip</th>
							<th>Folder</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<?php $i = 0 ?>
						<?php if (isset($file_lists) && !empty($file_lists) && (is_array($file_lists) || is_object($file_lists))): ?>
						<?php foreach ($file_lists as $file): ?>
							<tr class="<?= ($i % 2) ? "" : "alternate" ?>">
								<td>
									File:
									<b><?= $file["ori_name"] ?></b><br>
									Title: <?= $file["title"] ?><br>
									Type: <?= $file["mime/type"] ?>
								</td>
								<td>
									<?= $file["zip_name"] ?>
								</td>
								<td>
									<?php if (intval($file["percent_match"])): ?>
										<a href="<?= site_url("en_us/folder/".$file["id_folder"]) ?>">
											<?= $file["name_folder"] ?>
										</a>
									<?php else: ?>
										n/a
									<?php endif ?>
								</td>
								<td>
									<?= $file["status"] ?>
								</td>
							</tr>
							<?php $i++ ?>
						<?php endforeach ?>
						<?php endif ?>
					</tbody>
				</table>
				<?php if (isset($pagination) && !empty($pagination)): ?>
					<?= $pagination ?>
				<?php endif ?>
			</div>
		</div>
		<div class="clear"></div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/submit_file"); ?>
	<?= Modules::run("widget_admin/confirm_tip"); ?>
	<div class="clear"></div>
</div>
<div class="clear"></div>