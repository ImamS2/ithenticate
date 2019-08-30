<div id="column_wrapper">
	<div id="column_one">
		<div id="docsTable">
			<div id="col1_top" class="sub_tabs">
				<h2 class="document_header">Document Properties</h2>
				<ul class="navtab">
					<li class="active">
						<a href="<?= site_url("en_us/document/edit/".$id) ?>">
							<span>Properties</span>
						</a>
					</li>
				</ul>
			</div>
			<div class="navtab_bottom"></div>
			<div id="col1_bot">
				<form accept-charset="utf-8" method="post" id="form0" class="__validate" action="<?= site_url("en_us/document/edit/".$id) ?>">
					<?= Modules::run("widget_admin/error_form"); ?>
					<div>
						<input name="_token" type="hidden" value="D6DEF1FA-6666-11E9-8B3C-7F13A3D338EB">
					</div>
					<div class="ip_forms">
						<div class="form-group ip_form_row DocTitle ltext required">
							<div class="label">
								<label class="control-label" for="form_title">
									Document Title
									<img title="required" class="is_required" alt="(required)" src="<?= site_url("assets/images/asterick.gif")?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input class="DocTitle form-control __required __validateProfile:DocTitle" id="form_title" name="title" type="text" value="<?= (isset($file) && !empty($file)) ? $file["title"] : "" ?>">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Author ltext optional">
							<div class="label">
								<label class="control-label" for="form_author_first">
									Author First Name
									<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input value="<?= (isset($file) && !empty($file)) ? $file["author_first"] : "" ?>" type="text" name="author_first" id="form_author_first" class="Author form-control __validateProfile:Author">
								</div>
							</div>
						</div>
						<div class="form-group ip_form_row Author ltext optional">
							<div class="label">
								<label class="control-label" for="form_author_last">
									Author Last Name
									<img class="is_optional" alt="(optional)" src="<?= site_url("assets/images/transparent.gif")?>">
								</label>
							</div>
							<div class="ip_text_field">
								<div class="ip_valid_indicator">
									<input type="text" value="<?= (isset($file) && !empty($file)) ? $file["author_last"] : "" ?>" name="author_last" class="Author form-control __validateProfile:Author" id="form_author_last">
								</div>
							</div>
						</div>
						<div class="form_submit">
							<input class="btn btn-primary" type="submit" value="Update">
							<a href="<?= site_url("en_us/folder/". isset($file) && !empty($file) ? $file["id_folder"] : "") ?>" class="btn btn-link">Cancel</a>
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
			<dd><?= format_ithenticate($file["uploaded_on"]) ?></dd>
			<dt>Filename:</dt>
			<dd><?= $file["ori_name"] ?></dd>
			<dt>Folder:</dt>
			<dd>
				<a href="<?= site_url("en_us/folder/".$file["id_folder"]) ?>">
					<?= $file["folder_name"] ?>
				</a>
			</dd>
		</dl>
		<?php endif ?>
		<div class="clear"></div>
	</div>
	<div class="clear"></div>
</div>
<div class="clear"></div>