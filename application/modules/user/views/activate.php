<html>
	<body>
		Hello, <?= $userdata["first_name"] . " " . $userdata["last_name"]; ?>

		Welcome to <?= APPNAME ?>!  Your new account has been created.

		To get started:

		Please login using the following temporary password. You will be prompted to change this password when you first login.

		Login page:
		<?= anchor(site_url("en_us/logID/".$userdata["id"]),site_url("en_us/logID/".$userdata["id"])); ?>

			Login email: <?= $userdata["email"]; ?>
			Password: <?= $userdata["password"]; ?>

		If you have additional questions or have trouble logging in, please email us.

		Best regards,



		--
		<?= APPNAME ?> Support Team
		<?= $this->config->item("admin_email","ion_auth"); ?>
	</body>
</html>