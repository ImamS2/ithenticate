<div class="side_container">
	<!-- <form action="<?= site_url('en_us/user/activated/'.$id) ?>" class="__validate" id="form3" method="post"> -->
		<div class="ip_forms">
			<h2 style="padding-left: 0;"><b>User Inactive</b></h2>
			<p>
				This iThenticate user is currently inactive. To activate this account, click on the "Activate User" button below
			</p>
			<div class="form_submit">
				<input class="btn btn-success confirmation" value="Activate User" type="submit" data-link="<?= site_url('en_us/user/activated/'.$id) ?>" data-confirm_text="Apakah anda yakin ingin mengaktifkan user ini?" data-limit_left = "<?= isset($limit_left) ? $limit_left : "" ?>">
				<div class="clear"></div>
			</div>
		</div>
	<!-- </form> -->
</div>