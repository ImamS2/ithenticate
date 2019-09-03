<?php if (isset($response_msg) && !empty($response_msg)): ?>
	<script type="text/javascript">
		let r = confirm("<?= $response_msg ?>");
		let link = "<?= site_url($link_manual) ?>";
		let uri_string = "<?= $uri_string ?>";
		if (r == true) {
			// window.location = link;
			window.location = link + "?uri=" + uri_string;
		}
	</script>
<?php endif ?>