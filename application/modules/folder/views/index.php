<div id="column_three">
	<?= Modules::run("widget_admin/submit_file") ?>
	<?= Modules::run("widget_admin/new_folder"); ?>
	<?= Modules::run("widget_admin/folder_info"); ?>
	<?= Modules::run("widget_admin/user_add"); ?>
</div>
<div id="column_one">
	<div id="top-pager">
		<?php if (isset($pagination) && !empty($pagination)): ?>
			<?= $pagination ?>
		<?php endif ?>
	</div>
	<div id="docsTable" class="folder_table">
		<?= Modules::run("widget_admin/folder_col_top"); ?>
		<div class="navtab_bottom"></div>
		<div id="col1_bot">
			<?php if (isset($count_file) && $count_file > 0): ?>
				<div id="proxy_icon"></div>
				<table class="standard_table" id="docs">
					<thead>
						<tr>
							<th>
								<input type="checkbox" title="Click to select all the documents in this folder" id="selectall" class="doc">
							</th>
							<th>
							</th>
							<th>
								<a href="<?= site_url("en_us/folder/".$id) ?>?o=title">Title</a>
							</th>
							<th style="text-align:center">
								<a href="<?= site_url("en_us/folder/".$id) ?>?o=percent_match">Report</a>
							</th>
							<th>
								<a href="<?= site_url("en_us/folder/".$id) ?>?o=last_name">Author</a>
							</th>
							<th
								><a href="<?= site_url("en_us/folder/".$id) ?>?d=1&amp;o=processed_time" class="sorted">Processed</a>
							</th>
							<?php if ($this->ion_auth->user()->row()->id == $folder["id_user"]): ?>
								<th>Actions</th>
							<?php endif ?>
						</tr>
					</thead>
					<?php $i=0; ?>
					<?php foreach ($files_list as $file): ?>
						<tbody id="dr<?= $file["id"] ?>" class="<?= ($i % 2) ? "" : "alternate" ?> inbox_item document_item _<?= $file["id"] ?>">
							<tr class="document_row <?= ($i % 2) ? "" : "alternate" ?>" id="yui-gen<?= $i ?>" data-id = "<?= $file["id_upload"] ?>" >
								<td class="td_check">
									<span style="display:none;" class="item_id"><?= $file["id"] ?></span>
									<input class="select_item" type="checkbox" name="items" value="d<?= $file["id"] ?>">
								</td>
								<td>&nbsp;</td>
								<td class="td_title">
									<span class="document_title document_title_<?= $file["id"] ?>">
										<?= $file["title"] ?>
									</span>
									<?php if ($file["words"] > 0): ?>
										<em><?= format_ribuan($file["words"]) ?> words</em>
									<?php else: ?>
										<em></em>
									<?php endif ?>
								</td>
								<!-- <?php if ($file["status"] == FALSE): ?>
									<td class="rpt">
										Processed
									</td>
								<?php else: ?>
									<?php if ($file["percent_match"] != "Failed" ): ?>
										<?php if (!empty($file["processed_time"]) || !empty($file["percent_match"])): ?>
											<?php if (isset($score_change) && intval($file["percent_match"]) >= $score_change): ?>
												<td class="rpt">
													<a target="_blank" class="btn btn-primary" href="<?= site_url("en_us/report/".$file["id"]) ?>">
														<?= intval($file["percent_match"]) ?>%
													</a>
												</td>
											<?php else: ?>
												<td class="rpt">
													<a target="_blank" class="btn btn-default-alt" href="<?= site_url("en_us/report/".$file["id"]) ?>">
														<?= intval($file["percent_match"]) ?>%
													</a>
												</td>
											<?php endif ?>
										<?php else: ?>
											<td class="rpt">
												Savings
											</td>
										<?php endif ?>
									<?php else: ?>
										<td class="rpt td_noreport">
											<a href="<?= site_url("en_us/upload/uploadlog/".$file["uploaded_on"]) ?>">
												Failed
											</a>
										</td>
									<?php endif ?>
								<?php endif ?> -->
								<?php if (isset($file["status"])): ?>
									<?php switch ($file["status"]) {
										case "0":
											echo "<td class=\"rpt\">";
											echo "Processed";
											echo "</td>";
											break;

										case "1":
											echo "<td class=\"rpt\">";
											if (!empty($file["processed_time"]) || !empty($file["percent_match"])) {
												if (isset($score_change) && intval($file["percent_match"]) >= $score_change) {
													echo "<a target=\"_blank\" class=\"btn btn-primary\" href="?><?= site_url("en_us/report/".$file["id"]) ?><?= ">";
												} else {
													echo "<a target=\"_blank\" class=\"btn btn-default-alt\" href="?><?= site_url("en_us/report/".$file["id"]) ?><?= ">";
												}
													echo intval($file["percent_match"]) . "%";
													echo "</a>";
											} else {
												echo "Savings";
											}
											echo "</td>";
											break;

										case "-1":
											echo "<td class=\"rpt td_noreport\">";
											echo anchor(site_url("en_us/upload/uploadlog/".$file["uploaded_on"]),"Failed");
											echo "</td>";
											break;
										
										default:
											break;
									} ?>
								<?php endif ?>
								<td class="td_author">
									<?php if (!empty($file["author_first"]) && !empty($file["author_last"])): ?>
										<span title="<?= $file["author_first"]." ".$file["author_last"] ?>">
											<?= $file["author_first"]." ".$file["author_last"] ?>
										</span>
									<?php endif ?>
								</td>
								<td class="td_date">
									<?php if (!empty($file["processed_time"])): ?>
										<span title="<?= format_ithenticate($file["processed_time"]) ?>">
											<?= format_ithenticate($file["processed_time"]) ?>
										</span>
									<?php endif ?>
								</td>
								<?php if ($userdata->id == $folder["id_user"]): ?>
									<td class="td_options">
										<div class="folder_options">
											<span style="display: block;">
												<a href="<?= site_url("en_us/document/trash/".$file["id"]) ?>">
													<img src="<?= site_url("assets/images/trashcan.gif")?>" alt="Trash" title="Move to trash"></a>
												<a href="<?= site_url("en_us/document/edit/".$file["id"]) ?>">
													<img src="<?= site_url("assets/images/edit.gif")?>" alt="Edit" title="Document properties and resubmission schedule">
												</a>
											</span>
										</div>
									</td>
								<?php endif ?>
							</tr>
						</tbody>
						<?php $i++ ?>
					<?php endforeach ?>
				</table>
			<?php else: ?>
				<div class="generic">
					This folder is empty
					<?php if ($this->ion_auth->user()->row()->id == $folder["id_user"]): ?>:
						<a href="<?= site_url("en_us/upload/".$id) ?>">Submit a document</a>
					<?php endif ?>
				</div>
			<?php endif ?>
		</div>
		<div class="clear"></div>
	</div>
	<?php if (isset($pagination) && !empty($pagination)): ?>
		<?= $pagination ?>
	<?php endif ?>
</div>