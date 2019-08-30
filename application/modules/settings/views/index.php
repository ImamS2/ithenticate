<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/settings_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" id="form0" method="post" action="<?= site_url('en_us/settings') ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token">
					</div>
					<div class="ip_forms">
						<div class="form-group ip_form_row Select ltext optional">
							<div class="label">
								<label class="control-label" for="form846default_folder">
									Home Folder <img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
								</label>
							</div>
							<div class="ip_valid_indicator">
								<?php if (isset($folders) && !empty($folders) && (is_object($folders) || is_array($folders))): ?>
									<select id="form846default_folder" class="Select form-control __validateProfile:Select" name="default_folder">
										<?php foreach ($folders as $folder): ?>
											<option value="<?= $folder['id'] ?>" <?= ( isset($home_folder) && $home_folder == $folder["id"] ) ? "selected=\"selected\"" : "" ?> ><?= $folder["name"] ?></option>
										<?php endforeach ?>
									</select>
								<?php endif ?>
							</div>
						</div>
						<div class="form-group ip_form_row Select ltext required">
							<div class="label">
								<label class="control-label" for="form846num_items_to_display">
									Number of documents to show <img title="required" class="is_required" alt="(required)" src="<?= site_url("assets/images/asterick.gif")?>">
								</label>
							</div>
							<div class="ip_valid_indicator">
								<select id="form846num_items_to_display" name="num_items_to_display" class="Select form-control __required __validateProfile:Select">
									<?php if (isset($document_per_page_lists) && !empty($document_per_page_lists) && (is_object($document_per_page_lists) || is_array($document_per_page_lists))): ?>
										<option value="">Select an option</option>
										<optgroup label="------------">
											<?php foreach ($document_per_page_lists as $dpp): ?>
												<option value="<?= $dpp ?>" <?= (isset($document_per_page) && $document_per_page == $dpp) ? "selected=\"selected\"" : "" ?> ><?= $dpp ?></option>
											<?php endforeach ?>
										</optgroup>
									<?php endif ?>
								</select>
							</div>
						</div>
						<div class="form-group ip_form_row Select rradio required">
							<fieldset>
								<legend>
									After uploading a document <img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</legend>
								<div class="comment">
									This changes which page you view after uploading a document
								</div>
								<div class="ip_valid_indicator __required">
									<div class="radio select_box">
										<input id="form846folder_after_upload1" type="radio" name="folder_after_upload" value="1" <?= ($userdata->after_upload == 1 ? "checked='checked'": "") ?> class="Select">
										<div class="label">
											<label class="control-label" for="form846folder_after_upload1">
												Display the upload folder
											</label>
										</div>
									</div>
									<div class="radio select_box">
										<input id="form846folder_after_upload2" class="Select" type="radio" value="0" <?= ($userdata->after_upload == 0 ? "checked='checked'" : "") ?> name="folder_after_upload">
										<div class="label">
											<label class="control-label" for="form846folder_after_upload2">
												Upload another document
											</label>
										</div>
									</div>
								</div>
							</fieldset>
						</div>
						<div class="form_submit"><input class="btn btn-primary" value="Update Settings" type="submit">
							<a href="<?= site_url('en_us/folder')?>" class="btn btn-link">Cancel</a>
							<div class="clear"></div>
						</div>
					</div>
				</form>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/settings_tips"); ?>
</div>
<div class="clear"></div>