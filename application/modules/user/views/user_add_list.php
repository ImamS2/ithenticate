<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<?php if (isset($upload_error)): ?>
					<div class="error alert-danger"><?= $upload_error ?></div>
				<?php endif ?>
				<?php if (isset($jumlah_data)): ?>
					<form class="__validate" id="form0" method="post" action="<?= site_url('en_us/user/import_list') ?>" accept-charset="utf-8">
						<div class="ip_forms">
							<legend style="margin-bottom: 0;">
								<h2 style="padding-left: 0;margin-left: 0;">Upload User List</h2>
							</legend>
							<br>
							<br>
							<br>
							<br>
							<?php if ($jumlah_data > 0): ?>
								<table class="standard_table">
									<?php if (isset($header_row) && !empty($header_row) && (is_array($header_row) || is_object($header_row))): ?>
										<thead>
											<tr>
												<th class="text-center" colspan="<?= $count_cols ?>"><b>Preview Data</b></th>
											</tr>
											<tr>
												<?php foreach ($header_row as $header): ?>
													<?php if (is_array($header) || is_object($header)): ?>
														<th class="text-center"><b><?= $header["header"]; ?></b></th>
													<?php endif ?>
												<?php endforeach ?>
											</tr>
										</thead>
										<tbody>
											<?php if (isset($user_lists) && !empty($user_lists) && (is_array($user_lists) || is_object($user_lists)) && count($user_lists) === $jumlah_data ): ?>
												<?php foreach ($user_lists as $users): ?>
													<tr class="<?= ($alternate % 2) ? "" : "alternate" ?>">
													<?php if (is_array($users) || is_object($users)): ?>
														<?php foreach ($users as $detail): ?>
															<?php if (empty($detail["value"]) && $detail["required"] == 1 || isset($detail["false"])): ?>
																<td style="background: #E07171; color: white;">
																<?php $kosong++; ?>
															<?php else: ?>
																<td>
															<?php endif ?>
																<?= $detail["value"]; ?>
															</td>
														<?php endforeach ?>
													</tr>
													<?php $alternate++; ?>
													<?php endif ?>
												<?php endforeach ?>
											<?php endif ?>
										</tbody>
									<?php endif ?>
									<tfoot>
										<tr>
											<td colspan="<?= $quota_key ?>" class="text-right"><b>Total Usage</b></td>
											<td colspan="<?= $count_cols - $quota_key ?>"><b><?= format_ribuan($total_quota) ?></b></td>
										</tr>
									</tfoot>
								</table>
								<hr>
							<?php endif ?>
							<div class="form_submit">
								<?php if ($kosong > 0): ?>
								<?php else: ?>
									<?php if ($total_quota > $limit_quota_left): ?>
										<span class="alert alert-danger">Quota Insufficent</span>
									<?php else: ?>
										<input class="btn btn-primary" value="Import" type="submit" name="import">
									<?php endif ?>
								<?php endif ?>
								<a href="<?= site_url('en_us/user/add_list')?>" class="btn btn-link">Cancel</a>
								<div class="clear"></div>
							</div>
						</div>
					</form>
				<?php else: ?>
					<form class="__validate" enctype="multipart/form-data" id="form0" method="post" action="<?= site_url('en_us/user/add_list') ?>" accept-charset="utf-8">
						<?= Modules::run("widget_admin/error_form"); ?>
						<div><input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token"></div>
						<div class="ip_forms">
							<legend style="margin-bottom: 0;">
								<h2 style="padding-left: 0;margin-left: 0;">Upload User List</h2>
							</legend>
							<br>
							<br>
							<br>
							<br>
							<p>You have to chosen to upload a list of users to your account.</p>
							<div class="form-group ip_form_row File ltext optional">
								<div class="label">
									<label class="control-label" for="form930photo">
										Browse for the file to upload
										<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_file_field">
									<div class="ip_valid_indicator">
										<div class="fileuploader fileuploader-theme-default">
											<input type="hidden" name="fileuploader-list-users">
											<input name="users" type="file" class="File form-control __validateProfile:File" id="form930photo" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
											<div class="fileuploader-input">
											</div>
											<div class="fileuploader-items">
												<ul class="fileuploader-items-list"></ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="form_submit">
								<input class="btn btn-primary" value="Upload" type="submit" name="upload">
								<a href="<?= site_url('en_us/user')?>" class="btn btn-link">
									Cancel
								</a>
								<div class="clear"></div>
							</div>
							<p>
								Your list must countain a first name, last name, and email address for each new user. You are limited to 200 users per upload. Account profiles will be created for each user. The user will receive an email notification that includes instructions for logging into iThenticate. Your file can be an Excel Spreadsheet, Word file, PDF, or a plain text. View <?= anchor(base_url("assets/uploads/sampleformat.xlsx"),"examples"); ?> of properly formatted files.
							</p>
						</div>
					</form>
				<?php endif ?>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/confirm_tip_excel"); ?>
</div>
<div class="clear"></div>