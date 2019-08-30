<div id="col1_top" class="sub_tabs">
	<?= heading("Settings",2,array("class" => "settings_header")); ?>
	<ul class="navtab">
		<li title="General application settings" class="<?= (($this->uri->segment(2) === "settings") && (empty($this->uri->segment(3)))) ? "active" : "" ?>">
			<?= anchor(site_url("en_us/settings"),"<span>General</span>"); ?>
		</li>
		<li title="Default sort, score threshold color" class="<?= (($this->uri->segment(2) === "settings") && ($this->uri->segment(3) === "document")) ? "active" : "" ?>">
			<?= anchor(site_url("en_us/settings/document"),"<span>Documents</span>"); ?>
		</li>
		<?php if ($this->ion_auth->in_group("cho admin")): ?>
			<li title="APP Application Usage" class="<?= ((($this->uri->segment(2) === "settings") && ($this->uri->segment(3) === "app_setting")) || ($this->uri->segment(2) === "settings") && ($this->uri->segment(3) === "add_api")) ? "active" : "" ?>">
				<?= anchor(site_url("en_us/settings/app_setting"),"<span>APP Setting</span>"); ?>
			</li>
		<?php endif ?>
	</ul>
</div>