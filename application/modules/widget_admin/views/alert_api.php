<?php if (isset($response_msg) && !empty($response_msg)): ?>
	<script type="text/javascript">
		confirm("<?= $response_msg ?>");
	</script>
<?php endif ?>