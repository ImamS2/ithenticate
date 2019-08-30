<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<h3>Add and Remove Reporting Groups</h3>
				<p>You may create new groups and then assign users to these groups by using the Reporting Group pull down menu in the user's <a href="">profile</a>.</p>
				<?php if (isset($count_groups) && !empty($count_groups) && $count_groups > 0): ?>
					<div id="Table_num_1" class="stdtbl">
						<table class="standard_table">
							<thead>
								<tr>
									<th colspan="4">
										<h4>Existing Reporting Groups</h4>
									</th>
								</tr>
							</thead>
							<tbody>
								<?php $i = 0 ?>
								<?php if (isset($groups) && !empty($groups) && (is_object($groups) || is_array($groups))): ?>
									<?php foreach ($groups as $group): ?>
										<tr class="middle <?= ($i % 2) ? '' : 'alternate' ?>">
											<td>
												<img src="<?= site_url('assets/images/ReportingGroups.png') ?>">
											</td>
											<td>
												<h4>
													<a href="<?= site_url('en_us/user/groups/edit/'.$group['id']) ?>"> <?= $group['name'] ?> </a>
												</h4>
											</td>
											<td>
												<?php if (isset($group["count_users"]) && $group['count_users'] > 0): ?>
													<?= $group['count_users'] ?> user
												<?php else: ?>
													no users in this group
												<?php endif ?>
											</td>
											<td>
												<a href="<?= site_url('en_us/user/groups/delete/'.$group['id']) ?>">
													<img src="<?= site_url('assets/images/cb_cancel_16.png') ?>">
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
				<form class="__validate" id="form0" method="post" action="<?= site_url('en_us/user/groups/add') ?>" accept-charset="utf-8">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div><input type="hidden" value="41325378-5B6B-11E9-86EC-AAFF5C2D010A" name="_token"></div>
					<div class="ip_forms">
						<div class="form-group ip_form_row NewGroup ltext required">
							<div class="label">
								<label class="control-label" for="form492newgroup">
									Initial Group
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="NewGroup form-control __required __validateProfile:NewGroup" id="form492newgroup" name="newgroup" type="text">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row NameGroup ltext required">
							<div class="label">
								<label class="control-label" for="form492namegroup">
									Name Group
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="NameGroup form-control __required __validateProfile:NameGroup" id="form492namegroup" name="namegroup" type="text">
								</div>
							</div>
						</div>
						<div class="form_submit">
							<input class="btn btn-primary" value="Add Report Group" type="submit">
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