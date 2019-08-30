<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/settings_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" action="<?= site_url('en_us/settings/document') ?>" id="form0" accept-charset="utf-8" method="post">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input value="4D5E8A86-5B6B-11E9-98CB-1FF3C2560DCB" type="hidden" name="_token">
					</div>
					<div class="ip_forms">
						<div class="form-group ip_form_row Select ltext required">
							<div class="comment">
								Percentage when the color of the report score changes
							</div>
							<div class="label">
								<label class="control-label" for="form184alert_threshold">
									Change Score Color Percentage
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_valid_indicator">
								<select id="form184alert_threshold" class="Select form-control __required __validateProfile:Select" name="alert_threshold">
									<option value="">Select an option</option>
									<optgroup label="------------">
										<?php if (isset($percentage_lists) && (is_array($percentage_lists) || is_object($percentage_lists)) && !empty($percentage_lists)): ?>
											<?php foreach ($percentage_lists as $percentage): ?>
												<option value="<?= $percentage ?>" <?= (isset($score_change) && $score_change == $percentage) ? "selected=\"selected\"" : "" ?> ><?= $percentage ?>%</option>
											<?php endforeach ?>
										<?php endif ?>
									</optgroup>
								</select>
							</div>
						</div>
						<div class="form_submit">
							<input type="submit" class="btn btn-primary" value="Update Settings">
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