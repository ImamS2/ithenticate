<div id="footer">
	<?= ul($list); ?>
	<p>
		Copyright © 1998-<?= date('Y') ?>
		<?= anchor("http://www.turnitin.com/","<span>Turnitin, LLC.</span>",array("class"=>"external")); ?>
		All rights reserved.
	</p>
</div>
<script type="text/javascript">
	const baseURL = "<?= base_url(); ?>";
</script>
<?php if (isset($main_js) && is_array($main_js)): ?>
	<?php foreach ($main_js as $js): ?>
		<script type="text/javascript" src="<?= site_url('assets/'.$js) ?>"></script>
	<?php endforeach ?>
<?php endif ?>