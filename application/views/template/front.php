<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>
			<?= isset($title) ? $title : "" ?>
		</title>
		<?php if (isset($icon) && file_exists($icon)): ?>
		<link rel="shorcut icon" href="<?= site_url($icon) ?>">
		<?php endif ?>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<?php if (isset($main_css) && !empty($main_css) && is_array($main_css)): ?>
			<?php foreach ($main_css as $css): ?>
				<link rel="stylesheet" href="<?= site_url("assets/$css") ?>">
			<?php endforeach ?>
		<?php endif ?>
		<?php if (isset($js_up) && !empty($js_up) && is_array($js_up)): ?>
			<?php foreach ($js_up as $js): ?>
				<script src="<?= site_url("assets/$js") ?>"></script>
			<?php endforeach ?>
		<?php endif ?>
		<script>
			hsjQuery = window['jQuery'];
		</script>
	</head>
	<body class="<?= (isset($body_class) && !empty($body_class)) ? $body_class : "" ?>" style="" cz-shortcut-listen="true">
		<section class="eyebrow">
			<div class="container">
				<div class="row">
					<div class="span9">
						<a href="<?= site_url() ?>">
							<img src="<?= site_url('assets/images/ith-logo.webp') ?>" alt="iThenticate Logo">
						</a>
						<nav>
							<span id="hs_cos_wrapper_web_page_navigation" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_menu" style="" data-hs-cos-general-type="widget" data-hs-cos-type="menu">
								<div id="hs_menu_wrapper_web_page_navigation" class="hs-menu-wrapper active-branch flyouts hs-menu-flow-horizontal" role="navigation" data-sitemap-name="default" data-menu-id="2569028672" aria-label="Navigation Menu">
									<ul>
										<li class="hs-menu-item hs-menu-depth-1 hs-item-has-children" role="menu">
											<a href="http://www.ithenticate.com/products" aria-haspopup="true" aria-expanded="false" role="menuitem">Products</a>
											<ul class="hs-menu-children-wrapper">
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/products/whats-new" role="menuitem">What's New</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/products/faqs" role="menuitem">FAQ</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/view-demo" role="menuitem">Demo</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/products/crossref-similarity-check" role="menuitem">Crossref</a>
												</li>
											</ul>
										</li>
										<li class="hs-menu-item hs-menu-depth-1 hs-item-has-children" role="menu">
											<a href="http://www.ithenticate.com/content" aria-haspopup="true" aria-expanded="false" role="menuitem">Content</a>
											<ul class="hs-menu-children-wrapper">
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/search?q=" role="menuitem">Search Journals</a>
												</li>
											</ul>
										</li>
										<li class="hs-menu-item hs-menu-depth-1 hs-item-has-children" role="menu">
											<a href="http://www.ithenticate.com/customers" aria-haspopup="true" aria-expanded="false" role="menuitem">Customers</a>
											<ul class="hs-menu-children-wrapper">
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/resources/government" role="menuitem">Government</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/resources/medical-research" role="menuitem">Medical</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/resources/academic" role="menuitem">Academic</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/customers/success-stories" role="menuitem">Success Stories</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/customers/reviews" role="menuitem">Reviews</a>
												</li>
												<li class="hs-menu-item hs-menu-depth-2">
													<a href="http://www.ithenticate.com/admissions" role="menuitem">Admissions</a>
												</li>
											</ul>
										</li>
										<li class="hs-menu-item hs-menu-depth-1 hs-item-has-children" role="menu">
											<a href="http://www.ithenticate.com/resources" aria-haspopup="true" aria-expanded="false" role="menuitem">Resources</a>
											<ul class="hs-menu-children-wrapper">
												<li class="hs-menu-item hs-menu-depth-2"><a href="http://www.ithenticate.com/resources/papers" role="menuitem">Papers &amp; Reports</a></li>
												<li class="hs-menu-item hs-menu-depth-2"><a href="http://www.ithenticate.com/plagiarism-detection-blog" role="menuitem">Blog</a></li>
												<li class="hs-menu-item hs-menu-depth-2"><a href="http://www.ithenticate.com/resources/webcasts" role="menuitem">Webcasts</a></li>
												<li class="hs-menu-item hs-menu-depth-2"><a href="http://www.ithenticate.com/training" role="menuitem">Training</a></li>
											</ul>
										</li>
										<li class="hs-menu-item hs-menu-depth-1 hs-item-has-children" role="menu"><a href="http://www.ithenticate.com/about" aria-haspopup="true" aria-expanded="false" role="menuitem">About</a>
											<ul class="hs-menu-children-wrapper">
												<li class="hs-menu-item hs-menu-depth-2"><a href="http://www.ithenticate.com/press" role="menuitem">Press Releases</a></li>
												<li class="hs-menu-item hs-menu-depth-2"><a href="http://www.ithenticate.com/in-the-news" role="menuitem">In the News</a></li>
											</ul>
										</li>
									</ul>
								</div>
							</span>
						</nav>
					</div>
					<div class="span3 top-ctas">
						<a href="<?= site_url('en_us/login') ?>" class="login">Login</a>
						<a href="http://www.ithenticate.com/products" class="cta small yellow">Buy Credits</a>
					</div>
				</div>
			</div>
		</section>
		<section class="banner">
			<div class="container">
				<div class="row social">
					<div class="span2 offset8">
						<a href="https://www.facebook.com/ithenticate" target="_blank"><span class="icon-facebook"></span></a>
						<a href="http://twitter.com/ithenticate" target="_blank"><span class="icon-twitter"></span></a>
						<a href="http://www.linkedin.com/companies/ithenticate" target="_blank"><span class="icon-linkedin"></span></a>
					</div>
					<div class="span2">
						<script>
							(function() {
								var cx = '015781523391359252943:ilc40beya9w';
								var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
								gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
								'//www.google.com/cse/cse.js?cx=' + cx;
								var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
							})();
						</script>
						<gcse:search autosearchonload="false"></gcse:search>
					</div>
				</div>
		<?= $contents ?>
		<section id="footer-ctas">
			<div class="container">
				<div class="row">
					<div class="span3 offset3">
						<a href="https://app.ithenticate.com/signup/individual" class="cta medium yellow">Buy Credits</a>
					</div>
					<div class="span3">
						<a href="http://www.ithenticate.com/quote-request" class="cta medium yellow">Get a Quote</a>
					</div>
				</div>
			</div>
		</section>
		<section class="footer-legal">
			<div class="container">
				<div class="row">
					<div class="span6 contact">
						<a href="https://guides.turnitin.com/Privacy_and_Security">Privacy Center</a> |
						<a href="https://guides.turnitin.com/Privacy_and_Security#Terms_of_Service">Usage Policy</a> |
						<a href="mailto:ithsupport@ithenticate.com" target="_blank">Support</a> |
						<a href="http://www.ithenticate.com/blog/">Blog</a> |
						<a href="http://www.ithenticate.com/contact-us/">Contact</a>
					</div>
					<div class="span6 copyright">
						Copyright © 1998-<?= date('Y') ?> <a href="http://www.turnitin.com/" target="_blank">Turnitin, LLC</a>. All rights reserved.
					</div>
				</div>
			</div>
		</section>
	</body>
</html>