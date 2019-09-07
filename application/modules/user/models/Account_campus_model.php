<?php
defined("BASEPATH") OR exit("No direct script access allowed");

/**
* 
*/
class Account_campus_model extends MY_Model
{
	protected $table = "account_campus";
	protected $pk = "id";

	function __construct()
	{
		parent::__construct();
	}
}