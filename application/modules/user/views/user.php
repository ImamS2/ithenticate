<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<div id="top-pager">
					<?php if (isset($pagination) && !empty($pagination)): ?>
						<?= $pagination ?>
					<?php endif ?>
				</div>
				<h3>User Management</h3>
				<div id="Table_num_1" class="stdtbl">
					<table class="standard_table">
						<thead>
							<tr>
								<th></th>
								<th><b>First Name & Last Name</b></th>
								<th><b>User Type</b></th>
								<th><b>Email</b></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<?php if (isset($users_lists) && !empty($users_lists) && (is_object($users_lists) || is_array($users_lists))): ?>
								<?php $i = 0 ?>
								<?php foreach ($users_lists as $users): ?>
									<tr class="<?= ($i % 2) ? '' : 'alternate' ?>">
										<td class="center">
											<img src="<?= site_url("assets/images/users/".$users['profile_pic']) ?>" width="50px" >
										</td>
										<td>
											<?= $users['first_name'] . " " . $users['last_name'] ?>
										</td>
										<td>
											<?php if ($this->ion_auth->is_admin($users['id'])): ?>
												<?php if ($this->ion_auth->in_group("cho admin",$users['id'])): ?>
													Administrator
												<?php else: ?>
													University / College Administrator
												<?php endif ?>
											<?php else: ?>
												Member
											<?php endif ?>
										</td>
										<td>
											<?= $users['email'] ?>
										</td>
										<td>
											<?= anchor(site_url("en_us/user/edit/".$users["id"]),"Edit",array("class" => "btn btn-default")); ?>
											<?php if ($userdata->id !== $users["id"] && $this->ion_auth->in_group("cho admin")): ?>
												<?= anchor(site_url("en_us/user/impersonate/".$users["id"]),"Login",array("class" => "btn btn-default")); ?>
											<?php endif ?>
										</td>
									</tr>
									<?php $i++?>
								<?php endforeach ?>
							<?php endif ?>
						</tbody>
					</table>
				</div>
				<?php if (isset($pagination) && !empty($pagination)): ?>
					<?= $pagination ?>
				<?php endif ?>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/settings_tips"); ?>
	<?= Modules::run("widget_admin/user_add"); ?>
</div>
<div class="clear"></div>