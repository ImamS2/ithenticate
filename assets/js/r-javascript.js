(function() {
				var a = "sproutcore/standard_theme";
				if (!SC.BUNDLE_INFO) {
								throw "SC.BUNDLE_INFO is not defined!"
				}
				if (SC.BUNDLE_INFO[a]) { return } SC.BUNDLE_INFO[a] = { requires: ["sproutcore/empty_theme"], styles: ["assets/css/stylesheet-packed.css", "assets/css/stylesheet.css"], scripts: ["/static/sc/0425/sproutcore/standard_theme/en_us/a/javascript-packed.js"] }
})();
SC.Benchmark.globalStartTime = window.globalStartTime;
SC.Benchmark.start("applicationBootStrap", null, window.globalStartTime);
SC.Benchmark.end("applicationBootStrap");
SC.Benchmark.start("applicationStartup");
var use_fixtures = NO;
Ip.manageParentSession();
IthenticateDv = SC.Application.create({
				NAMESPACE: "IthenticateDv",
				VERSION: "0.1.0",
				init: function() {
								arguments.callee.base.apply(this, arguments);
								if (use_fixtures) {
												var f = SC.Record.fixtures;
												f.set("simulateRemoteResponse", YES);
												this.set("store", SC.Store.create().from(f));
												window.config = { userId: 10, paperId: 1, defaultSideBar: Cv.originalityController.CUMULATIVE_MODE }
								} else {
												var b = SC.Store.create({
																removeDataHash: function(i, g) {
																				var h = arguments.callee.base.apply(this, arguments);
																				if (this.records) { delete this.records[i] }
																				return h
																}
												}).from("Cv.DataSource");
												this.set("store", b);
												var c = Ip.getQueryStringParameter("o") || 9626000;
												var e = Ip.getQueryStringParameter("u") || 3388567;
												var d = SC.Cookie.find("defaultSideBar") || SC.Cookie.create({ name: "defaultSideBar", value: Cv.originalityController.CUMULATIVE_MODE });
												d.write();
												var a = Number(Ip.getQueryStringParameter("d")) || Number(d.get("value"));
												window.config = { userId: e, paperId: c, defaultSideBar: a }
								}
				}
});
IthenticateDv.String = function() {
				this.__sc_loc = this.loc;
				this.loc = function() {
								var a = this.__sc_loc.apply(this, arguments);
								if (a.substr(0, 1) === "_") { a = a.substr(1) }
								return a
				}
};
IthenticateDv.String.call(String.prototype);
Cv.config.mixin({ APP_NAME: "iThenticate", PAPER_ZOOM_DEFAULT: 0, DEFAULT_ACTIVE_SERVICE: 1, DEFAULT_VISIBLE_SERVICES: [1], SHOW_MATCH_GROUP_PERCENT_IN_LABEL: NO, ALLOW_OR_OPTIONS_IN_ALL_MODES: YES, USE_FULL_TITLE_IN_ORIGINALITY_SIDEBAR_MATCH: YES, SHOW_WORD_COUNT_IN_ORIGINALITY_SIDEBAR_MATCH: YES, SHOW_CRAWLED_ON_DATE: YES, SOURCE_TREE_NODE_ITEM_HEIGHT: 70, SOURCE_ITEM_HEIGHT: 32, COLLECTION_NAMES_LOCALIZED: YES, HIGH_BIBLIO_QUOTE_WARNING: YES, HIGH_QUOTE_THRESHOLD: 30, HIGH_BIBLIO_THRESHOLD: 15 });
Cv.gradeMarkController.mixin({ readQueryUrl: null });
Cv.assignmentController.mixin({ contentBinding: "Cv.paperController.assignment", paperStubs: [] });
Ip.DataSourceExceptionHandling.LOGGED_OUT_ERROR_MSG = "_We couldn't carry out that action because you have been logged out.".loc();
IthenticateDv.ApplicationView = SC.View.extend({
				classController: null,
				assignmentsController: null,
				assignmentStudentsController: null,
				assignmentController: null,
				paperController: null,
				paperTextSelectionController: null,
				servicesController: null,
				zoomController: null,
				createChildViews: function() {
								var g = [];
								var f = this._getNavBarView();
								var d = this.createChildView(f);
								g.push(d);
								var e = this._getInfoBarView();
								var a = this.createChildView(e);
								g.push(a);
								var c = this._getMainBodyView();
								var b = this.createChildView(c);
								g.push(b);
								this.paperView = b.topLeftView.paperView;
								this.set("childViews", g)
				},
				_getNavBarView: function() {
								return SC.View.design({
												layout: { top: 0, height: 20, left: 0, right: 0 },
												childViews: "networkMonitorView submissionDateView titleView faqView".w(),
												classNames: ["navbar"],
												networkMonitorView: Cv.NetworkMonitorView,
												submissionDateView: SC.LabelView.design({
																layout: { top: 0, width: 150, height: 20, left: 15 },
																submissionDateBinding: "Cv.paperController.uploadedDate",
																classNames: ["nav-title"],
																value: function() {
																				var a = "";
																				var b = this.get("submissionDate");
																				if (b) {
																								var c = Cv.classController.get("displayTimeIn24Hr") ? "__ipDefaultFullDateTime24HrFormat".loc() : "__ipDefaultFullDateTimeFormat".loc();
																								a = b.toFormattedString(c)
																				}
																				return a
																}.property("submissionDate").cacheable()
												}),
												titleView: SC.LabelView.design({
																layout: { top: 0, height: 20, left: 150, right: 150 },
																classNames: ["nav-title"],
																wordCountBinding: "Cv.paperController.wordCount",
																sourceCountBinding: "Cv.originalityDataTreeController.arrangedObjectsLength",
																matchCountBinding: "Cv.originalityMatchGroupsController.length",
																textAlign: SC.ALIGN_CENTER,
																escapeHTML: NO,
																value: function() {
																				var c = this.get("wordCount"),
																								b = this.get("matchCount"),
																								a = this.get("sourceCount");
																				if (SC.none(c) || SC.none("matchCount") || SC.none(a)) { return "" }
																				var d = [];
																				d.push(parseInt(c, 10) === 1 ? "_%@ word".loc(c) : "_%@ words".loc(c));
																				d.push(parseInt(b, 10) === 1 ? "_%@ match".loc(b) : "_%@ matches".loc(b));
																				d.push(parseInt(a, 10) === 1 ? "_%@ source".loc(a) : "_%@ sources".loc(a));
																				return d.join(" &bull; ")
																}.property("wordCount", "matchCount", "sourceCount").cacheable()
												}),
												faqView: SC.LabelView.design({
																classNames: ["faq-link"],
																layout: { top: 0, right: 0, bottom: 0, width: 60 },
																value: "_FAQ".loc(),
																tagName: "a",
																textAlign: SC.ALIGN_CENTER,
																mouseDown: function() {
																				window.open("http://www.ithenticate.com/products/plagiarism-checker-faqs/")
																}
												}).loc(Ip.getLocalizationHash("IthenticateDV.FAQLink"))
								})
				},
				_getInfoBarView: function() {
								var b = "/static/sc/0425/ithenticate_dv/en_us/a/resources/images/ithenticate-logo.png";
								var a = { top: 10, height: 33, centerX: 0, width: 195 };
								if (window.location.host.indexOf("crosscheck" || "crossref") != -1) {
												b = "/static/sc/0425/ithenticate_dv/en_us/a/resources/images/crosscheck-logo.png";
												a = { top: 4, left: 10, height: 47, centerX: 0, width: 107 }
								}
								return SC.View.design({
												layout: { top: 20, left: 0, height: 60, minWidth: 800 },
												classNames: ["infobar"],
												childViews: "brandingView documentHeaderView reportFiltersOptionsView similarityScoreTileView".w(),
												brandingView: SC.View.design({ layout: { top: 0, width: 260, left: 0 }, childViews: "logoView".w(), classNames: ["branding-view"], logoView: Ip.ImageView.design({ layout: a, value: b }) }),
												documentHeaderView: SC.View.design({
																layout: { top: 0, height: 60, left: 310, right: 345 },
																childViews: "paperTitleView authorView".w(),
																classNames: ["infobar-paper-info"],
																paperTitleView: SC.LabelView.design({
																				layout: { top: 10, height: 24, left: 0, right: 0 },
																				textAlign: SC.ALIGN_CENTER,
																				classNames: ["infobar-title"],
																				titleBinding: SC.Binding.notNull("Cv.paperController.title", ""),
																				value: function() {
																								return Ip.unscrubHTML(this.get("title"))
																				}.property("title").cacheable()
																}),
																authorView: SC.LabelView.design({
																				layout: { top: 35, left: 0, right: 0 },
																				classNames: ["author"],
																				textAlign: SC.ALIGN_CENTER,
																				escapeHTML: NO,
																				selectedStubBinding: "Cv.paperStubController.content",
																				authorNameBinding: "Cv.paperController.authorName",
																				value: function() {
																								var d;
																								var c = this.get("authorName");
																								if (c) { d = "_by %@".loc(c) }
																								return d
																				}.property("authorName", "selectedStub").cacheable()
																})
												}),
												reportFiltersOptionsView: SC.View.design({
																classNames: ["report-filters-options"],
																layout: { top: 0, width: 150, bottom: 0, right: 101 },
																childViews: "quotesExclusionSettingLabel bibliographyExclusionSettingLabel".w(),
																quotesExclusionSettingLabel: SC.LabelView.design({
																				layout: { top: 10, right: 10, height: 25, left: 0 },
																				textAlign: SC.ALIGN_RIGHT,
																				excludeQuotesBinding: "Cv.originalityOptionsController.excludeQuotes",
																				cumulativeDataBinding: "Cv.originalityController.cumulativeData",
																				value: function() {
																								return this.get("excludeQuotes") ? "_Quotes Excluded".loc() : "_Quotes Included".loc()
																				}.property("cumulativeData").cacheable()
																}),
																bibliographyExclusionSettingLabel: SC.LabelView.design({
																				layout: { top: 30, right: 10, height: 25, left: 0 },
																				textAlign: SC.ALIGN_RIGHT,
																				excludeBibliographyBinding: "Cv.originalityOptionsController.excludeBibliography",
																				cumulativeDataBinding: "Cv.originalityController.cumulativeData",
																				value: function() {
																								return this.get("excludeBibliography") ? "_Bibliography Excluded".loc() : "_Bibliography Included".loc()
																				}.property("cumulativeData").cacheable()
																})
												}),
												similarityScoreTileView: Cv.InfoTileView.design({
																layout: { width: 100, right: 0 },
																classNames: ["similarity-view"],
																toolTip: "_Percent of document text that matches to selected content repositories".loc(),
																overlapBinding: SC.Binding.oneWay("Cv.paperController.overlap"),
																originalityIsAvailableBinding: SC.Binding.oneWay("Cv.originalityController.isAvailable"),
																bottomLabel: "_Similar".loc(),
																percentageBinding: "Cv.similarityScoreController.displayPercent",
																mainContent: function() {
																				return "_%@%".loc(this.get("percentage"))
																}.property("percentage")
												})
								})
				},
				_getMainBodyView: function() {
								return Cv.ApplicationSplitView.design({
												layout: { top: 81, left: 0, right: 0 },
												defaultThickness: 450,
												defaultWiderWidth: 450,
												sidebarIsVisibleBinding: "IthenticateDv.sidebarViewController.sidebarIsVisible",
												bottomRightView: SC.ContainerView.design(SC.Animatable, { contentViewBinding: "Cv.originalityController.sidebarView" }),
												topLeftView: SC.View.design(SC.Animatable, {
																childViews: "paperView toolbarView".w(),
																transitions: { right: { duration: 0.15, timing: SC.TRANSITION_CSS_EASE } },
																paperView: Cv.PaperView.design({ layout: { top: 0, bottom: 30, left: 0, right: 0 }, classNames: ["paper-view"], paperBinding: "Cv.paperController", nowShowingPageBinding: "Cv.paperController.nowShowingPage", paperTextSelectionController: this.get("paperTextSelectionController"), servicesController: this.get("servicesController"), zoomController: this.get("zoomController") }),
																toolbarView: SC.ToolbarView.design({
																				layout: { height: 29 },
																				childViews: "paperInfoButtonView printButtonView printSpinnerView zoomControlsView pageCountView hideSidebarButtonView".w(),
																				anchorLocation: SC.ANCHOR_BOTTOM,
																				classNames: ["paper-toolbar"],
																				paperInfoButtonView: SC.ButtonView.design({
																								layout: { centerY: 0, height: 28, left: 10, width: 33 },
																								classNames: ["paper-info-button"],
																								paperController: this.get("paperController"),
																								paperBinding: "Cv.paperController.content",
																								translateLanguageBinding: "Cv.originalityController.translateLanguage",
																								toolTip: "_View information about this paper".loc(),
																								icon: "/static/sc/0425/cv/en_us/a/resources/images/footer-button-info.png",
																								titleMinWidth: "0",
																								action: function() {
																												this.get("infoPane").append()
																								},
																								infoPane: function() {
																												var d = this.get("paper");
																												var b = Cv.classController.get("displayTimeIn24Hr") ? "__ipDefaultFullDateTime24HrFormat".loc() : "__ipDefaultFullDateTimeFormat".loc();
																												var c = d.get("uploadedDate") ? d.get("uploadedDate").toFormattedString(b) : "_N/A".loc();
																												var a = d.get("processedTime") ? d.get("processedTime").toFormattedString(b) : "_N/A".loc();
																												var e = SC.PalettePane.design({
																																classNames: ["paper-info-pane"],
																																layout: { height: 250, bottom: 35, left: 10 },
																																isModal: YES,
																																isAnchored: YES,
																																render: function(f, g) {
																																				if (f.needsContent) {
																																								this.renderChildViews(f, g)
																																				}
																																},
																																contentView: SC.View.design({
																																				classNames: ["paper-info"],
																																				height: 124,
																																				render: function(f, g) {
																																								f.push("<h1>").push("_Document Info".loc()).push("</h1>");
																																								f.push('<div class="inner-container" style="height: auto;">');
																																								f.push("<div>").push("<span>").push(d.get("id")).push("</span>").push("_DOCUMENT ID".loc()).push("</div>");
																																								f.push("<div>").push("<span>").push(c).push("</span>").push("_SUBMITTED ON".loc()).push("</div>");
																																								f.push("<div>").push("<span>").push(a).push("</span>").push("_PROCESSED ON".loc()).push("</div>");
																																								f.push("<div>").push("<span>").push(d.get("wordCount")).push("</span>").push("_WORD COUNT".loc()).push("</div>");
																																								f.push("</div>");
																																								this.get("parentView").adjust("height", this.get("height"))
																																				}
																																}),
																																modalPaneDidClick: function(g) {
																																				var h = this.get("frame");
																																				if (!this.clickInside(h, g)) { this.remove() }
																																				return YES
																																},
																																mouseDown: function(f) {
																																				this.remove()
																																},
																																clickInside: function(g, f) { return SC.pointInRect({ x: f.pageX, y: f.pageY }, g) }
																												}).loc(Ip.getLocalizationHash("Cv.paperInfoPane"));
																												return e.create({})
																								}.property("paper", "translateLanguage").cacheable()
																				}),
																				printButtonView: SC.ButtonView.design({ layout: { left: 55, height: 28, width: 40, centerY: 0 }, titleMinWidth: "35", isPrintingBinding: SC.Binding.oneWay("Cv.printController.printDownloadIsLoading"), isVisibleBinding: SC.Binding.not(".isPrinting"), classNames: ["footer-button-print"], toolTip: "_Download PDF of current report view".loc(), action: "printPaper", target: "Cv.printController", icon: "/static/sc/0425/ithenticate_dv/en_us/a/resources/images/legacy-footer-button-print.png" }),
																				printSpinnerView: SC.ButtonView.design({ layout: { left: 55, height: 28, width: 40, centerY: 0 }, titleMinWidth: "35", isVisibleBinding: SC.Binding.oneWay("Cv.printController.printDownloadIsLoading"), isEnabled: NO, classNames: ["footer-button-print-spinner"], icon: "/static/sc/0425/ip/en_us/a/resources/loading-spinner.gif" }),
																				zoomControlsView: Cv.ZoomControlsView.design({ layout: { top: 0, width: 165, bottom: 0, right: 35 }, paperViewBinding: SC.Binding.oneWay(".parentView.parentView.paperView") }),
																				pageCountView: SC.LabelView.design({
																								layout: { top: 4, right: 225, height: 15, left: SC.LAYOUT_AUTO },
																								pageCountBinding: SC.Binding.notEmpty("Cv.paperController.pageCount", "--"),
																								nowShowingPageBinding: "Cv.paperController.nowShowingPage",
																								value: function() {
																												return "_Page: %@1 of %@2".loc(this.get("nowShowingPage"), this.get("pageCount"))
																								}.property("pageCount", "nowShowingPage").cacheable()
																				}),
																				hideSidebarButtonView: SC.ButtonView.design(SCUI.ToolTip, {
																								layout: { width: 12, right: 0, top: 0, bottom: 0 },
																								titleMinWidth: 0,
																								target: "parentView.parentView.parentView",
																								action: "toggleSidebarVisibility",
																								sidebarIsVisibleBinding: ".parentView.parentView.parentView.sidebarIsVisible",
																								visibilityDidChange: function() {
																												var a = this.get("classNames").concat();
																												if (this.get("sidebarIsVisible")) {
																																a.removeObject("show-sidebar");
																																a.push("hide-sidebar")
																												} else { a.removeObject("hide-sidebar");
																																a.push("show-sidebar") } this.set("classNames", a);
																												this.set("toolTip", this.get("sidebarIsVisible") ? "_Hide sidebar".loc() : "_Show sidebar".loc())
																								}.observes("sidebarIsVisible")
																				})
																})
												})
								})
				}
});
IthenticateDv.OriginalityFilterSettingsSidebarView = Cv.OriginalityFilterSettingsSidebarView.extend({
				bodyView: SC.ScrollView.design({
								layout: { top: 38, bottom: 0, left: 0, right: 0 },
								isVisibleBinding: "Cv.originalityOptionsController.content",
								isVisibleBindingDefault: SC.Binding.oneWay().bool(),
								contentView: SC.View.design({
												childViews: function(a, b) {
																if (b === undefined) {
																				b = "generalGroupView applyChangesView loadingView".w()
																}
																return b
												}.property().cacheable(),
												loadingView: Ip.LoadingView.design({ isVisibleBinding: "Cv.originalityOptionsController.isBusy" }),
												saveOrCancelView: SC.View.design({ layout: { centerX: 0, bottom: 50, width: 300, height: 75 }, childViews: "submitChangesButton cancelChangesButton".w(), submitChangesButton: SC.ButtonView.design({ layout: { left: 0, bottom: 0, top: 0, width: 145 }, title: "Submit", isVisibleBinding: "Cv.originalityOptionsController.isDirty", action: "commitOptionChanges", target: "Cv.originalityOptionsController" }), cancelChangesButton: SC.ButtonView.design({ layout: { right: 0, bottom: 0, top: 0, width: 145 }, title: "Submit", isVisibleBinding: "Cv.originalityOptionsController.isDirty", action: "discardOptionChanges", target: "Cv.originalityOptionsController" }) }),
												generalGroupView: SC.View.design({
																layout: { top: 0, height: 400, left: 0, right: 0 },
																childViews: "labelView quotesView bibloView smallMatchesView limitMatchSizeView excludeSectionsView excludeAbstractsView excludeMethodsView excludeVariationsView".w(),
																labelView: SC.LabelView.design({ layout: { top: 0, height: 18, left: 0, right: 0 }, classNames: "sidebar-section-label", value: "_Filters".loc() }),
																quotesView: SC.View.design({
																				layout: { top: 18, height: 25, left: 0, right: 0 },
																				childViews: "quotesLabelView quotesButtonView".w(),
																				quotesLabelView: SC.LabelView.design({
																								layout: { top: 5, height: 20, left: 10, width: 230 },
																								displayProperties: ["classNames"],
																								controlSize: SC.LARGE_CONTROL_SIZE,
																								value: "_Exclude Quotes".loc(),
																								isEnabledBinding: SC.Binding.oneWay().bool("Cv.originalityOptionsController.supportsExcludeQuotes"),
																								isEnabledDidChange: function() {
																												this.invokeOnce(this._updateClassNames)
																								}.observes("isEnabled"),
																								_updateClassNames: function() {
																												var a = this.get("isEnabled");
																												var b = this.get("classNames") || [];
																												b = b.toArray();
																												if (a && (b.indexOf("disabled") !== -1)) {
																																b.removeObject("disabled");
																																this.set("classNames", b)
																												} else {
																																if (!a && (b.indexOf("disabled") === -1)) {
																																				b.pushObject("disabled");
																																				this.set("classNames", b)
																																}
																												}
																								}
																				}),
																				quotesButtonView: SC.CheckboxView.design({ layout: { top: 7, height: 18, right: 20, width: 20 }, classNames: ["exclude-quotes-checkbox"], valueBinding: "Cv.originalityOptionsController.excludeQuotes", isEnabledBinding: "Cv.originalityOptionsController.supportsExcludeQuotes" })
																}),
																bibloView: SC.View.design({
																				layout: { top: 43, height: 25, left: 0, right: 0 },
																				childViews: "biblioLabelView biblioButtonView".w(),
																				biblioLabelView: SC.LabelView.design({
																								layout: { top: 5, height: 20, left: 10, width: 230 },
																								displayProperties: ["classNames"],
																								controlSize: SC.LARGE_CONTROL_SIZE,
																								value: "_Exclude Bibliography".loc(),
																								isEnabledBinding: SC.Binding.oneWay().bool("Cv.originalityOptionsController.supportsExcludeBibliography"),
																								isEnabledDidChange: function() {
																												this.invokeOnce(this._updateClassNames)
																								}.observes("isEnabled"),
																								_updateClassNames: function() {
																												var a = this.get("isEnabled");
																												var b = this.get("classNames") || [];
																												b = b.toArray();
																												if (a && (b.indexOf("disabled") !== -1)) {
																																b.removeObject("disabled");
																																this.set("classNames", b)
																												} else {
																																if (!a && (b.indexOf("disabled") === -1)) {
																																				b.pushObject("disabled");
																																				this.set("classNames", b)
																																}
																												}
																												this.displayDidChange()
																								}
																				}),
																				biblioButtonView: SC.CheckboxView.design({ layout: { top: 7, height: 18, right: 20, width: 20 }, classNames: ["exclude-biblio-checkbox"], isEnabledBinding: "Cv.originalityOptionsController.supportsExcludeBibliography", valueBinding: "Cv.originalityOptionsController.excludeBibliography" })
																}),
																smallMatchesView: SC.View.design({
																				layout: { top: 73, bottom: 0, left: 10, right: 0 },
																				childViews: "smallMatchesLabelView smallMatchesRadioView limitByWordsView limitByPercentView".w(),
																				smallMatchesLabelView: SC.LabelView.design({
																								layout: { top: 5, height: 25, left: 0, right: -1 },
																								displayProperties: ["classNames"],
																								controlSize: SC.LARGE_CONTROL_SIZE,
																								value: "_Exclude sources that are less than:".loc(),
																								isEnabledBinding: SC.Binding.oneWay().bool("Cv.originalityOptionsController.supportsSmallMatchesExclusion"),
																								isEnabledDidChange: function() {
																												this.invokeOnce(this._updateClassNames)
																								}.observes("isEnabled"),
																								_updateClassNames: function() {
																												var a = this.get("isEnabled");
																												var b = this.get("classNames") || [];
																												b = b.toArray();
																												if (a && (b.indexOf("disabled") !== -1)) {
																																b.removeObject("disabled");
																																this.set("classNames", b)
																												} else {
																																if (!a && (b.indexOf("disabled") === -1)) {
																																				b.pushObject("disabled");
																																				this.set("classNames", b)
																																}
																												}
																								}
																				}),
																				smallMatchesRadioView: Ip.RadioView.design({
																								layout: { top: 35, bottom: 0, left: 0, right: 0 },
																								classNames: ["small-matches-radio"],
																								itemClassNameKey: "className",
																								items: [{ value: Cv.OriginalityOptions.LIMIT_BY_WORD_COUNT, title: "_words".loc(), className: "radio-offset-label" }, { value: Cv.OriginalityOptions.LIMIT_BY_PERCENT, title: "%", className: "radio-offset-label percentage" }, { value: Cv.OriginalityOptions.UNLIMITED, title: "_Don't exclude by size".loc() }],
																								render: function() {
																												arguments.callee.base.apply(this, arguments)
																								},
																								valueBinding: "Cv.originalityOptionsController.limitType",
																								itemTitleKey: "title",
																								itemValueKey: "value",
																								layoutDirection: SC.LAYOUT_VERTICAL,
																								isEnabledBinding: "Cv.originalityOptionsController.supportsSmallMatchesExclusion"
																				}),
																				limitByWordsView: SC.TextFieldView.design({
																								layout: { top: 34, height: 18, left: 30, width: 30 },
																								valueBinding: "Cv.originalityOptionsController.smallMatchWordCount",
																								isEnabledBinding: "Cv.originalityOptionsController.supportsSmallMatchesExclusion",
																								limitTypeBinding: "Cv.originalityOptionsController.limitType",
																								applyImmediately: NO,
																								didBecomeFirstResponder: function(a) {
																												this.set("limitType", Cv.OriginalityOptions.LIMIT_BY_WORD_COUNT)
																								},
																								willLoseFirstResponder: function(a) {
																												var b = this.get("value");
																												if (!b) {
																																this.set("value", 0)
																												}
																								}
																				}),
																				limitByPercentView: SC.TextFieldView.design({
																								layout: { top: 54, height: 18, left: 30, width: 30 },
																								valueBinding: "Cv.originalityOptionsController.smallMatchPercent",
																								isEnabledBinding: "Cv.originalityOptionsController.supportsSmallMatchesExclusion",
																								limitTypeBinding: "Cv.originalityOptionsController.limitType",
																								applyImmediately: NO,
																								didBecomeFirstResponder: function(a) {
																												this.set("limitType", Cv.OriginalityOptions.LIMIT_BY_PERCENT)
																								},
																								willLoseFirstResponder: function(a) {
																												var b = this.get("value");
																												if (!b) {
																																this.set("value", 0)
																												}
																								}
																				}).loc(Ip.getLocalizationHash("Cv.limitByPercentView"))
																}),
																limitMatchSizeView: SC.View.design({
																				layout: { top: 167, bottom: 0, left: 10, right: 0 },
																				childViews: "limitMatchSizeLabelView limitMatchSizeRadioView limitByMatchSizeWordsView".w(),
																				limitMatchSizeLabelView: SC.LabelView.design({
																								layout: { top: 5, height: 25, left: 0, right: -1 },
																								displayProperties: ["classNames"],
																								controlSize: SC.LARGE_CONTROL_SIZE,
																								value: "_Exclude matches that are less than:".loc(),
																								isEnabledBinding: SC.Binding.oneWay().bool("Cv.originalityOptionsController.supportsLimitMatchSizeExclusion"),
																								isEnabledDidChange: function() {
																												this.invokeOnce(this._updateClassNames)
																								}.observes("isEnabled"),
																								_updateClassNames: function() {
																												var a = this.get("isEnabled");
																												var b = this.get("classNames") || [];
																												b = b.toArray();
																												if (a && (b.indexOf("disabled") !== -1)) {
																																b.removeObject("disabled");
																																this.set("classNames", b)
																												} else {
																																if (!a && (b.indexOf("disabled") === -1)) {
																																				b.pushObject("disabled");
																																				this.set("classNames", b)
																																}
																												}
																								}
																				}),
																				limitMatchSizeRadioView: Ip.RadioView.design({
																								layout: { top: 35, bottom: 0, left: 0, right: 0 },
																								classNames: ["small-matches-radio"],
																								itemClassNameKey: "className",
																								items: [{ value: Cv.OriginalityOptions.LIMIT_BY_WORD_COUNT, title: "_words".loc(), className: "radio-offset-label" }, { value: Cv.OriginalityOptions.UNLIMITED, title: "_Don't exclude".loc() }],
																								render: function() {
																												arguments.callee.base.apply(this, arguments)
																								},
																								valueBinding: "Cv.originalityOptionsController.limitMatchSizeType",
																								itemTitleKey: "title",
																								itemValueKey: "value",
																								layoutDirection: SC.LAYOUT_VERTICAL,
																								isEnabledBinding: "Cv.originalityOptionsController.supportsLimitMatchSizeExclusion"
																				}),
																				limitByMatchSizeWordsView: SC.TextFieldView.design({
																								layout: { top: 34, height: 18, left: 30, width: 30 },
																								valueBinding: "Cv.originalityOptionsController.limitMatchSizeWordCount",
																								isEnabledBinding: "Cv.originalityOptionsController.supportsLimitMatchSizeExclusion",
																								limitMatchSizeTypeBinding: "Cv.originalityOptionsController.limitMatchSizeType",
																								applyImmediately: NO,
																								didBecomeFirstResponder: function(a) {
																												this.set("limitMatchSizeType", Cv.OriginalityOptions.LIMIT_BY_WORD_COUNT)
																								},
																								willLoseFirstResponder: function(a) {
																												var b = this.get("value");
																												if (!b) {
																																this.set("value", 0)
																												}
																								}
																				}),
																}),
																excludeSectionsView: SC.View.design({ layout: { top: 245, height: 30, left: 0, right: 0 }, childViews: "sectionsLabelView".w(), sectionsLabelView: SC.LabelView.design({ layout: { top: 5, height: 25, left: 10, width: 230 }, classNames: "exclude-sections-label", displayProperties: ["classNames"], controlSize: SC.LARGE_CONTROL_SIZE, value: "_Exclude Sections:".loc(), }), }),
																excludeAbstractsView: SC.View.design({
																				layout: { top: 270, height: 25, left: 0, right: 0 },
																				childViews: "abstractsLabelView abstractsButtonView".w(),
																				abstractsLabelView: SC.LabelView.design({
																								layout: { top: 5, height: 20, left: 20, width: 230 },
																								classNames: "exclude-sections-label",
																								displayProperties: ["classNames"],
																								controlSize: SC.LARGE_CONTROL_SIZE,
																								value: "_Abstract".loc(),
																								isEnabledBinding: SC.Binding.oneWay().bool("Cv.originalityOptionsController.supportsExcludeAbstracts"),
																								isEnabledDidChange: function() {
																												this.invokeOnce(this._updateClassNames)
																								}.observes("isEnabled"),
																								_updateClassNames: function() {
																												var a = this.get("isEnabled");
																												var b = this.get("classNames") || [];
																												b = b.toArray();
																												if (a && (b.indexOf("disabled") !== -1)) {
																																b.removeObject("disabled");
																																this.set("classNames", b)
																												} else {
																																if (!a && (b.indexOf("disabled") === -1)) {
																																				b.pushObject("disabled");
																																				this.set("classNames", b)
																																}
																												}
																								}
																				}),
																				abstractsButtonView: SC.CheckboxView.design({ layout: { top: 7, height: 18, right: 20, width: 20 }, classNames: ["exclude-abstracts-checkbox"], valueBinding: "Cv.originalityOptionsController.excludeAbstracts", isEnabledBinding: "Cv.originalityOptionsController.supportsExcludeAbstracts" })
																}),
																excludeMethodsView: SC.View.design({
																				layout: { top: 295, height: 25, left: 0, right: 0 },
																				childViews: "methodsLabelView methodsButtonView".w(),
																				methodsLabelView: SC.LabelView.design({
																								layout: { top: 5, height: 25, left: 20, width: 230 },
																								classNames: "exclude-sections-label",
																								displayProperties: ["classNames"],
																								controlSize: SC.LARGE_CONTROL_SIZE,
																								value: "_Methods and Materials".loc(),
																								isEnabledBinding: SC.Binding.oneWay().bool("Cv.originalityOptionsController.supportsExcludeMethods"),
																								isEnabledDidChange: function() {
																												this.invokeOnce(this._updateClassNames)
																								}.observes("isEnabled"),
																								_updateClassNames: function() {
																												var a = this.get("isEnabled");
																												var b = this.get("classNames") || [];
																												b = b.toArray();
																												if (a && (b.indexOf("disabled") !== -1)) {
																																b.removeObject("disabled");
																																this.set("classNames", b)
																												} else {
																																if (!a && (b.indexOf("disabled") === -1)) {
																																				b.pushObject("disabled");
																																				this.set("classNames", b)
																																}
																												}
																								}
																				}),
																				methodsButtonView: SC.CheckboxView.design({ layout: { top: 7, height: 18, right: 20, width: 20 }, classNames: ["exclude-methods-checkbox"], valueBinding: "Cv.originalityOptionsController.excludeMethods", isEnabledBinding: "Cv.originalityOptionsController.supportsExcludeMethods" })
																}),
																excludeVariationsView: SC.View.design({ layout: { top: 320, height: 20, left: 0, right: 0 }, childViews: "variationsLabelView".w(), variationsLabelView: SC.LabelView.design({ layout: { top: 5, height: 20, left: 20, width: 400 }, classNames: "exclude-sections-label", displayProperties: ["classNames"], controlSize: SC.SMALL_CONTROL_SIZE, value: "_Includes variations: Methods, Method, Materials, Materials and Methods".loc(), }), }),
												}),
												applyChangesView: SC.View.design({
																layout: { bottom: 0, height: 60, left: 0, right: 0 },
																classNames: "panel-button-set ithenticate",
																childViews: "applyChangesButtonView".w(),
																applyChangesButtonView: SC.ButtonView.design({
																				layout: { top: 12, height: 24, centerX: 0, width: 130 },
																				icon: "/static/sc/0425/cv/en_us/a/resources/images/bt-icon-filter.png",
																				title: "_Apply Changes".loc(),
																				classNames: ["panel-button", "primary"],
																				isEnabledBinding: "Cv.originalityOptionsController.isDirty",
																				mouseUp: function() {
																								var c = this.getPath("parentView.parentView.generalGroupView.smallMatchesView.limitByWordsView");
																								if (c) { c.commitEditing() }
																								var a = this.getPath("parentView.parentView.generalGroupView.smallMatchesView.limitByPercentView");
																								if (a) { a.commitEditing() }
																								var b = this.getPath("parentView.parentView.generalGroupView.limitMatchSizeView.limitByMatchSizeWordsView");
																								if (b) { b.commitEditing() }
																								return arguments.callee.base.apply(this, arguments)
																				},
																				action: function() {
																								var a = ((Cv.originalityOptionsController.get("status") & SC.Record.DIRTY) !== 0) && (Cv.originalityOptionsController.get("useMultiColorHighlighting") === Cv.userController.get("useMultiColorHighlighting"));
																								Cv.originalityOptionsController.commitOptionChanges(a)
																				}
																})
												})
								})
				})
});
Cv.OriginalitySidebarView = Cv.OriginalitySidebarView.extend({
				classicReportButtonView: SC.ButtonView.extend({
								layout: { right: 30, width: 130, height: 24, bottom: 0, maxHeight: 30 },
								classNames: ["olde-version"],
								title: "_Text-Only Report".loc(),
								action: function() {
												var a = Ip.getQueryStringParameter("lang") || "en_us";
												window.location = Cv.paperController.get("textReportURL")
								},
								target: this,
								toolTip: "_Navigate to text-only Similarity Report".loc(),
								translateLanguageBinding: "Cv.originalityController.translateLanguage",
								isVisible: function() {
												var a = Cv.translatedMatchingController.isNative();
												return a
								}.property("translateLanguage").cacheable()
				}),
				filterSettingsView: function() {
								var b = Cv.LazyLoadContainerView.design({ lazyContentView: IthenticateDv.OriginalityFilterSettingsSidebarView.design({}) });
								var a = this.createChildView(b);
								return a
				}.property().cacheable()
});
IthenticateDv.mainPage = SC.Page.design({
				mainPane: SC.MainPane.design({
								childViews: "applicationView".w(),
								defaultResponder: "Cv.paperView",
								bypassFirstTimeMessageBinding: SC.Binding.bool("Cv.userController.bypassFirstTimeMessage"),
								firstTimeMessageDisplayed: NO,
								classProductsBinding: "Cv.classController.productStatus",
								applicationView: IthenticateDv.ApplicationView.design({ layout: { top: 0, bottom: 0, left: 0, right: 0 }, classController: Cv.classController, assignmentsController: Cv.assignmentsController, assignmentStudentsController: Cv.assignmentStudentsController, assignmentController: Cv.assignmentController, paperController: Cv.paperController, paperTextSelectionController: Cv.paperTextSelectionController, servicesController: Cv.servicesController, zoomController: Cv.zoomController }),
								loadingView: Ip.LoadingView.design({
												layerId: "loading_mask",
												loadingText: "_Document Viewer is loading...".loc(),
												classNames: ["application-loading"],
												firstPageLoadedBinding: SC.Binding.bool("Cv.paperView.pageListView.firstPageHasLoaded"),
												dprStatusBinding: "Cv.paperController.dprStatusCode",
												isVisible: function() {
																var a = this.get("dprStatus");
																if (this.get("firstPageLoaded")) { this._hasBeenHidden = YES; return NO } else {
																				if (((a === 0) || (a > 0)) && (a !== Cv.DPR_CONSTANTS.DPR_SUCCESS)) {
																								this._hasBeenHidden = YES;
																								return NO
																				} else { if (this._hasBeenHidden) { return NO } }
																}
																return YES
												}.property("firstPageLoaded", "dprStatus").cacheable(),
												isVisibleDidChange: function() {
																Cv.loadingViewController.set("isShowing", this.get("isVisible"))
												}.observes("isVisible"),
												stopBenchMark: function() {
																if (this.get("firstPageLoaded")) {
																				try {
																								SC.Benchmark.end("applicationStartup");
																								var c = SC.Benchmark._statFor("applicationStartup").amt;
																								var b = SC.Benchmark._statFor("applicationBootStrap").amt;
																								var a = b + c;
																								LoadingTimer.returnResults({ pageLoadDuration: b, appLoadDuration: c, userType: Cv.get("inStudentMode") ? "student" : "instructor", readId: Cv.paperController.get("id") })
																				} catch (d) { console.log("could not gather startup info") }
																}
												}.observes("firstPageLoaded")
								})
				})
});
sc_require("core");
SC.DateTime.dayNames = "_SC.DateTime.dayNames".loc().w();
SC.DateTime.abbreviatedDayNames = "_SC.DateTime.abbreviatedDayNames".loc().w();
SC.DateTime.monthNames = "_SC.DateTime.monthNames".loc().w();
SC.DateTime.abbreviatedMonthNames = "_SC.DateTime.abbreviatedMonthNames".loc().w();
IthenticateDv.main = function main() {
				IthenticateDv.getPath("mainPage.mainPane").append();
				Cv.applicationView = IthenticateDv.getPath("mainPage.mainPane.applicationView");
				Cv.paperView = Cv.applicationView.get("paperView");
				Qmlib.store = IthenticateDv.store;
				RubricManagerCore.store = IthenticateDv.store;
				Cv.store = IthenticateDv.store;
				var b = IthenticateDv.store.find(Cv.Paper, window.config.paperId);
				Cv.paperController.set("content", b);
				var a = IthenticateDv.store.find(Cv.User, window.config.userId);
				Cv.userController.set("content", a);
				IthenticateDv.preloadImages()
};
IthenticateDv.preloadImages = function() {
				SC.imageCache.loadImage("/static/sc/0425/sproutcore/desktop/en_us/a/images/icons/shared.png");
				return
};
SC.mixin(SC.RecordArray.prototype, {
				isReady: function() {
								return (this.get("status") & SC.Record.READY) !== 0
				}.property("status").cacheable()
});
SC.mixin(SC.Record.prototype, {
				isReady: function() {
								return (this.get("status") & SC.Record.READY) !== 0
				}
});
SC.mixin(SC.XHRResponse.prototype, Ip.XHRResponse);

function main() {
				IthenticateDv.main()
};