<?php $i = 0; ?>
<div class="folder_list" id="folder_list">
	<?= heading('<strong>My Folders</strong>',2) ?>
	<ul>
		<li class="_folder_group" id="folder_grp0">
			<span id="group0" class="folder_group" title="Administrator">
				<?= anchor(site_url("en_us/user_file"),"Administrator") ?>
			</span>
		</li>
		<?php if (isset($browse_dir) && !empty($browse_dir) && (is_object($browse_dir) || is_array($browse_dir))): ?>
			<?php foreach ($browse_dir as $dir): ?>
				<?php if (isset($dir->users) && count($dir->users) > 0): ?>
					<li class="_folder_group" id="folder_grp<?= $i ?>">
						<span id="group<?= $i ?>" class="folder_group" title="My Folders">
							<span style="" class="collapse_icon"></span>
							<a>
								<?= $dir->description ?>
							</a>
						</span>
						<div class="folders" style="">
							<ul>
								<?php foreach ($dir->users as $folders): ?>
									<?php if (is_null($this->uri->segment(3))): ?>
									<li id="folder<?= $folders->user_id ?>" class="<?= isset($home_user_file) && ($home_user_file == $folders->user_id) ? 'active' : '' ?>">
									<?php else: ?>
										<?php if (is_null($this->uri->segment(4))): ?>
										<li id="folder<?= $folders->user_id ?>" class="<?= ($this->uri->segment(3) == $folders->user_id) ? 'active' : '' ?>">
										<?php else: ?>
										<li id="folder<?= $folders->user_id ?>" class="<?= ($this->uri->segment(4) == $folders->user_id) ? 'active' : '' ?>">
										<?php endif ?>
									<?php endif ?>
										<span class="folder_options">
										</span>
										<div class="folder_name">
											<a title="<?= $folders->first_name . " " . $folders->last_name ?>" href="<?= site_url('en_us/user_file/'.$folders->user_id) ?>">
												<span><?= $folders->first_name . " " . $folders->last_name ?></span>
											</a>
										</div>
										<div class="clear"></div>
									</li>
								<?php endforeach ?>
							</ul>
						</div>
					</li>
				<?php else: ?>
					<li class="_folder_group" id="folder_grp<?= $i ?>">
						<span id="group<?= $i ?>" class="folder_group" title="<?= $dir->description ?>">
							<span style="display: none;"></span>
							<a>
								<?= $dir->description ?>
							</a>
						</span>
					</li>
				<?php endif?>
			<?php $i++ ?>
			<?php endforeach ?>
		<?php endif?>
	</ul>
</div>