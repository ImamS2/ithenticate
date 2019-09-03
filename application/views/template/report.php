<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="default" />
		<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<style>
		.ellipsis {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			-o-text-overflow: ellipsis; /* required for Opera */
			-ms-text-overflow: ellipsis;   /* required for IE8, allegedly */
			-moz-binding: url('/mozxml/ellipsis.xml'); /* http://mattsnider.com/css/css-string-truncation-with-ellipsis/ */
		}
		</style>
		<link rel="apple-touch-icon" href="assets/images/sproutcore-logo.png" />
		<link rel="apple-touch-startup-image" media="screen and (orientation:portrait)" href="assets/images/sproutcore-startup-portrait.png" />
		<link rel="apple-touch-startup-image" media="screen and (orientation:landscape)" href="assets/images/sproutcore-startup-landscape.png" />

		<title>iThenticate Document Viewer</title>

		<!-- <script type="text/javascript">
			/* >>>>>>>>>> BEGIN source/core.js */
			// ==========================================================================
			// Project:   SproutCore - JavaScript Application Framework
			// Copyright: ©2006-2011 Strobe Inc. and contributors.
			//            Portions ©2008-2010 Apple Inc. All rights reserved.
			// License:   Licensed under MIT license (see license.js)
			// ==========================================================================

			/* >>>>>>>>>> BEGIN source/system/browser.js */
			// ==========================================================================
			// Project:   SproutCore - JavaScript Application Framework
			// Copyright: ©2006-2011 Strobe Inc. and contributors.
			//            Portions ©2008-2010 Apple Inc. All rights reserved.
			// License:   Licensed under MIT license (see license.js)
			// ==========================================================================

			var SC = SC || { BUNDLE_INFO: {}, LAZY_INSTANTIATION: {} };

			SC.browser = (function() {
				var userAgent = navigator.userAgent.toLowerCase(),
				version = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1] ;

				var browser = {
					version: version,
					safari: (/webkit/).test( userAgent ) ? version : 0,
					opera: (/opera/).test( userAgent ) ? version : 0,
					msie: (/msie/).test( userAgent ) && !(/opera/).test( userAgent ) ? version : 0,
					mozilla: (/mozilla/).test( userAgent ) && !(/(compatible|webkit)/).test( userAgent ) ? version : 0,
					mobileSafari: (/apple.*mobile.*safari/).test(userAgent) ? version : 0,
					chrome: (/chrome/).test( userAgent ) ? version : 0,
					windows: !!(/(windows)/).test(userAgent),
					mac: !!((/(macintosh)/).test(userAgent) || (/(mac os x)/).test(userAgent)),
					language: (navigator.language || navigator.browserLanguage).split('-', 1)[0]
				};

				browser.current = browser.msie ? 'msie' : browser.mozilla ? 'mozilla' : browser.safari ? 'safari' : browser.opera ? 'opera' : 'unknown' ;
				return browser ;
			})();

			/* >>>>>>>>>> BEGIN source/system/loader.js */
			// ==========================================================================
			// Project:   SproutCore - JavaScript Application Framework
			// Copyright: ©2006-2011 Strobe Inc. and contributors.
			//            Portions ©2008-2010 Apple Inc. All rights reserved.
			// License:   Licensed under MIT license (see license.js)
			// ==========================================================================

			// sc_require("system/browser");

			SC.bundleDidLoad = function(bundle) {
				var info = this.BUNDLE_INFO[bundle] ;
				if (!info) info = this.BUNDLE_INFO[bundle] = {} ;
				info.loaded = true ;
			};

			SC.bundleIsLoaded = function(bundle) {
				var info = this.BUNDLE_INFO[bundle] ;
				return info ? !!info.loaded : false ;
			};

			SC.loadBundle = function() { throw "SC.loadBundle(): SproutCore is not loaded."; };

			SC.setupBodyClassNames = function() {
				var el = document.body ;
				if (!el) return ;
				var browser, platform, shadows, borderRad, classNames, style;
				browser = SC.browser.current ;
				platform = SC.browser.windows ? 'windows' : SC.browser.mac ? 'mac' : 'other-platform' ;
				style = document.documentElement.style;
				shadows = (style.MozBoxShadow !== undefined) ||
					(style.webkitBoxShadow !== undefined) ||
					(style.oBoxShadow !== undefined) ||
					(style.boxShadow !== undefined);

				borderRad = (style.MozBorderRadius !== undefined) || 
					(style.webkitBorderRadius !== undefined) ||
					(style.oBorderRadius !== undefined) ||
					(style.borderRadius !== undefined);

				classNames = el.className ? el.className.split(' ') : [] ;
				if(shadows) classNames.push('box-shadow');
				if(borderRad) classNames.push('border-rad');
				classNames.push(browser) ;
				classNames.push(platform) ;
				if (parseInt(SC.browser.msie,0)==7) classNames.push('ie7') ;
				if (SC.browser.mobileSafari) classNames.push('mobile-safari') ;
				if ('createTouch' in document) classNames.push('touch');
				el.className = classNames.join(' ') ;
			} ;

			/* >>>>>>>>>> BEGIN bundle_loaded.js */
			; if ((typeof SC !== 'undefined') && SC && SC.bundleDidLoad) SC.bundleDidLoad('sproutcore/bootstrap');

		</script> -->
		<!-- <script type="text/javascript">SC.buildMode = "production";</script> -->

		<link href="assets/css/stylesheet-packed.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/stylesheet.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/r-stylesheet.css" rel="stylesheet" type="text/css" />
	</head>

	<body class="sc-theme focus box-shadow border-rad safari windows en_us sc-focus" cz-shortcut-listen="true">
		<!-- <script type="text/javascript">
			// ==========================================================================
			// Project:   SproutCore - JavaScript Application Framework
			// Copyright: ©2006-2011 Strobe Inc. and contributors.
			//            Portions ©2008-2010 Apple Inc. All rights reserved.
			// License:   Licensed under MIT license (see license.js)
			// ==========================================================================

			// sc_resource('setup_body_class_names'); // publish into inline format

			if (SC.setupBodyClassNames) SC.setupBodyClassNames() ;

		</script> -->


		<!-- <div id="loading">
			<p class="loading">Loading...<p>

			<style type="text/css" media="screen">
				/* loading */
				.waiting { 
					position: absolute; 
					left: 0;
					right: 0;
				}

				.waiting.navbar {
					height: 20px;
					top: 0;
				}

				.waiting.infobar {
					height: 60px;
					top: 20px;
				}

				.sc-theme #loading p.loading {
					background-color: #ddd;
					text-align: center;
					top: 50%;
					font-size: 18px;
					color: #333;
					border-top: 0;
					text-shadow: 1px 1px 0 #fff;
				}

				.sc-theme #loading {
					background: #ddd;
				}

			</style>
			<div class="waiting navbar"> </div>
			<div class="waiting infobar"> </div>
			<p class="loading">Loading Document Viewer...</p>
		</div> -->
		<!-- <script type="text/javascript" src="assets/js/javascript-packed.js"></script>
		<script type="text/javascript" src="assets/js/r-javascript.js"></script> -->
		<!-- <script type="text/javascript">String.preferredLanguage = "en_us";</script>
		<script type="text/javascript"> -->
			<!-- <![CDATA[//><!--

			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-952189-1']);
			_gaq.push(['_setDomainName', 'app.ithenticate.com']);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script');
				ga.type = 'text/javascript';
				ga.async = true;
				ga.src = ('https:' == document.location.protocol
					? 'https://ssl'
					: 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(ga, s);
			})();

			// -->
		<!-- </script> -->
		<?= $contents ?>
    </div>
	</body>
</html>