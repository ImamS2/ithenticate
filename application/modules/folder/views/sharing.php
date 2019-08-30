<div id="column_wrapper">
	<div id="column_wrapper_inner">
		<div id="column_three">
			<?= Modules::run("widget_admin/submit_file"); ?>
			<?= Modules::run("widget_admin/new_folder"); ?>
			<?= Modules::run("widget_admin/folder_info"); ?>
			<?= Modules::run("widget_admin/user_add"); ?>
		</div>
		<div id="column_one">
			<div id="top-pager"></div>
			<div id="docsTable" class="folder_table">
				<?= Modules::run("widget_admin/folder_col_top"); ?>
				<div class="navtab_bottom"></div>
				<div id="col1_bot">
					<div id="sharing">
						<?= form_open(site_url("en_us/folder/sharing/".$id),$sharing_form,$hidden_sharing); ?>
						<?= Modules::run("widget_admin/error_form"); ?>
							<div class="ip_forms">
								<div class="form-group ip_form_row Multiple rcheck-group optional">
									<fieldset>
										<legend> Share with <img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif') ?>">
										</legend>
										<div class="ip_valid_indicator">
											<?php if (isset($user_lists) && !empty($user_lists) && (is_object($user_lists) || is_array($user_lists))): ?>
												<?php foreach ($user_lists as $user): ?>
													<div class="checkbox select_box">
														<?php if (isset($shared_users) && !empty($shared_users)): ?>
															<input class="Multiple" type="checkbox" id="shared_with<?= $user->id ?>" value="<?= $user->id ?>" name="shared_with" <?= (in_array($user->id, $shared_users) ? "checked=\"checked\"" : "") ?> >
														<?php else: ?>
															<input class="Multiple" type="checkbox" id="shared_with<?= $user->id ?>" value="<?= $user->id ?>" name="shared_with">
														<?php endif ?>
														<div class="label">
															<label class="control-label" for="shared_with">
																<?= $user->first_name . " " . $user->last_name ?>
															</label>
														</div>
													</div>
												<?php endforeach ?>
											<?php endif ?>
										</div>
										<div>
											<input type="<?= (ENVIRONMENT === "development") ? "text" : "hidden" ?>" name="_id_user" id="id_user" value="">
										</div>
									</fieldset>
								</div>
								<div class="form_submit">
									<?php if (isset($share_update_btn) && !empty($share_update_btn)): ?>
										<?= form_submit($share_update_btn); ?>
									<?php endif ?>
									<!-- <input type="submit" class="btn btn-primary" value="Update Sharing"> -->
									<?= anchor(site_url("en_us/folder/".$id),"Cancel",array("class" => "btn btn-link")); ?>
									<div class="clear"></div>
								</div>
							</div>
						<?= form_close() ?>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/folder_directory"); ?>
</div>
<div class="clear"></div>