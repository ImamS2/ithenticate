<div id="column_wrapper">
	<div id="column_wrapper_inner">
		<div id="column_three">
			<?= Modules::run("widget_admin/submit_file"); ?>
			<?= Modules::run("widget_admin/new_folder"); ?>
		</div>
		<div id="column_one">
			<div id="top-pager"></div>
			<div id="docsTable" class="groups">
				<?= Modules::run("widget_admin/group_folder_col_top"); ?>
				<div class="navtab_bottom"></div>
				<div id="col1_bot">
					<form class="__validate" method="post" id="form0" action="<?= site_url('en_us/group/edit/'.$id) ?>" accept-charset="utf-8">
						<?= Modules::run("widget_admin/error_form"); ?>
						<div>
							<input type="hidden" name="_token" value="D3209EFA-5E6A-11E9-89B0-A5278AE6784A">
						</div>
						<div class="ip_forms">
							<div class="form-group ip_form_row FolderName ltext required">
								<div class="label">
									<label class="control-label" for="form886name">
										Name
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif') ?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<?php if (isset($group_folder) && !empty($group_folder)): ?>
											<input type="text" value="<?= $group_folder['name'] ?>" class="FolderName form-control __required __validateProfile:FolderName" name="name" id="form886name">
										<?php endif ?>
									</div>
								</div>
							</div>
							<div class="form_submit">
								<input type="submit" value="Update" class="btn btn-primary">
								<a href="<?= site_url('en_us/folder') ?>" class="btn btn-link">Cancel</a>
								<div class="clear"></div>
							</div>
						</div>
					</form>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/folder_directory"); ?>
</div>
<div class="clear"></div>