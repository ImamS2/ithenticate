<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/settings_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form class="__validate" id="form0" method="post" action="<?= site_url("en_us/settings/app_setting") ?>" accept-charset="utf-8">
					<div class="ip_forms">
						<div class="form-group ip_form_row Maitenance ltext optional">
							<div class="label">
								<label class="control-label" for="form_maintenance">
									Maintenance Text
									<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="Maitenance form-control __validateProfile:Maitenance" id="form_maintenance" name="maintenance" type="text" value='<?= isset($maintenance) ? $maintenance : "" ?>'>
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Telegram_ID ltext optional">
							<div class="label">
								<label class="control-label" for="form_telegram_id">
									Telegram ID
									<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="Telegram_ID form-control __validateProfile:Telegram_ID" id="form_telegram_id" name="telegram" value="<?= isset($telegram) ? $telegram : "" ?>" type="text">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Email_Address ltext optional">
							<div class="label">
								<label class="control-label" for="form_email_address">
									Email Address
									<img title="optional" class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="Email_Address form-control __validateProfile:Email_Address" id="form_email_address" name="email" value="<?= isset($email) ? $email : "" ?>" type="text">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Select rradio required">
							<fieldset>
								<legend>
									Use API or Manual
									<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</legend>
								<div class="comment">
								</div>
								<div class="ip_valid_indicator __required">
									<div class="radio select_box">
										<input id="form_use_api1" type="radio" name="use_api" value="1" <?= ($use_api == 1 ? "checked=\"checked\"": "") ?> class="Select" >
										<div class="label">
											<label class="control-label" for="form_use_api1">
												Use Api
											</label>
										</div>
									</div>
									<div class="radio select_box">
										<input id="form_use_api2" class="Select" type="radio" value="0" <?= ($use_api == 0 ? "checked=\"checked\"" : "") ?> name="use_api" >
										<div class="label">
											<label class="control-label" for="form_use_api2">
												Use Manual
											</label>
										</div>
									</div>
								</div>
							</fieldset>
						</div>
						<div id="Table_num_1" class="stdtbl">
							<?= anchor(site_url("en_us/settings/add_api"),"Tambah Akun API",array("class"=>"pull-right btn btn-sm btn-primary","style"=>"margin-bottom:20px;")); ?>
							<table class="standard_table">
								<thead>
									<tr>
										<th><b>API Username</b></th>
										<th><b>Active</b></th>
										<th><b>Group Folder</b></th>
										<th><b>Action</b></th>
									</tr>
								</thead>
								<tbody>
									<?php if (isset($api_accounts) && !empty($api_accounts)): ?>
										<?php foreach ($api_accounts as $account): ?>
											<tr class="<?= ($alternate % 2) ? "" : "alternate" ?>">
												<td><?= $account->api_username ?></td>
												<td>
													<?php if ($account->active == 1): ?>
														<?= anchor(site_url("settings/api_deactivate/".$account->id),"Deactivate",array("class"=>"btn btn-xs btn-danger","style"=>($account->checked == NULL) ? "color:#ffffff;text-decoration:none;display:none;" : "color:#ffffff;text-decoration:none;","id"=>"active_".$account->id)); ?>
													<?php else: ?>
														<?= anchor(site_url("settings/api_activate/".$account->id),"Activate",array("class"=>"btn btn-xs btn-primary","style"=> ($account->checked == NULL) ? "display:none" : "","id"=>"active_".$account->id)) ?>
													<?php endif ?>
												</td>
												<td><?= $account->id_group_folder_api . " - " . $account->name_group_folder_api ?></td>
												<td>
													<a href="javascript:void(0);" class="cek_api btn btn-xs btn-primary" data-id="<?= $account->id ?>"> Cek API</a>
												</td>
											</tr>
											<?php $alternate++; ?>
										<?php endforeach ?>
									<?php endif ?>
								</tbody>
								<tfoot></tfoot>
							</table>
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