<div id="main">
	<div class="container">
		<div class="row">
			<div class="col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4">
				<?= (isset($title) && !empty($title)) ? heading(humanize(camelize($title))) : " "; ?>
				<div id="message_spot">
					<span class="_inline_message message" style=""></span>
					<span class="_inline_action" style="display: none;"><a href="#">Undo</a></span>
					<span class="_inline_info" style="display: none;"><a href="#"><abbr title="information">Info</abbr></a></span>
					<span class="_inline_link" style="display: none;"><a href="#" class="_inline_link_label"></a></span>
				</div>
				<div id="login" class="panel clearfix">
					<?php if (isset($message) && !empty($message)): ?>
					<div id="FormErrors" class="error alert-danger">
						<p class="error">
							<?= $message ?>
						</p>
					</div>
					<?php endif ?>
					<?= form_open(site_url("en_us/login"), $login_form); ?>
						<div class="ip_forms">
							<div class="form-group ip_form_row Email ltext required">
								<div class="label">
									<?= lang("login_identity_label", "username", $username_label); ?>
									<?= img($asterisk); ?>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<?= form_input($username); ?>
									</div>
								</div>
							</div>

							<?= anchor(current_url(),lang("login_forgot_password"),$forgot_password); ?>

							<div class="form-group ip_form_row EnterPassword ltext required">
								<div class="label">
									<?= lang("login_password_label", "password", $password_label); ?>
									<?= img($asterisk); ?>
								</div>
								<div class="ip_password_field">
									<div class="ip_valid_indicator">
										<?= form_input($password); ?>
									</div>
								</div>
							</div>

							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?= form_checkbox($remember_me);?>
										<div class="label">
											<?= lang("login_remember_label", "remember_me") ?>
											<?= img($transparent); ?>
										</div>
									</div>
								</div>
							</div>
							<div class="form_submit">
								<?= form_submit($submit); ?>
								<div class="clear"></div>
							</div>
						</div>
					<?= form_close(); ?>
				</div>
				<p class="large push-down-9">
					Don't have an account?
					<?= anchor(current_url(),"Sign Up") ?>
				</p>
			</div>
		</div>
	</div>
</div>