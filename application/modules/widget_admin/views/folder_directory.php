<?php $i = 0; ?>
<div class="folder_list" id="folder_list">
	<?= heading("<strong>My Folders</strong>",2); ?>
	<ul>
		<?php if (isset($browse_dir) && !empty($browse_dir) && (is_object($browse_dir) || is_array($browse_dir))): ?>
			<?php foreach ($browse_dir as $group_folders): ?>
			<?php if (isset($group_folders["subs"]) && count($group_folders["subs"]) > 0): ?>
			<li class="_folder_group <?= $this->uri->segment(2) == "group" && $this->uri->segment(4) == $group_folders["id"] ? "active" : "" ?> " id="folder_grp<?= $i ?>">
				<span id="group<?= $group_folders["id"] ?>" class="folder_group" title="My Folders">
					<span style="" class="collapse_icon"></span>
					<a href="<?= site_url("en_us/group/folders/".$group_folders["id"]) ?>">
						<?= $group_folders["name"] ?>
					</a>
				</span>
				<div class="folders" style="">
					<ul>
						<?php foreach ($group_folders["subs"] as $folders): ?>
							<?php if (is_null($this->uri->segment(3))): ?>
								<li id="folder<?= $folders["id"] ?>" class="<?= isset($temp_id) && ($temp_id == $folders["id"]) ? "active" : "" ?>" >
							<?php else: ?>
								<?php if (is_null($this->uri->segment(4))): ?>
								<li id="folder<?= $folders["id"] ?>" class="<?= ($this->uri->segment(3) == $folders["id"]) ? "active" : "" ?>" >
								<?php else: ?>
								<li id="folder<?= $folders["id"] ?>" class="<?= ($this->uri->segment(4) == $folders["id"]) ? "active" : "" ?>" >
								<?php endif ?>
							<?php endif ?>
							<span class="folder_options">
								<a href="<?= site_url("en_us/folder/delete/".$folders["id"]) ?>"><img src="<?= site_url("assets/images/trashcan.gif")?>" alt="Trash" title="Move to Trash"></a>
							</span>
							<div class="folder_name">
								<a title="<?= $folders["name"] ?>" href="<?= site_url("en_us/folder/".$folders["id"]) ?>">
									<span><?= $folders["name"] ?></span>
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
				<span id="group<?= $group_folders["id"] ?>" class="folder_group" title="<?= $group_folders["name"] ?>">
					<span style="display: none;"></span>
					<a href="<?= site_url("en_us/group/folders/".$group_folders["id"]) ?>">
						<?= $group_folders["name"] ?>
					</a>
				</span>
			</li>
			<?php endif ?>
			<?php $i++ ?>
			<?php endforeach ?>
		<?php endif ?>
		<?php if (isset($share_folders) && count($share_folders) > 0): ?>
			<?php foreach ($share_folders as $users_shares): ?>
			<li class="_folder_group" id="folder_grp">
				<span class="folder_group" id="group" title="<?= $users_shares->first_name . " " . $users_shares->last_name  ?>">
					<span style="" class="collapse_icon"></span>
					<a href="<?= site_url("en_us/folder/users/".$users_shares->shared_id_user) ?>">
						<?= $users_shares->first_name . " " . $users_shares->last_name  ?>
					</a>
				</span>
				<?php if (isset($users_shares->folders) && !empty($users_shares->folders)): ?>
					<div class="folders" style="">
						<ul>
							<?php foreach ($users_shares->folders as $folders): ?>
								<li id="folder<?= $folders->id_folder ?>" class="<?= ($this->uri->segment(3) == $folders->id_folder) ? "active" : "" ?>">
									<span class="folder_options">
									</span>
									<div class="folder_name">
										<a title="<?= $folders->name_folder ?>" href="<?= site_url("en_us/folder/".$folders->id_folder) ?>">
											<span><?= $folders->name_folder ?></span>
										</a>
									</div>
									<div class="clear"></div>
								</li>
							<?php endforeach ?>
						</ul>
					</div>
				<?php endif ?>
			</li>
			<?php endforeach ?>
		<?php endif ?>
		<?php if (isset($trash) && !empty($trash) && (is_object($trash) || is_array($trash))): ?>
			<li id="trash_folder" class="trashcan">
				<span class="folder_group" title="<?= $trash->name ?>">
					<a href="<?= site_url("en_us/folder/".$trash->id) ?>">
						<?= $trash->name ?>
					</a>
				</span>
			</li>
		<?php endif ?>
	</ul>
</div>
<div class="clear"></div>