<html>
	<body>
		Hello, <?= $userdata["first_name"] . " " . $userdata["last_name"]; ?>
		<br>
		<br>

		Welcome to <?= APPNAME ?>!  Your new account has been created.
		<br>
		<br>

		To get started:
		<br>
		<br>

		Please login using the following temporary password. You will be prompted to change this password when you first login.
		<br>
		<br>

		Login page:
		<br>
		<?= anchor(site_url("en_us/login/".$activation),site_url("en_us/login/".$activation)); ?>
		<br>
		<br>

			<span style="text-indent: 20px;">Login email: <?= $userdata["email"]; ?></span>
		<br>
			<span style="text-indent: 20px;">Password: <?= $userdata["password"]; ?></span>
		<br>
		<br>

		If you have additional questions or have trouble logging in, please email us.
		<br>
		<br>

		Best regards,
		<br>
		<br>


		<footer>
			--
			<br>
			<?= APPNAME ?> Support Team
			<br>
			<?= $this->config->item("admin_email","ion_auth"); ?>
			<br>
		</footer>
	</body>
</html>