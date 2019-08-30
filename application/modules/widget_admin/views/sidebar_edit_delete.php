<div class="side_container">
	<!-- <form action="<?= site_url('en_us/user/delete/'.$id) ?>" class="__validate" id="form2" method="post"> -->
		<div class="ip_forms">
			<h2 style="padding-left: 0;"><b>Delete This User</b></h2>
			<p>
				If you would like permanently delete this user click on the "Delete User" button below. Please note that all the files associated with this user will no longer be accessible.
			</p>
			<div class="form_submit">
				<input class="btn btn-danger confirmation" value="Delete User" type="submit" data-link="<?= site_url('en_us/user/delete/'.$id) ?>" data-confirm_text="Apakah anda yakin ingin menghapus user ini?" data-limit_left = "<?= isset($limit_left) ? $limit_left : "" ?>">
				<div class="clear"></div>
			</div>
		</div>
	<!-- </form> -->
</div>