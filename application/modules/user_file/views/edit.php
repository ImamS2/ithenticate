<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<div id="col1_top" class="sub_tabs">
				<h2 class="document_header">Document Properties</h2>
				<ul class="navtab">
					<li class="active">
						<a href="<?= site_url("en_us/user_file/edit/".$id) ?>">
							<span>Properties</span>
						</a>
					</li>
				</ul>
			</div>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form accept-charset="utf-8" method="post" id="form0" class="__validate" enctype="multipart/form-data" action="<?= site_url("en_us/user_file/edit/".$id) ?>">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input name="_token" type="hidden" value="D6DEF1FA-6666-11E9-8B3C-7F13A3D338EB">
					</div>
					<div class="form-group ip_form_row percent_match ltext optional">
						<div class="label">
							<label class="control-label" for="form492percent_match">Percent Match <img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>"></label>
						</div>
						<div class="ip_text_field">
							<div class="ip_valid_indicator">
								<input type="text" value="<?= ($file->percent_match == 0) ? "" : $file->percent_match ?>" name="percent_match" class="percent_match form-control __validateProfile:percent_match" id="form492percent_match">
							</div>
						</div>
					</div>
					<div class="form-group ip_form_row status ltext optional">
						<div class="label">
							<label class="control-label" for="form492status">Status <img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>"></label>
						</div>
						<div class="ip_text_field">
							<div class="ip_valid_indicator">
								<input type="text" value="<?= ($file->status == "") ? "" : $file->status ?>" name="status" class="status form-control __validateProfile:status" id="form492words">
							</div>
						</div>
					</div>
					<div class="form-group ip_form_row words ltext optional">
						<div class="label">
							<label class="control-label" for="form492words">Words Count <img class="is_optional" alt="(optional)" src="<?= site_url('assets/images/transparent.gif')?>"></label>
						</div>
						<div class="ip_text_field">
							<div class="ip_valid_indicator">
								<input type="text" value="<?= ($file->words == 0) ? "" : $file->words ?>" name="words" class="words form-control __validateProfile:words" id="form492words">
							</div>
						</div>
					</div>
					<div class="ip_forms">
						<div class="form-group ip_form_row Select rradio required">
							<fieldset>
								<legend>
									Pending <img title="required" class="is_required" alt="(required)" src="<?= site_url('assets/images/asterick.gif')?>">
								</legend>
								<div class="comment">
									Status file is pending or not
								</div>
								<div class="ip_valid_indicator __required">
									<div class="radio select_box">
										<input id="form846pending3" type="radio" name="is_pending" value="1" <?= ($file->is_pending == TRUE ? "checked='checked'": "") ?> class="Select">
										<div class="label">
											<label class="control-label" for="form846pending3">Pending</label>
										</div>
									</div>
									<div class="radio select_box">
										<input id="form846pending4" type="radio" name="is_pending" value="0" <?= ($file->is_pending == FALSE ? "checked='checked'": "") ?> class="Select">
										<div class="label">
											<label class="control-label" for="form846pending4">Not Pending</label>
										</div>
									</div>
								</div>
							</fieldset>
						</div>
						<p class="paragraph-label">Upload PDF Report file here : </p>
						<div class="form-group ip_form_row File ltext optional">
							<div class="ip_file_field">
								<div class="ip_valid_indicator">
									<div class="fileuploader fileuploader-theme-default">
										<input type="file" name="file_pdf" class="File form-control __validateProfile:File" id="form673file_pdf" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
									</div>
								</div>
							</div>
						</div>
						<p class="paragraph-label">Upload HTML Report file here : </p>
						<div class="form-group ip_form_row File ltext optional">
							<div class="ip_file_field">
								<div class="ip_valid_indicator">
									<div class="fileuploader fileuploader-theme-default">
										<input type="file" name="file_html" class="File form-control __validateProfile:File" id="form673file_html" style="position: absolute; z-index: -9999; height: 0px; width: 0px; padding: 0px; margin: 0px; line-height: 0; outline: 0px; border: 0px; opacity: 0;">
									</div>
								</div>
							</div>
						</div>
						<div class="form_submit">
							<input class="btn btn-primary" type="submit" value="Update">
							<a href="<?= site_url("en_us/user_file") ?>" class="btn btn-link">Cancel</a>
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
	<div class="side_container info">
		<?= heading("Document Information",2); ?>
		<?php if (isset($file) && !empty($file) && (is_array($file) || is_object($file))): ?>
		<dl>
			<dt>Uploaded:</dt>
			<dd><?= format_ithenticate($file->uploaded_on) ?></dd>
			<dt>Filename:</dt>
			<dd><?= $file->ori_name ?></dd>
			<dt>Download File:</dt>
			<dd>
				<?= anchor(site_url("en_us/user_file/download/".$id),"Download Here",array("class"=>"btn btn-sm btn-primary")) ?>
			</dd>
		</dl>
		<?php endif ?>
		<div class="clear"></div>
	</div>
	<div class="clear"></div>
</div>
<div class="clear"></div>