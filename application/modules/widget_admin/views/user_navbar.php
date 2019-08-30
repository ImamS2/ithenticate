<div id="col1_top" class="sub_tabs">
	<h2 class="users_icon"> Manage Users </h2>
	<ul class="navtab">
		<li class="<?= ($this->uri->segment(3) == "add" || $this->uri->segment(3) == "add_list" || $this->uri->segment(3) == "edit" || ($this->uri->segment(2) == "user" && $this->uri->segment(3) == "" )) ? "active" : "" ?>">
			<a href="<?= site_url('en_us/user') ?>">
				<span>Profiles</span>
			</a>
		</li>
		<?php if ($this->ion_auth->in_group('cho admin')): ?>
		<li class="<?= ($this->uri->segment(3) == "groups") ? "active" : "" ?>">
			<a href="<?= site_url('en_us/user/groups') ?>">
				<span>Groups</span>
			</a>
		</li>
		<li class="<?= ($this->uri->segment(3) == "ip_whitelist") ? "active" : "" ?>">
			<a href="<?= site_url('en_us/user/ip_whitelist') ?>">
				<span>IP Address</span>
			</a>
		</li>
		<li class="<?= ($this->uri->segment(3) == "report") ? "active" : "" ?>">
			<a href="<?= site_url('en_us/user/report') ?>">
				<span>Reports</span>
			</a>
		</li>
		<?php endif ?>
		<!-- <li class="<?= ($this->uri->segment(3) == "sharing") ? "active" : "" ?>">
			<a href="<?= site_url('en_us/user/sharing') ?>">
				<span>Sharing</span>
			</a>
		</li>
		<li class="<?= ($this->uri->segment(3) == "email") ? "active" : "" ?>">
			<a href="<?= site_url('en_us/user/email') ?>">
				<span>Email</span>
			</a>
		</li> -->
	</ul>
</div>