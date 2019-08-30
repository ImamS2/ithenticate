<?php if ($this->ion_auth->is_admin()): ?>
<div class="side_container add_users">
	<div class="item">
		<h2>Add Users</h2>
	</div>
	<p class="item"> Active Users : <?= (isset($active_users) && !empty($active_users)) ? $active_users : 0 ?> of
	<?php if ($this->ion_auth->in_group('cho admin')): ?>
	<?= $this->ion_auth->users()->num_rows() ?>
	<?php else: ?>
	<?= (isset($jumlah_user_kampus) && !empty($jumlah_user_kampus)) ? $jumlah_user_kampus : 0 ?>
	<?php endif ?>
	</p>
	<ul class="item">
		<li><a href="<?= site_url('en_us/user/add') ?>"><h3>Add New User</h3></a></li>
		<?php if ( ! $this->ion_auth->in_group('cho admin')): ?>
		<li><a href="<?= site_url('en_us/user/add_list') ?>"><span>Upload User List</span></a></li>
		<?php endif ?>
	</ul>
	<div class="clear"></div>
</div>
<?php endif ?>