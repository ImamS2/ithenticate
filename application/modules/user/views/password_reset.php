<div id="column_wrapper">
	<div id="column_one">
		<div class="general_header">
			<h2 class="users_icon">Password Reset</h2>
			<div class="clear"></div>
		</div>
		<div id="col1_bot">
			<p>
				Your password must be changed before you can continue.
			</p>
			<form method="post" accept-charset="utf-8" id="form0" class="__validate" action="<?= site_url("en_us/user/password_reset/".$id) ?>">
				<div><input value="DFD03254-D9B3-11E9-A83D-C565BBF6F4D5" type="hidden" name="_token"></div>
				<?= Modules::run("widget_admin/error_form"); ?>
				<div class="ip_forms">
					<fieldset>
						<!-- <div class="form-group ip_form_row EnterPassword ltext required">
							<div class="comment">Enter your existing password</div>
							<div class="label">
								<label class="control-label" for="form618old_password">
									Current password
									<?= img($asterisk); ?>
								</label>
							</div>
							<div class="ip_password_field">
								<div class="ip_valid_indicator">
									<input name="old_password" type="password" id="form618old_password" class="EnterPassword form-control __required __validateProfile:EnterPassword">
								</div>
							</div>
						</div> -->
						<div class="form-group ip_form_row ScryptPassword ltext required">
							<div class="comment">Pick a new password</div>
							<div class="label">
								<label class="control-label" for="form618password">
									New password
									<?= img($asterisk); ?>
								</label>
							</div>
							<div class="ip_password_field">
								<div class="ip_valid_indicator">
									<input name="password" id="form618password" class="ScryptPassword form-control __required __validateProfile:ScryptPassword" type="password">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row EnterPassword ltext required">
							<div class="comment">Retype your new password</div>
							<div class="label">
								<label class="control-label" for="form618password_chk">
									Confirm new password
									<?= img($asterisk); ?>
								</label>
							</div>
							<div class="ip_password_field">
								<div class="ip_valid_indicator">
									<input name="password_chk" class="EnterPassword form-control __required __validateProfile:EnterPassword" id="form618password_chk" type="password">
								</div>
							</div>
						</div>
					</fieldset>
					<div class="form_submit">
						<input class="btn btn-primary" type="submit" value="Change Password">
						<div class="clear"></div>
					</div>
				</div>
			</form>
		</div>
		<div class="clear"></div>
	</div>
</div>
<div class="clear"></div>