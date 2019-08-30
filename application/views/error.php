<div id="column_wrapper">
	<div id="column_one">
		<div id="error_page">
			<?= heading("Sorry we could not find that page"); ?>
			<p>We're really sorry but we couldn't find that page. It's possible the page no longer exists or that you typed the page name incorrectly.</p>
			<p>The page you requested was: <strong><?= current_url() ?></strong></p>
			<?= heading("See also:",2); ?>
			<?php if (isset($list_see_also) && !empty($list_see_also) && (is_object($list_see_also) || is_array($list_see_also))): ?>
				<?= ul($list_see_also); ?>
			<?php endif ?>
			<?= heading("Contact Us",2); ?>
			<p>
				If you still can't find the page you were looking for, feel free to contact us.
			</p>
			<?php if (isset($list_contact_us) && !empty($list_contact_us) && (is_object($list_contact_us) || is_array($list_contact_us))): ?>
				<?= ul($list_contact_us); ?>
			<?php endif ?>
			<p>The technical name for this error is: <strong>404</strong></p>
		</div>
	</div>
</div>