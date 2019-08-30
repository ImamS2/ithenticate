<?php if ($this->ion_auth->logged_in()): ?>
<div id="nav">
	<ul class="navtab">
		<li class="<?= (($this->uri->segment(1) == "en_us" && empty($this->uri->segment(2))) || $this->uri->segment(2) == "folder" || $this->uri->segment(2) == "upload" || $this->uri->segment(2) == "group") ? "active" : "" ?>">
			<?= anchor(site_url("en_us/folder"),"<span>Folders</span>"); ?>
		</li>
		<li class="<?= ($this->uri->segment(2) == "settings") ? "active" : "" ?>">
			<?= anchor(site_url("en_us/settings"),"<span>Settings</span>"); ?>
		</li>
		<li class="<?= ($this->uri->segment(2) == "account") ? "active" : "" ?>">
			<?= anchor(site_url("en_us/account"),"<span>Account Info</span>"); ?>
		</li>
		<?php if ($this->ion_auth->is_admin()): ?>
			<li class="<?= ($this->uri->segment(2) == "user") ? "active" : "" ?>">
				<?= anchor(site_url("en_us/user"),"<span>User Management</span>"); ?>
			</li>
			<?php if ($this->ion_auth->in_group("cho admin")): ?>
				<li class="<?= ($this->uri->segment(2) == "user_file") ? "active" : "" ?>">
					<?= anchor(site_url("en_us/user_file"),"<span>User File</span>"); ?>
				</li>
			<?php endif ?>
		<?php endif ?>
	</ul>
	<div id="login">
		<?php if (isset($userdata) && !empty($userdata)): ?>
			Welcome <?= $userdata->first_name ?> <?= $userdata->last_name ?> |
		<?php endif ?>
		<?= anchor(site_url("en_us/logout"),"Logout"); ?>
		<?= anchor("https://app.ithenticate.com/en_us/help/helpdesk","<span>Help</span>",array("class" => "help_button")); ?>
	</div>
</div>
<?php endif ?>