<div id="column_wrapper">
	<div id="column_wrapper_inner">
		<div id="column_three">
		</div>
		<div id="column_one">
			<div id="top-pager"></div>
			<div class="general_header">
				<h2>Create A New Folder Group</h2>
				<a href="<?= site_url('en_us/folder')?>">
					<strong>Return to Folders</strong>
				</a>
				<div class="clear"></div>
			</div>
			<div id="col1_bot">
				<form class="__validate" id="form0" method="post" action="<?= site_url('en_us/group/edit') ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div><input type="hidden" name="_token" value="CD230572-5B6A-11E9-932E-E2CD4A89A445"></div>
					<div class="ip_forms">
						<div class="form-group ip_form_row FolderName ltext required">
							<div class="label">
								<label class="control-label" for="form_name">
									Name
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input name="name" type="text" class="FolderName form-control __required __validateProfile:FolderName" id="form_name">
								</div>
							</div>
						</div>
						<div class="form_submit">
							<input type="submit" class="btn btn-primary" value="Create">
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
	<?= Modules::run("widget_admin/folder_directory"); ?>
</div>
<div class="clear"></div>