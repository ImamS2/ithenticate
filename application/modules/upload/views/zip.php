<div id="column_wrapper">
	<div id="column_one">
		<div class="general_header">
			<h2 class="zip_icon">Zip File Upload</h2>
			<a href="<?= site_url("en_us/folder")?>">
				<strong>Return to Folders</strong>
			</a>
			<div class="clear"></div>
		</div>
		<div id="col1_bot">
			<form enctype="multipart/form-data" class="__validate" action="<?= site_url("en_us/upload/zip") ?>" method="post" id="form0" accept-charset="utf-8">
				<?= Modules::run("widget_admin/error_form"); ?>
				<div>
					<input name="_token" type="hidden" value="F076F304-5B69-11E9-B139-4B93C646984A">
				</div>
				<div class="ip_forms">
					<p class="comment">
						Your zip will be unpacked and the individual files uploaded. the title and author you provide here will be use as the default author and title for the file contained within the zip. You will have the chance to change the titles after uploading the zip file.
					</p>
					<div id="multiple_files">
						<?php if (isset($count_folders) && $count_folders > 1): ?>
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
															<option value="<?= $folder->id ?>"><?= $group_folder->name ?> - <?= $folder->name ?></option>
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
						<div>
							<input value="1" type="hidden" name="submit_to">
						</div>
						<fieldset class="j-uploader-single fld_grp">
							<legend>Document information</legend>
							<div class="form-group ip_form_row Author ltext optional">
								<div class="label">
									<label class="control-label" for="form40author_first">
										Author First Name
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input name="author_first_1" class="Author form-control __validateProfile:Author" type="text" id="form40author_first">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Author ltext optional">
								<div class="label">
									<label class="control-label" for="form40author_last">
										Author Last Name
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input id="form40author_last" name="author_last_1" class="Author form-control __validateProfile:Author" type="text">
									</div>
								</div>
							</div>
							<p class="paragraph-label">Browse for the file you would like to submit</p>
							<div class="form-group ip_form_row File ltext optional">
								<div class="ip_file_field">
									<div class="ip_valid_indicator">
										<div class="fileuploader fileuploader-theme-default">
											<input type="file" name="file_1" class="File form-control __validateProfile:File" id="form40file" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
										</div>
									</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="form_submit">
						<input class="btn btn-primary" type="submit" value="Upload" data-upload-type="zip">
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