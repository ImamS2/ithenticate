<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/settings_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" action="<?= site_url("en_us/settings/add_api_account") ?>" id="form0" accept-charset="utf-8" method="post">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input value="4D5E8A86-5B6B-11E9-98CB-1FF3C2560DCB" type="hidden" name="_token">
					</div>
					<div class="ip_forms">
						<div class="form-group ip_form_row Username ltext optional">
							<div class="label">
								<label class="control-label" for="form_api_username">
									API Username
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="Username form-control __validateEmail:Username" id="form_api_username" name="api_username" type="text" value='<?= isset($api_username) ? $api_username : "" ?>'>
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Password ltext optional">
							<div class="label">
								<label class="control-label" for="form_api_password">
									API Password
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="Password form-control __validateProfile:Password" id="form_api_password" name="api_password" type="text" value='<?= isset($api_password) ? $api_password : "" ?>'>
								</div>
							</div>
						</div>
						<div class="form_submit">
							<a href="javascript:void(0);" class="btn btn-primary" id="cek_api">Check API</a>
							<a href="javascript:void(0);" class="btn btn-primary" style="display: none;" data-id="" id="save_acc">Save Account</a>
							<a href="<?= site_url("en_us/settings/app_setting")?>" class="btn btn-link">Cancel</a>
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