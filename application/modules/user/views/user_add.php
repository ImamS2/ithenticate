<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" enctype="multipart/form-data" autocomplete="off" id="form0" method="post" action="<?= site_url('en_us/user/add') ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token">
					</div>
					<div class="ip_forms">
						<fieldset class="" style="">
							<legend>User Information</legend>
							<div class="form-group ip_form_row UserID ltext optional">
								<div class="label">
									<label class="control-label" for="form492user_id">
										User ID
										<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="UserID form-control __validateProfile:UserID" id="form492user_id" name="user_id" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row FirstName ltext required">
								<div class="label">
									<label class="control-label" for="form492first_name">
										First Name
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="FirstName form-control __required __validateProfile:FirstName" id="form492first_name" name="first_name" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row LastName ltext required">
								<div class="label">
									<label class="control-label" for="form492last_name">
										Last Name
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="LastName form-control __required __validateProfile:LastName" id="form492last_name" name="last_name" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Email ltext required">
								<div class="label">
									<label class="control-label" for="form492email">
										Email
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="Email form-control __required __validateProfile:Email" id="form492email" name="email" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row File ltext optional">
								<div class="label">
									<label class="control-label" for="form930photo">
										Upload a photo
										<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
									</label>
								</div>
								<div class="ip_file_field">
									<div class="ip_valid_indicator">
										<div class="fileuploader fileuploader-theme-default">
											<input type="hidden" name="fileuploader-list-photo">
											<input name="photo" type="file" class="File form-control __validateProfile:File" id="form930photo" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
											<div class="fileuploader-input">
											</div>
											<div class="fileuploader-items">
												<ul class="fileuploader-items-list"></ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- <div class="form-group ip_form_row ScryptPassword ltext required">
								<div class="label">
									<label class="control-label" for="form930password">
										Password
										<img class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_password_field">
									<div class="ip_valid_indicator">
										<input name="password" autocomplete="new-password" class="ScryptPassword form-control __required __validateProfile:ScryptPassword password" type="text" id="form930password" value="<?= $default_password ?>">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row EnterPassword ltext required">
								<div class="label">
									<label class="control-label" for="form930password_chk">
										Confirm Password
										<img class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_password_field">
									<div class="ip_valid_indicator">
										<input name="password_chk" autocomplete="new-password" type="text" class="EnterPassword form-control __required __validateProfile:EnterPassword password" id="form930password_chk" value="<?= $default_password ?>">
									</div>
								</div>
							</div> -->
							<?php if (isset($groups) && count($groups) > 0): ?>
								<?php if ($this->ion_auth->in_group("cho admin")): ?>
									<div class="form-group ip_form_row Select ltext required">
										<div class="label">
											<label class="control-label" for="form317group">
												Reporting Group
												<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
											</label>
										</div>
										<div class="ip_valid_indicator">
											<select class="Select form-control __required __validateProfile:Select" id="form317group" name="group_campus">
												<?php if (isset($groups) && !empty($groups) && (is_object($groups) || is_array($groups))): ?>
													<option value="">Select an option</option>
													<?php foreach ($groups as $group): ?>
														<option value="<?= $group->id ?>"><?= $group->name ?></option>
													<?php endforeach ?>
												<?php endif ?>
											</select>
										</div>
									</div>
								<?php else: ?>
									<div>
										<input type="hidden" value="<?= isset($id_campus) ? $id_campus : "" ?>" name="group_campus">
									</div>
								<?php endif ?>
							<?php else: ?>
								<div>
									<input type="hidden" value="<?= isset($id_campus) ? $id_campus : "" ?>" name="group_campus">
								</div>
							<?php endif ?>
							<div class="form-group ip_form_row Quota ltext required">
								<div class="label">
									<label class="control-label" for="form492quota">
									Quota
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="Quota form-control __required __validateProfile:Quota" id="form492quota" name="quota" type="text">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Select Expired ltext required">
								<div class="label">
									<label class="control-label" for="form317expireduser">
										Expired User
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_valid_indicator">
									<select class="Select form-control __required __validateProfile:Select" id="form317expireduser" name="expireduser">
										<option value="">Select an option</option>
										<optgroup label="---------Month---------">
											<?php for ($bulan = 1; $bulan <= 12; $bulan++) { ?>
											<option value="<?= $bulan ?>">
												<?= $bulan ?>
												<?php if ($bulan == 1): ?>
													Month
												<?php else: ?>
													Months
												<?php endif ?>
											</option>
											<?php } ?>
										</optgroup>
									</select>
								</div>
							</div>
						</fieldset>
						<?php if ($this->ion_auth->in_group("cho admin")): ?>
							<fieldset class="" id="permisi" style="display: none;">
								<legend>User Permissions</legend>
								<div class="form-group ip_form_row Checkbox rcheck optional">
									<div class="comment">Accounts Administrators are allowed to manage users and view their folders and documents.</div>
									<div class="ip_valid_indicator">
										<div class="checkbox select_box">
											<input type="checkbox" name="set_administrator" class="Checkbox __validateProfile:Checkbox" value="1" id="id_set_administrator">
											<div class="label">
												<label class="control-label" for="id_set_administrator">Set user as account administrator</label>
											</div>
										</div>
									</div>
								</div>
							</fieldset>
						<?php endif ?>
						<fieldset class="" style="">
							<legend>Contact Information</legend>
							<div class="form-group ip_form_row Phone ltext optional">
								<div class="label">
									<label class="control-label" for="form492phone">
										Phone #
										<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="Phone form-control __validateProfile:Phone" id="form492phone" name="phone" type="text">
									</div>
								</div>
							</div>
						</fieldset>
						<div class="form_submit">
							<input class="btn btn-primary submit" value="Create" type="submit">
							<a href="<?= site_url('en_us/user')?>" class="btn btn-link">Cancel</a>
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
<script type="text/javascript">
	let id_kampus = "<?= isset($id_campus) ? $id_campus : NULL ?>";
	let administrator = "<?= $this->ion_auth->in_group("cho admin"); ?>";
</script>