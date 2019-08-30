<div class="side_container">
	<!-- <form action="<?= site_url('en_us/user/banned/'.$id) ?>" class="__validate" id="form1" method="post"> -->
		<div class="ip_forms">
			<h2 style="padding-left: 0;"><b>Deactivate this User</b></h2>
			<p>
				If you would like to disable this user account click on the "Deactivate User" button below. Please note that all files associated with this user will NOT be deleted and are still viewable by Administrators.
			</p>
			<div class="form_submit">
				<input class="btn btn-danger confirmation" value="Deactivate User" type="submit" data-link="<?= site_url('en_us/user/banned/'.$id) ?>" data-confirm_text="Apakah anda yakin ingin membanned user ini?" data-limit_left = "<?= isset($limit_left) ? $limit_left : "" ?>">
				<div class="clear"></div>
			</div>
		</div>
	<!-- </form> -->
</div>