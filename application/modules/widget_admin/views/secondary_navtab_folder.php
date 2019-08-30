<ul class="secondary_tab_nav">
	<li class="<?= ($this->uri->segment(3)=="settings") ? 'active' : '' ?>">
		<a href="<?= site_url('en_us/folder/settings/'.$id) ?>">
			<span>Folder Options</span>
		</a>
	</li>
	<!-- <li class="<?= ($this->uri->segment(3)=="url_filter") ? 'active' : '' ?>">
		<a href="<?= site_url('en_us/folder/url_filter/'.$id) ?>">
			<span>Report Filters</span>
		</a>
	</li>
	<li class="<?= ($this->uri->segment(3)=="excludephrase") ? 'active' : '' ?>">
		<a href="<?= site_url('en_us/folder/excludephrase/'.$id) ?>">
			<span>Phrase Exclusions</span>
		</a>
	</li> -->
</ul>