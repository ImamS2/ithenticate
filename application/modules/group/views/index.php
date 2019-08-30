<div id="column_three">
	<?= Modules::run("widget_admin/new_folder"); ?>
</div>
<div id="column_one">
	<div id="top-pager">
		<?php if (isset($pagination) && !empty($pagination)): ?>
			<?= $pagination ?>
		<?php endif ?>
	</div>
	<div id="docsTable" class="groups">
		<?= Modules::run("widget_admin/group_folder_col_top"); ?>
		<div class="navtab_bottom"></div>
		<div id="col1_bot">
			<?php if (isset($count_folder)): ?>
				<?php if ($count_folder > 0): ?>
					<table class="standard_table" id="docs">
						<thead>
							<tr>
								<th>
									<input type="checkbox" title="Click to select all folders for toolbar action" id="selectall" class="doc">
								</th>
								<th>
									<a href="<?= site_url('en_us/group/folders/'.$id) ?>?d=1&amp;o=name" class="sorted" title="Click to sort by this column">Title</a>
								</th>
								<th>
									<a href="<?= site_url('en_us/group/folders/'.$id) ?>?o=setup_time">Date Created</a>
								</th>
							</tr>
						</thead>
						<?php $i = 1 ?>
						<?php if (isset($folders) && !empty($folders) && (is_object($folders) || is_array($folders))): ?>
							<?php foreach ($folders as $folder): ?>
								<tbody class="middle <?= ($i % 2) ? 'alternate' : '' ?> inbox_item folder_item _<?= $folder['id'] ?>">
									<tr class="folder_row <?= ($i % 2) ? 'alternate' : '' ?> middle" id="yui-gen<?= $i ?>">
										<td class="td_check">
											<span class="item_id" style="display: none;"><?= $folder['id'] ?></span>
											<input class="select_item" type="checkbox" title="Click to select this folder for toolbar action" name="items" value="f<?= $folder['id'] ?>">
										</td>
										<td class="folder_name">
											<a href="<?= site_url('en_us/folder/'.$folder['id']) ?>">
												<?= $folder['name'] ?>
											</a>
										</td>
										<td>
											<?php if (function_exists("format_ithenticate")): ?>
												<?= format_ithenticate($folder['created_at']) ?>
											<?php else: ?>
												<?= $folder['created_at'] ?>
											<?php endif ?>
										</td>
									</tr>
								</tbody>
								<?php $i++ ?>
							<?php endforeach ?>
						<?php endif ?>
					</table>
				<?php else: ?>
					<div class="generic">
						<h3>This group is empty</h3>
						<ul>
							<li>
								<a href="<?= site_url('en_us/folder/new_folder/'.$id) ?>">
									Create a folder
								</a>
							</li>
							<li>
								<a href="<?= site_url('en_us/group/remove/'.$id) ?>">
									Remove this empty group
								</a>
							</li>
						</ul>
					</div>
				<?php endif ?>
			<?php endif ?>
		</div>
		<div class="clear"></div>
	</div>
	<?php if (isset($pagination) && !empty($pagination)): ?>
		<?= $pagination ?>
	<?php endif ?>
</div>