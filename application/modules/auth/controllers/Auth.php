<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Auth
 * @property Ion_auth|Ion_auth_model $ion_auth        The ION Auth spark
 * @property CI_Form_validation      $form_validation The form validation library
 */
class Auth extends Auth_Controller
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->library(['ion_auth', 'form_validation']);
		$this->load->helper(['url', 'language', 'html', 'inflector']);

		$this->form_validation->set_error_delimiters($this->config->item('error_start_delimiter', 'ion_auth'), $this->config->item('error_end_delimiter', 'ion_auth'));

		$this->lang->load('auth');
	}

	/**
	 * Redirect if needed, otherwise display the user list
	 */
	public function index()
	{

		if (!$this->ion_auth->logged_in())
		{
			// redirect them to the login page
			redirect("en_us" . DIRECTORY_SEPARATOR . "login", "refresh");
		}
		else
		{
			// redirect to admin page
			redirect("en_us");
		}
	}

	/**
	 * Log the user in
	 */
	public function login()
	{
		$this->data['title'] = $this->lang->line('login_heading');
		$this->data['subtitle'] = $this->lang->line('login_subheading');

		$main_css = array(
			'css/style.css',
		);

		$main_js = array(
			// 'js/ithen_site.js',
			'js/jquery.min.js',
			'js/bootstrap.js',
			'js/modernize_ie8.js',
			'js/en_us.js',
			'js/auth.js',
			// 'js/auth_anti_simpan.js',
		);

		$this->template->set('main_css',$main_css);
		$this->template->set('main_js',$main_js);

		// validate form input
		$this->form_validation->set_rules('username', $this->lang->line('login_identity_label'), 'required');
		$this->form_validation->set_rules('password', $this->lang->line('login_password_label'), 'required');

		if ($this->form_validation->run() === TRUE)
		{
			// check to see if the user is logging in
			// check for "remember me"
			$remember = (bool)$this->input->post('remember');

			if ($this->ion_auth->login($this->input->post('username'), $this->input->post('password'), $remember))
			{
				//if the login is successful
				//redirect them back to the home page
				$this->session->set_flashdata("message", $this->ion_auth->messages());
				// pre($this->session);
				redirect("en_us", 'refresh');
			}
			else
			{
				// if the login was un-successful
				// redirect them back to the login page
				$this->session->set_flashdata('message', $this->ion_auth->errors());
				redirect("en_us" . DIRECTORY_SEPARATOR . "login", 'refresh'); // use redirects instead of loading views for compatibility with MY_Controller libraries
			}
		}
		else
		{
			// the user is not logging in so display the login page
			// set the flash data error message if there is one
			$this->data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata("message");

			$this->data['login_form'] = [
				'id' => 'form0',
				'class' => '__validate',
			];

			$this->data['username_label'] = [
				'class' => 'control-label',
			];

			$this->data['password_label'] = [
				'class' => 'control-label',
			];

			$this->data['remember_me'] = [
				'name' => 'remember_me',
				'value' => "1",
				'class' => 'Checkbox __validateProfile:Checkbox',
				'id' => 'remember_me',
			];

			$this->data['username'] = [
				'name' => 'username',
				'id' => 'username',
				'type' => 'text',
				'value' => $this->form_validation->set_value('username'),
				'class' => 'Email form-control __required __validateProfile:Email',
				'autocomplete' => 'off',
			];

			$this->data['password'] = [
				'name' => 'password',
				'id' => 'password',
				'type' => 'password',
				'class' => 'EnterPassword form-control __required __validateProfile:EnterPassword',
			];

			$this->data['forgot_password'] = [
				'class' => 'label-link',
				'tabindex' => '-1',
			];

			$this->data['submit'] = [
				'value' => lang("login_submit_btn"),
				'class' => 'btn btn-primary',
			];

			// $this->_render_page('auth' . DIRECTORY_SEPARATOR . 'login', $this->data);
			$this->template->load("auth" . DIRECTORY_SEPARATOR . "login", $this->data);
		}
	}

	/**
	 * Log the user out
	 */
	public function logout()
	{
		$this->data['title'] = "Logout";
		$cek_impersonate = $this->session->has_userdata("impersonate");
		// pre($cek_impersonate);
		// exit();

		if ($cek_impersonate === TRUE) {
			Modules::load("User");
			$this->load->model("User_model");
			$this->User_model->back_to_admin();
			$this->session->set_flashdata("message","Welcome Back");
			redirect("en_us/user","refresh");
		} else {
			$this->ion_auth->logout();

			// redirect them to the login page
			$this->session->set_flashdata('message', $this->ion_auth->messages());
			redirect("en_us/login", 'refresh');
		}
	}
}
