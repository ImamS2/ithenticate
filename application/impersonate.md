  /**
	 * impersonate
	 *
	 * @return bool
	 * @author Nuri
	 **/
	public function impersonate($identity)
	{

    $admin = check_admin();

		if ( $admin ) {

			$query = $this->db->select($this->identity_column . ', username, email, id, active, last_login')
			                  ->where($this->identity_column, $this->db->escape_str($identity))
			                  ->limit(1)
			                  ->get($this->tables['users']);

			if ($query->num_rows() === 1)
			{
				$user = $query->row();

				$session_data = array(
				    'identity'             => $user->{$this->identity_column},
				    'username'             => $user->username,
				    'email'                => $user->email,
				    'user_id'              => $user->id, //everyone likes to overwrite id so we'll use user_id
				    'impersonating'        => true
				);

				$this->session->set_userdata($session_data);

				return TRUE;
			}

		} else {

			return FALSE;

		}

	}