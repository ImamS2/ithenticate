<div id="header">
	<?= heading("<em>iThenticate</em>"); ?>
	<?php if (isset($message) && !empty($message)): ?>
		<div id="message_spot">
			<span class="_inline_message message" style=""><?= $message ?></span>
		</div>
	<?php endif ?>
</div>