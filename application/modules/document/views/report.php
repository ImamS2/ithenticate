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
		<link rel="apple-touch-icon" href="../../assets/images/sproutcore-logo.png" />
		<link rel="apple-touch-startup-image" media="screen and (orientation:portrait)" href="assets/images/sproutcore-startup-portrait.png" />
		<link rel="apple-touch-startup-image" media="screen and (orientation:landscape)" href="assets/images/sproutcore-startup-landscape.png" />

		<title>iThenticate Document Viewer</title>

		<link href="../../assets/css/stylesheet-packed.css" rel="stylesheet" type="text/css" />
		<link href="../../assets/css/stylesheet.css" rel="stylesheet" type="text/css" />
		<link href="../../assets/css/r-stylesheet.css" rel="stylesheet" type="text/css" />
	</head>

	<body class="sc-theme focus box-shadow border-rad safari windows en_us sc-focus" cz-shortcut-listen="true">
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
		<div id="sc2623" class="sc-view sc-pane sc-main" style="left: 0px; right: 0px; min-width: 200px; top: 0px; bottom: 0px; min-height: 200px">
			<div id="sc2626" class="sc-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
				<div id="sc2633" class="sc-view navbar" style="left: 0px; right: 0px; top: 0px; height: 20px">
					<div id="sc2634" class="sc-view ajax-indicator hidden" style="left: 50%; width: 125px; margin-left: -63px; top: 50%; height: 20px; margin-top: -10px">
						<div id="sc2637" class="sc-view sc-label-view sc-regular-size" style="left: 20px; width: 100px; top: 50%; height: 20px; margin-top: -10px; text-align: left; font-weight: normal">
							Loading...
						</div>
						<div id="sc2638" class="sc-view" style="left: 0px; width: 16px; top: 50%; height: 16px; margin-top: -8px">
							<img src="./iThenticate Document Viewer report_files/loading-spinner.gif" width="16" height="16">
						</div>
					</div>
					<div id="sc2639" class="sc-view sc-label-view nav-title sc-regular-size" style="left: 15px; width: 150px; top: 0px; height: 20px; text-align: left; font-weight: normal; text-align: left; font-weight: normal">
						19-Aug-2019 05:54PM
					</div>
					<div id="sc2641" class="sc-view sc-label-view nav-title sc-regular-size" style="left: 150px; right: 150px; top: 0px; height: 20px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
						5986 words • 180 matches • 74 sources
					</div>
					<a id="sc2645" class="sc-view sc-label-view faq-link sc-regular-size" style="right: 0px; width: 60px; top: 0px; bottom: 0px; text-align: center; font-weight: normal">
						FAQ
					</a>
				</div>
				<div id="sc2661" class="sc-view infobar" style="left: 0px; right: 0px; min-width: 800px; top: 20px; height: 60px">
					<div id="sc2662" class="sc-view branding-view" style="left: 0px; width: 260px; top: 0px; bottom: 0px">
						<img src="./iThenticate Document Viewer report_files/ithenticate-logo.png" id="sc2663" class="sc-view sc-image-view sc-regular-size" style="left: 50%; width: 195px; margin-left: -98px; top: 10px; height: 33px">
					</div>
					<div id="sc2664" class="sc-view infobar-paper-info" style="left: 310px; right: 345px; top: 0px; height: 60px">
						<div id="sc2665" class="sc-view sc-label-view infobar-title sc-regular-size" style="left: 0px; right: 0px; top: 10px; height: 24px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
							PENGARUH INVESTASI, TRADE OPENNES DAN LABOR FORCE TERHADAP PERTUMBUHAN EKONOMI
						</div>
						<div id="sc2667" class="sc-view sc-label-view author sc-regular-size" style="left: 0px; right: 0px; top: 35px; bottom: 0px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
							by resty
						</div>
					</div>
					<div id="sc2670" class="sc-view report-filters-options" style="right: 101px; width: 150px; top: 0px; bottom: 0px">
						<div id="sc2671" class="sc-view sc-label-view sc-regular-size" style="left: 0px; right: 10px; top: 10px; height: 25px; text-align: right; font-weight: normal; text-align: right; font-weight: normal">
							Quotes Included
						</div>
						<div id="sc2674" class="sc-view sc-label-view sc-regular-size" style="left: 0px; right: 10px; top: 30px; height: 25px; text-align: right; font-weight: normal; text-align: right; font-weight: normal">
							Bibliography Included
						</div>
					</div>
					<div title="Percent of document text that matches to selected content repositories" id="sc2677" class="sc-view info-tile-view similarity-view" style="right: 0px; width: 100px; top: 0px; bottom: 0px">
						<div title="" id="sc2681" class="sc-view sc-label-view label top-label sc-regular-size" style="left: 0px; right: 0px; top: 0px; height: 20px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
						</div>
						<div id="sc2684" class="sc-view sc-label-view infobar-value sc-regular-size" style="left: 50%; width: 80px; margin-left: -40px; top: 14px; height: 30px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
							43%
						</div>
						<div title="" id="sc2686" class="sc-view sc-label-view label bottom-label sc-regular-size" style="left: 0px; right: 0px; bottom: 0px; height: 17px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
							Similar
						</div>
					</div>
				</div>
				<div id="sc2702" class="sc-view sc-split-view sc-horizontal" style="left: 0px; right: 0px; top: 81px; bottom: 0px">
					<div id="sc2706" class="sc-view" style="left: 0px; right: 450px; top: 0px; bottom: 0px; transition: right 0.15s linear 0s;">
						<div id="sc2707" class="sc-view sc-scroll-view paper-view sc-gray-border" style="left: 0px; right: 0px; top: 0px; bottom: 30px">
							<div class="corner"></div>
							<div id="sc2712" class="sc-view sc-container-view" style="left: 0px; right: 14px; top: 0px; bottom: 0px">
								<div id="sc2966" class="sc-view" style="left: 0px; top: 0px; height: 43273px; right: 0px">
									<a id="sc2969" class="sc-view download-container hidden" style="left: 0px; top: 7px; height: 50px; width: 860px">
										<img class="download-icon" src="./iThenticate Document Viewer report_files/download-icon.png">
										<div class="download-filename ellipsis">
											Download submitted file: koreksi Resti Ayu Ningsih 4111601001...docx
										</div>
									</a>
									<div id="sc2974" class="sc-view simple-collection-view simple-list-view page-list-view" style="left: 0px; top: 0px; width: 860px; height: 43273px">
										<div id="sc2974-sc2964" class="sc-view page-view" style="left: 0px; width: 860px; top: 8px; height: 1216px">
											<div id="sc3034" class="sc-view sc-image-view" style="left: 0px; right: 0px; top: 0px; height: 1216px">
												<img height="1216" width="860" src="./iThenticate Document Viewer report_files/image">
											</div>
											<div id="sc3037" class="sc-view page-services-view" style="left: 0px; width: 860px; top: 0px; height: 1216px">
												<div id="sc3046" class="sc-view page-service-view originality active" style="left: 0px; width: 860px; top: 0px; height: 1216px">
													<div id="sc3054" class="sc-view simple-collection-view highlights-view or-multi-color-highlighting-off" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
														<div id="sc5052" class="sc-view highlight-view group-node-color-6 first-match-segment last-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight" style="top:887px;height:19px;left:205px;width:279px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:880px;left:204px;height:20px;">&nbsp;</div>
															<div class="line-highlight" style="top:908px;height:19px;left:247px;width:196px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="line-highlight last-line-highlight" style="top:930px;height:19px;left:255px;width:180px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:926px;left:435px;height:19px;">&nbsp;</div>
															<div class="match-stem-tail" style="top:945px;left:433px;">&nbsp;</div>
															<div class="highlight-label" style="top:871px;height:18px;left:204px;">7</div>
														</div>
													</div>
													<div id="sc3069" class="sc-view originality-glimpse-view or-multi-color-highlighting-off allow-select hidden" style="left: 0px; width: 600px; top: 0px; height: 180px">
														<div class="glimpse-liner above-highlight" style="">
															<img class="resize-handle" src="./iThenticate Document Viewer report_files/resize_handle.gif">
															<div class="header">
																<div class="translated-report-indicator">
																	EN
																</div>
																<div class="source-tools">
																	<div class="source-link">
																	</div>
																	<img class="close-button" src="./iThenticate Document Viewer report_files/icon_close.png" alt="Close Glimpse" title="Close Glimpse">
																	<div class="view-full-source">
																		<a class="view-full-source-link clickable">Full Source View</a>
																	</div>
																</div>
																<div class="source-title">
																	<div class="title-link ellipsis"></div>
																</div>
															</div>
															<div class="loading-image-container">
																<img class="loading-image" src="./iThenticate Document Viewer report_files/loading_spinner_32x32.gif">
															</div>
														</div>
													</div>
												</div>
												<div id="sc3084" class="sc-view page-service-view grademark hidden" style="left: 0px; width: 860px; top: 0px; height: 1216px">
													<div id="sc3089" class="sc-view read-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px"></div>
												</div>
												<div id="sc3102" class="sc-view page-service-view grademark peermark hidden" style="left: 0px; width: 860px; top: 0px; height: 1216px">
													<div id="sc3107" class="sc-view read-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px"></div>
												</div>
											</div>
											<div id="sc3116" class="sc-view loading-view page-loading-view hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
												<img src="data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==" id="sc3121" class="sc-view sc-image-view loading-image sc-regular-size" style="left: 50%; width: 32px; margin-left: -16px; top: 50%; height: 32px; margin-top: -16px">
												<div id="sc3122" class="sc-view sc-label-view loading-text sc-regular-size" style="left: 50%; width: 200px; margin-left: -95px; top: 50%; height: 32px; margin-top: 19px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
													Loading Page
												</div>
											</div>
										</div>
										<div id="sc2974-sc2988" class="sc-view page-view" style="left: 0px; width: 860px; top: 1244px; height: 1216px">
											<div id="sc3132" class="sc-view sc-image-view" style="left: 0px; right: 0px; top: 0px; height: 1216px">
												<img height="1216" width="860" src="./iThenticate Document Viewer report_files/image(1)">
											</div>
											<div id="sc3135" class="sc-view page-services-view" style="left: 0px; width: 860px; top: 0px; height: 1216px">
												<div id="sc3141" class="sc-view page-service-view originality active" style="left: 0px; width: 860px; top: 0px; height: 1216px">
													<div id="sc3148" class="sc-view simple-collection-view highlights-view or-multi-color-highlighting-off" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
														<div id="sc5058" class="sc-view highlight-view group-node-color-1 first-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:343px;height:16px;left:129px;width:100px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:336px;left:128px;height:20px;">&nbsp;</div>
															<div class="highlight-label" style="top:327px;height:18px;left:128px;">2</div>
														</div>
														<div id="sc5064" class="sc-view highlight-view group-node-color-1 bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:376px;height:16px;left:156px;width:128px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
														</div>
														<div id="sc5069" class="sc-view highlight-view group-node-color-1 bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:376px;height:16px;left:336px;width:35px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
														</div>
														<div id="sc5074" class="sc-view highlight-view group-node-color-1 last-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight" style="top:376px;height:16px;left:428px;width:136px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="line-highlight last-line-highlight" style="top:408px;height:16px;left:125px;width:87px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:404px;left:213px;height:19px;">&nbsp;</div>
															<div class="match-stem-tail" style="top:423px;left:211px;">&nbsp;</div>
														</div>
														<div id="sc5079" class="sc-view highlight-view group-node-color-3 first-match-segment last-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:862px;height:16px;left:156px;width:408px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:855px;left:155px;height:20px;">&nbsp;</div>
															<div class="match-stem" style="top:858px;left:565px;height:19px;">&nbsp;</div>
															<div class="match-stem-tail" style="top:877px;left:563px;">&nbsp;</div>
															<div class="highlight-label" style="top:846px;height:18px;left:155px;">4</div>
														</div>
														<div id="sc5084" class="sc-view highlight-view group-node-color-11 first-match-segment last-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight" style="top:953px;height:13px;left:212px;width:333px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:946px;left:211px;height:20px;">&nbsp;</div>
															<div class="line-highlight last-line-highlight" style="top:967px;height:13px;left:125px;width:227px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:963px;left:353px;height:19px;">&nbsp;</div>
															<div class="match-stem-tail" style="top:982px;left:351px;">&nbsp;</div>
															<div class="highlight-label" style="top:937px;height:18px;left:211px;">12</div>
														</div>
														<div id="sc5089" class="sc-view highlight-view group-node-color-0 first-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight" style="top:505px;height:16px;left:198px;width:366px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:498px;left:197px;height:20px;">&nbsp;</div>
															<div class="line-highlight" style="top:538px;height:16px;left:125px;width:439px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="line-highlight last-line-highlight" style="top:570px;height:16px;left:125px;width:317px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="highlight-label" style="top:489px;height:18px;left:196px;">13</div>
														</div>
														<div id="sc5094" class="sc-view highlight-view group-node-color-0 last-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:603px;height:16px;left:156px;width:124px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:599px;left:281px;height:19px;">&nbsp;</div>
															<div class="match-stem-tail" style="top:618px;left:279px;">&nbsp;</div>
														</div>
														<div id="sc5099" class="sc-view highlight-view group-node-color-2 first-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:408px;height:16px;left:340px;width:97px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:400px;left:338px;height:20px;">&nbsp;</div>
															<div class="highlight-label" style="top:392px;height:18px;left:338px;">51</div>
														</div>
														<div id="sc5104" class="sc-view highlight-view group-node-color-2 bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight" style="top:408px;height:16px;left:490px;width:74px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="line-highlight last-line-highlight" style="top:440px;height:16px;left:125px;width:112px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
														</div>
														<div id="sc5109" class="sc-view highlight-view group-node-color-2 bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:440px;height:16px;left:367px;width:128px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
														</div>
														<div id="sc5114" class="sc-view highlight-view group-node-color-2 bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:440px;height:16px;left:528px;width:36px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
														</div>
														<div id="sc5119" class="sc-view highlight-view group-node-color-2 bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:472px;height:16px;left:152px;width:115px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
														</div>
														<div id="sc5124" class="sc-view highlight-view group-node-color-2 last-match-segment bright-highlight" style="left: 0px; width: 0px; top: 0px; height: 0px">
															<div class="line-highlight first-line-highlight last-line-highlight" style="top:472px;height:16px;left:303px;width:261px;">
																<div class="line-highlight-liner">&nbsp;</div>
															</div>
															<div class="match-stem" style="top:468px;left:565px;height:19px;">&nbsp;</div>
															<div class="match-stem-tail" style="top:487px;left:563px;">&nbsp;</div>
														</div>
													</div>
													<div id="sc3161" class="sc-view originality-glimpse-view or-multi-color-highlighting-off allow-select hidden" style="left: 0px; width: 600px; top: 0px; height: 180px">
														<div class="glimpse-liner above-highlight" style=""><img class="resize-handle" src="./iThenticate Document Viewer report_files/resize_handle.gif">
															<div class="header">
																<div class="translated-report-indicator">EN</div>
																<div class="source-tools">
																	<div class="source-link"></div>
																	<img class="close-button" src="./iThenticate Document Viewer report_files/icon_close.png" alt="Close Glimpse" title="Close Glimpse">
																	<div class="view-full-source">
																		<a class="view-full-source-link clickable">Full Source View</a>
																	</div>
																</div>
																<div class="source-title">
																	<div class="title-link ellipsis"></div>
																</div>
															</div>
															<div class="loading-image-container">
																<img class="loading-image" src="./iThenticate Document Viewer report_files/loading_spinner_32x32.gif">
															</div>
														</div>
													</div>
												</div>
												<div id="sc3172" class="sc-view page-service-view grademark hidden" style="left: 0px; width: 860px; top: 0px; height: 1216px">
													<div id="sc3177" class="sc-view read-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px"></div>
												</div>
												<div id="sc3187" class="sc-view page-service-view grademark peermark hidden" style="left: 0px; width: 860px; top: 0px; height: 1216px">
													<div id="sc3192" class="sc-view read-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px"></div>
												</div>
											</div>
											<div id="sc3200" class="sc-view loading-view page-loading-view hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
												<img src="data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==" id="sc3204" class="sc-view sc-image-view loading-image sc-regular-size" style="left: 50%; width: 32px; margin-left: -16px; top: 50%; height: 32px; margin-top: -16px">
												<div id="sc3205" class="sc-view sc-label-view loading-text sc-regular-size" style="left: 50%; width: 200px; margin-left: -95px; top: 50%; height: 32px; margin-top: 19px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">Loading Page</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="sc2713" class="sc-view sc-scroller-view hidden sc-horizontal controls-hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
								<div class="track"></div>
								<div class="cap"></div>
								<div class="button-bottom"></div>
								<div class="button-top"></div>
								<div class="thumb" style="width: Infinitypx; left: 0px;">
									<div class="thumb-center"></div>
									<div class="thumb-top"></div>
									<div class="thumb-bottom"></div>
								</div>
							</div>
							<div id="sc2715" class="sc-view sc-scroller-view sc-vertical" style="right: 0px; width: 14px; top: 0px; bottom: 0px">
								<div class="track"></div>
								<div class="cap"></div>
								<div class="button-bottom"></div>
								<div class="button-top"></div>
								<div class="thumb" style="top: 4px; height: 20px;">
									<div class="thumb-center"></div>
									<div class="thumb-top"></div>
									<div class="thumb-bottom"></div>
								</div>
							</div>
						</div>
						<div id="sc2717" class="sc-view sc-toolbar-view paper-toolbar" style="left: 0px; right: 0px; bottom: 0px; height: 29px">
							<div title="View information about this paper" alt="View information about this paper" role="button" id="sc2718" class="sc-view sc-button-view paper-info-button icon square sc-regular-size" style="left: 10px; width: 33px; top: 50%; height: 28px; margin-top: -14px">
								<span class="sc-button-inner" style="min-width:0px">
									<label class="sc-button-label ellipsis"><img src="./iThenticate Document Viewer report_files/footer-button-info.png" alt="" class="icon"></label>
								</span>
							</div>
							<div title="Download PDF of current report view" alt="Download PDF of current report view" role="button" id="sc2721" class="sc-view sc-button-view footer-button-print icon square sc-regular-size" style="left: 55px; width: 40px; top: 50%; height: 28px; margin-top: -14px">
								<span class="sc-button-inner" style="min-width:35px">
									<label class="sc-button-label ellipsis"><img src="./iThenticate Document Viewer report_files/legacy-footer-button-print.png" alt="" class="icon"></label>
								</span>
							</div>
							<div role="button" id="sc2724" class="sc-view sc-button-view footer-button-print-spinner disabled hidden icon square sc-regular-size" style="left: 55px; width: 40px; top: 50%; height: 28px; margin-top: -14px">
								<span class="sc-button-inner" style="min-width:35px">
									<label class="sc-button-label ellipsis"><img src="./iThenticate Document Viewer report_files/loading-spinner(1).gif" alt="" class="icon"></label>
								</span>
							</div>
							<div id="sc2726" class="sc-view" style="right: 35px; width: 165px; top: 0px; bottom: 0px; transition: right 0.15s linear 0s;">
								<img src="./iThenticate Document Viewer report_files/zoom-out.png" id="sc2728" class="sc-view sc-image-view sc-regular-size" style="left: 0px; width: 17px; top: 50%; height: 17px; margin-top: -9px">
								<div title="Change zoom level" id="sc2729" class="sc-view sc-slider-view sc-regular-size" style="left: 20px; right: 20px; top: 50%; height: 21px; margin-top: -11px">
									<span class="sc-inner">
										<span class="sc-leftcap"></span>
										<span class="sc-rightcap"></span>
										<img src="data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==" class="sc-handle" style="left: 25%;">
									</span>
								</div>
								<img src="./iThenticate Document Viewer report_files/zoom-in.png" id="sc2734" class="sc-view sc-image-view sc-regular-size" style="right: 0px; width: 17px; top: 50%; height: 17px; margin-top: -9px">
							</div>
							<div id="sc2736" class="sc-view sc-label-view sc-regular-size" style="left: NaNpx; right: 225px; top: 4px; height: 15px; text-align: left; font-weight: normal; text-align: left; font-weight: normal">
								Page: 1 of 35
							</div>
							<div title="Hide sidebar" alt="Hide sidebar" role="button" id="sc2739" class="sc-view sc-button-view hide-sidebar square sc-regular-size" style="right: 0px; width: 12px; top: 0px; bottom: 0px">
								<span class="sc-button-inner" style="min-width:0px">
									<label class="sc-button-label ellipsis"></label>
								</span>
							</div>
						</div>
					</div>
					<div id="sc2741" class="sc-view sc-container-view" style="right: 0px; width: 450px; top: 0px; bottom: 0px">
						<div id="sc2780" class="sc-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
							<div id="sc2781" class="sc-view or-full-source-view-sidebar hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
								<div id="sc2783" class="sc-view" style="left: 0px; right: 0px; top: 0px; height: 38px">
									<div id="sc2784" class="sc-view sc-label-view sidebar-header sc-regular-size" style="left: 50%; width: 200px; margin-left: -100px; top: 0px; height: 38px; text-align: center; font-weight: normal">
										Full Source Text
									</div>
									<div title="" alt="" role="button" id="sc2785" class="sc-view sc-button-view panel-button square sc-regular-size" style="right: 6px; width: 30px; top: 6px; height: 30px">
										<span class="sc-button-inner" style="min-width:px">
											<label class="sc-button-label ellipsis"></label>
										</span>
									</div>
								</div>
								<div id="sc2787" class="sc-view loading-view hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px"><img src="data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==" id="sc2789" class="sc-view sc-image-view loading-image sc-regular-size" style="left: 50%; width: 32px; margin-left: -16px; top: 50%; height: 32px; margin-top: -16px">
									<div id="sc2790" class="sc-view sc-label-view loading-text sc-regular-size" style="left: 50%; width: 200px; margin-left: -95px; top: 50%; height: 32px; margin-top: 19px; text-align: center; font-weight: normal">
										Loading...
									</div>
								</div>
								<div id="sc2795" class="sc-view" style="left: 8px; right: 8px; top: 38px; bottom: 30px">
									<div id="sc2797" class="sc-view originality-list-node originality-list-non-group-node originality-full-source-item-view sc-regular-size" style="left: 0px; right: 0px; top: 0px; height: 60px"></div>
									<div id="sc2799" class="sc-view match-group-selector-view" style="left: 0px; right: 0px; top: 60px; height: 30px">
										<div role="button" id="sc2802" class="sc-view sc-button-view left-match square sc-regular-size" style="left: 0px; width: 30px; top: 1px; height: 26px">
											<span class="sc-button-inner" style="min-width:80px">
												<label class="sc-button-label ellipsis"></label>
											</span>
										</div>
										<div id="sc2804" class="sc-view sc-label-view match-instance-conroller-label sc-regular-size" style="left: 30px; right: 30px; top: 5px; bottom: 0px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">
										</div>
										<div role="button" id="sc2808" class="sc-view sc-button-view right-match square sc-regular-size" style="right: 0px; width: 30px; top: 1px; height: 26px">
											<span class="sc-button-inner" style="min-width:80px">
												<label class="sc-button-label ellipsis"></label>
											</span>
										</div>
									</div>
									<div id="sc2810" class="sc-view sc-scroll-view sc-gray-border" style="left: 0px; right: 0px; top: 90px; bottom: 0px">
										<div class="corner"></div>
										<div id="sc2814" class="sc-view sc-container-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
											<div id="sc2815" class="sc-view sc-label-view source-text-label sc-static-layout sc-regular-size" style="left: 0px; right: 0px; top: 0px; bottom: 0px; min-height: 100px; text-align: left; font-weight: normal">
											</div>
										</div>
										<div id="sc2817" class="sc-view sc-scroller-view hidden sc-horizontal controls-hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
											<div class="track"></div>
											<div class="cap"></div>
											<div class="button-bottom"></div>
											<div class="button-top"></div>
											<div class="thumb" style="width: Infinitypx; left: 0px;">
												<div class="thumb-center"></div>
												<div class="thumb-top"></div>
												<div class="thumb-bottom"></div>
											</div>
										</div>
										<div id="sc2819" class="sc-view sc-scroller-view hidden sc-vertical controls-hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
											<div class="track"></div>
											<div class="cap"></div>
											<div class="button-bottom"></div>
											<div class="button-top"></div>
											<div class="thumb" style="height: Infinitypx; top: 0px;">
												<div class="thumb-center"></div>
												<div class="thumb-top"></div>
												<div class="thumb-bottom"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="sc2821" class="sc-view sc-tab-view or-sidebar" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
								<div id="sc2829" class="sc-view sc-container-view sc-black-border" style="left: 0px; right: 0px; top: 0px; bottom: 29px">
									<div id="sc2840" class="sc-view sc-container-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
										<div id="sc2845" class="sc-view sc-container-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
											<div id="sc2865" class="sc-view originality-cumulative-sidebar" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
												<div id="sc2867" class="sc-view sc-label-view or-sidebar-header sc-regular-size" style="left: 0px; right: 0px; top: 0px; height: 38px; text-align: left; font-weight: normal">
													Match Overview
												</div>
												<div id="sc2868" class="sc-view sc-segmented-view mode-toggle square sc-regular-size" style="right: 0px; width: 70px; top: 8px; height: 30px; text-align: center">
													<a role="button" title="Match Overview" class="sc-segment sc-first-segment sel" style="display: inline-block">
														<span class="sc-button-inner">
															<label class="sc-button-label">
																Match Overview
															</label>
														</span>
													</a>
													<a role="button" title="All Sources" class="sc-segment sc-last-segment" style="display: inline-block">
														<span class="sc-button-inner">
															<label class="sc-button-label">All Sources</label>
														</span>
													</a>
												</div>
												<div id="sc2870" class="sc-view or-multi-color-highlighting-off" style="left: 0px; right: 0px; top: 38px; bottom: 0px">
													<div id="sc2874" class="sc-view match-group-selector-view" style="left: 0px; right: 0px; top: 0px; height: 30px">
														<div role="button" id="sc2877" class="sc-view sc-button-view left-match disabled square sc-regular-size" style="left: 0px; width: 30px; top: 1px; height: 26px">
															<span class="sc-button-inner" style="min-width:80px">
																<label class="sc-button-label ellipsis"></label>
															</span>
														</div>
														<div id="sc2879" class="sc-view sc-label-view match-instance-conroller-label sc-regular-size" style="left: 30px; right: 30px; top: 5px; bottom: 0px; text-align: center; font-weight: normal; text-align: center; font-weight: normal"></div>
														<div role="button" id="sc2883" class="sc-view sc-button-view right-match disabled square sc-regular-size" style="right: 0px; width: 30px; top: 1px; height: 26px">
															<span class="sc-button-inner" style="min-width:80px">
																<label class="sc-button-label ellipsis"></label>
															</span>
														</div>
													</div>
													<div id="sc2885" class="sc-view sc-scroll-view sc-gray-border" style="left: 0px; right: 0px; top: 30px; bottom: 0px">
														<div class="corner"></div>
														<div id="sc2888" class="sc-view sc-container-view" style="left: 0px; right: 14px; top: 0px; bottom: 0px">
															<div id="sc2889" class="sc-view" style="left: 0px; right: 0px; top: 0px; height: 5180px">
																<div id="sc2890" class="sc-view hidden" style="left: 0px; right: 0px; top: 0px; height: 100px">
																	<div id="sc2893" class="sc-view sidebar-section-header" style="left: 0px; right: 0px; top: 0px; height: 18px">
																		<div id="sc2894" class="sc-view sc-label-view sc-regular-size" style="left: 10px; right: 0px; top: 0px; bottom: 0px; text-align: left; font-weight: normal; text-align: left; font-weight: normal">
																			Currently viewing standard sources
																		</div>
																	</div>
																	<div id="sc2896" class="sc-view" style="left: 0px; right: 0px; top: 20px; height: 60px">
																		<div title="Switch to the Originality Report with sources for the English translation of the paper" alt="Switch to the Originality Report with sources for the English translation of the paper" role="button" id="sc2897" class="sc-view sc-button-view panel-button large icon square sc-regular-size" style="left: 50%; width: 260px; margin-left: -130px; top: 15px; height: 26px">
																			<span class="sc-button-inner" style="min-width:80px">
																				<label class="sc-button-label ellipsis">
																					<img src="./iThenticate Document Viewer report_files/en.png" alt="" class="icon">View English Sources (Beta)
																				</label>
																			</span>
																		</div>
																	</div>
																	<div id="sc2899" class="sc-view sidebar-section-header" style="left: 0px; right: 0px; top: 80px; height: 18px">
																		<div id="sc2900" class="sc-view sc-label-view sc-regular-size" style="left: 10px; right: 0px; top: 0px; bottom: 0px; text-align: left; font-weight: normal">Matches</div>
																	</div>
																</div>
																<div id="sc2901" class="sc-view simple-collection-view simple-list-view" style="left: 0px; right: 0px; top: 0px; height: 5180px">
																	<div id="sc2901-sc4958" class="sc-view originality-list-node originality-list-group-node group-node-color-0 sc-regular-size" style="left: 0px; right: 0px; top: 0px; height: 70px">
																		<div class="number ">1</div>
																		<div class="title ellipsis" title="anzdoc.com">anzdoc.com</div>
																		<div class="type">Internet<span class="word-count">263 words</span></div>
																		<div class="crawled-on">crawled on 18-Mar-2019</div>
																		<div class="percent">4%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																	<div id="sc2901-sc4959" class="sc-view originality-list-node originality-list-group-node group-node-color-1 sc-regular-size" style="left: 0px; right: 0px; top: 70px; height: 70px">
																		<div class="number ">2</div>
																		<div class="title ellipsis" title="adoc.tips">adoc.tips</div>
																		<div class="type">Internet<span class="word-count">217 words</span></div>
																		<div class="crawled-on">crawled on 31-Mar-2019</div>
																		<div class="percent">3%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																	<div id="sc2901-sc4960" class="sc-view originality-list-node originality-list-group-node group-node-color-2 sc-regular-size" style="left: 0px; right: 0px; top: 140px; height: 70px">
																		<div class="number ">3</div>
																		<div class="title ellipsis" title="id.123dok.com">id.123dok.com</div>
																		<div class="type">Internet<span class="word-count">124 words</span></div>
																		<div class="crawled-on">crawled on 22-Jul-2019</div>
																		<div class="percent">2%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																	<div id="sc2901-sc4961" class="sc-view originality-list-node originality-list-group-node group-node-color-3 sc-regular-size" style="left: 0px; right: 0px; top: 210px; height: 70px">
																		<div class="number ">4</div>
																		<div class="title ellipsis" title="www.scribd.com">www.scribd.com</div>
																		<div class="type">Internet<span class="word-count">121 words</span></div>
																		<div class="crawled-on">crawled on 16-Jun-2019</div>
																		<div class="percent">2%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																	<div id="sc2901-sc4962" class="sc-view originality-list-node originality-list-group-node group-node-color-4 sc-regular-size" style="left: 0px; right: 0px; top: 280px; height: 70px">
																		<div class="number ">5</div>
																		<div class="title ellipsis" title="www.emeraldinsight.com">www.emeraldinsight.com</div>
																		<div class="type">Internet<span class="word-count">118 words</span></div>
																		<div class="crawled-on">crawled on 24-May-2019</div>
																		<div class="percent">2%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																	<div id="sc2901-sc4963" class="sc-view originality-list-node originality-list-group-node group-node-color-5 sc-regular-size" style="left: 0px; right: 0px; top: 350px; height: 70px">
																		<div class="number ">6</div>
																		<div class="title ellipsis" title="digilib.uin-suka.ac.id">digilib.uin-suka.ac.id</div>
																		<div class="type">Internet<span class="word-count">98 words</span></div>
																		<div class="crawled-on">crawled on 09-Jul-2019</div>
																		<div class="percent">2%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																	<div id="sc2901-sc4964" class="sc-view originality-list-node originality-list-group-node group-node-color-6 sc-regular-size" style="left: 0px; right: 0px; top: 420px; height: 70px">
																		<div class="number ">7</div>
																		<div class="title ellipsis" title="docplayer.info">docplayer.info</div>
																		<div class="type">Internet<span class="word-count">85 words</span></div>
																		<div class="crawled-on">crawled on 30-Aug-2018</div>
																		<div class="percent">1%</div>
																		<div class="clickable research-mode-link" title="View Match Breakdown"></div>
																	</div>
																</div>
															</div>
														</div>
														<div id="sc2914" class="sc-view sc-scroller-view hidden sc-horizontal controls-hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
															<div class="track"></div>
															<div class="cap"></div>
															<div class="button-bottom"></div>
															<div class="button-top"></div>
															<div class="thumb" style="width: 412px; left: 0px;">
																<div class="thumb-center"></div>
																<div class="thumb-top"></div>
																<div class="thumb-bottom"></div>
															</div>
														</div>
														<div id="sc2916" class="sc-view sc-scroller-view sc-vertical" style="right: 0px; width: 14px; top: 0px; bottom: 0px">
															<div class="track"></div>
															<div class="cap"></div>
															<div class="button-bottom"></div>
															<div class="button-top"></div>
															<div class="thumb" style="height: 32px; top: 4px;">
																<div class="thumb-center"></div>
																<div class="thumb-top"></div>
																<div class="thumb-bottom"></div>
															</div>
														</div>
													</div>
													<div id="sc2919" class="sc-view loading-view hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
														<img src="data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==" id="sc2921" class="sc-view sc-image-view loading-image sc-regular-size" style="left: 50%; width: 32px; margin-left: -16px; top: 50%; height: 32px; margin-top: -16px">
														<div id="sc2922" class="sc-view sc-label-view loading-text hidden sc-regular-size" style="left: 50%; width: 200px; margin-left: -95px; top: 50%; height: 32px; margin-top: 19px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">Loading...</div>
													</div>
													<div id="sc2927" class="sc-view hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
														<div id="sc2932" class="sc-view sc-label-view sc-regular-size" style="left: 0px; right: 0px; top: 50%; height: 35px; margin-top: -18px; text-align: center; font-weight: normal">
															There are no matching sources for this report.
														</div>
													</div>
												</div>
												<div id="sc2933" class="sc-view frozenView hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px; background-color: #AEAEAE">
													<div id="__sc2867" class="sc-view sc-label-view or-sidebar-header sc-regular-size" style="left: 0px; right: 0px; top: 0px; height: 38px; text-align: left; font-weight: normal">
														Match Overview
													</div>
													<div id="__sc2868" class="sc-view sc-segmented-view mode-toggle square sc-regular-size" style="right: 0px; width: 70px; top: 8px; height: 30px; text-align: center">
														<a role="button" title="Match Overview" class="sc-segment sc-first-segment" style="display: inline-block">
															<span class="sc-button-inner">
																<label class="sc-button-label">Match Overview</label>
															</span>
														</a>
														<a role="button" title="All Sources" class="sc-segment sc-last-segment" style="display: inline-block">
															<span class="sc-button-inner">
																<label class="sc-button-label">All Sources</label>
															</span>
														</a>
													</div>
													<div id="__sc2870" class="sc-view or-multi-color-highlighting-off" style="left: 0px; right: 0px; top: 38px; bottom: 0px">
														<div id="__sc2874" class="sc-view match-group-selector-view" style="left: 0px; right: 0px; top: 0px; height: 30px">
															<div role="button" id="__sc2877" class="sc-view sc-button-view left-match square sc-regular-size" style="left: 0px; width: 30px; top: 1px; height: 26px">
																<span class="sc-button-inner" style="min-width:80px">
																	<label class="sc-button-label ellipsis"></label>
																</span>
															</div>
															<div id="__sc2879" class="sc-view sc-label-view match-instance-conroller-label sc-regular-size" style="left: 30px; right: 30px; top: 5px; bottom: 0px; text-align: center; font-weight: normal; text-align: center; font-weight: normal"></div>
															<div role="button" id="__sc2883" class="sc-view sc-button-view right-match square sc-regular-size" style="right: 0px; width: 30px; top: 1px; height: 26px">
																<span class="sc-button-inner" style="min-width:80px">
																	<label class="sc-button-label ellipsis"></label>
																</span>
															</div>
														</div>
														<div id="__sc2885" class="sc-view sc-scroll-view hidden sc-gray-border" style="left: 0px; right: 0px; top: 30px; bottom: 0px">
															<div class="corner"></div>
															<div id="__sc2888" class="sc-view sc-container-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
																<div id="__sc2889" class="sc-view" style="left: 0px; right: 0px; top: 0px; height: 426px">
																	<div id="__sc2890" class="sc-view hidden" style="left: 0px; right: 0px; top: 0px; height: 100px">
																		<div id="__sc2893" class="sc-view sidebar-section-header" style="left: 0px; right: 0px; top: 0px; height: 18px">
																			<div id="__sc2894" class="sc-view sc-label-view sc-regular-size" style="left: 10px; right: 0px; top: 0px; bottom: 0px; text-align: left; font-weight: normal; text-align: left; font-weight: normal">
																				Currently viewing standard sources
																			</div>
																		</div>
																		<div id="__sc2896" class="sc-view" style="left: 0px; right: 0px; top: 20px; height: 60px">
																			<div title="Switch to the Originality Report with sources for the English translation of the paper" alt="Switch to the Originality Report with sources for the English translation of the paper" role="button" id="__sc2897" class="sc-view sc-button-view panel-button large icon square sc-regular-size" style="left: 50%; width: 260px; margin-left: -130px; top: 15px; height: 26px">
																				<span class="sc-button-inner" style="min-width:80px">
																					<label class="sc-button-label ellipsis">
																						<img src="./iThenticate Document Viewer report_files/en.png" alt="" class="icon">View English Sources (Beta)
																					</label>
																				</span>
																			</div>
																		</div>
																		<div id="__sc2899" class="sc-view sidebar-section-header" style="left: 0px; right: 0px; top: 80px; height: 18px">
																			<div id="__sc2900" class="sc-view sc-label-view sc-regular-size" style="left: 10px; right: 0px; top: 0px; bottom: 0px; text-align: left; font-weight: normal">Matches</div>
																		</div>
																	</div>
																	<div id="__sc2901" class="sc-view simple-collection-view simple-list-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px"></div>
																</div>
															</div>
															<div id="__sc2914" class="sc-view sc-scroller-view hidden sc-horizontal controls-hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
																<div class="track"></div>
																<div class="cap"></div>
																<div class="button-bottom"></div>
																<div class="button-top"></div>
																<div class="thumb" style="width: 412px; left: 0px;">
																	<div class="thumb-center"></div>
																	<div class="thumb-top"></div>
																	<div class="thumb-bottom"></div>
																</div>
															</div>
															<div id="__sc2916" class="sc-view sc-scroller-view hidden sc-vertical controls-hidden" style="right: 0px; width: 14px; top: 0px; bottom: 0px">
																<div class="track"></div>
																<div class="cap"></div>
																<div class="button-bottom"></div>
																<div class="button-top"></div>
																<div class="thumb" style="height: 392px; top: 0px;">
																	<div class="thumb-center"></div>
																	<div class="thumb-top"></div>
																	<div class="thumb-bottom"></div>
																</div>
															</div>
														</div>
														<div id="__sc2919" class="sc-view loading-view" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
															<img src="data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==" id="__sc2921" class="sc-view sc-image-view loading-image sc-regular-size" style="left: 50%; width: 32px; margin-left: -16px; top: 50%; height: 32px; margin-top: -16px">
															<div id="__sc2922" class="sc-view sc-label-view loading-text hidden sc-regular-size" style="left: 50%; width: 200px; margin-left: -95px; top: 50%; height: 32px; margin-top: 19px; text-align: center; font-weight: normal; text-align: center; font-weight: normal">Loading...</div>
														</div>
														<div id="__sc2927" class="sc-view hidden" style="left: 0px; right: 0px; top: 0px; bottom: 0px">
															<div id="__sc2932" class="sc-view sc-label-view sc-regular-size" style="left: 0px; right: 0px; top: 50%; height: 35px; margin-top: -18px; text-align: center; font-weight: normal">There are no matching sources for this report.</div>
														</div>
													</div>
													<div id="__sc2933" class="sc-view frozenView" style="left: 0px; right: 0px; top: 0px; bottom: 0px; background-color: #AEAEAE"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div id="sc2832" class="sc-view sc-segmented-view sidebar-tabs square sc-regular-size" style="left: 0px; width: 125px; bottom: 0px; height: 30px; text-align: center">
									<a role="button" title="View sources" class="sc-segment sc-first-segment sel cumulative" style="display: inline-block">
										<span class="sc-button-inner"><label class="sc-button-label"></label></span>
									</a>
									<a role="button" title="View/edit filters and settings" class="sc-segment sc-middle-segment filter-settings" style="display: inline-block">
										<span class="sc-button-inner"><label class="sc-button-label"></label></span>
									</a>
									<a role="button" title="View/edit excluded sources" class="sc-segment sc-last-segment exclusion-list" style="display: inline-block">
										<span class="sc-button-inner"><label class="sc-button-label"></label></span>
									</a>
								</div>
								<div title="Navigate to text-only Similarity Report" alt="Navigate to text-only Similarity Report" role="button" id="sc2834" class="sc-view sc-button-view olde-version square sc-regular-size" style="right: 30px; width: 130px; bottom: 0px; height: 24px; max-height: 30px">
									<span class="sc-button-inner" style="min-width:80px">
										<label class="sc-button-label ellipsis">Text-Only Report</label>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>