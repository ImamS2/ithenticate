<!DOCTYPE html>
<html>
<head>
	<title>Kirim Pesan ke Telegram</title>
</head>
<body>
	<?= form_open(site_url("api/telegram/sendMessage")); ?>
		<?= form_input("message"); ?>
		<?= form_submit("","Kirim"); ?>
	<?= form_close(); ?>
</body>
</html>
