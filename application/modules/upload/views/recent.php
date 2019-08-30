<div id="column_wrapper">
	<div id="column_one">
		<div class="general_header">
			<h2 class="folder_icon">Recent Uploads</h2>
			<a href="<?= site_url('en_us/folder')?>">
				<strong>Return to Folders</strong>
			</a>
			<div class="clear"></div>
		</div>
		<div id="col1_bot">
			<?php if (isset($recent_uploads) && !empty($recent_uploads) && (is_object($recent_uploads) || is_array($recent_uploads))): ?>
			<div id="docsTable" class="stdtbl">
				<table class="standard_table">
					<thead>
						<tr>
							<th>
								Upload Date & Time
							</th>
							<th>
								Destination Folder
							</th>
							<th>
								Number of Uploads
							</th>
							<th>
								Upload log
							</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ($recent_uploads as $log_upload): ?>
							<tr class="<?= ($i % 2) ? '' : 'alternate' ?>">
								<td>
									<a href="<?= site_url('en_us/upload/uploadlog/'.$log_upload['uploaded_on']) ?>" title="View documents">
										<?= format_ithenticate($log_upload['uploaded_on']) ?>
									</a>
								</td>
								<td>
									<a href="<?= site_url('en_us/folder/'.$log_upload['id_folder_awal']) ?>">
										<?= $log_upload['name'] ?>
									</a>
								</td>
								<td class="number">
									<?= $log_upload['quantity'] ?>
								</td>
								<td>
									<small>
										<a href="<?= site_url('en_us/upload/uploadlog/'.$log_upload['uploaded_on']) ?>" title="View upload log detail">
											view log
										</a>
									</small>
								</td>
							</tr>
							<?php $i++ ?>
						<?php endforeach ?>
					</tbody>
				</table>
				<?php if (isset($pagination) && !empty($pagination)): ?>
					<?= $pagination ?>
				<?php endif ?>
			</div>
			<?php else: ?>
			<div>
				This user is recently not yet uploaded a file. <?= anchor(site_url("en_us/upload"),"Upload a file") ?>
			</div>
			<?php endif ?>
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