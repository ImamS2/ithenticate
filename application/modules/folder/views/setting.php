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
				<?= Modules::run("widget_admin/secondary_navtab_folder"); ?>
				<div id="col1_bot">
					<form accept-charset="utf-8" class="__validate" id="form0" method="post" action="<?= site_url('en_us/folder/settings/'.$id) ?>">
						<?= Modules::run("widget_admin/error_form"); ?>
						<div>
							<input value="04B23E2C-5B6B-11E9-B34C-8FFF1BEF6708" name="_token" type="hidden">
						</div>
						<div class="ip_forms">
							<div class="form-group ip_form_row FolderName ltext required">
								<div class="label">
									<label class="control-label" for="id_name">
										Folder Name
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<?php if (isset($folder) && !empty($folder)): ?>
											<input type="text" id="id_name" name="name" value="<?= $folder['name'] ?>" class="FolderName form-control __required __validateProfile:FolderName">
										<?php endif ?>
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude quoted text from comparison of documents submitted in this folder
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['exclude_quotes'] == 0): ?>
												<input value="1" class="Checkbox __validateProfile:Checkbox" name="exclude_quotes" type="checkbox" id="id_exclude_quotes">
											<?php else: ?>
												<input value="1" class="Checkbox __validateProfile:Checkbox" name="exclude_quotes" type="checkbox" id="id_exclude_quotes" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_exclude_quotes">
												Exclude quotes
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude bibliography from comparison of documents submitted in this folder
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['exclude_biblio'] == 0): ?>
												<input name="exclude_biblio" value="1" class="Checkbox __validateProfile:Checkbox" type="checkbox" id="id_exclude_biblio">
											<?php else: ?>
												<input name="exclude_biblio" value="1" class="Checkbox __validateProfile:Checkbox" type="checkbox" id="id_exclude_biblio" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_exclude_biblio">
												Exclude bibliography
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude phrases associated with this folder (or with your account) from comparison of documents submitted in this folder
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['exclude_phrases'] == 0): ?>
												<input type="checkbox" id="id_exclude_phrases" value="1" class="Checkbox __validateProfile:Checkbox" name="exclude_phrases">
											<?php else: ?>
												<input type="checkbox" id="id_exclude_phrases" value="1" class="Checkbox __validateProfile:Checkbox" name="exclude_phrases" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_exclude_phrases">
												Exclude Phrases
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude match instances from reports that are below the set word count.
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['limit_match_size'] == 0): ?>
												<input id="id_limit_match_size" type="checkbox" class="Checkbox __validateProfile:Checkbox" value="1" name="limit_match_size">
											<?php else: ?>
												<input id="id_limit_match_size" type="checkbox" class="Checkbox __validateProfile:Checkbox" value="1" name="limit_match_size" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_limit_match_size">
												Exclude Small Matches
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<div id="limit_match_size" style="display: none;">
								<fieldset class="form-inline fieldset-nested">
									<legend>Set match exclusion threshold:</legend>
									<p>Exclude all match instances below the set threshold from reports.</p>
									<div class="fld form-group rcheck optional">
										<div class="label">
											<label class="control-label" for="id_minimum_match_word_count">
												Word Count
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<?php if (isset($folder) && !empty($folder)): ?>
													<input type="text" id="id_minimum_match_word_count" name="minimum_match_word_count" value="<?= $folder['minimum_match_word_count'] ?>" class="PosInteger form-control __validateProfile:PosInteger">
												<?php endif ?>
											</div>
										</div> words
									</div>
								</fieldset>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude sources below the set thresholds from reports.
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['exclude_small_matches'] == 0): ?>
												<input class="Checkbox __validateProfile:Checkbox" value="1" name="exclude_small_matches" id="id_exclude_small_matches" type="checkbox">
											<?php else: ?>
												<input class="Checkbox __validateProfile:Checkbox" value="1" name="exclude_small_matches" id="id_exclude_small_matches" type="checkbox" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_exclude_small_matches">
												Exclude Small Sources
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<div id="exclude_small_matches" style="display: none;">
								<fieldset class="form-inline fieldset-nested">
									<legend>Exclude Sources by:</legend>
									<p>Based on a source's total match percentage or match word count.</p>
									<div class="fld">
										<input type="radio" id="ex_by_per" name="exclude_by_percent" onclick="set_disabled(0)" value="0" checked="checked">
										<div class="label">
											<label class="control-label" for="id_exclude_word_count">
												Word Count
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<?php if (isset($folder) && !empty($folder)): ?>
													<input name="exclude_word_count" value="<?= $folder['exclude_word_count'] ?>" class="PosInteger form-control __validateProfile:PosInteger" type="text" id="id_exclude_word_count">
												<?php endif ?>
											</div>
										</div> words
									</div>
									<div class="fld">
										<input id="ex_by_per1" type="radio" value="1" onclick="set_disabled(1)" name="exclude_by_percent">
										<div class="label">
											<label class="control-label" for="id_exclude_percent">
												Percentage
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<?php if (isset($folder) && !empty($folder)): ?>
													<input id="id_exclude_percent" type="text" class="PosInteger form-control __validateProfile:PosInteger" value="<?= $folder['exclude_percent'] ?>" name="exclude_percent" disabled="">
												<?php endif ?>
											</div>
										</div> %
									</div>
								</fieldset>
							</div>
							<h3>Exclude Sections:</h3>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude the Abstract from comparison of documents submitted to this folder.
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['exclude_abstracts'] == 0): ?>
												<input name="exclude_abstracts" value="1" class="Checkbox __validateProfile:Checkbox" type="checkbox" id="id_exclude_abstracts">
											<?php else: ?>
												<input name="exclude_abstracts" value="1" class="Checkbox __validateProfile:Checkbox" type="checkbox" id="id_exclude_abstracts" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_exclude_abstracts">
												Abstract
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude the Methods and Materials section from comparison of documents submitted to this folder. Includes variations: Method, Methods, Materials and Methods
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<?php if (isset($folder) && !empty($folder)): ?>
											<?php if ($folder['exclude_methods'] == 0): ?>
												<input class="Checkbox __validateProfile:Checkbox" value="1" name="exclude_methods" id="id_exclude_methods" type="checkbox">
											<?php else: ?>
												<input class="Checkbox __validateProfile:Checkbox" value="1" name="exclude_methods" id="id_exclude_methods" type="checkbox" checked="checked">
											<?php endif ?>
										<?php endif ?>
										<div class="label">
											<label class="control-label" for="id_exclude_methods">
												Methods and Materials
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<input type="hidden" name="add_to_index" value="1">
							<div class="form_submit">
								<?= form_submit($update_setting_btn); ?>
								<?= anchor(site_url("en_us/folder"),"Cancel",array("class" => "btn btn-link")); ?>
								<div class="clear"></div>
							</div>
						</div>
 					</form>
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