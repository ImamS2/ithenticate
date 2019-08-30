<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" id="form0" method="post" action="<?= site_url('en_us/user/groups/edit/'.$id) ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div><input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token"></div>
					<div class="ip_forms">
						<div class="form-group ip_form_row NameGroup ltext required">
							<div class="label">
								<label class="control-label" for="form492namegroup">
									Name Group
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="NameGroup form-control __required __validateProfile:NameGroup" id="form492namegroup" name="namegroup" value="<?= isset($group) ? $group->name : "" ?>" type="text">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Description ltext optional">
							<div class="label">
								<label class="control-label" for="form492description">
									Description
									<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="Description form-control __validateProfile:Description" id="form492description" name="description" value="<?= isset($group) ? $group->description : "" ?>" type="text">
								</div>
							</div>
						</div>
						<div class="form_submit">
							<input class="btn btn-primary" value="Update Report Group" type="submit">
							<a href="<?= site_url('en_us/user/groups')?>" class="btn btn-link">Cancel</a>
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