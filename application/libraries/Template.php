<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Template 
{
	private $_template = '';
	private $template_data = array();
	
	function set($name, $value)
	{
		$this->template_data[$name] = $value;
	}

	function set_template($template)
	{
		$this->_template = $template;
	}

	function load($view = '' , $view_data = array(), $return = FALSE)
	{
		$this->CI =& get_instance();
		$this->set('contents', $this->CI->load->view($view, $view_data, TRUE));			
		return $this->CI->load->view($this->_template, $this->template_data, $return);
	}

}

/* End of file Template.php */
/* Location: ./system/application/libraries/Template.php */