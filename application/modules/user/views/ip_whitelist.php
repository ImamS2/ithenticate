<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<h3>Add and Remove IP Address Reporting Groups</h3>
				<p>You may create new ip address and then assign to reporting groups.</p>
				<?php if (isset($count_ip) && !empty($count_ip) && $count_ip > 0): ?>
					<div id="Table_num_1" class="stdtbl">
						<table class="standard_table">
							<thead>
								<tr>
									<th colspan="5">
										<h4>Existing IP Address Reporting Groups</h4>
									</th>
								</tr>
							</thead>
							<tbody>
								<?php $i = 0 ?>
								<?php if (isset($ip_whitelists) && !empty($ip_whitelists) && (is_object($ip_whitelists) || is_array($ip_whitelists))): ?>
									<?php foreach ($ip_whitelists as $ip_whitelist): ?>
										<tr class="<?= ($i % 2) ? "" : "alternate" ?>">
											<td>
												<img src="<?= site_url("assets/images/ReportingGroups.png") ?>">
											</td>
											<td>
												<h4>
													<a href="<?= site_url("en_us/user/ip_whitelist/edit/".$ip_whitelist->id) ?>">
														<?= $this->ion_auth->group($ip_whitelist->id_group)->row()->name ?>
													</a>
												</h4>
											</td>
											<td>
												<?= $ip_whitelist->start_ip ?>
											</td>
											<td>
												<?= $ip_whitelist->end_ip ?>
											</td>
											<td>
												<a href="<?= site_url("en_us/user/ip_whitelist/delete/".$ip_whitelist->id) ?>">
													<img src="<?= site_url("assets/images/cb_cancel_16.png") ?>">
												</a>
											</td>
										</tr>
										<?php $i++?>
									<?php endforeach ?>
								<?php endif ?>
							</tbody>
						</table>
					</div>
				<?php endif ?>
				<form class="__validate" id="form0" method="post" action="<?= site_url("en_us/user/ip_whitelist/add") ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div><input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token"></div>
					<div class="ip_forms">
						<div class="form-group ip_form_row End_ip ltext required">
							<div class="label">
								<label class="control-label" for="form492start_ip">
									Start IP Address
									<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator ipaddress" id="start_ip" style="border: none;">
								</div>
								<input type="hidden" class="__optional" name="start_ip" id="input_start_ip">
							</div>
						</div>
						<div class="form-group ip_form_row End_ip ltext required">
							<div class="label">
								<label class="control-label" for="form492end_ip">
									End IP Address
									<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator ipaddress" id="end_ip" style="border: none;">
								</div>
								<input type="hidden" class="__optional" name="end_ip" id="input_end_ip">
							</div>
						</div>
						<div class="form-group ip_form_row Group ltext required">
							<div class="label">
								<label class="control-label" for="form492namegroup">
									Name Group
									<img title="required" class="is_required" alt="(required)" src="<?= site_url("assets/images/asterick.gif")?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<select class="Select form-control __required __validateProfile:Select" id="form317group" name="group_campus">
										<option value="">Select an option</option>
										<?php foreach ($groups as $group): ?>
											<option value="<?= $group->id ?>"><?= $group->name ?></option>
										<?php endforeach ?>
									</select>
								</div>
							</div>
						</div>
						<div class="form_submit">
							<input class="btn btn-primary" value="Add Report Group" type="submit">
							<a href="<?= site_url("en_us/folder")?>" class="btn btn-link">Cancel</a>
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