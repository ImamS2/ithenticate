<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<?= Modules::run("widget_admin/user_navbar"); ?>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<h3>Usage Reports</h3>
				<p>This page displays a snapshot of account usage. You can view more detailed statistics for an individual by clicking on the user's name.</p>
				<p>Sort report by clicking on a column title. Click on the plus sign to view users within each group.</p>
				<div id="Table_num_1" class="stdtbl">
					<table class="standard_table">
						<thead>
							<tr>
								<th><b>User / Group</b></th>
								<th><b>Limit</b></th>
								<th><b>Usage</b></th>
								<th><b>Limit Left</b></th>
							</tr>
						</thead>
						<?php if (isset($report_lists) && !empty($report_lists) && (is_object($report_lists) || is_array($report_lists))): ?>
							<tbody>
								<?php foreach ($report_lists as $group): ?>
									<tr class="<?= ($alternate % 2) ? '' : 'alternate' ?>">
										<td><?= $group->name?><?= ($group->description != "") ? " - ".$group->description : "" ?></td>
										<td><?= format_ribuan($group->base_quota_campus); ?></td>
										<td><?= format_ribuan($group->usage_quota_campus) ?></td>
										<td><b><?= format_ribuan($group->limit_quota_campus) ?></b></td>
									</tr>
									<?php $alternate++?>
								<?php endforeach ?>
							</tbody>
							<tfoot>
								<tr>
									<th><b>Total</b></th>
									<th><b><?= format_ribuan($total_awal) ?></b></th>
									<th><b><?= format_ribuan($total_pakai) ?></b></th>
									<th><b><?= format_ribuan($sisa_total) ?></b></th>
								</tr>
							</tfoot>
						<?php endif ?>
					</table>
				</div>
				<?php if (isset($use_api) && $use_api === TRUE): ?>
					<div id="Table_num_2" class="stdtbl">
						<table class="standard_table">
							<thead>
								<tr>
									<th colspan="3" class="text-center"><b>Actual Limit</b></th>
								</tr>
								<tr>
									<th><b>Report Count</b></th>
									<th><b>Report Limit</b></th>
									<th><b>Limit Left</b></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<?php if (isset($actual_quota) && !empty($actual_quota) && (is_array($actual_quota) || is_object($actual_quota))): ?>
									<td><?= format_ribuan($actual_quota['report_count']) ?></td>
									<td><?= format_ribuan($actual_quota['report_limit']) ?></td>
									<td><?= format_ribuan($actual_quota['report_limit'] - $actual_quota['report_count']) ?></td>
									<?php endif ?>
								</tr>
							</tbody>
						</table>
					</div>
				<?php endif ?>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>
<div id="column_two">
	<?= Modules::run("widget_admin/settings_tips"); ?>
</div>
<div class="clear"></div>