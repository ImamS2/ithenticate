<div id="column_three">
	<?= Modules::run("widget_admin/submit_file") ?>
	<?= Modules::run("widget_admin/new_folder"); ?>
	<?= Modules::run("widget_admin/user_add"); ?>
</div>
<div id="column_one">
	<div id="top-pager">
		<?php if (isset($pagination) && !empty($pagination)): ?>
			<?= $pagination ?>
		<?php endif ?>
	</div>
	<div id="docsTable" class="trash">
		<?= Modules::run("widget_admin/folder_col_top"); ?>
		<div class="navtab_bottom"></div>
		<div id="col1_bot">
			<?php if (isset($count_isi_trash) && $count_isi_trash > 0): ?>
				<div id="proxy_icon"></div>
				<table class="standard_table" id="docs">
					<thead>
						<tr>
							<th>
								<input type="checkbox" title="Click to select all the documents in this folder" id="selectall" class="doc">
							</th>
							<th>
							</th>
							<th><a>Title</a></th>
							<th style="text-align:center"><a>Report</a></th>
							<th><a>Author</a></th>
							<th><a>Processed</a></th>
						</tr>
					</thead>
					<?php if (isset($isi_trash) && !empty($isi_trash)): ?>
					<?php $i = 0 ?>
						<?php foreach ($isi_trash as $trash): ?>
							<tbody class="<?= ($i % 2) ? "" : "alternate" ?>">
								<tr class="<?= ($i % 2) ? "" : "alternate" ?>">
									<?php if ($trash["description"] == ""): ?>
										<td class="td_check">
											<span style="display:none;" class="item_id"><?= $trash["id"] ?></span>
											<input type="checkbox" class="select_item" name="items" value="f<?= $trash["id"] ?>">
										</td>
										<td class="td_expand">&nbsp;</td>
										<td class="folder_name">
											<a href="<?= site_url("en_us/folder/".$trash["id"]) ?>"><?= $trash["name"] ?></a>
										</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
										<td class="td_date"><?= format_ithenticate($trash["processed_time"]) ?></td>
									<?php else:?>
										<td class="td_check">
											<span style="display:none;" class="item_id"><?= $trash["id"] ?></span>
											<input class="select_item" type="checkbox" name="items" value="d<?= $trash["id"] ?>">
										</td>
										<td>&nbsp;</td>
										<td class="td_title">
											<span class="document_title document_title_<?= $trash["id"] ?>">
												<?= $trash["name"] ?>
											</span>
											<em>
												<?php if ($trash["exclude_biblio"] > 0): ?>
													<?= format_ribuan($trash["exclude_biblio"]) ?> words
												<?php endif ?>
											</em>
										</td>
										<?php if ($trash["add_to_index"] == TRUE ): ?>
											<td class="rpt">
												Processed
											</td>
										<?php else: ?>
											<?php if ($trash["exclude_small_matches"] != "Failed" ): ?>
												<?php if (!empty($trash["exclude_small_matches"])): ?>
													<td class="rpt">
														<?php if (intval($trash["exclude_small_matches"]) >= $score_change): ?>
															<span title="Remove from trash to view" style="cursor:default" class="btn btn-primary" href="<?= site_url("en_us/report/".$trash["id"]) ?>"><?= $trash["exclude_small_matches"] ?>%</span>
														<?php else: ?>
															<span title="Remove from trash to view" style="cursor:default" class="btn btn-default-alt" href="<?= site_url("en_us/report/".$trash["id"]) ?>"><?= $trash["exclude_small_matches"] ?>%</span>
														<?php endif ?>
													</td>
												<?php else: ?>
													<td class="rpt">
														Pending
													</td>
												<?php endif ?>
											<?php else: ?>
												<td class="rpt td_noreport">
													<a title="Remove from trash to view" style="" class="" href="<?= site_url("en_us/upload/uploadlog/".$trash["exclude_phrases"]) ?>"><?= $trash["exclude_small_matches"] ?></a>
												</td>
											<?php endif ?>
										<?php endif ?>
										<td class="td_author">
											<span title="<?= $trash["description"] . " " . $trash["exclude_quotes"] ?>"><?= $trash["description"] . " " . $trash["exclude_quotes"] ?>
											</span>
										</td>
										<td class="td_date">
											<span title="<?= format_ithenticate($trash["exclude_phrases"]) ?>">
												<?= format_ithenticate($trash["exclude_phrases"]) ?>
											</span>
										</td>
									<?php endif ?>
								</tr>
							</tbody>
							<?php $i++ ?>
						<?php endforeach ?>
					<?php endif ?>
				</table>
			<?php else: ?>
				<div class="generic">The trash is empty.</div>
			<?php endif ?>
		</div>
		<div class="clear"></div>
	</div>
	<?php if (isset($pagination) && !empty($pagination)): ?>
		<?= $pagination ?>
	<?php endif ?>
</div>