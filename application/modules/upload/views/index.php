<div id="column_wrapper">
	<div id="column_one">
		<div class="general_header">
			<h2 class="uf_icon">Upload a file</h2>
			<a href="<?= site_url("en_us/folder")?>">
				<strong>Return to Folders</strong>
			</a>
			<div class="clear"></div>
		</div>
		<div id="col1_bot">
			<form id="form0" class="__validate" accept-charset="utf-8" method="post" enctype="multipart/form-data" action="<?= site_url("en_us/upload") ?>">
				<?= Modules::run("widget_admin/error_form"); ?>
				<div><input type="hidden" value="D342B674-6311-11E9-BBAE-22B41BEF6708" name="_token"></div>
				<div class="ip_forms">
					<div id="multiple_files">
						<?php if (isset($count_folders)): ?>
							<?php if ($count_folders > 1): ?>
								<div class="form-group ip_form_row Select ltext required">
									<div class="label">
										<label class="control-label" for="form317folder">
											Destination Folder
											<img title="required" class="is_required" alt="(required)" src="<?= site_url("assets/images/asterick.gif")?>">
										</label>
									</div>
									<div class="ip_valid_indicator">
										<?php if (isset($browse_dir) && !empty($browse_dir)): ?>
											<select class="Select form-control __required __validateProfile:Select" id="form317folder" name="folder">
												<option value="">Select an option</option>
												<optgroup label="------------">
													<?php foreach ($browse_dir as $group_folder): ?>
														<?php if (isset($group_folder->subs) && !empty($group_folder->subs)): ?>
															<?php foreach ($group_folder->subs as $folder): ?>
																<?php if ($id == $folder->id): ?>
																	<option <?= (isset($id) && $id == $folder->id) ? "selected=\"selected\"" : "" ?> value="<?= $folder->id ?>"><?= $group_folder->name ?> - <?= $folder->name ?></option>
																<?php else: ?>
																	<option value="<?= $folder->id ?>"><?= $group_folder->name ?> - <?= $folder->name ?></option>
																<?php endif ?>
															<?php endforeach ?>
														<?php endif ?>
													<?php endforeach ?>
												</optgroup>
											</select>
										<?php endif ?>
									</div>
								</div>
							<?php else: ?>
								<div class="form-group ip_form_row Select ltext optional">
									<div class="label">
										<label class="control-label" for="form673folder">
											Destination Folder
											<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
										</label>
									</div>
									<?php if (isset($browse_dir) && !empty($browse_dir)): ?>
										<?php foreach ($browse_dir as $group_folder): ?>
											<?php if (isset($group_folder->subs) && !empty($group_folder->subs)): ?>
												<?php foreach ($group_folder->subs as $folder): ?>
													<?= $group_folder->name ?> - <?= $folder->name ?>
													<input value="<?= $folder->id ?>" type="hidden" name="folder" class="form-control">
												<?php endforeach ?>
											<?php endif ?>
										<?php endforeach ?>
									<?php endif ?>
								</div>
							<?php endif ?>
						<?php endif ?>
						<div><input name="submit_to" value="1" type="hidden"></div>
						<fieldset class="j-uploader-single fld_grp" style="">
							<legend>Upload #1</legend>
							<div class="form-group ip_form_row Author ltext optional">
								<div class="label">
									<label class="control-label" for="form673author_first_1">
										Author First Name 
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input type="text" name="author_first_1" id="form673author_first_1" class="Author form-control __validateProfile:Author">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Author ltext optional">
								<div class="label">
									<label class="control-label" for="form673author_last_1">
										Author Last Name
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input name="author_last_1" class="Author form-control __validateProfile:Author" id="form673author_last_1" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row DocTitle ltext optional">
								<div class="label">
									<label class="control-label" for="form673title_1">
										Document Title
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input type="text" id="form673title_1" class="DocTitle form-control __validateProfile:DocTitle" name="title_1">
									</div>
								</div>
							</div>
							<p class="paragraph-label">Browse for the file you would like to submit</p>
							<div class="form-group ip_form_row File ltext optional">
								<div class="ip_file_field">
									<div class="ip_valid_indicator">
										<div class="fileuploader fileuploader-theme-default">
											<input type="file" name="file" class="File form-control __validateProfile:File" id="form673file" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
										</div>
									</div>
								</div>
							</div>
						</fieldset>
						<?php if (isset($putaran)): ?>
							<?php for ($i=2; $i <= $putaran ; $i++) { ?>
							<fieldset class="j-uploader-single fld_grp" style="display:none">
								<legend>Upload #<?= $i ?></legend>
								<div class="form-group ip_form_row Author ltext optional">
									<div class="label">
										<label class="control-label" for="form673author_first_<?= $i ?>">
											Author First Name
											<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
										</label>
									</div>
									<div class="ip_text_field">
										<div class="ip_valid_indicator">
											<input type="text" id="form673author_first_<?= $i ?>" class="Author form-control __validateProfile:Author" name="author_first_<?= $i ?>">
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row Author ltext optional">
									<div class="label">
										<label class="control-label" for="form673author_last_<?= $i ?>">
											Author Last Name
											<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
										</label>
									</div>
									<div class="ip_text_field">
										<div class="ip_valid_indicator">
											<input name="author_last_<?= $i ?>" id="form673author_last_<?= $i ?>" class="Author form-control __validateProfile:Author" type="text">
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row DocTitle ltext optional">
									<div class="label">
										<label class="control-label" for="form673title_<?= $i ?>">
											Document Title
											<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
										</label>
									</div>
									<div class="ip_text_field">
										<div class="ip_valid_indicator">
											<input class="DocTitle form-control __validateProfile:DocTitle" id="form673title_<?= $i ?>" name="title_<?= $i ?>" type="text">
										</div>
									</div>
								</div>
								<p class="paragraph-label">Browse for the file you would like to submit</p>
								<div class="form-group ip_form_row File ltext optional">
									<div class="ip_file_field">
										<div class="ip_valid_indicator">
											<div class="fileuploader fileuploader-theme-default">
												<input name="file_<?= $i ?>" id="form673file_<?= $i ?>" class="File form-control __validateProfile:File" type="file" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
											</div>
										</div>
									</div>
								</div>
							</fieldset>
							<?php } ?>
						<?php endif ?>
					</div>
					<input type="hidden" name="putaran" value="1" id="putaran">
					<span id="addButton" class="btn">Add another file</span>
					<!-- <span id="test" class="btn">Test</span> -->
					<div class="form_submit">
						<input type="submit" value="Upload" class="btn btn-primary" data-upload-type="default">
						<a href="<?= site_url("en_us/folder")?>" class="btn btn-link">Cancel</a>
						<div class="clear"></div>
					</div>
				</div>
			</form>
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
<?php if (isset($putaran) && !empty($putaran)): ?>
	<script type="text/javascript">
		let max_loop = "<?= $putaran ?>";
	</script>
<?php endif ?>