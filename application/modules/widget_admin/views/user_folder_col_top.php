<div id="col1_top" class="sub_tabs">
	<?= heading($user_data->first_name . " " . $user_data->last_name,2) ?>
	<ul class="navtab">
		<li class="active">
			<a href="<?= site_url('en_us/user_file/'.$id) ?>">
				<span>Documents</span>
			</a>
		</li>
	</ul>
</div>