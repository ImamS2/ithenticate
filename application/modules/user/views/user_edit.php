<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" enctype="multipart/form-data" id="form0" method="post" action="<?= site_url('en_us/user/edit/'.$id) ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div><input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token"></div>
					<div class="ip_forms">
						<fieldset class="" style="">
							<legend>User Information</legend>
							<div class="form-group ip_form_row FirstName ltext required">
								<div class="label">
									<label class="control-label" for="form492first_name">
										First Name
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="FirstName form-control __required __validateProfile:FirstName" value="<?= isset($user) ? $user->first_name : "" ?>" id="form492first_name" name="first_name" type="text">
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
										<input class="LastName form-control __required __validateProfile:LastName" value="<?= isset($user) ? $user->last_name : "" ?>" id="form492last_name" name="last_name" type="text">
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
										<input class="Email form-control __required __validateProfile:Email" id="form492email" value="<?= isset($user) ? $user->email : "" ?>" name="email" type="text">
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
							<div class="form-group ip_form_row ScryptPassword ltext optional">
								<div class="label">
									<label class="control-label" for="form930password">
										Password
										<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
									</label>
								</div>
								<div class="ip_password_field">
									<div class="ip_valid_indicator">
										<input name="password" class="ScryptPassword form-control __validateProfile:ScryptPassword" autocomplete="new-password" type="password" id="form930password">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row EnterPassword ltext optional">
								<div class="label">
									<label class="control-label" for="form930password_chk">
										Confirm Password
										<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
									</label>
								</div>
								<div class="ip_password_field">
									<div class="ip_valid_indicator">
										<input name="password_chk" type="password" class="EnterPassword form-control __validateProfile:EnterPassword" autocomplete="new-password" id="form930password_chk">
									</div>
								</div>
							</div>
							<?php if (!$this->ion_auth->in_group("cho admin",$id)): ?>
								<?php if ($id != $this->ion_auth->user()->row()->id): ?>
									<div class="form-group ip_form_row Quota ltext required">
										<div class="label">
											<label class="control-label" for="form492quota">
												Base Quota
												<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<input class="Quota form-control __required __validateProfile:Quota" id="form492quota" value="<?= isset($user) ? $user->quota : "" ?>" name="quota" type="text">
											</div>
										</div>
									</div>
									<div class="form-group ip_form_row Expireduser ltext optional">
										<div class="label">
											<label class="control-label" for="form492expireduser">
												Expired User
												<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<input class="Expireduser form-control __validateProfile:Expireduser" id="form492expireduser" name="expireduser" value="<?= isset($user) ? date('Y-m-d',$user->expired_at) : "" ?>" type="text">
											</div>
										</div>
									</div>
								<?php endif ?>
							<?php endif ?>
						</fieldset>
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
										<input class="Phone form-control __validateProfile:Phone" id="form492phone" name="phone" value="<?= isset($user) ? $user->phone : "" ?>" type="text">
									</div>
								</div>
							</div>
						</fieldset>
						<div class="form_submit">
							<input class="btn btn-primary submit" value="Update" type="submit">
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
	<?php if ($id != $this->ion_auth->user()->row()->id): ?>
		<?php if (isset($jumlah_mhs) && $jumlah_mhs > 1): ?>
			<?php if (isset($user_is_admin) && $user_is_admin == FALSE): ?>
				<?= Modules::run("widget_admin/sidebar_edit_delete"); ?>
			<?php endif ?>
		<?php else: ?>
			<?= Modules::run("widget_admin/sidebar_edit_delete"); ?>
		<?php endif ?>
		<?php if ($this->ion_auth->user($id)->row()->active == TRUE): ?>
			<?= Modules::run("widget_admin/sidebar_edit_banned"); ?>
		<?php else: ?>
			<?= Modules::run("widget_admin/sidebar_edit_activated"); ?>
		<?php endif ?>
		<div class="clear"></div>
	<?php endif?>
</div>
<div class="clear"></div>