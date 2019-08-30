<div id="column_wrapper">
	<div id="column_one">
		<div id="account_info">
			<div class="general_header">
				<?= heading($title,2); ?>
				<?= anchor(site_url("en_us/folder"),"<strong>Return to Folders</strong>"); ?>
				<div class="clear"></div>
			</div>
			<div id="col1_bot">
				<div id="left_col">
					<?= form_open_multipart(site_url("en_us/account"),$attr_form,$hidden); ?>
						<?= Modules::run("widget_admin/error_form"); ?>
						<div class="ip_forms">
							<?= form_fieldset("My Profile"); ?>
								<div class="form-group ip_form_row EnterPassword ltext required">
									<div class="label">
										<?= lang("current_password_label","form_old_password",array("class" => "control-label")); ?>
										<?= img($asterisk); ?>
									</div>
									<div class="ip_password_field">
										<div class="ip_valid_indicator">
											<?= form_input($old_password); ?>
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row Author ltext required">
									<div class="label">
										<?= lang("first_name_label","form_first_name",array("class" => "control-label")); ?>
										<?= img($asterisk); ?>
									</div>
									<div class="ip_text_field">
										<div class="ip_valid_indicator">
											<?= form_input($first_name); ?>
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row Author ltext required">
									<div class="label">
										<?= lang("last_name_label","form_last_name",array("class" => "control-label")); ?>
										<?= img($asterisk); ?>
									</div>
									<div class="ip_text_field">
										<div class="ip_valid_indicator">
											<?= form_input($last_name); ?>
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row Email ltext required">
									<div class="label">
										<?= lang("email_label","form_email",array("class" => "control-label")); ?>
										<?= img($asterisk); ?>
									</div>
									<div class="ip_text_field">
										<div class="ip_valid_indicator">
											<?= form_input($email); ?>
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row File ltext optional">
									<div class="label">
										<?= lang("photo_label","form_photo",array("class" => "control-label")); ?>
										<?= img($transparent); ?>
									</div>
									<div class="ip_file_field">
										<div class="ip_valid_indicator">
											<div class="fileuploader fileuploader-theme-default">
												<?= form_input($photo); ?>
											</div>
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row ScryptPassword ltext optional">
									<div class="label">
										<?= lang("password_label","form_password",array("class" => "control-label")); ?>
										<?= img($transparent); ?>
									</div>
									<div class="ip_password_field">
										<div class="ip_valid_indicator">
											<?= form_input($password); ?>
										</div>
									</div>
								</div>
								<div class="form-group ip_form_row EnterPassword ltext optional">
									<div class="label">
										<?= lang("password_chk_label","form_password_chk",array("class" => "control-label")); ?>
										<?= img($transparent); ?>
									</div>
									<div class="ip_password_field">
										<div class="ip_valid_indicator">
											<?= form_input($password_chk); ?>
										</div>
									</div>
								</div>
							<?= form_fieldset_close() ?>
							<div class="form_submit">
								<?= form_submit($update_profile_btn); ?>
								<?= anchor(site_url("en_us/folder"),"Cancel",array("class" => "btn btn-link")); ?>
								<div class="clear"></div>
							</div>
						</div>
					<?= form_close() ?>
					<div class="clear"></div>
					<div class="clear"></div>
				</div>
				<div id="right_col">
					<div id="user_photo">
						<?= img($profile_pic) ?>
					</div>
					<?= heading("Account Info",3); ?>
					<ul style="margin-bottom:10px">
						<?php if (!$this->ion_auth->in_group("cho admin") && isset($universitas)): ?>
							<li><?= $universitas->name ?></li>
						<?php endif ?>
						<li>User ID: <?= $userdata->id ?></li>
						<?php if ($this->ion_auth->in_group("cho admin")): ?>
							<?php if ($use_api === TRUE): ?>
								<li>Expiry date: <?= $expired_real ?></li>
								<br>
								<br>
								<li>
									<?= anchor(site_url("en_us/user/reports"),"Cek Sisa Quota",array("class" => "btn btn-primary")) ?>
								</li>
							<?php else: ?>
							<?php endif ?>
						<?php else: ?>
							<li>Expiry date: <?= date("m-d-Y", $userdata->expired_at) ?></li>
							<?php if (isset($limit_quota_left) && !empty($limit_quota_left)): ?>
								<li>Limit Left: <?= $limit_quota_left ?></li>
							<?php endif ?>
						<?php endif ?>
					</ul>
				</div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
<div>