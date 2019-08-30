<div id="column_wrapper">
	<div id="column_wrapper_inner">
		<div id="column_three"></div>
		<div id="column_one">
			<div id="top-pager"></div>
			<div class="general_header">
				<h2>Create A New Folder</h2>
				<a href="<?= site_url('en_us/folder')?>">
					<strong>Return to Folders</strong>
				</a>
				<div class="clear"></div>
			</div>
			<div id="col1_bot">
				<form accept-charset="utf-8" class="__validate" method="post" id="form0" action="<?= site_url('en_us/folder/create_folder') ?>">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input value="BD466ACC-5B6A-11E9-A3A0-F3C989E6784A" name="_token" type="hidden">
					</div>
					<div class="ip_forms">
						<fieldset>
							<?php if (isset($count_group_folders)): ?>
								<?php if ($count_group_folders > 1): ?>
									<div class="form-group ip_form_row Select ltext required">
										<div class="label">
											<label class="control-label" for="form952folder_group">
												Folder Group
												<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
											</label>
										</div>
										<div class="ip_valid_indicator">
											<select id="form952folder_group" class="Select form-control __required __validateProfile:Select" name="folder_group">
												<?php if (isset($group_folders) && !empty($group_folders) && (is_object($group_folders) || is_array($group_folders))): ?>
													<?php foreach ($group_folders as $group_folder): ?>
														<option <?= (isset($id) && $id === $group_folder["id"]) ? "selected=\"selected\"" : "" ?> value="<?= $group_folder['id'] ?>"><?= $group_folder['name'] ?></option>
													<?php endforeach ?>
												<?php endif ?>
											</select>
										</div>
									</div>
								<?php else: ?>
									<div class="form-group ip_form_row Select ltext optional">
										<div class="label">
											<label class="control-label" for="form453folder_group">
												Folder Group
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<?= $group_folders["name"] ?>
										<input class="form-control" value="<?= $group_folders["id"] ?>" name="folder_group" type="hidden">
									</div>
								<?php endif ?>
							<?php endif ?>
							<div class="form-group ip_form_row FolderName ltext required">
								<div class="label">
									<label class="control-label" for="id_name">
										Folder Name
										<img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
									</label>
								</div>
								<div class="ip_text_field">
									<div class="ip_valid_indicator">
										<input class="FolderName form-control __required __validateProfile:FolderName" name="name" type="text" id="id_name">
									</div>
								</div>
							</div>
							<div class="form-group ip_form_row Checkbox rcheck optional">
								<div class="comment">
									Check to exclude quoted text from comparison of documents submitted in this folder
								</div>
								<div class="ip_valid_indicator">
									<div class="checkbox select_box">
										<input type="checkbox" name="exclude_quotes" class="Checkbox __validateProfile:Checkbox" value="1" id="id_exclude_quotes">
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
										<input value="1" name="exclude_biblio" class="Checkbox __validateProfile:Checkbox" type="checkbox" id="id_exclude_biblio">
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
										<input id="id_exclude_phrases" class="Checkbox __validateProfile:Checkbox" name="exclude_phrases" value="1" type="checkbox">
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
										<input type="checkbox" name="limit_match_size" value="1" class="Checkbox __validateProfile:Checkbox" id="id_limit_match_size">
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
												<input name="minimum_match_word_count" class="PosInteger form-control __validateProfile:PosInteger" type="text" id="id_minimum_match_word_count">
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
										<input id="id_exclude_small_matches" value="1" class="Checkbox __validateProfile:Checkbox" name="exclude_small_matches" type="checkbox">
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
										<input onclick="set_disabled(0)" value="0" name="exclude_by_percent" type="radio" id="ex_by_per">
										<div class="label">
											<label class="control-label" for="id_exclude_word_count">
												Word Count
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<input id="id_exclude_word_count" class="PosInteger form-control __validateProfile:PosInteger" name="exclude_word_count" type="text">
											</div>
										</div> words
									</div>
									<div class="fld">
										<input id="ex_by_per1" value="1" onclick="set_disabled(1)" name="exclude_by_percent" type="radio">
										<div class="label">
											<label class="control-label" for="id_exclude_percent">
												Percentage
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
										<div class="ip_text_field">
											<div class="ip_valid_indicator">
												<input id="id_exclude_percent" class="PosInteger form-control __validateProfile:PosInteger" name="exclude_percent" type="text" disabled="">
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
										<input class="Checkbox __validateProfile:Checkbox" name="exclude_abstracts" value="1" type="checkbox" id="id_exclude_abstracts">
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
										<input type="checkbox" name="exclude_methods" class="Checkbox __validateProfile:Checkbox" value="1" id="id_exclude_methods">
										<div class="label">
											<label class="control-label" for="id_exclude_methods">
												Methods and Materials
												<img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>">
											</label>
										</div>
									</div>
								</div>
							</div>
							<input type="hidden" name="add_to_index" value="0">
						</fieldset>
						<div class="form_submit">
							<input value="Create" class="btn btn-primary" type="submit">
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
	<?= Modules::run("widget_admin/folder_directory"); ?>
</div>
<div class="clear"></div>