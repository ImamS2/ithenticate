/**
 * FileUploader
 * Copyright (c) 2017 Innostudio.de
 * Website: http://innostudio.de/fileuploader/
 * Version: 1.0 (15-Mar-2017)
 * Requires: jQuery v1.7.1 or later
 * License: GPLv3 license
 */
(function($) {
				"use strict";
				$.fn.fileuploader = function(q) {
								return this.each(function(t, r) {
												var s = $(r),
																p = null,
																o = null,
																l = null,
																sl = [],
																n = $.extend(true, {}, $.fn.fileuploader.defaults, q),
																f = {
																				init: function() {
																								if (!s.closest('.fileuploader').length)
																												s.wrap('<div class="fileuploader"></div>');
																								p = s.closest('.fileuploader');
																								f.set('attrOpts');
																								if (!f.isSupported()) { n.onSupportError && $.isFunction(n.onSupportError) ? n.onSupportError(p, s) : null; return false; }
																								if (n.beforeRender && $.isFunction(n.beforeRender) && n.beforeRender(p, s) === false) { return false; }
																								f.redesign();
																								if (n.files)
																												f.files.append(n.files);
																								f.rendered = true;
																								n.afterRender && $.isFunction(n.afterRender) ? n.afterRender(l, p, o, s) : null;
																								if (!f.disabled)
																												f.bindUnbindEvents(true);
																				},
																				bindUnbindEvents: function(bind) {
																								if (bind)
																												f.bindUnbindEvents(false);
																								s[bind ? 'on' : 'off'](f._assets.getAllEvents(), f.onEvent);
																								if (n.changeInput && o !== s)
																												o[bind ? 'on' : 'off']('click', f.clickHandler);
																								if (n.dragDrop && f.isUploadMode() && n.dragDrop.container.length) { n.dragDrop.container[bind ? 'on' : 'off']('drag dragstart dragend dragover dragenter dragleave drop', function(e) { e.preventDefault(); });
																												n.dragDrop.container[bind ? 'on' : 'off']('drop', f.dragDrop.onDrop);
																												n.dragDrop.container[bind ? 'on' : 'off']('dragover', f.dragDrop.onDragEnter);
																												n.dragDrop.container[bind ? 'on' : 'off']('dragleave', f.dragDrop.onDragLeave); }
																								if (f.isUploadMode() && n.clipboardPaste)
																												$(window)[bind ? 'on' : 'off']('paste', f.clipboard.paste);
																								s.closest('form')[bind ? 'on' : 'off']('reset', f.reset);
																				},
																				redesign: function() {
																								o = s;
																								if (n.theme)
																												p.addClass('fileuploader-theme-' + n.theme);
																								if (n.changeInput) {
																												switch ((typeof n.changeInput + "").toLowerCase()) {
																																case 'boolean':
																																				o = $('<div class="fileuploader-input">' +
																																								'<div class="fileuploader-input-caption"><span>' + f._assets.textParse(n.captions.feedback) + '</span></div>' +
																																								'<div class="fileuploader-input-button"><span>' + f._assets.textParse(n.captions.button) + '</span></div>' +
																																								'</div>');
																																				break;
																																case 'string':
																																				if (n.changeInput != ' ')
																																								o = $(f._assets.textParse(n.changeInput, n));
																																				break;
																																case 'object':
																																				o = $(n.changeInput);
																																				break;
																																case 'function':
																																				o = $(n.changeInput(s, p, n, f._assets.textParse));
																																				break;
																												}
																												s.after(o);
																												s.css({ position: "absolute", "z-index": "-9999", height: '0', width: '0', padding: '0', margin: '0', "line-height": '0', outline: '0', border: '0', opacity: '0' });
																								}
																								if (n.thumbnails)
																												f.thumbnails.create();
																								if (n.dragDrop) { n.dragDrop = typeof(n.dragDrop) != 'object' ? { container: null } : n.dragDrop;
																												n.dragDrop.container = n.dragDrop.container ? $(n.dragDrop.container) : o; }
																				},
																				clickHandler: function(e) {
																								e.preventDefault();
																								if (f.clipboard._timer) { f.clipboard.clean(); return; }
																								s.click();
																				},
																				onEvent: function(e) {
																								switch (e.type) {
																												case 'focus':
																																p ? p.addClass('fileuploader-focused') : null; break;
																												case 'blur':
																																p ? p.removeClass('fileuploader-focused') : null; break;
																												case 'change':
																																f.onChange.call(this); break; }
																								n.listeners && $.isFunction(n.listeners[e.type]) ? n.listeners[e.type].call(s, p) : null;
																				},
																				set: function(type, value) {
																								switch (type) {
																												case 'attrOpts':
																																var d = ['limit', 'maxSize', 'fileMaxSize', 'extensions', 'changeInput', 'theme', 'addMore', 'listInput', 'files'];
																																for (var k in d) {
																																				var j = 'data-fileuploader-' + d[k];
																																				if (f._assets.hasAttr(j)) {
																																								switch (d[k]) {
																																												case 'changeInput':
																																												case 'addMore':
																																												case 'listInput':
																																																n[d[k]] = (['true', 'false'].indexOf(s.attr(j)) > -1 ? s.attr(j) == 'true' : s.attr(j));
																																																break;
																																												case 'extensions':
																																																n[d[k]] = s.attr(j)
																																																				.replace(/ /g, '')
																																																				.split(',');
																																																break;
																																												case 'files':
																																																n[d[k]] = JSON.parse(s.attr(j));
																																																break;
																																												default:
																																																n[d[k]] = s.attr(j);
																																								}
																																				}
																																				s.removeAttr(j);
																																}
																																if (s.attr('disabled') != null || s.attr('readonly') != null || n.limit === 0)
																																				f.disabled = true;
																																if (!n.limit || (n.limit && n.limit >= 2)) { s.attr('multiple', 'multiple');
																																				n.inputNameBrackets && s.attr('name').slice(-2) != '[]' ? s.attr('name', s.attr('name') + '[]') : null; }
																																if (n.listInput === true) { n.listInput = $('<input type="hidden" name="fileuploader-list-' + s.attr('name').replace('[]', '').split('[').pop().replace(']', '') + '">').insertBefore(s); }
																																if (typeof n.listInput == "string" && $(n.listInput).length == 0) { n.listInput = $('<input type="hidden" name="' + n.listInput + '">').insertBefore(s); }
																																f.set('disabled', f.disabled);
																																if (!n.fileMaxSize && n.maxSize)
																																				n.fileMaxSize = n.maxSize;
																																break;
																												case 'disabled':
																																f.disabled = value;
																																p[f.disabled ? 'addClass' : 'removeClass']('fileuploader-disabled');
																																s[f.disabled ? 'attr' : 'removeAttr']('disabled', 'disabled');
																																if (f.rendered)
																																				f.bindUnbindEvents(!value);
																																break;
																												case 'feedback':
																																if (!value)
																																				value = f._assets.textParse(f._itFl.length > 0 ? n.captions.feedback2 : n.captions.feedback, { length: f._itFl.length });
																																$(!o.is(':file')) ? o.find('.fileuploader-input-caption span').html(value) : null;
																																break;
																												case 'input':
																																var el = f._assets.copyAllAttributes($('<input type="file">'), s, true);
																																f.bindUnbindEvents(false);
																																s.after(s = el).remove();
																																f.bindUnbindEvents(true);
																																break;
																												case 'prevInput':
																																if (sl.length > 0) { f.bindUnbindEvents(false);
																																				sl[value].remove();
																																				sl.splice(value, 1);
																																				s = sl[sl.length - 1];
																																				f.bindUnbindEvents(true); }
																																break;
																												case 'nextInput':
																																var el = f._assets.copyAllAttributes($('<input type="file">'), s);
																																f.bindUnbindEvents(false);
																																if (sl.length > 0 && sl[sl.length - 1].get(0).files.length == 0) { s = sl[sl.length - 1]; } else { sl.indexOf(s) == -1 ? sl.push(s) : null;
																																				sl.push(el);
																																				s.after(s = el); }
																																f.bindUnbindEvents(true);
																																break;
																												case 'listInput':
																																if (n.listInput)
																																				n.listInput.val(value === null ? f.files.list(true) : value);
																																break;
																								}
																				},
																				onChange: function(e, fileList) {
																								var files = s.get(0).files;
																								if (fileList) { if (fileList.length) { files = fileList; } else { f.set('input', '');
																																f.files.clear(); return false } }
																								if (f.clipboard._timer)
																												f.clipboard.clean();
																								if (f.isDefaultMode()) {
																												f.reset();
																												if (files.length == 0)
																																return;
																								}
																								if (n.beforeSelect && $.isFunction(n.beforeSelect) && n.beforeSelect(files, l, p, o, s) == false) { return false }
																								var t = 0;
																								for (var i = 0; i < files.length; i++) {
																												var file = files[i],
																																item = f._itFl[f.files.add(file, 'choosed')],
																																status = f.files.check(item, files, i == 0);
																												if (status !== true) {
																																f.files.remove(item, true);
																																if (!status[2]) {
																																				if (f.isDefaultMode()) { f.set('input', '');
																																								f.reset();
																																								status[3] = true; }
																																				status[1] ? n.dialogs.alert(status[1]) : null;
																																}
																																if (status[3]) { break; }
																																continue;
																												}
																												if (n.thumbnails)
																																f.thumbnails.item(item);
																												if (f.isUploadMode())
																																f.upload.prepare(item);
																												n.onSelect && $.isFunction(n.onSelect) ? n.onSelect(item, l, p, o, s) : null;
																												t++;
																								}
																								if (f.isUploadMode() && t > 0)
																												f.set('input', '');
																								f.set('feedback', null);
																								if (f.isAddMoreMode() && t > 0) { f.set('nextInput'); }
																								f.set('listInput', null);
																								n.afterSelect && $.isFunction(n.afterSelect) ? n.afterSelect(l, p, o, s) : null;
																				},
																				thumbnails: {
																								create: function() {
																												n.thumbnails.beforeShow != null && $.isFunction(n.thumbnails.beforeShow) ? n.thumbnails.beforeShow(p, o, s) : null;
																												var box = $(f._assets.textParse(n.thumbnails.box)).appendTo(n.thumbnails.boxAppendTo ? n.thumbnails.boxAppendTo : p);
																												l = !box.is(n.thumbnails._selectors.list) ? box.find(n.thumbnails._selectors.list) : box;
																												if (f.isUploadMode() && n.thumbnails._selectors.start) {
																																l.on('click', n.thumbnails._selectors.start, function(e) {
																																				e.preventDefault();
																																				if (f.locked)
																																								return false;
																																				var m = $(this).closest(n.thumbnails._selectors.item),
																																								item = f.files.find(m);
																																				if (item)
																																								f.upload.send(item, true);
																																});
																												}
																												if (f.isUploadMode() && n.thumbnails._selectors.retry) {
																																l.on('click', n.thumbnails._selectors.retry, function(e) {
																																				e.preventDefault();
																																				if (f.locked)
																																								return false;
																																				var m = $(this).closest(n.thumbnails._selectors.item),
																																								item = f.files.find(m);
																																				if (item)
																																								f.upload.retry(item);
																																});
																												}
																												if (n.thumbnails._selectors.remove) {
																																l.on('click', n.thumbnails._selectors.remove, function(e) {
																																				e.preventDefault();
																																				if (f.locked)
																																								return false;
																																				var m = $(this).closest(n.thumbnails._selectors.item),
																																								item = f.files.find(m),
																																								c = function(a) { f.files.remove(item); };
																																				if (item) { if (item.upload && item.upload.status != 'successful') { f.upload.cancel(item); } else { if (n.thumbnails.removeConfirmation) { n.dialogs.confirm(f._assets.textParse(n.captions.removeConfirmation, item), c); } else { c(); } } }
																																});
																												}
																								},
																								clear: function() {
																												if (l)
																																l.html('');
																								},
																								item: function(item) { item.icon = f.thumbnails.generateFileIcon(item.format, item.extension);
																												item.image = '<div class="fileuploader-item-image fileuploader-loading"></div>';
																												item.progressBar = f.isUploadMode() ? '<div class="fileuploader-progressbar"><div class="bar"></div></div>' : '';
																												item.html = $(f._assets.textParse(item.appended && n.thumbnails.item2 ? n.thumbnails.item2 : n.thumbnails.item, item, true));
																												item.progressBar = item.html.find('.fileuploader-progressbar');
																												item.html.addClass('file-type-' + (item.format ? item.format : 'no') + ' file-ext-' + (item.extension ? item.extension : 'no') + '');
																												item.html[n.thumbnails.itemPrepend ? 'prependTo' : 'appendTo'](l);
																												item.renderImage = function() { f.thumbnails.renderImage(item, true); };
																												f.thumbnails.renderImage(item);
																												n.thumbnails.onItemShow != null && $.isFunction(n.thumbnails.onItemShow) ? n.thumbnails.onItemShow(item, l, p, o, s) : null; },
																								generateFileIcon: function(format, extension) {
																												var el = '<div style="${style}" class="fileuploader-item-icon' + '${class}"><i>' + (extension ? extension : '') + '</i></div>';
																												var bgColor = f._assets.textToColor(extension);
																												if (bgColor) {
																																var isBgColorBright = f._assets.isBrightColor(bgColor);
																																if (isBgColorBright)
																																				el = el.replace('${class}', ' is-bright-color');
																																el = el.replace('${style}', 'background-color: ' + bgColor);
																												}
																												return el.replace('${style}', '').replace('${class}', '');
																								},
																								renderImage: function(item, force_render) {
																												var m = item.html.find('.fileuploader-item-image'),
																																setImageThumb = function(img) {
																																				var $img = $(img);
																																				if ($img.is('img'))
																																								$img.on('load error', function(e) {
																																												if (e.type == 'error')
																																																setIconThumb();
																																												renderNextItem();
																																												n.thumbnails.onImageLoaded != null && $.isFunction(n.thumbnails.onImageLoaded) ? n.thumbnails.onImageLoaded(item, l, p, o, s) : null;
																																								});
																																				if ($img.is('canvas'))
																																								n.thumbnails.onImageLoaded != null && $.isFunction(n.thumbnails.onImageLoaded) ? n.thumbnails.onImageLoaded(item, l, p, o, s) : null;
																																				m.removeClass('fileupload-no-thumbnail fileuploader-loading').html($img);
																																},
																																setIconThumb = function() { m.addClass('fileupload-no-thumbnail');
																																				m.removeClass('fileuploader-loading').html(item.icon); },
																																renderNextItem = function() {
																																				var i = 0;
																																				if (item && f._pfrL.indexOf(item) > -1) {
																																								f._pfrL.splice(f._pfrL.indexOf(item), 1);
																																								while (i < f._pfrL.length) {
																																												if (f._itFl.indexOf(f._pfrL[i]) > -1) { f.thumbnails.renderImage(f._pfrL[i], true); break; } else { f._pfrL.splice(i, 1); }
																																												i++;
																																								}
																																				}
																																};
																												if (!m.length) { renderNextItem(); return; }
																												item.image = m;
																												if (item.format == "image" && f.isFileReaderSupported() && (item.appended || n.thumbnails.startImageRenderer || force_render)) {
																																if (n.thumbnails.synchronImages) { f._pfrL.indexOf(item) == -1 && !force_render ? f._pfrL.push(item) : null; if (f._pfrL.length > 1 && !force_render) { return; } }
																																var y = new FileReader(),
																																				onload = function(e) {
																																								if (n.thumbnails.canvasImage) {
																																												var canvas = document.createElement('canvas'),
																																																context = canvas.getContext('2d'),
																																																img = new Image();
																																												img.onload = function() {
																																																var height = n.thumbnails.canvasImage.height ? n.thumbnails.canvasImage.height : m.height(),
																																																				width = n.thumbnails.canvasImage.width ? n.thumbnails.canvasImage.width : m.width(),
																																																				heightRatio = img.height / height,
																																																				widthRatio = img.width / width,
																																																				optimalRatio = heightRatio < widthRatio ? heightRatio : widthRatio,
																																																				optimalHeight = img.height / optimalRatio,
																																																				optimalWidth = img.width / optimalRatio,
																																																				steps = Math.ceil(Math.log(img.width / optimalWidth) / Math.log(2));
																																																canvas.height = height;
																																																canvas.width = width;
																																																if (img.width < canvas.width || img.height < canvas.height || steps <= 1) { var x = img.width < canvas.width ? canvas.width / 2 - img.width / 2 : img.width > canvas.width ? -(img.width - canvas.width) / 2 : 0,
																																																								y = img.height < canvas.height ? canvas.height / 2 - img.height / 2 : 0;
																																																				context.drawImage(img, x, y, img.width, img.height); } else { var oc = document.createElement('canvas'),
																																																								octx = oc.getContext('2d');
																																																				oc.width = img.width * 0.5;
																																																				oc.height = img.height * 0.5;
																																																				octx.fillStyle = "#fff";
																																																				octx.fillRect(0, 0, oc.width, oc.height);
																																																				octx.drawImage(img, 0, 0, oc.width, oc.height);
																																																				octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
																																																				context.drawImage(oc, optimalWidth > canvas.width ? optimalWidth - canvas.width : 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, optimalWidth, optimalHeight); }
																																																img = null;
																																																if (!f._assets.isBlankCanvas(canvas)) { setImageThumb(canvas); } else { setIconThumb(); }
																																																renderNextItem();
																																												};
																																												img.onerror = function(text) { setIconThumb();
																																																renderNextItem(); };
																																												img.src = e.target.result;
																																								} else { setImageThumb('<img src="' + e.target.result + '" draggable="false">'); }
																																				};
																																if (typeof item.file == "string") { onload({ target: { result: item.file } }); } else { y.onload = onload;
																																				y.readAsDataURL(item.file); }
																																return;
																												}
																												setIconThumb();
																								}
																				},
																				upload: {
																								prepare: function(item, force_send) {
																												item.upload = { url: n.upload.url, data: n.upload.data || {}, formData: new FormData(), type: n.upload.type || 'POST', enctype: n.upload.enctype || 'multipart/form-data', cache: false, contentType: false, processData: false, status: null, send: function() { f.upload.send(item, true); }, cancel: function() { f.upload.cancel(item); }, retry: function() { f.upload.retry(item); }, };
																												item.upload.formData.append(s.attr('name'), item.file, (item.name ? item.name : false));
																												if (n.upload.start || force_send)
																																f.upload.send(item, force_send);
																								},
																								send: function(item, force_send) {
																												if (!item.upload)
																																return;
																												var setItemUploadStatus = function(status) { item.html.removeClass('upload-pending upload-loading upload-cancelled upload-failed upload-success').addClass('upload-' + (status || item.upload.status)); },
																																loadNextItem = function() {
																																				var i = 0;
																																				if (f._pfuL.length > 0) {
																																								f._pfuL.indexOf(item) > -1 ? f._pfuL.splice(f._pfuL.indexOf(item), 1) : null;
																																								while (i < f._pfuL.length) {
																																												if (f._itFl.indexOf(f._pfuL[i]) > -1 && f._pfuL[i].upload && !f._pfuL[i].upload.$ajax) { f.upload.send(f._pfuL[i], true); break; } else { f._pfuL.splice(i, 1); }
																																												i++;
																																								}
																																				}
																																};
																												if (n.upload.synchron) {
																																item.upload.status = 'pending';
																																if (item.html)
																																				setItemUploadStatus();
																																if (force_send) { f._pfuL.indexOf(item) > -1 ? f._pfuL.splice(f._pfuL.indexOf(item), 1) : null; } else { f._pfuL.indexOf(item) == -1 ? f._pfuL.push(item) : null; if (f._pfuL.length > 1) { return; } }
																												}
																												if (n.upload.beforeSend && $.isFunction(n.upload.beforeSend) && n.upload.beforeSend(item, l, p, o, s) === false) { setItemUploadStatus();
																																loadNextItem(); return; }
																												p.addClass('fileuploader-is-uploading');
																												if (item.upload.$ajax)
																																item.upload.$ajax.abort();
																												delete item.upload.$ajax;
																												delete item.upload.send;
																												item.upload.status = 'loading';
																												if (item.html) {
																																if (n.thumbnails._selectors.start)
																																				item.html.find(n.thumbnails._selectors.start).remove();
																																setItemUploadStatus();
																												}
																												if (item.upload.data) { for (var k in item.upload.data) { item.upload.formData.append(k, item.upload.data[k]); } }
																												item.upload.data = item.upload.formData;
																												item.upload.xhr = function() {
																																var xhr = $.ajaxSettings.xhr(),
																																				xhrStartedAt = new Date();
																																if (xhr.upload) { xhr.upload.addEventListener("progress", function(e) { f.upload.progressHandling(e, item, xhrStartedAt) }, false); }
																																return xhr
																												};
																												item.upload.complete = function(jqXHR, textStatus) {
																																loadNextItem();
																																var g = true;
																																$.each(f._itFl, function(i, a) {
																																				if (a.upload && a.upload.$ajax)
																																								g = false;
																																});
																																if (g) { p.removeClass('fileuploader-is-uploading');
																																				n.upload.onComplete != null && typeof n.upload.onComplete == "function" ? n.upload.onComplete(l, p, o, s, jqXHR, textStatus) : null; }
																												};
																												item.upload.success = function(data, textStatus, jqXHR) {
																																item.uploaded = true;
																																delete item.upload;
																																item.upload = { status: 'successful' };
																																if (item.html)
																																				setItemUploadStatus();
																																f.set('listInput', null);
																																n.upload.onSuccess != null && $.isFunction(n.upload.onSuccess) ? n.upload.onSuccess(data, item, l, p, o, s, textStatus, jqXHR) : null
																												};
																												item.upload.error = function(jqXHR, textStatus, errorThrown) {
																																item.uploaded = false;
																																item.upload.status = item.upload.status == 'cancelled' ? item.upload.status : 'failed';
																																delete item.upload.$ajax;
																																if (item.html)
																																				setItemUploadStatus();
																																n.upload.onError != null && $.isFunction(n.upload.onError) ? n.upload.onError(item, l, p, o, s, jqXHR, textStatus, errorThrown) : null
																												};
																												item.upload.$ajax = $.ajax(item.upload);
																								},
																								cancel: function(item) { if (item && item.upload) { item.upload.status = 'cancelled';
																																item.upload.$ajax ? item.upload.$ajax.abort() : null;
																																delete item.upload.$ajax;
																																f.files.remove(item); } },
																								retry: function(item) {
																												if (item && item.upload) {
																																if (item.html && n.thumbnails._selectors.retry)
																																				item.html.find(n.thumbnails._selectors.retry).remove();
																																f.upload.prepare(item, true);
																												}
																								},
																								progressHandling: function(e, item, xhrStartedAt) { if (e.lengthComputable) { var loaded = e.loaded,
																																				total = e.total,
																																				percentage = Math.round(loaded * 100 / total),
																																				secondsElapsed = (new Date().getTime() - xhrStartedAt.getTime()) / 1000,
																																				bytesPerSecond = secondsElapsed ? loaded / secondsElapsed : 0,
																																				remainingBytes = total - loaded,
																																				secondsRemaining = secondsElapsed ? remainingBytes / bytesPerSecond : null,
																																				data = { loaded: loaded, loadedInFormat: f._assets.bytesToText(loaded), total: total, totalInFormat: f._assets.bytesToText(total), percentage: percentage, secondsElapsed: secondsElapsed, secondsElapsedInFormat: f._assets.secondsToText(secondsElapsed, true), bytesPerSecond: bytesPerSecond, bytesPerSecondInFormat: f._assets.bytesToText(bytesPerSecond) + '/s', remainingBytes: remainingBytes, remainingBytesInFormat: f._assets.bytesToText(remainingBytes), secondsRemaining: secondsRemaining, secondsRemainingInFormat: f._assets.secondsToText(secondsRemaining, true) };
																																n.upload.onProgress && $.isFunction(n.upload.onProgress) ? n.upload.onProgress(data, item, l, p, o, s) : null; } }
																				},
																				dragDrop: {
																								onDragEnter: function(e) { clearTimeout(f.dragDrop._timer);
																												n.dragDrop.container.addClass('fileuploader-dragging');
																												f.set('feedback', f._assets.textParse(n.captions.drop));
																												n.dragDrop.onDragEnter != null && $.isFunction(n.dragDrop.onDragEnter) ? n.dragDrop.onDragEnter(e, l, p, o, s) : null; },
																								onDragLeave: function(e) {
																												clearTimeout(f.dragDrop._timer);
																												f.dragDrop._timer = setTimeout(function(e) {
																																if (!f.dragDrop._dragLeaveCheck(e)) { return false; }
																																n.dragDrop.container.removeClass('fileuploader-dragging');
																																f.set('feedback', null);
																																n.dragDrop.onDragLeave != null && $.isFunction(n.dragDrop.onDragLeave) ? n.dragDrop.onDragLeave(e, l, p, o, s) : null;
																												}, 100, e);
																								},
																								onDrop: function(e) {
																												clearTimeout(f.dragDrop._timer);
																												n.dragDrop.container.removeClass('fileuploader-dragging');
																												f.set('feedback', null);
																												if (e && e.originalEvent && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length) { f.onChange(e, e.originalEvent.dataTransfer.files); }
																												n.dragDrop.onDrop != null && $.isFunction(n.dragDrop.onDrop) ? n.dragDrop.onDrop(e, l, p, o, s) : null;
																								},
																								_dragLeaveCheck: function(e) {
																												var related = $(e.currentTarget),
																																insideEls;
																												if (!related.is(n.dragDrop.container)) { insideEls = n.dragDrop.container.find(related); if (insideEls.length) { return false; } }
																												return true;
																								}
																				},
																				clipboard: {
																								paste: function(e) {
																												if (!f._assets.isIntoView(o) || !e.originalEvent.clipboardData || !e.originalEvent.clipboardData.items || !e.originalEvent.clipboardData.items.length)
																																return;
																												var items = e.originalEvent.clipboardData.items;
																												f.clipboard.clean();
																												for (var i = 0; i < items.length; i++) {
																																if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("text/uri-list") !== -1) {
																																				var blob = items[i].getAsFile(),
																																								date = new Date(),
																																								addZero = function(x) {
																																												if (x < 10)
																																																x = "0" + x;
																																												return x;
																																								},
																																								ms = n.clipboardPaste > 1 ? n.clipboardPaste : 2000;
																																				if (blob) { blob.name = 'Clipboard ' + date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + '-' + addZero(date.getMinutes()) + '-' + addZero(date.getSeconds());
																																								blob.name += blob.type.indexOf("/") != -1 ? "." + blob.type.split("/")[1].toString().toLowerCase() : ".png";
																																								f.set('feedback', f._assets.textParse(n.captions.paste, { ms: ms / 1000 }));
																																								f.clipboard._timer = setTimeout(function() { f.set('feedback', null);
																																												f.onChange(e, [blob]); }, ms - 2); }
																																}
																												}
																								},
																								clean: function() { if (f.clipboard._timer) { clearTimeout(f.clipboard._timer);
																																delete f.clipboard._timer;
																																f.set('feedback', null); } }
																				},
																				files: {
																								add: function(file, prop) { var name = file.name,
																																size = file.size,
																																size2 = f._assets.bytesToText(size),
																																type = file.type,
																																format = type ? type.split('/', 1).toString().toLowerCase() : '',
																																extension = name.indexOf('.') != -1 ? name.split('.').pop().toLowerCase() : '',
																																title = name.substr(0, name.length - (name.indexOf('.') != -1 ? extension.length + 1 : extension.length)),
																																data = file.data,
																																file = file.file || file,
																																index, item;
																												f._itFl.push({ name: name, title: title, size: size, size2: size2, type: type, format: format, extension: extension, data: data, file: file, input: prop == 'choosed' ? s : null, html: null, upload: null, choosed: prop == 'choosed', appended: prop == 'appended', uploaded: prop == 'uploaded' });
																												index = f._itFl.length - 1;
																												item = f._itFl[index];
																												item.remove = function() { f.files.remove(item); }; return index; },
																								list: function(toJson, customKey, triggered) {
																												var files = [];
																												$.each(f._itFl, function(i, a) {
																																if (a.upload && !a.uploaded)
																																				return;
																																var file = a;
																																if (toJson || customKey) { file = (file.choosed ? '0:/' : '') + (customKey && f.files.getItemAttr(a, customKey) !== null ? f.files.getItemAttr(a, customKey) : a[typeof a.file == "string" ? "file" : "name"]); }
																																files.push(file);
																												});
																												files = n.onListInput && $.isFunction(n.onListInput) && !triggered ? n.onListInput(f._itFl, n.listInput, l, p, o, s) : files;
																												return !toJson ? files : JSON.stringify(files);
																								},
																								check: function(item, files, fullCheck) {
																												var r = ["warning", null, false, false];
																												if (n.limit != null && fullCheck && files.length + f._itFl.length - 1 > n.limit) { r[1] = f._assets.textParse(n.captions.errors.filesLimit);
																																r[3] = true; return r; }
																												if (n.maxSize != null && fullCheck) { var g = 0;
																																$.each(f._itFl, function(i, a) { g += a.size; });
																																g -= item.size;
																																$.each(files, function(i, a) { g += a.size; }); if (g > Math.round(n.maxSize * 1e+6)) { r[1] = f._assets.textParse(n.captions.errors.filesSizeAll);
																																				r[3] = true; return r; } }
																												if (n.onFilesCheck != null && $.isFunction(n.onFilesCheck) && fullCheck) { var onFilesCheck = n.onFilesCheck(files, n, l, p, o, s); if (onFilesCheck === false) { r[3] = true; return r; } }
																												if (n.extensions != null && $.inArray(item.extension, n.extensions) == -1 && $.inArray(item.type, n.extensions) == -1) { r[1] = f._assets.textParse(n.captions.errors.filesType, item); return r; }
																												if (n.fileMaxSize != null && item.size > n.fileMaxSize * 1e+6) { r[1] = f._assets.textParse(n.captions.errors.fileSize, item); return r; }
																												if (item.size == 4096 && item.type == "") { r[1] = f._assets.textParse(n.captions.errors.folderUpload, item); return r; }
																												if (true) {
																																var g = false;
																																$.each(f._itFl, function(i, a) {
																																				if (a != item && a.choosed == true && a.file && a.file.name == item.name) {
																																								g = true;
																																								if (a.file.size == item.size && a.file.type == item.type && (item.file.lastModified && a.file.lastModified ? a.file.lastModified == item.file.lastModified : true)) { r[2] = true; } else { r[1] = f._assets.textParse(n.captions.errors.fileName, item);
																																												r[2] = false; }
																																								return false;
																																				}
																																});
																																if (g) { return r; }
																												}
																												return true;
																								},
																								append: function(files) {
																												files = $.isArray(files) ? files : [files];
																												if (files.length) {
																																var item;
																																for (var i = 0; i < files.length; i++) { item = f._itFl[f.files.add(files[i], 'appended')];
																																				n.thumbnails ? f.thumbnails.item(item) : null; }
																																f.set('feedback', null);
																																f.set('listInput', null);
																																n.afterSelect && $.isFunction(n.afterSelect) ? n.afterSelect(l, p, o, s) : null;
																																return files.length == 1 ? item : true;
																												}
																								},
																								find: function(html) { var item = null;
																												$.each(f._itFl, function(i, a) { if (a.html && a.html.is(html)) { item = a; return false; } }); return item; },
																								remove: function(item, isFromCheck) {
																												if (!isFromCheck && n.onRemove && $.isFunction(n.onRemove) && n.onRemove(item, l, p, o, s) === false)
																																return;
																												if (item.html)
																																n.thumbnails.onItemRemove && $.isFunction(n.thumbnails.onItemRemove) && !isFromCheck ? n.thumbnails.onItemRemove(item.html, l, p, o, s) : item.html.remove();
																												if (item.upload && item.upload.$ajax && item.upload.cancel)
																																item.upload.cancel();
																												if (item.input) { var g = true;
																																$.each(f._itFl, function(i, a) { if (item != a && (item.input == a.input || (isFromCheck && item.input.get(0).files.length > 1))) { g = false; return false; } }); if (g) { if (f.isAddMoreMode() && sl.length > 1) { sl.splice(sl.indexOf(item.input), 1);
																																								item.input.remove();
																																								f.set('nextInput'); } else { f.set('input', ''); } } }
																												f._pfrL.indexOf(item) > -1 ? f._pfrL.splice(f._pfrL.indexOf(item), 1) : null;
																												f._pfuL.indexOf(item) > -1 ? f._pfuL.splice(f._pfuL.indexOf(item), 1) : null;
																												f._itFl.indexOf(item) > -1 ? f._itFl.splice(f._itFl.indexOf(item), 1) : null;
																												item = null;
																												f._itFl.length == 0 ? f.reset() : null;
																												f.set('feedback', null);
																												f.set('listInput', null);
																								},
																								getItemAttr: function(item, attr) {
																												var result = null;
																												if (item) { if (typeof item[attr] != "undefined") { result = item[attr]; } else if (item.data && typeof item.data[attr] != "undefined") { result = item.data[attr]; } }
																												return result;
																								},
																								clear: function(all) {
																												var i = 0;
																												while (i < f._itFl.length) {
																																var a = f._itFl[i];
																																if (!all && a.appended) { i++; continue; }
																																if (a.html)
																																				a.html ? f._itFl[i].html.remove() : null;
																																if (a.upload && a.upload.$ajax)
																																				f.upload.cancel(a);
																																f._itFl.splice(i, 1);
																												}
																												f.set('feedback', null);
																												f.set('listInput', null);
																												f._itFl.length == 0 && n.onEmpty && typeof $.isFunction(n.onEmpty) ? n.onEmpty(l, p, o, s) : null;
																								}
																				},
																				reset: function(all) {
																								if (all) {
																												if (f.clipboard._timer)
																																f.clipboard.clean();
																												$.each(sl, function(i, a) {
																																if (i < sl.length)
																																				a.remove();
																												});
																												sl = [];
																												f.set('input', '');
																								}
																								f._itRl = [];
																								f._pfuL = [];
																								f._pfrL = [];
																								f.files.clear(all);
																				},
																				destroy: function() { f.reset(true);
																								f.bindUnbindEvents(false);
																								s.removeAttr('style');
																								s.insertBefore('.fileuploader');
																								s.prop('FileUploader', null);
																								p.remove();
																								p = o = l = null; },
																				_assets: {
																								bytesToText: function(bytes) { if (bytes == 0) return '0 Byte'; var k = 1000,
																																sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
																																i = Math.floor(Math.log(bytes) / Math.log(k)); return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]; },
																								secondsToText: function(seconds, textFormat) {
																												seconds = parseInt(Math.round(seconds), 10);
																												var hours = Math.floor(seconds / 3600),
																																minutes = Math.floor((seconds - (hours * 3600)) / 60),
																																seconds = seconds - (hours * 3600) - (minutes * 60),
																																result = "";
																												if (hours > 0 || !textFormat) { result += (hours < 10 ? "0" : "") + hours + (textFormat ? "h " : ":"); }
																												if (minutes > 0 || !textFormat) { result += (minutes < 10 && !textFormat ? "0" : "") + minutes + (textFormat ? "m " : ":"); }
																												result += (seconds < 10 && !textFormat ? "0" : "") + seconds + (textFormat ? "s" : "");
																												return result;
																								},
																								hasAttr: function(attr, el) { var el = !el ? s : el,
																																a = el.attr(attr); if (!a || typeof a == 'undefined') { return false; } else { return true; } },
																								copyAllAttributes: function(newEl, oldEl) {
																												$.each(oldEl.get(0).attributes, function() { if (this.name == 'required') return;
																																newEl.attr(this.name, this.value); });
																												if (oldEl.get(0).FileUploader)
																																newEl.get(0).FileUploader = oldEl.get(0).FileUploader;
																												return newEl;
																								},
																								getAllEvents: function(el) {
																												var el = !el ? s : el,
																																result = [];
																												el = el.get ? el.get(0) : el;
																												for (var key in el) { if (key.indexOf('on') === 0) { result.push(key.slice(2)); } }
																												return result.join(' ');
																								},
																								isIntoView: function(el) { var windowTop = $(window).scrollTop(),
																																windowBottom = windowTop + window.innerHeight,
																																elTop = el.offset().top,
																																elBottom = elTop + el.outerHeight(); return ((windowTop < elTop) && (windowBottom > elBottom)); },
																								isBlankCanvas: function(canvas) { var blank = document.createElement('canvas'),
																																result = false;
																												blank.width = canvas.width;
																												blank.height = canvas.height;
																												result = canvas.toDataURL() == blank.toDataURL();
																												blank = null; return result; },
																								textParse: function(text, opts, noOptions) {
																												opts = noOptions ? (opts || {}) : $.extend({}, { limit: n.limit, maxSize: n.maxSize, fileMaxSize: n.fileMaxSize, extensions: n.extensions ? n.extensions.join(', ') : null, }, opts);
																												switch (typeof(text)) {
																																case 'string':
																																				text = text.replace(/\$\{(.*?)\}/g, function(match, a) {
																																								var a = a.replace(/ /g, ''),
																																												r = typeof opts[a] != "undefined" && opts[a] != null ? opts[a] : '';
																																								if (a.indexOf('.') > -1 || a.indexOf('[]') > -1) { var x = a.substr(0, a.indexOf('.') > -1 ? a.indexOf('.') : a.indexOf('[') > -1 ? a.indexOf('[') : a.length),
																																																y = a.substring(x.length); if (opts[x]) { try { r = eval('opts["' + x + '"]' + y); } catch (e) { r = ''; } } }
																																								r = $.isFunction(r) ? f._assets.textParse(r) : r;
																																								return r || '';
																																				});
																																				break;
																																case 'function':
																																				text = text(opts);
																																				break;
																												}
																												opts = null;
																												return text;
																								},
																								textToColor: function(str) {
																												if (!str || str.length == 0)
																																return false;
																												for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
																												for (var i = 0, colour = '#'; i < 3; colour += ('00' + ((hash >> i++ * 2) & 0xFF)
																																				.toString(16))
																																.slice(-2));
																												return colour;
																								},
																								isBrightColor: function(color) { var getRGB = function(b) { var a; if (b && b.constructor == Array && b.length == 3) return b; if (a = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) return [parseInt(a[1]), parseInt(a[2]), parseInt(a[3])]; if (a = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b)) return [parseFloat(a[1]) * 2.55, parseFloat(a[2]) * 2.55, parseFloat(a[3]) * 2.55]; if (a = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)]; if (a = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)]; return (typeof(colors) != "undefined") ? colors[$.trim(b).toLowerCase()] : null },
																																luminance_get = function(color) { var rgb = getRGB(color); if (!rgb) return null; return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; }; return luminance_get(color) > 194; }
																				},
																				isSupported: function() { return s && s.get(0).files; },
																				isFileReaderSupported: function() { return window.File && window.FileList && window.FileReader; },
																				isDefaultMode: function() { return !n.upload && !n.addMore; },
																				isAddMoreMode: function() { return !n.upload && n.addMore; },
																				isUploadMode: function() { return n.upload; },
																				_itFl: [],
																				_pfuL: [],
																				_pfrL: [],
																				disabled: false,
																				locked: false,
																				rendered: false
																};
												if (n.enableApi) {
																s.prop('FileUploader', {
																				open: function() { s.trigger('click'); },
																				getOptions: function() { return n; },
																				getParentEl: function() { return p; },
																				getInputEl: function() { return s; },
																				getNewInputEl: function() { return o; },
																				getListEl: function() { return l; },
																				getListInputEl: function() { return n.listInput; },
																				getFiles: function() { return f._itFl; },
																				getChoosedFiles: function() { return f._itFl.filter(function(a) { return a.choosed; }); },
																				getAppendedFiles: function() { return f._itFl.filter(function(a) { return a.appended; }); },
																				getUploadedFiles: function() { return f._itFl.filter(function(a) { return a.uploaded; }); },
																				getFileList: function(toJson, customKey) { return f.files.list(toJson, customKey, true); },
																				setOption: function(option, value) { n[option] = value; return true; },
																				findFile: function(html) { return f.files.find(html); },
																				append: function(files) { return f.files.append(files); },
																				remove: function(item) {
																								item = item.jquery ? f.files.find(item) : item;
																								if (f._itFl.indexOf(item) > -1) { f.files.remove(item); return true; }
																								return false;
																				},
																				reset: function() { f.reset(true); return true; },
																				disable: function(lock) {
																								f.set('disabled', true);
																								if (lock)
																												f.locked = true;
																								return true;
																				},
																				enable: function() { f.set('disabled', false);
																								f.locked = false; return true; },
																				destroy: function() { f.destroy(); return true; },
																				isEmpty: function() { return f._itFl.length == 0; },
																				isDisabled: function() { return f.disabled; },
																				isRendered: function() { return f.rendered; },
																				assets: f._assets,
																				getPluginMode: function() {
																								if (f.isDefaultMode())
																												return 'default';
																								if (f.isAddMoreMode())
																												return 'addMore';
																								if (f.isUploadMode())
																												return 'upload';
																				}
																});
												}
												f.init();
												return this;
								});
				};
				window.$.fileuploader = { getInstance: function(input) { var $input = input.prop ? input : $(input); return $input.prop('FileUploader'); } };
				$.fn.fileuploader.defaults = {
								limit: null,
								maxSize: null,
								fileMaxSize: null,
								extensions: null,
								changeInput: true,
								inputNameBrackets: true,
								theme: 'default',
								thumbnails: {
												box: '<div class="fileuploader-items">' +
																'<ul class="fileuploader-items-list"></ul>' +
																'</div>',
												boxAppendTo: null,
												item: '<li class="fileuploader-item">' +
																'<div class="columns">' +
																'<div class="column-thumbnail">${image}</div>' +
																'<div class="column-title">' +
																'<div title="${name}">${name}</div>' +
																'<span>${size2}</span>' +
																'</div>' +
																'<div class="column-actions">' +
																'<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i></i></a>' +
																'</div>' +
																'</div>' +
																'<div class="progress-bar2">${progressBar}<span></span></div>' +
																'</li>',
												item2: '<li class="fileuploader-item">' +
																'<div class="columns">' +
																'<a href="${file}" target="_blank">' +
																'<div class="column-thumbnail">${image}</div>' +
																'<div class="column-title">' +
																'<div title="${name}">${name}</div>' +
																'<span>${size2}</span>' +
																'</div>' +
																'</a>' +
																'<div class="column-actions">' +
																'<a href="${file}" class="fileuploader-action fileuploader-action-download" title="Download" download><i></i></a>' +
																'<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i></i></a>' +
																'</div>' +
																'</div>' +
																'</li>',
												itemPrepend: false,
												removeConfirmation: true,
												startImageRenderer: true,
												synchronImages: true,
												canvasImage: true,
												_selectors: { list: '.fileuploader-items-list', item: '.fileuploader-item', start: '.fileuploader-action-start', retry: '.fileuploader-action-retry', remove: '.fileuploader-action-remove' },
												beforeShow: null,
												onItemShow: null,
												onItemRemove: function(html) { html.children().animate({ 'opacity': 0 }, 200, function() { setTimeout(function() { html.slideUp(200, function() { html.remove(); }); }, 100); }); },
												onImageLoaded: null,
								},
								files: null,
								upload: null,
								dragDrop: true,
								addMore: false,
								clipboardPaste: true,
								listInput: true,
								enableApi: false,
								listeners: null,
								onSupportError: null,
								beforeRender: null,
								afterRender: null,
								beforeSelect: null,
								onFilesCheck: null,
								onSelect: null,
								afterSelect: null,
								onListInput: null,
								onRemove: null,
								onEmpty: null,
								dialogs: { alert: function(text) { return alert(text); }, confirm: function(text, callback) { confirm(text) ? callback() : null; } },
								captions: { button: function(options) { return 'Choose ' + (options.limit == 1 ? 'File' : 'Files'); }, feedback: function(options) { return 'Choose ' + (options.limit == 1 ? 'file' : 'files') + ' to upload'; }, feedback2: function(options) { return options.length + ' ' + (options.length > 1 ? ' files were' : ' file was') + ' chosen'; }, drop: 'Drop the files here to Upload', paste: '<div class="fileuploader-pending-loader"><div class="left-half" style="animation-duration: ${ms}s"></div><div class="spinner" style="animation-duration: ${ms}s"></div><div class="right-half" style="animation-duration: ${ms}s"></div></div> Pasting a file, click here to cancel.', removeConfirmation: 'Are you sure you want to remove this file?', errors: { filesLimit: 'Only ${limit} files are allowed to be uploaded.', filesType: 'Only ${extensions} files are allowed to be uploaded.', fileSize: '${name} is too large! Please choose a file up to ${fileMaxSize}MB.', filesSizeAll: 'Files that you choosed are too large! Please upload files up to ${maxSize} MB.', fileName: 'File with the name ${name} is already selected.', folderUpload: 'You are not allowed to upload folders.' } }
				}
})(jQuery);