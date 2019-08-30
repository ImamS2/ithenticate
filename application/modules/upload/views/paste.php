<div id="column_wrapper">
	<div id="column_one">
		<div class="general_header">
			<h2 class="cp_icon">Cut &amp; Paste Upload</h2>
			<a href="<?= site_url("en_us/folder")?>">
				<strong>Return to Folders</strong>
			</a>
			<div class="clear"></div>
		</div>
		<div id="col1_bot">
			<form id="form0" class="__validate" accept-charset="utf-8" action="<?= site_url("en_us/upload/paste") ?>" method="post" enctype="multipart/form-data">
				<div><input value="152D4568-5B6A-11E9-BDF5-4C33A3D338EB" name="_token" type="hidden"></div>
				<div class="ip_forms">
					<p class="comment">Paste your document directly into the area provided below.</p>
					<div id="multiple_files">
						<?php if (isset($count_folders) && !empty($count_folders)): ?>
							<?php if ($count_folders > 1): ?>
								<div class="form-group ip_form_row Select ltext required">
									<div class="label">
										<label class="control-label" for="form317folder">
											Destination Folder
											<img title="required" class="is_required" alt="(required)" src="<?= site_url("assets/images/asterick.gif")?>">
										</label>
									</div>
									<div class="ip_valid_indicator">
										<select class="Select form-control __required __validateProfile:Select" id="form317folder" name="folder">
											<?php if (isset($browse_dir) && !empty($browse_dir)): ?>
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
											<?php endif ?>
										</select>
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
						<div>
							<input type="hidden" value="1" name="submit_to">
						</div>
						<fieldset class="j-uploader-single fld_grp">
							<legend>Document information</legend>
							<div class="form-group ip_form_row Author ltext optional">
								<div class="label">
									<label class="control-label" for="form52author_first">
										Author First Name
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input name="author_first" class="Author form-control __validateProfile:Author" type="text" id="form52author_first">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Author ltext optional">
								<div class="label">
									<label class="control-label" for="form52author_last">
										Author Last Name
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input name="author_last" class="Author form-control __validateProfile:Author" id="form52author_last" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row DocTitle ltext optional">
								<div class="label">
									<label class="control-label" for="form52title">
										Document Title
										<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input name="title" type="text" id="form52title" class="DocTitle form-control __validateProfile:DocTitle">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Paste textarea required">
								<div class="label">
									<label class="control-label" for="form52text">
										Paste your document in the area below
										<img title="required" class="is_required" alt="(required)" src="<?= site_url("assets/images/asterick.gif")?>">
									</label>
								</div>
								<textarea id="form52text" rows="10" class="Paste form-control __required __validateProfile:Paste" cols="50" name="text"></textarea>
							</div>
						</fieldset>
					</div>
					<div class="form_submit">
						<input value="Upload" type="submit" class="btn btn-primary" data-upload-type="paste">
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