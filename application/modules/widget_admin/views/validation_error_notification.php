<?php if (!empty(validation_errors())): ?>
	<div class="alert alert-danger">
		<button type="button" class="close" data-dismiss="alert">
			<i class="ace-icon fa fa-times"></i>
		</button>
		<?= validation_errors(); ?>
	</div>
<?php endif ?>