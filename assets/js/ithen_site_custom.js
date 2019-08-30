var JSON = {
				org: 'http://www.JSON.org',
				copyright: '(c)2005 JSON.org',
				license: 'http://www.crockford.com/JSON/license.html',
				stringify: function(arg) {
								var c, i, l, s = '',
												v;
								switch (typeof arg) {
												case 'object':
																if (arg) {
																				if (arg instanceof Array) {
																								for (i = 0; i < arg.length; ++i) {
																												v = this.stringify(arg[i]);
																												if (s) { s += ','; }
																												s += v;
																								}
																								return '[' + s + ']';
																				} else if (typeof arg.toString != 'undefined') {
																								for (i in arg) {
																												v = arg[i];
																												if (typeof v != 'undefined' && typeof v != 'function') {
																																v = this.stringify(v);
																																if (s) { s += ','; }
																																s += this.stringify(i) + ':' + v;
																												}
																								}
																								return '{' + s + '}';
																				}
																}
																return 'null';

												case 'number':
																return isFinite(arg) ? String(arg) : 'null';

												case 'string':
																l = arg.length;
																s = '"';
																for (i = 0; i < l; i += 1) {
																				c = arg.charAt(i);
																				if (c >= ' ') {
																								if (c == '\\' || c == '"') {
																												s += '\\';
																								}
																								s += c;
																				} else {
																								switch (c) {
																												case '\b':
																																s += '\\b';
																																break;

																												case '\f':
																																s += '\\f';
																																break;

																												case '\n':
																																s += '\\n';
																																break;

																												case '\r':
																																s += '\\r';
																																break;

																												case '\t':
																																s += '\\t';
																																break;

																												default:
																																c = c.charCodeAt();
																																s += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
																								}
																				}
																}
																return s + '"';

												case 'boolean':
																return String(arg);
												default:
																return 'null';
								}
				},
				parse: function(text) {
								var at = 0;
								var ch = ' ';

								function error(m) {
												throw {
																name: 'JSONError',
																message: m,
																at: at - 1,
																text: text
												};
								}

								function next() {
												ch = text.charAt(at);
												at += 1;
												return ch;
								}

								function white() {
												while (ch != '' && ch <= ' ') {
																next();
												}
								}

								function str() {
												var i, s = '',
																t, u;
												if (ch == '"') {
																outer: while (next()) {
																				if (ch == '"') {
																								next();
																								return s;
																				} else if (ch == '\\') {
																								switch (next()) {
																												case 'b':
																																s += '\b';
																																break;

																												case 'f':
																																s += '\f';
																																break;

																												case 'n':
																																s += '\n';
																																break;

																												case 'r':
																																s += '\r';
																																break;

																												case 't':
																																s += '\t';
																																break;

																												case 'u':
																																u = 0;
																																for (i = 0; i < 4; i += 1) {
																																				t = parseInt(next(), 16);
																																				if (!isFinite(t)) {
																																								break outer;
																																				}
																																				u = u * 16 + t;
																																}
																																s += String.fromCharCode(u);
																																break;

																												default:
																																s += ch;
																								}
																				} else {
																								s += ch;
																				}
																}
												}
												error("Bad string");
								}

								function arr() {
												var a = [];
												if (ch == '[') {
																next();
																white();
																if (ch == ']') {
																				next();
																				return a;
																}
																while (ch) {
																				a.push(val());
																				white();
																				if (ch == ']') {
																								next();
																								return a;
																				} else if (ch != ',') {
																								break;
																				}
																				next();
																				white();
																}
												}
												error("Bad array");
								}

								function obj() {
												var k, o = {};
												if (ch == '{') {
																next();
																white();
																if (ch == '}') {
																				next();
																				return o;
																}
																while (ch) {
																				k = str();
																				white();
																				if (ch != ':') {
																								break;
																				}
																				next();
																				o[k] = val();
																				white();
																				if (ch == '}') {
																								next();
																								return o;
																				} else if (ch != ',') {
																								break;
																				}
																				next();
																				white();
																}
												}
												error("Bad object");
								}

								function num() {
												var n = '',
																v;
												if (ch == '-') {
																n = '-';
																next();
												}
												while (ch >= '0' && ch <= '9') {
																n += ch;
																next();
												}
												if (ch == '.') {
																n += '.';
																while (next() && ch >= '0' && ch <= '9') {
																				n += ch;
																}
												}
												if (ch == 'e' || ch == 'E') {
																n += 'e';
																next();
																if (ch == '-' || ch == '+') {
																				n += ch;
																				next();
																}
																while (ch >= '0' && ch <= '9') {
																				n += ch;
																				next();
																}
												}
												v = +n;
												if (!isFinite(v)) {
																error("Bad number");
												} else {
																return v;
												}
								}

								function word() {
												switch (ch) {
																case 't':
																				if (next() == 'r' && next() == 'u' && next() == 'e') {
																								next();
																								return true;
																				}
																				break;
																case 'f':
																				if (next() == 'a' && next() == 'l' && next() == 's' && next() == 'e') {
																								next();
																								return false;
																				}
																				break;
																case 'n':
																				if (next() == 'u' && next() == 'l' && next() == 'l') {
																								next();
																								return null;
																				}
																				break;
												}
												error("Syntax error");
								}

								function val() {
												white();
												switch (ch) {
																case '{':
																				return obj();
																case '[':
																				return arr();
																case '"':
																				return str();
																case '-':
																				return num();
																default:
																				return ch >= '0' && ch <= '9' ? num() : word();
												}
								}
								return val();
				}
};
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
if (typeof YAHOO == "undefined") {
				var YAHOO = {};
}
YAHOO.namespace = function() {
				var A = arguments,
								E = null,
								C, B, D;
				for (C = 0; C < A.length; C = C + 1) {
								D = A[C].split(".");
								E = YAHOO;
								for (B = (D[0] == "YAHOO") ? 1 : 0; B < D.length; B = B + 1) {
												E[D[B]] = E[D[B]] || {};
												E = E[D[B]];
								}
				}
				return E;
};
YAHOO.log = function(D, A, C) {
				var B = YAHOO.widget.Logger;
				if (B && B.log) {
								return B.log(D, A, C);
				} else {
								return false;
				}
};
YAHOO.register = function(A, E, D) {
				var I = YAHOO.env.modules;
				if (!I[A]) {
								I[A] = { versions: [], builds: [] };
				}
				var B = I[A],
								H = D.version,
								G = D.build,
								F = YAHOO.env.listeners;
				B.name = A;
				B.version = H;
				B.build = G;
				B.versions.push(H);
				B.builds.push(G);
				B.mainClass = E;
				for (var C = 0; C < F.length; C = C + 1) {
								F[C](B);
				}
				if (E) {
								E.VERSION = H;
								E.BUILD = G;
				} else {
								YAHOO.log("mainClass is undefined for module " + A, "warn");
				}
};
YAHOO.env = YAHOO.env || { modules: [], listeners: [] };
YAHOO.env.getVersion = function(A) {
				return YAHOO.env.modules[A] || null;
};
YAHOO.env.ua = function() {
				var C = {
								ie: 0,
								opera: 0,
								gecko: 0,
								webkit: 0
				};
				var B = navigator.userAgent,
								A;
				if ((/KHTML/).test(B)) {
								C.webkit = 1;
				}
				A = B.match(/AppleWebKit\/([^\s]*)/);
				if (A && A[1]) {
								C.webkit = parseFloat(A[1]);
				}
				if (!C.webkit) {
								A = B.match(/Opera[\s\/]([^\s]*)/);
								if (A && A[1]) {
												C.opera = parseFloat(A[1]);
								} else {
												A = B.match(/MSIE\s([^;]*)/);
												if (A && A[1]) {
																C.ie = parseFloat(A[1]);
												} else {
																A = B.match(/Gecko\/([^\s]*)/);
																if (A) {
																				C.gecko = 1;
																				A = B.match(/rv:([^\s\)]*)/);
																				if (A && A[1]) {
																								C.gecko = parseFloat(A[1]);
																				}
																}
												}
								}
				}
				return C;
}();
(function() {
				YAHOO.namespace("util", "widget", "example");
				if ("undefined" !== typeof YAHOO_config) {
								var B = YAHOO_config.listener,
												A = YAHOO.env.listeners,
												D = true,
												C;
								if (B) {
												for (C = 0; C < A.length; C = C + 1) {
																if (A[C] == B) {
																				D = false;
																				break;
																}
												}
												if (D) {
																A.push(B);
												}
								}
				}
})();
YAHOO.lang = {
				isArray: function(B) {
								if (B) {
												var A = YAHOO.lang;
												return A.isNumber(B.length) && A.isFunction(B.splice) && !A.hasOwnProperty(B.length);
								}
								return false;
				},
				isBoolean: function(A) {
								return typeof A === "boolean";
				},
				isFunction: function(A) {
								return typeof A === "function";
				},
				isNull: function(A) {
								return A === null;
				},
				isNumber: function(A) {
								return typeof A === "number" && isFinite(A);
				},
				isObject: function(A) {
								return (A && (typeof A === "object" || YAHOO.lang.isFunction(A))) || false;
				},
				isString: function(A) {
								return typeof A === "string";
				},
				isUndefined: function(A) {
								return typeof A === "undefined";
				},
				hasOwnProperty: function(A, B) {
								if (Object.prototype.hasOwnProperty) {
												return A.hasOwnProperty(B);
								}
								return !YAHOO.lang.isUndefined(A[B]) && A.constructor.prototype[B] !== A[B];
				},
				_IEEnumFix: function(C, B) {
								if (YAHOO.env.ua.ie) {
												var E = ["toString", "valueOf"],
																A;
												for (A = 0; A < E.length; A = A + 1) {
																var F = E[A],
																				D = B[F];
																if (YAHOO.lang.isFunction(D) && D != Object.prototype[F]) {
																				C[F] = D;
																}
												}
								}
				},
				extend: function(D, E, C) {
								if (!E || !D) {
												throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
								}
								var B = function() {};
								B.prototype = E.prototype;
								D.prototype = new B();
								D.prototype.constructor = D;
								D.superclass = E.prototype;
								if (E.prototype.constructor == Object.prototype.constructor) {
												E.prototype.constructor = E;
								}
								if (C) {
												for (var A in C) {
																D.prototype[A] = C[A];
												}
												YAHOO.lang._IEEnumFix(D.prototype, C);
								}
				},
				augmentObject: function(E, D) {
								if (!D || !E) {
												throw new Error("Absorb failed, verify dependencies.");
								}
								var A = arguments,
												C, F, B = A[2];
								if (B && B !== true) {
												for (C = 2; C < A.length; C = C + 1) {
																E[A[C]] = D[A[C]];
												}
								} else {
												for (F in D) {
																if (B || !E[F]) {
																				E[F] = D[F];
																}
												}
												YAHOO.lang._IEEnumFix(E, D);
								}
				},
				augmentProto: function(D, C) {
								if (!C || !D) {
												throw new Error("Augment failed, verify dependencies.");
								}
								var A = [D.prototype, C.prototype];
								for (var B = 2; B < arguments.length; B = B + 1) {
												A.push(arguments[B]);
								}
								YAHOO.lang.augmentObject.apply(this, A);
				},
				dump: function(A, G) {
								var C = YAHOO.lang,
												D, F, I = [],
												J = "{...}",
												B = "f(){...}",
												H = ", ",
												E = " => ";
								if (!C.isObject(A)) {
												return A + "";
								} else {
												if (A instanceof Date || ("nodeType" in A && "tagName" in A)) {
																return A;
												} else {
																if (C.isFunction(A)) {
																				return B;
																}
												}
								}
								G = (C.isNumber(G)) ? G : 3;
								if (C.isArray(A)) {
												I.push("[");
												for (D = 0, F = A.length; D < F; D = D + 1) {
																if (C.isObject(A[D])) {
																				I.push((G > 0) ? C.dump(A[D], G - 1) : J);
																} else {
																				I.push(A[D]);
																}
																I.push(H);
												}
												if (I.length > 1) {
																I.pop();
												}
												I.push("]");
								} else {
												I.push("{");
												for (D in A) {
																if (C.hasOwnProperty(A, D)) {
																				I.push(D + E);
																				if (C.isObject(A[D])) {
																								I.push((G > 0) ? C.dump(A[D], G - 1) : J);
																				} else {
																								I.push(A[D]);
																				}
																				I.push(H);
																}
												}
												if (I.length > 1) {
																I.pop();
												}
												I.push("}");
								}
								return I.join("");
				},
				substitute: function(Q, B, J) {
								var G, F, E, M, N, P, D = YAHOO.lang,
												L = [],
												C, H = "dump",
												K = " ",
												A = "{",
												O = "}";
								for (;;) {
												G = Q.lastIndexOf(A);
												if (G < 0) {
																break;
												}
												F = Q.indexOf(O, G);
												if (G + 1 >= F) {
																break;
												}
												C = Q.substring(G + 1, F);
												M = C;
												P = null;
												E = M.indexOf(K);
												if (E > -1) {
																P = M.substring(E + 1);
																M = M.substring(0, E);
												}
												N = B[M];
												if (J) {
																N = J(M, N, P);
												}
												if (D.isObject(N)) {
																if (D.isArray(N)) {
																				N = D.dump(N, parseInt(P, 10));
																} else {
																				P = P || "";
																				var I = P.indexOf(H);
																				if (I > -1) {
																								P = P.substring(4);
																				}
																				if (N.toString === Object.prototype.toString || I > -1) {
																								N = D.dump(N, parseInt(P, 10));
																				} else {
																								N = N.toString();
																				}
																}
												} else {
																if (!D.isString(N) && !D.isNumber(N)) {
																				N = "~-" + L.length + "-~";
																				L[L.length] = C;
																}
												}
												Q = Q.substring(0, G) + N + Q.substring(F + 1);
								}
								for (G = L.length - 1; G >= 0; G = G - 1) {
												Q = Q.replace(new RegExp("~-" + G + "-~"), "{" + L[G] + "}", "g");
								}
								return Q;
				},
				trim: function(A) {
								try {
												return A.replace(/^\s+|\s+$/g, "");
								} catch (B) {
												return A;
								}
				},
				merge: function() {
								var C = {},
												A = arguments,
												B;
								for (B = 0; B < A.length; B = B + 1) {
												YAHOO.lang.augmentObject(C, A[B], true);
								}
								return C;
				},
				isValue: function(B) {
								var A = YAHOO.lang;
								return (A.isObject(B) || A.isString(B) || A.isNumber(B) || A.isBoolean(B));
				}
};
YAHOO.util.Lang = YAHOO.lang;
YAHOO.lang.augment = YAHOO.lang.augmentProto;
YAHOO.augment = YAHOO.lang.augmentProto;
YAHOO.extend = YAHOO.lang.extend;
YAHOO.register("yahoo", YAHOO, { version: "2.3.1", build: "541" });
(function() {
				var B = YAHOO.util,
								K, I, H = 0,
								J = {},
								F = {};
				var C = YAHOO.env.ua.opera,
								L = YAHOO.env.ua.webkit,
								A = YAHOO.env.ua.gecko,
								G = YAHOO.env.ua.ie;
				var E = { HYPHEN: /(-[a-z])/i, ROOT_TAG: /^body|html$/i };
				var M = function(O) {
								if (!E.HYPHEN.test(O)) {
												return O;
								}
								if (J[O]) {
												return J[O];
								}
								var P = O;
								while (E.HYPHEN.exec(P)) {
												P = P.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase());
								}
								J[O] = P;
								return P;
				};
				var N = function(P) {
								var O = F[P];
								if (!O) {
												O = new RegExp("(?:^|\\s+)" + P + "(?:\\s+|$)");
												F[P] = O;
								}
								return O;
				};
				if (document.defaultView && document.defaultView.getComputedStyle) {
								K = function(O, R) {
												var Q = null;
												if (R == "float") {
																R = "cssFloat";
												}
												var P = document.defaultView.getComputedStyle(O, "");
												if (P) {
																Q = P[M(R)];
												}
												return O.style[R] || Q;
								};
				} else {
								if (document.documentElement.currentStyle && G) {
												K = function(O, Q) {
																switch (M(Q)) {
																				case "opacity":
																								var S = 100;
																								try {
																												S = O.filters["DXImageTransform.Microsoft.Alpha"].opacity;
																								} catch (R) {
																												try {
																																S = O.filters("alpha").opacity;
																												} catch (R) {}
																								}
																								return S / 100;
																				case "float":
																								Q = "styleFloat";
																				default:
																								var P = O.currentStyle ? O.currentStyle[Q] : null;
																								return (O.style[Q] || P);
																}
												};
								} else {
												K = function(O, P) {
																return O.style[P];
												};
								}
				}
				if (G) {
								I = function(O, P, Q) {
												switch (P) {
																case "opacity":
																				if (YAHOO.lang.isString(O.style.filter)) {
																								O.style.filter = "alpha(opacity=" + Q * 100 + ")";
																								if (!O.currentStyle || !O.currentStyle.hasLayout) {
																												O.style.zoom = 1;
																								}
																				}
																				break;
																case "float":
																				P = "styleFloat";
																default:
																				O.style[P] = Q;
												}
								};
				} else {
								I = function(O, P, Q) {
												if (P == "float") {
																P = "cssFloat";
												}
												O.style[P] = Q;
								};
				}
				var D = function(O, P) {
								return O && O.nodeType == 1 && (!P || P(O));
				};
				YAHOO.util.Dom = {
								get: function(Q) {
												if (Q && (Q.tagName || Q.item)) {
																return Q;
												}
												if (YAHOO.lang.isString(Q) || !Q) {
																return document.getElementById(Q);
												}
												if (Q.length !== undefined) {
																var R = [];
																for (var P = 0, O = Q.length; P < O; ++P) {
																				R[R.length] = B.Dom.get(Q[P]);
																}
																return R;
												}
												return Q;
								},
								getStyle: function(O, Q) {
												Q = M(Q);
												var P = function(R) {
																return K(R, Q);
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								setStyle: function(O, Q, R) {
												Q = M(Q);
												var P = function(S) {
																I(S, Q, R);
												};
												B.Dom.batch(O, P, B.Dom, true);
								},
								getXY: function(O) {
												var P = function(R) {
																if ((R.parentNode === null || R.offsetParent === null || this.getStyle(R, "display") == "none") && R != document.body) {
																				return false;
																}
																var Q = null;
																var V = [];
																var S;
																var T = R.ownerDocument;
																if (R.getBoundingClientRect) {
																				S = R.getBoundingClientRect();
																				return [S.left + B.Dom.getDocumentScrollLeft(R.ownerDocument), S.top + B.Dom.getDocumentScrollTop(R.ownerDocument)];
																} else {
																				V = [R.offsetLeft, R.offsetTop];
																				Q = R.offsetParent;
																				var U = this.getStyle(R, "position") == "absolute";
																				if (Q != R) {
																								while (Q) {
																												V[0] += Q.offsetLeft;
																												V[1] += Q.offsetTop;
																												if (L && !U && this.getStyle(Q, "position") == "absolute") {
																																U = true;
																												}
																												Q = Q.offsetParent;
																								}
																				}
																				if (L && U) {
																								V[0] -= R.ownerDocument.body.offsetLeft;
																								V[1] -= R.ownerDocument.body.offsetTop;
																				}
																}
																Q = R.parentNode;
																while (Q.tagName && !E.ROOT_TAG.test(Q.tagName)) {
																				if (B.Dom.getStyle(Q, "display").search(/^inline|table-row.*$/i)) {
																								V[0] -= Q.scrollLeft;
																								V[1] -= Q.scrollTop;
																				}
																				Q = Q.parentNode;
																}
																return V;
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								getX: function(O) {
												var P = function(Q) {
																return B.Dom.getXY(Q)[0];
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								getY: function(O) {
												var P = function(Q) {
																return B.Dom.getXY(Q)[1];
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								setXY: function(O, R, Q) {
												var P = function(U) {
																var T = this.getStyle(U, "position");
																if (T == "static") {
																				this.setStyle(U, "position", "relative");
																				T = "relative";
																}
																var W = this.getXY(U);
																if (W === false) {
																				return false;
																}
																var V = [parseInt(this.getStyle(U, "left"), 10), parseInt(this.getStyle(U, "top"), 10)];
																if (isNaN(V[0])) {
																				V[0] = (T == "relative") ? 0 : U.offsetLeft;
																}
																if (isNaN(V[1])) {
																				V[1] = (T == "relative") ? 0 : U.offsetTop;
																}
																if (R[0] !== null) {
																				U.style.left = R[0] - W[0] + V[0] + "px";
																}
																if (R[1] !== null) {
																				U.style.top = R[1] - W[1] + V[1] + "px";
																}
																if (!Q) {
																				var S = this.getXY(U);
																				if ((R[0] !== null && S[0] != R[0]) || (R[1] !== null && S[1] != R[1])) {
																								this.setXY(U, R, true);
																				}
																}
												};
												B.Dom.batch(O, P, B.Dom, true);
								},
								setX: function(P, O) {
												B.Dom.setXY(P, [O, null]);
								},
								setY: function(O, P) {
												B.Dom.setXY(O, [null, P]);
								},
								getRegion: function(O) {
												var P = function(Q) {
																if ((Q.parentNode === null || Q.offsetParent === null || this.getStyle(Q, "display") == "none") && Q != document.body) {
																				return false;
																}
																var R = B.Region.getRegion(Q);
																return R;
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								getClientWidth: function() {
												return B.Dom.getViewportWidth();
								},
								getClientHeight: function() {
												return B.Dom.getViewportHeight();
								},
								getElementsByClassName: function(S, W, T, U) {
												W = W || "*";
												T = (T) ? B.Dom.get(T) : null || document;
												if (!T) {
																return [];
												}
												var P = [],
																O = T.getElementsByTagName(W),
																V = N(S);
												for (var Q = 0, R = O.length; Q < R; ++Q) {
																if (V.test(O[Q].className)) {
																				P[P.length] = O[Q];
																				if (U) {
																								U.call(O[Q], O[Q]);
																				}
																}
												}
												return P;
								},
								hasClass: function(Q, P) {
												var O = N(P);
												var R = function(S) {
																return O.test(S.className);
												};
												return B.Dom.batch(Q, R, B.Dom, true);
								},
								addClass: function(P, O) {
												var Q = function(R) {
																if (this.hasClass(R, O)) {
																				return false;
																}
																R.className = YAHOO.lang.trim([R.className, O].join(" "));
																return true;
												};
												return B.Dom.batch(P, Q, B.Dom, true);
								},
								removeClass: function(Q, P) {
												var O = N(P);
												var R = function(S) {
																if (!this.hasClass(S, P)) {
																				return false;
																}
																var T = S.className;
																S.className = T.replace(O, " ");
																if (this.hasClass(S, P)) {
																				this.removeClass(S, P);
																}
																S.className = YAHOO.lang.trim(S.className);
																return true;
												};
												return B.Dom.batch(Q, R, B.Dom, true);
								},
								replaceClass: function(R, P, O) {
												if (!O || P === O) {
																return false;
												}
												var Q = N(P);
												var S = function(T) {
																if (!this.hasClass(T, P)) {
																				this.addClass(T, O);
																				return true;
																}
																T.className = T.className.replace(Q, " " + O + " ");
																if (this.hasClass(T, P)) {
																				this.replaceClass(T, P, O);
																}
																T.className = YAHOO.lang.trim(T.className);
																return true;
												};
												return B.Dom.batch(R, S, B.Dom, true);
								},
								generateId: function(O, Q) {
												Q = Q || "yui-gen";
												var P = function(R) {
																if (R && R.id) {
																				return R.id;
																}
																var S = Q + H++;
																if (R) {
																				R.id = S;
																}
																return S;
												};
												return B.Dom.batch(O, P, B.Dom, true) || P.apply(B.Dom, arguments);
								},
								isAncestor: function(P, Q) {
												P = B.Dom.get(P);
												if (!P || !Q) {
																return false;
												}
												var O = function(R) {
																if (P.contains && R.nodeType && !L) {
																				return P.contains(R);
																} else {
																				if (P.compareDocumentPosition && R.nodeType) {
																								return !!(P.compareDocumentPosition(R) & 16);
																				} else {
																								if (R.nodeType) {
																												return !!this.getAncestorBy(R, function(S) {
																																return S == P;
																												});
																								}
																				}
																}
																return false;
												};
												return B.Dom.batch(Q, O, B.Dom, true);
								},
								inDocument: function(O) {
												var P = function(Q) {
																if (L) {
																				while (Q = Q.parentNode) {
																								if (Q == document.documentElement) {
																												return true;
																								}
																				}
																				return false;
																}
																return this.isAncestor(document.documentElement, Q);
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								getElementsBy: function(V, P, Q, S) {
												P = P || "*";
												Q = (Q) ? B.Dom.get(Q) : null || document;
												if (!Q) {
																return [];
												}
												var R = [],
																U = Q.getElementsByTagName(P);
												for (var T = 0, O = U.length; T < O; ++T) {
																if (V(U[T])) {
																				R[R.length] = U[T];
																				if (S) {
																								S(U[T]);
																				}
																}
												}
												return R;
								},
								batch: function(S, V, U, Q) {
												S = (S && (S.tagName || S.item)) ? S : B.Dom.get(S);
												if (!S || !V) {
																return false;
												}
												var R = (Q) ? U : window;
												if (S.tagName || S.length === undefined) {
																return V.call(R, S, U);
												}
												var T = [];
												for (var P = 0, O = S.length; P < O; ++P) {
																T[T.length] = V.call(R, S[P], U);
												}
												return T;
								},
								getDocumentHeight: function() {
												var P = (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight;
												var O = Math.max(P, B.Dom.getViewportHeight());
												return O;
								},
								getDocumentWidth: function() {
												var P = (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth;
												var O = Math.max(P, B.Dom.getViewportWidth());
												return O;
								},
								getViewportHeight: function() {
												var O = self.innerHeight;
												var P = document.compatMode;
												if ((P || G) && !C) {
																O = (P == "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
												}
												return O;
								},
								getViewportWidth: function() {
												var O = self.innerWidth;
												var P = document.compatMode;
												if (P || G) {
																O = (P == "CSS1Compat") ? document.documentElement.clientWidth : document.body.clientWidth;
												}
												return O;
								},
								getAncestorBy: function(O, P) {
												while (O = O.parentNode) {
																if (D(O, P)) {
																				return O;
																}
												}
												return null;
								},
								getAncestorByClassName: function(P, O) {
												P = B.Dom.get(P);
												if (!P) {
																return null;
												}
												var Q = function(R) {
																return B.Dom.hasClass(R, O);
												};
												return B.Dom.getAncestorBy(P, Q);
								},
								getAncestorByTagName: function(P, O) {
												P = B.Dom.get(P);
												if (!P) {
																return null;
												}
												var Q = function(R) {
																return R.tagName && R.tagName.toUpperCase() == O.toUpperCase();
												};
												return B.Dom.getAncestorBy(P, Q);
								},
								getPreviousSiblingBy: function(O, P) {
												while (O) {
																O = O.previousSibling;
																if (D(O, P)) {
																				return O;
																}
												}
												return null;
								},
								getPreviousSibling: function(O) {
												O = B.Dom.get(O);
												if (!O) {
																return null;
												}
												return B.Dom.getPreviousSiblingBy(O);
								},
								getNextSiblingBy: function(O, P) {
												while (O) {
																O = O.nextSibling;
																if (D(O, P)) {
																				return O;
																}
												}
												return null;
								},
								getNextSibling: function(O) {
												O = B.Dom.get(O);
												if (!O) {
																return null;
												}
												return B.Dom.getNextSiblingBy(O);
								},
								getFirstChildBy: function(O, Q) {
												var P = (D(O.firstChild, Q)) ? O.firstChild : null;
												return P || B.Dom.getNextSiblingBy(O.firstChild, Q);
								},
								getFirstChild: function(O, P) {
												O = B.Dom.get(O);
												if (!O) {
																return null;
												}
												return B.Dom.getFirstChildBy(O);
								},
								getLastChildBy: function(O, Q) {
												if (!O) {
																return null;
												}
												var P = (D(O.lastChild, Q)) ? O.lastChild : null;
												return P || B.Dom.getPreviousSiblingBy(O.lastChild, Q);
								},
								getLastChild: function(O) {
												O = B.Dom.get(O);
												return B.Dom.getLastChildBy(O);
								},
								getChildrenBy: function(P, R) {
												var Q = B.Dom.getFirstChildBy(P, R);
												var O = Q ? [Q] : [];
												B.Dom.getNextSiblingBy(Q, function(S) {
																if (!R || R(S)) {
																				O[O.length] = S;
																}
																return false;
												});
												return O;
								},
								getChildren: function(O) {
												O = B.Dom.get(O);
												if (!O) {}
												return B.Dom.getChildrenBy(O);
								},
								getDocumentScrollLeft: function(O) {
												O = O || document;
												return Math.max(O.documentElement.scrollLeft, O.body.scrollLeft);
								},
								getDocumentScrollTop: function(O) {
												O = O || document;
												return Math.max(O.documentElement.scrollTop, O.body.scrollTop);
								},
								insertBefore: function(P, O) {
												P = B.Dom.get(P);
												O = B.Dom.get(O);
												if (!P || !O || !O.parentNode) {
																return null;
												}
												return O.parentNode.insertBefore(P, O);
								},
								insertAfter: function(P, O) {
												P = B.Dom.get(P);
												O = B.Dom.get(O);
												if (!P || !O || !O.parentNode) {
																return null;
												}
												if (O.nextSibling) {
																return O.parentNode.insertBefore(P, O.nextSibling);
												} else {
																return O.parentNode.appendChild(P);
												}
								}
				};
})();
YAHOO.util.Region = function(C, D, A, B) {
				this.top = C;
				this[1] = C;
				this.right = D;
				this.bottom = A;
				this.left = B;
				this[0] = B;
};
YAHOO.util.Region.prototype.contains = function(A) {
				return (A.left >= this.left && A.right <= this.right && A.top >= this.top && A.bottom <= this.bottom);
};
YAHOO.util.Region.prototype.getArea = function() {
				return ((this.bottom - this.top) * (this.right - this.left));
};
YAHOO.util.Region.prototype.intersect = function(E) {
				var C = Math.max(this.top, E.top);
				var D = Math.min(this.right, E.right);
				var A = Math.min(this.bottom, E.bottom);
				var B = Math.max(this.left, E.left);
				if (A >= C && D >= B) {
								return new YAHOO.util.Region(C, D, A, B);
				} else {
								return null;
				}
};
YAHOO.util.Region.prototype.union = function(E) {
				var C = Math.min(this.top, E.top);
				var D = Math.max(this.right, E.right);
				var A = Math.max(this.bottom, E.bottom);
				var B = Math.min(this.left, E.left);
				return new YAHOO.util.Region(C, D, A, B);
};
YAHOO.util.Region.prototype.toString = function() {
				return ("Region {top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + ", left: " + this.left + "}");
};
YAHOO.util.Region.getRegion = function(D) {
				var F = YAHOO.util.Dom.getXY(D);
				var C = F[1];
				var E = F[0] + D.offsetWidth;
				var A = F[1] + D.offsetHeight;
				var B = F[0];
				return new YAHOO.util.Region(C, E, A, B);
};
YAHOO.util.Point = function(A, B) {
				if (YAHOO.lang.isArray(A)) {
								B = A[1];
								A = A[0];
				}
				this.x = this.right = this.left = this[0] = A;
				this.y = this.top = this.bottom = this[1] = B;
};
YAHOO.util.Point.prototype = new YAHOO.util.Region();
YAHOO.register("dom", YAHOO.util.Dom, {
				version: "2.3.1",
				build: "541"
});
YAHOO.util.CustomEvent = function(D, B, C, A) {
				this.type = D;
				this.scope = B || window;
				this.silent = C;
				this.signature = A || YAHOO.util.CustomEvent.LIST;
				this.subscribers = [];
				if (!this.silent) {}
				var E = "_YUICEOnSubscribe";
				if (D !== E) {
								this.subscribeEvent = new YAHOO.util.CustomEvent(E, this, true);
				}
				this.lastError = null;
};
YAHOO.util.CustomEvent.LIST = 0;
YAHOO.util.CustomEvent.FLAT = 1;
YAHOO.util.CustomEvent.prototype = {
				subscribe: function(B, C, A) {
								if (!B) {
												throw new Error("Invalid callback for subscriber to '" + this.type + "'");
								}
								if (this.subscribeEvent) {
												this.subscribeEvent.fire(B, C, A);
								}
								this.subscribers.push(new YAHOO.util.Subscriber(B, C, A));
				},
				unsubscribe: function(D, F) {
								if (!D) {
												return this.unsubscribeAll();
								}
								var E = false;
								for (var B = 0, A = this.subscribers.length; B < A; ++B) {
												var C = this.subscribers[B];
												if (C && C.contains(D, F)) {
																this._delete(B);
																E = true;
												}
								}
								return E;
				},
				fire: function() {
								var E = this.subscribers.length;
								if (!E && this.silent) {
												return true;
								}
								var H = [],
												G = true,
												D, I = false;
								for (D = 0; D < arguments.length; ++D) {
												H.push(arguments[D]);
								}
								var A = H.length;
								if (!this.silent) {}
								for (D = 0; D < E; ++D) {
												var L = this.subscribers[D];
												if (!L) {
																I = true;
												} else {
																if (!this.silent) {}
																var K = L.getScope(this.scope);
																if (this.signature == YAHOO.util.CustomEvent.FLAT) {
																				var B = null;
																				if (H.length > 0) {
																								B = H[0];
																				}
																				try {
																								G = L.fn.call(K, B, L.obj);
																				} catch (F) {
																								this.lastError = F;
																				}
																} else {
																				try {
																								G = L.fn.call(K, this.type, H, L.obj);
																				} catch (F) {
																								this.lastError = F;
																				}
																}
																if (false === G) {
																				if (!this.silent) {}
																				return false;
																}
												}
								}
								if (I) {
												var J = [],
																C = this.subscribers;
												for (D = 0, E = C.length; D < E; D = D + 1) {
																J.push(C[D]);
												}
												this.subscribers = J;
								}
								return true;
				},
				unsubscribeAll: function() {
								for (var B = 0, A = this.subscribers.length; B < A; ++B) {
												this._delete(A - 1 - B);
								}
								this.subscribers = [];
								return B;
				},
				_delete: function(A) {
								var B = this.subscribers[A];
								if (B) {
												delete B.fn;
												delete B.obj;
								}
								this.subscribers[A] = null;
				},
				toString: function() {
								return "CustomEvent: '" + this.type + "', scope: " + this.scope;
				}
};
YAHOO.util.Subscriber = function(B, C, A) {
				this.fn = B;
				this.obj = YAHOO.lang.isUndefined(C) ? null : C;
				this.override = A;
};
YAHOO.util.Subscriber.prototype.getScope = function(A) {
				if (this.override) {
								if (this.override === true) {
												return this.obj;
								} else {
												return this.override;
								}
				}
				return A;
};
YAHOO.util.Subscriber.prototype.contains = function(A, B) {
				if (B) {
								return (this.fn == A && this.obj == B);
				} else {
								return (this.fn == A);
				}
};
YAHOO.util.Subscriber.prototype.toString = function() {
				return "Subscriber { obj: " + this.obj + ", override: " + (this.override || "no") + " }";
};
if (!YAHOO.util.Event) {
				YAHOO.util.Event = function() {
								var H = false;
								var J = false;
								var I = [];
								var K = [];
								var G = [];
								var E = [];
								var C = 0;
								var F = [];
								var B = [];
								var A = 0;
								var D = { 63232: 38, 63233: 40, 63234: 37, 63235: 39 };
								return {
												POLL_RETRYS: 4000,
												POLL_INTERVAL: 10,
												EL: 0,
												TYPE: 1,
												FN: 2,
												WFN: 3,
												UNLOAD_OBJ: 3,
												ADJ_SCOPE: 4,
												OBJ: 5,
												OVERRIDE: 6,
												lastError: null,
												isSafari: YAHOO.env.ua.webkit,
												webkit: YAHOO.env.ua.webkit,
												isIE: YAHOO.env.ua.ie,
												_interval: null,
												startInterval: function() {
																if (!this._interval) {
																				var L = this;
																				var M = function() {
																								L._tryPreloadAttach();
																				};
																				this._interval = setInterval(M, this.POLL_INTERVAL);
																}
												},
												onAvailable: function(N, L, O, M) {
																F.push({
																				id: N,
																				fn: L,
																				obj: O,
																				override: M,
																				checkReady: false
																});
																C = this.POLL_RETRYS;
																this.startInterval();
												},
												onDOMReady: function(L, N, M) {
																if (J) {
																				setTimeout(function() {
																												var O = window;
																												if (M) {
																																if (M === true) {
																																				O = N;
																																} else {
																																				O = M;
																																}
																												}
																												L.call(O, "DOMReady", [], N);
																								},
																								0);
																} else {
																				this.DOMReadyEvent.subscribe(L, N, M);
																}
												},
												onContentReady: function(N, L, O, M) {
																F.push({
																				id: N,
																				fn: L,
																				obj: O,
																				override: M,
																				checkReady: true
																});
																C = this.POLL_RETRYS;
																this.startInterval();
												},
												addListener: function(N, L, W, R, M) {
																if (!W || !W.call) {
																				return false;
																}
																if (this._isValidCollection(N)) {
																				var X = true;
																				for (var S = 0, U = N.length; S < U; ++S) {
																								X = this.on(N[S], L, W, R, M) && X;
																				}
																				return X;
																} else {
																				if (YAHOO.lang.isString(N)) {
																								var Q = this.getEl(N);
																								if (Q) {
																												N = Q;
																								} else {
																												this.onAvailable(N, function() {
																																YAHOO.util.Event.on(N, L, W, R, M);
																												});
																												return true;
																								}
																				}
																}
																if (!N) {
																				return false;
																}
																if ("unload" == L && R !== this) {
																				K[K.length] = [N, L, W, R, M];
																				return true;
																}
																var Z = N;
																if (M) {
																				if (M === true) {
																								Z = R;
																				} else {
																								Z = M;
																				}
																}
																var O = function(a) {
																				return W.call(Z, YAHOO.util.Event.getEvent(a, N), R);
																};
																var Y = [N, L, W, O, Z, R, M];
																var T = I.length;
																I[T] = Y;
																if (this.useLegacyEvent(N, L)) {
																				var P = this.getLegacyIndex(N, L);
																				if (P == -1 || N != G[P][0]) {
																								P = G.length;
																								B[N.id + L] = P;
																								G[P] = [N, L, N["on" + L]];
																								E[P] = [];
																								N["on" + L] = function(a) {
																												YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(a), P);
																								};
																				}
																				E[P].push(Y);
																} else {
																				try {
																								this._simpleAdd(N, L, O, false);
																				} catch (V) {
																								this.lastError = V;
																								this.removeListener(N, L, W);
																								return false;
																				}
																}
																return true;
												},
												fireLegacyEvent: function(P, N) {
																var R = true,
																				L, T, S, U, Q;
																T = E[N];
																for (var M = 0, O = T.length; M < O; ++M) {
																				S = T[M];
																				if (S && S[this.WFN]) {
																								U = S[this.ADJ_SCOPE];
																								Q = S[this.WFN].call(U, P);
																								R = (R && Q);
																				}
																}
																L = G[N];
																if (L && L[2]) {
																				L[2](P);
																}
																return R;
												},
												getLegacyIndex: function(M, N) {
																var L = this.generateId(M) + N;
																if (typeof B[L] == "undefined") {
																				return -1;
																} else {
																				return B[L];
																}
												},
												useLegacyEvent: function(M, N) {
																if (this.webkit && ("click" == N || "dblclick" == N)) {
																				var L = parseInt(this.webkit, 10);
																				if (!isNaN(L) && L < 418) {
																								return true;
																				}
																}
																return false;
												},
												removeListener: function(M, L, U) {
																var P, S, W;
																if (typeof M == "string") {
																				M = this.getEl(M);
																} else {
																				if (this._isValidCollection(M)) {
																								var V = true;
																								for (P = 0, S = M.length; P < S; ++P) {
																												V = (this.removeListener(M[P], L, U) && V);
																								}
																								return V;
																				}
																}
																if (!U || !U.call) {
																				return this.purgeElement(M, false, L);
																}
																if ("unload" == L) {
																				for (P = 0, S = K.length; P < S; P++) {
																								W = K[P];
																								if (W && W[0] == M && W[1] == L && W[2] == U) {
																												K[P] = null;
																												return true;
																								}
																				}
																				return false;
																}
																var Q = null;
																var R = arguments[3];
																if ("undefined" === typeof R) {
																				R = this._getCacheIndex(M, L, U);
																}
																if (R >= 0) {
																				Q = I[R];
																}
																if (!M || !Q) {
																				return false;
																}
																if (this.useLegacyEvent(M, L)) {
																				var O = this.getLegacyIndex(M, L);
																				var N = E[O];
																				if (N) {
																								for (P = 0, S = N.length; P < S; ++P) {
																												W = N[P];
																												if (W && W[this.EL] == M && W[this.TYPE] == L && W[this.FN] == U) {
																																N[P] = null;
																																break;
																												}
																								}
																				}
																} else {
																				try {
																								this._simpleRemove(M, L, Q[this.WFN], false);
																				} catch (T) {
																								this.lastError = T;
																								return false;
																				}
																}
																delete I[R][this.WFN];
																delete I[R][this.FN];
																I[R] = null;
																return true;
												},
												getTarget: function(N, M) {
																var L = N.target || N.srcElement;
																return this.resolveTextNode(L);
												},
												resolveTextNode: function(L) {
																if (L && 3 == L.nodeType) {
																				return L.parentNode;
																} else {
																				return L;
																}
												},
												getPageX: function(M) {
																var L = M.pageX;
																if (!L && 0 !== L) {
																				L = M.clientX || 0;
																				if (this.isIE) {
																								L += this._getScrollLeft();
																				}
																}
																return L;
												},
												getPageY: function(L) {
																var M = L.pageY;
																if (!M && 0 !== M) {
																				M = L.clientY || 0;
																				if (this.isIE) {
																								M += this._getScrollTop();
																				}
																}
																return M;
												},
												getXY: function(L) {
																return [this.getPageX(L), this.getPageY(L)];
												},
												getRelatedTarget: function(M) {
																var L = M.relatedTarget;
																if (!L) {
																				if (M.type == "mouseout") {
																								L = M.toElement;
																				} else {
																								if (M.type == "mouseover") {
																												L = M.fromElement;
																								}
																				}
																}
																return this.resolveTextNode(L);
												},
												getTime: function(N) {
																if (!N.time) {
																				var M = new Date().getTime();
																				try {
																								N.time = M;
																				} catch (L) {
																								this.lastError = L;
																								return M;
																				}
																}
																return N.time;
												},
												stopEvent: function(L) {
																this.stopPropagation(L);
																this.preventDefault(L);
												},
												stopPropagation: function(L) {
																if (L.stopPropagation) {
																				L.stopPropagation();
																} else {
																				L.cancelBubble = true;
																}
												},
												preventDefault: function(L) {
																if (L.preventDefault) {
																				L.preventDefault();
																} else {
																				L.returnValue = false;
																}
												},
												getEvent: function(Q, O) {
																var P = Q || window.event;
																if (!P) {
																				var R = this.getEvent.caller;
																				while (R) {
																								P = R.arguments[0];
																								if (P && Event == P.constructor) {
																												break;
																								}
																								R = R.caller;
																				}
																}
																if (P && this.isIE) {
																				try {
																								var N = P.srcElement;
																								if (N) {
																												var M = N.type;
																								}
																				} catch (L) {
																								P.target = O;
																				}
																}
																return P;
												},
												getCharCode: function(M) {
																var L = M.keyCode || M.charCode || 0;
																if (YAHOO.env.ua.webkit && (L in D)) {
																				L = D[L];
																}
																return L;
												},
												_getCacheIndex: function(P, Q, O) {
																for (var N = 0, M = I.length; N < M; ++N) {
																				var L = I[N];
																				if (L && L[this.FN] == O && L[this.EL] == P && L[this.TYPE] == Q) {
																								return N;
																				}
																}
																return -1;
												},
												generateId: function(L) {
																var M = L.id;
																if (!M) {
																				M = "yuievtautoid-" + A;
																				++A;
																				L.id = M;
																}
																return M;
												},
												_isValidCollection: function(M) {
																try {
																				return (typeof M !== "string" && M.length && !M.tagName && !M.alert && typeof M[0] !== "undefined");
																} catch (L) {
																				return false;
																}
												},
												elCache: {},
												getEl: function(L) {
																return (typeof L === "string") ? document.getElementById(L) : L;
												},
												clearCache: function() {},
												DOMReadyEvent: new YAHOO.util.CustomEvent("DOMReady", this),
												_load: function(M) {
																if (!H) {
																				H = true;
																				var L = YAHOO.util.Event;
																				L._ready();
																				L._tryPreloadAttach();
																}
												},
												_ready: function(M) {
																if (!J) {
																				J = true;
																				var L = YAHOO.util.Event;
																				L.DOMReadyEvent.fire();
																				L._simpleRemove(document, "DOMContentLoaded", L._ready);
																}
												},
												_tryPreloadAttach: function() {
																if (this.locked) {
																				return false;
																}
																if (this.isIE) {
																				if (!J) {
																								this.startInterval();
																								return false;
																				}
																}
																this.locked = true;
																var Q = !H;
																if (!Q) {
																				Q = (C > 0);
																}
																var P = [];
																var R = function(T, U) {
																				var S = T;
																				if (U.override) {
																								if (U.override === true) {
																												S = U.obj;
																								} else {
																												S = U.override;
																								}
																				}
																				U.fn.call(S, U.obj);
																};
																var M, L, O, N;
																for (M = 0, L = F.length; M < L; ++M) {
																				O = F[M];
																				if (O && !O.checkReady) {
																								N = this.getEl(O.id);
																								if (N) {
																												R(N, O);
																												F[M] = null;
																								} else {
																												P.push(O);
																								}
																				}
																}
																for (M = 0, L = F.length; M < L; ++M) {
																				O = F[M];
																				if (O && O.checkReady) {
																								N = this.getEl(O.id);
																								if (N) {
																												if (H || N.nextSibling) {
																																R(N, O);
																																F[M] = null;
																												}
																								} else {
																												P.push(O);
																								}
																				}
																}
																C = (P.length === 0) ? 0 : C - 1;
																if (Q) {
																				this.startInterval();
																} else {
																				clearInterval(this._interval);
																				this._interval = null;
																}
																this.locked = false;
																return true;
												},
												purgeElement: function(O, P, R) {
																var Q = this.getListeners(O, R),
																				N, L;
																if (Q) {
																				for (N = 0, L = Q.length; N < L; ++N) {
																								var M = Q[N];
																								this.removeListener(O, M.type, M.fn, M.index);
																				}
																}
																if (P && O && O.childNodes) {
																				for (N = 0, L = O.childNodes.length; N < L; ++N) {
																								this.purgeElement(O.childNodes[N], P, R);
																				}
																}
												},
												getListeners: function(N, L) {
																var Q = [],
																				M;
																if (!L) {
																				M = [I, K];
																} else {
																				if (L == "unload") {
																								M = [K];
																				} else {
																								M = [I];
																				}
																}
																for (var P = 0; P < M.length; P = P + 1) {
																				var T = M[P];
																				if (T && T.length > 0) {
																								for (var R = 0, S = T.length; R < S; ++R) {
																												var O = T[R];
																												if (O && O[this.EL] === N && (!L || L === O[this.TYPE])) {
																																Q.push({
																																				type: O[this.TYPE],
																																				fn: O[this.FN],
																																				obj: O[this.OBJ],
																																				adjust: O[this.OVERRIDE],
																																				scope: O[this.ADJ_SCOPE],
																																				index: R
																																});
																												}
																								}
																				}
																}
																return (Q.length) ? Q : null;
												},
												_unload: function(S) {
																var R = YAHOO.util.Event,
																				P, O, M, L, N;
																for (P = 0, L = K.length; P < L; ++P) {
																				M = K[P];
																				if (M) {
																								var Q = window;
																								if (M[R.ADJ_SCOPE]) {
																												if (M[R.ADJ_SCOPE] === true) {
																																Q = M[R.UNLOAD_OBJ];
																												} else {
																																Q = M[R.ADJ_SCOPE];
																												}
																								}
																								M[R.FN].call(Q, R.getEvent(S, M[R.EL]), M[R.UNLOAD_OBJ]);
																								K[P] = null;
																								M = null;
																								Q = null;
																				}
																}
																K = null;
																if (I && I.length > 0) {
																				O = I.length;
																				while (O) {
																								N = O - 1;
																								M = I[N];
																								if (M) {
																												R.removeListener(M[R.EL], M[R.TYPE], M[R.FN], N);
																								}
																								O = O - 1;
																				}
																				M = null;
																				R.clearCache();
																}
																for (P = 0, L = G.length; P < L; ++P) {
																				G[P][0] = null;
																				G[P] = null;
																}
																G = null;
																R._simpleRemove(window, "unload", R._unload);
												},
												_getScrollLeft: function() {
																return this._getScroll()[1];
												},
												_getScrollTop: function() {
																return this._getScroll()[0];
												},
												_getScroll: function() {
																var L = document.documentElement,
																				M = document.body;
																if (L && (L.scrollTop || L.scrollLeft)) {
																				return [L.scrollTop, L.scrollLeft];
																} else {
																				if (M) {
																								return [M.scrollTop, M.scrollLeft];
																				} else {
																								return [0, 0];
																				}
																}
												},
												regCE: function() {},
												_simpleAdd: function() {
																if (window.addEventListener) {
																				return function(N, O, M, L) {
																								N.addEventListener(O, M, (L));
																				};
																} else {
																				if (window.attachEvent) {
																								return function(N, O, M, L) {
																												N.attachEvent("on" + O, M);
																								};
																				} else {
																								return function() {};
																				}
																}
												}(),
												_simpleRemove: function() {
																if (window.removeEventListener) {
																				return function(N, O, M, L) {
																								N.removeEventListener(O, M, (L));
																				};
																} else {
																				if (window.detachEvent) {
																								return function(M, N, L) {
																												M.detachEvent("on" + N, L);
																								};
																				} else {
																								return function() {};
																				}
																}
												}()
								};
				}();
				(function() {
								var D = YAHOO.util.Event;
								D.on = D.addListener;
								if (D.isIE) {
												YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach, YAHOO.util.Event, true);
												var B, E = document,
																A = E.body;
												if (("undefined" !== typeof YAHOO_config) && YAHOO_config.injecting) {
																B = document.createElement("script");
																var C = E.getElementsByTagName("head")[0] || A;
																C.insertBefore(B, C.firstChild);
												} else {
																E.write("<script id=\"_yui_eu_dr\" defer=\"true\" src=\"//:\"></script>");
																B = document.getElementById("_yui_eu_dr");
												}
												if (B) {
																B.onreadystatechange = function() {
																				if ("complete" === this.readyState) {
																								this.parentNode.removeChild(this);
																								YAHOO.util.Event._ready();
																				}
																};
												} else {}
												B = null;
								} else {
												if (D.webkit) {
																D._drwatch = setInterval(function() {
																								var F = document.readyState;
																								if ("loaded" == F || "complete" == F) {
																												clearInterval(D._drwatch);
																												D._drwatch = null;
																												D._ready();
																								}
																				},
																				D.POLL_INTERVAL);
												} else {
																D._simpleAdd(document, "DOMContentLoaded", D._ready);
												}
								}
								D._simpleAdd(window, "load", D._load);
								D._simpleAdd(window, "unload", D._unload);
								D._tryPreloadAttach();
				})();
}
YAHOO.util.EventProvider = function() {};
YAHOO.util.EventProvider.prototype = {
				__yui_events: null,
				__yui_subscribers: null,
				subscribe: function(A, C, F, E) {
								this.__yui_events = this.__yui_events || {};
								var D = this.__yui_events[A];
								if (D) {
												D.subscribe(C, F, E);
								} else {
												this.__yui_subscribers = this.__yui_subscribers || {};
												var B = this.__yui_subscribers;
												if (!B[A]) {
																B[A] = [];
												}
												B[A].push({
																fn: C,
																obj: F,
																override: E
												});
								}
				},
				unsubscribe: function(C, E, G) {
								this.__yui_events = this.__yui_events || {};
								var A = this.__yui_events;
								if (C) {
												var F = A[C];
												if (F) {
																return F.unsubscribe(E, G);
												}
								} else {
												var B = true;
												for (var D in A) {
																if (YAHOO.lang.hasOwnProperty(A, D)) {
																				B = B && A[D].unsubscribe(E, G);
																}
												}
												return B;
								}
								return false;
				},
				unsubscribeAll: function(A) {
								return this.unsubscribe(A);
				},
				createEvent: function(G, D) {
								this.__yui_events = this.__yui_events || {};
								var A = D || {};
								var I = this.__yui_events;
								if (I[G]) {} else {
												var H = A.scope || this;
												var E = (A.silent);
												var B = new YAHOO.util.CustomEvent(G, H, E, YAHOO.util.CustomEvent.FLAT);
												I[G] = B;
												if (A.onSubscribeCallback) {
																B.subscribeEvent.subscribe(A.onSubscribeCallback);
												}
												this.__yui_subscribers = this.__yui_subscribers || {};
												var F = this.__yui_subscribers[G];
												if (F) {
																for (var C = 0; C < F.length; ++C) {
																				B.subscribe(F[C].fn, F[C].obj, F[C].override);
																}
												}
								}
								return I[G];
				},
				fireEvent: function(E, D, A, C) {
								this.__yui_events = this.__yui_events || {};
								var G = this.__yui_events[E];
								if (!G) {
												return null;
								}
								var B = [];
								for (var F = 1; F < arguments.length; ++F) {
												B.push(arguments[F]);
								}
								return G.fire.apply(G, B);
				},
				hasEvent: function(A) {
								if (this.__yui_events) {
												if (this.__yui_events[A]) {
																return true;
												}
								}
								return false;
				}
};
YAHOO.util.KeyListener = function(A, F, B, C) {
				if (!A) {} else {
								if (!F) {} else {
												if (!B) {}
								}
				}
				if (!C) {
								C = YAHOO.util.KeyListener.KEYDOWN;
				}
				var D = new YAHOO.util.CustomEvent("keyPressed");
				this.enabledEvent = new YAHOO.util.CustomEvent("enabled");
				this.disabledEvent = new YAHOO.util.CustomEvent("disabled");
				if (typeof A == "string") {
								A = document.getElementById(A);
				}
				if (typeof B == "function") {
								D.subscribe(B);
				} else {
								D.subscribe(B.fn, B.scope, B.correctScope);
				}

				function E(K, J) {
								if (!F.shift) {
												F.shift = false;
								}
								if (!F.alt) {
												F.alt = false;
								}
								if (!F.ctrl) {
												F.ctrl = false;
								}
								if (K.shiftKey == F.shift && K.altKey == F.alt && K.ctrlKey == F.ctrl) {
												var H;
												var G;
												if (F.keys instanceof Array) {
																for (var I = 0; I < F.keys.length; I++) {
																				H = F.keys[I];
																				if (H == K.charCode) {
																								D.fire(K.charCode, K);
																								break;
																				} else {
																								if (H == K.keyCode) {
																												D.fire(K.keyCode, K);
																												break;
																								}
																				}
																}
												} else {
																H = F.keys;
																if (H == K.charCode) {
																				D.fire(K.charCode, K);
																} else {
																				if (H == K.keyCode) {
																								D.fire(K.keyCode, K);
																				}
																}
												}
								}
				}
				this.enable = function() {
								if (!this.enabled) {
												YAHOO.util.Event.addListener(A, C, E);
												this.enabledEvent.fire(F);
								}
								this.enabled = true;
				};
				this.disable = function() {
								if (this.enabled) {
												YAHOO.util.Event.removeListener(A, C, E);
												this.disabledEvent.fire(F);
								}
								this.enabled = false;
				};
				this.toString = function() {
								return "KeyListener [" + F.keys + "] " + A.tagName + (A.id ? "[" + A.id + "]" : "");
				};
};
YAHOO.util.KeyListener.KEYDOWN = "keydown";
YAHOO.util.KeyListener.KEYUP = "keyup";
YAHOO.register("event", YAHOO.util.Event, { version: "2.3.1", build: "541" });
YAHOO.register("yahoo-dom-event", YAHOO, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
YAHOO.util.Attribute = function(hash, owner) {
				if (owner) {
								this.owner = owner;
								this.configure(hash, true);
				}
};
YAHOO.util.Attribute.prototype = {
				name: undefined,
				value: null,
				owner: null,
				readOnly: false,
				writeOnce: false,
				_initialConfig: null,
				_written: false,
				method: null,
				validator: null,
				getValue: function() {
								return this.value;
				},
				setValue: function(value, silent) {
								var beforeRetVal;
								var owner = this.owner;
								var name = this.name;
								var event = {
												type: name,
												prevValue: this.getValue(),
												newValue: value
								};
								if (this.readOnly || (this.writeOnce && this._written)) {
												return false;
								}
								if (this.validator && !this.validator.call(owner, value)) {
												return false;
								}
								if (!silent) {
												beforeRetVal = owner.fireBeforeChangeEvent(event);
												if (beforeRetVal === false) {
																return false;
												}
								}
								if (this.method) {
												this.method.call(owner, value);
								}
								this.value = value;
								this._written = true;
								event.type = name;
								if (!silent) {
												this.owner.fireChangeEvent(event);
								}
								return true;
				},
				configure: function(map, init) {
								map = map || {};
								this._written = false;
								this._initialConfig = this._initialConfig || {};
								for (var key in map) {
												if (key && YAHOO.lang.hasOwnProperty(map, key)) {
																this[key] = map[key];
																if (init) {
																				this._initialConfig[key] = map[key];
																}
												}
								}
				},
				resetValue: function() {
								return this.setValue(this._initialConfig.value);
				},
				resetConfig: function() {
								this.configure(this._initialConfig);
				},
				refresh: function(silent) {
								this.setValue(this.value, silent);
				}
};
(function() {
				var Lang = YAHOO.util.Lang;
				/*
		    Copyright (c) 2006, Yahoo! Inc. All rights reserved.
		    Code licensed under the BSD License:
		    http://developer.yahoo.net/yui/license.txt
		    */
				YAHOO.util.AttributeProvider = function() {};
				YAHOO.util.AttributeProvider.prototype = {
								_configs: null,
								get: function(key) {
												this._configs = this._configs || {};
												var config = this._configs[key];
												if (!config) {
																return undefined;
												}
												return config.value;
								},
								set: function(key, value, silent) {
												this._configs = this._configs || {};
												var config = this._configs[key];
												if (!config) {
																return false;
												}
												return config.setValue(value, silent);
								},
								getAttributeKeys: function() {
												this._configs = this._configs;
												var keys = [];
												var config;
												for (var key in this._configs) {
																config = this._configs[key];
																if (Lang.hasOwnProperty(this._configs, key) && !Lang.isUndefined(config)) {
																				keys[keys.length] = key;
																}
												}
												return keys;
								},
								setAttributes: function(map, silent) {
												for (var key in map) {
																if (Lang.hasOwnProperty(map, key)) {
																				this.set(key, map[key], silent);
																}
												}
								},
								resetValue: function(key, silent) {
												this._configs = this._configs || {};
												if (this._configs[key]) {
																this.set(key, this._configs[key]._initialConfig.value, silent);
																return true;
												}
												return false;
								},
								refresh: function(key, silent) {
												this._configs = this._configs;
												key = ((Lang.isString(key)) ? [key] : key) || this.getAttributeKeys();
												for (var i = 0, len = key.length; i < len; ++i) {
																if (this._configs[key[i]] && !Lang.isUndefined(this._configs[key[i]].value) && !Lang.isNull(this._configs[key[i]].value)) {
																				this._configs[key[i]].refresh(silent);
																}
												}
								},
								register: function(key, map) {
												this.setAttributeConfig(key, map);
								},
								getAttributeConfig: function(key) {
												this._configs = this._configs || {};
												var config = this._configs[key] || {};
												var map = {};
												for (key in config) {
																if (Lang.hasOwnProperty(config, key)) {
																				map[key] = config[key];
																}
												}
												return map;
								},
								setAttributeConfig: function(key, map, init) {
												this._configs = this._configs || {};
												map = map || {};
												if (!this._configs[key]) {
																map.name = key;
																this._configs[key] = this.createAttribute(map);
												} else {
																this._configs[key].configure(map, init);
												}
								},
								configureAttribute: function(key, map, init) {
												this.setAttributeConfig(key, map, init);
								},
								resetAttributeConfig: function(key) {
												this._configs = this._configs || {};
												this._configs[key].resetConfig();
								},
								subscribe: function(type, callback) {
												this._events = this._events || {};
												if (!(type in this._events)) {
																this._events[type] = this.createEvent(type);
												}
												YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
								},
								on: function() {
												this.subscribe.apply(this, arguments);
								},
								addListener: function() {
												this.subscribe.apply(this, arguments);
								},
								fireBeforeChangeEvent: function(e) {
												var type = 'before';
												type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
												e.type = type;
												return this.fireEvent(e.type, e);
								},
								fireChangeEvent: function(e) {
												e.type += 'Change';
												return this.fireEvent(e.type, e);
								},
								createAttribute: function(map) {
												return new YAHOO.util.Attribute(map, this);
								}
				};
				YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();
(function() {
				var Dom = YAHOO.util.Dom,
								AttributeProvider = YAHOO.util.AttributeProvider;
				YAHOO.util.Element = function(el, map) {
								if (arguments.length) {
												this.init(el, map);
								}
				};
				YAHOO.util.Element.prototype = {
								DOM_EVENTS: null,
								appendChild: function(child) {
												child = child.get ? child.get('element') : child;
												this.get('element').appendChild(child);
								},
								getElementsByTagName: function(tag) {
												return this.get('element').getElementsByTagName(tag);
								},
								hasChildNodes: function() {
												return this.get('element').hasChildNodes();
								},
								insertBefore: function(element, before) {
												element = element.get ? element.get('element') : element;
												before = (before && before.get) ? before.get('element') : before;
												this.get('element').insertBefore(element, before);
								},
								removeChild: function(child) {
												child = child.get ? child.get('element') : child;
												this.get('element').removeChild(child);
												return true;
								},
								replaceChild: function(newNode, oldNode) {
												newNode = newNode.get ? newNode.get('element') : newNode;
												oldNode = oldNode.get ? oldNode.get('element') : oldNode;
												return this.get('element').replaceChild(newNode, oldNode);
								},
								initAttributes: function(map) {},
								addListener: function(type, fn, obj, scope) {
												var el = this.get('element');
												scope = scope || this;
												el = this.get('id') || el;
												var self = this;
												if (!this._events[type]) {
																if (this.DOM_EVENTS[type]) {
																				YAHOO.util.Event.addListener(el, type, function(e) {
																												if (e.srcElement && !e.target) {
																																e.target = e.srcElement;
																												}
																												self.fireEvent(type, e);
																								},
																								obj, scope);
																}
																this.createEvent(type, this);
												}
												YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
								},
								on: function() {
												this.addListener.apply(this, arguments);
								},
								subscribe: function() {
												this.addListener.apply(this, arguments);
								},
								removeListener: function(type, fn) {
												this.unsubscribe.apply(this, arguments);
								},
								addClass: function(className) {
												Dom.addClass(this.get('element'), className);
								},
								getElementsByClassName: function(className, tag) {
												return Dom.getElementsByClassName(className, tag, this.get('element'));
								},
								hasClass: function(className) {
												return Dom.hasClass(this.get('element'), className);
								},
								removeClass: function(className) {
												return Dom.removeClass(this.get('element'), className);
								},
								replaceClass: function(oldClassName, newClassName) {
												return Dom.replaceClass(this.get('element'), oldClassName, newClassName);
								},
								setStyle: function(property, value) {
												var el = this.get('element');
												if (!el) {
																return this._queue[this._queue.length] = ['setStyle', arguments];
												}
												return Dom.setStyle(el, property, value);
								},
								getStyle: function(property) {
												return Dom.getStyle(this.get('element'), property);
								},
								fireQueue: function() {
												var queue = this._queue;
												for (var i = 0, len = queue.length; i < len; ++i) {
																this[queue[i][0]].apply(this, queue[i][1]);
												}
								},
								appendTo: function(parent, before) {
												parent = (parent.get) ? parent.get('element') : Dom.get(parent);
												this.fireEvent('beforeAppendTo', { type: 'beforeAppendTo', target: parent });
												before = (before && before.get) ? before.get('element') : Dom.get(before);
												var element = this.get('element');
												if (!element) {
																return false;
												}
												if (!parent) {
																return false;
												}
												if (element.parent != parent) {
																if (before) {
																				parent.insertBefore(element, before);
																} else {
																				parent.appendChild(element);
																}
												}
												this.fireEvent('appendTo', { type: 'appendTo', target: parent });
								},
								get: function(key) {
												var configs = this._configs || {};
												var el = configs.element;
												if (el && !configs[key] && !YAHOO.lang.isUndefined(el.value[key])) {
																return el.value[key];
												}
												return AttributeProvider.prototype.get.call(this, key);
								},
								setAttributes: function(map, silent) {
												var el = this.get('element');
												for (var key in map) {
																if (!this._configs[key] && !YAHOO.lang.isUndefined(el[key])) {
																				this.setAttributeConfig(key);
																}
												}
												for (var i = 0, len = this._configOrder.length; i < len; ++i) {
																if (map[this._configOrder[i]]) {
																				this.set(this._configOrder[i], map[this._configOrder[i]], silent);
																}
												}
								},
								set: function(key, value, silent) {
												var el = this.get('element');
												if (!el) {
																this._queue[this._queue.length] = ['set', arguments];
																if (this._configs[key]) {
																				this._configs[key].value = value;
																}
																return;
												}
												if (!this._configs[key] && !YAHOO.lang.isUndefined(el[key])) {
																_registerHTMLAttr.call(this, key);
												}
												return AttributeProvider.prototype.set.apply(this, arguments);
								},
								setAttributeConfig: function(key, map, init) {
												var el = this.get('element');
												if (el && !this._configs[key] && !YAHOO.lang.isUndefined(el[key])) {
																_registerHTMLAttr.call(this, key, map);
												} else {
																AttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
												}
												this._configOrder.push(key);
								},
								getAttributeKeys: function() {
												var el = this.get('element');
												var keys = AttributeProvider.prototype.getAttributeKeys.call(this);
												for (var key in el) {
																if (!this._configs[key]) {
																				keys[key] = keys[key] || el[key];
																}
												}
												return keys;
								},
								createEvent: function(type, scope) {
												this._events[type] = true;
												AttributeProvider.prototype.createEvent.apply(this, arguments);
								},
								init: function(el, attr) {
												_initElement.apply(this, arguments);
								}
				};
				var _initElement = function(el, attr) {
								this._queue = this._queue || [];
								this._events = this._events || {};
								this._configs = this._configs || {};
								this._configOrder = [];
								attr = attr || {};
								attr.element = attr.element || el || null;
								this.DOM_EVENTS = {
												'click': true,
												'dblclick': true,
												'keydown': true,
												'keypress': true,
												'keyup': true,
												'mousedown': true,
												'mousemove': true,
												'mouseout': true,
												'mouseover': true,
												'mouseup': true,
												'focus': true,
												'blur': true,
												'submit': true
								};
								var isReady = false;
								if (YAHOO.lang.isString(el)) {
												_registerHTMLAttr.call(this, 'id', { value: attr.element });
								}
								if (Dom.get(el)) {
												isReady = true;
												_initHTMLElement.call(this, attr);
												_initContent.call(this, attr);
								}
								YAHOO.util.Event.onAvailable(attr.element, function() {
																if (!isReady) {
																				_initHTMLElement.call(this, attr);
																}
																this.fireEvent('available', {
																				type: 'available',
																				target: attr.element
																});
												},
												this, true);
								YAHOO.util.Event.onContentReady(attr.element, function() {
																if (!isReady) {
																				_initContent.call(this, attr);
																}
																this.fireEvent('contentReady', {
																				type: 'contentReady',
																				target: attr.element
																});
												},
												this, true);
				};
				var _initHTMLElement = function(attr) {
								this.setAttributeConfig('element', {
												value: Dom.get(attr.element),
												readOnly: true
								});
				};
				var _initContent = function(attr) {
								this.initAttributes(attr);
								this.setAttributes(attr, true);
								this.fireQueue();
				};
				var _registerHTMLAttr = function(key, map) {
								var el = this.get('element');
								map = map || {};
								map.name = key;
								map.method = map.method || function(value) { el[key] = value; };
								map.value = map.value || el[key];
								this._configs[key] = new YAHOO.util.Attribute(map, this);
				};
				YAHOO.augment(YAHOO.util.Element, AttributeProvider);
})();
YAHOO.register("element", YAHOO.util.Element, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
YAHOO.widget.LogMsg = function(oConfigs) { if (oConfigs && (oConfigs.constructor == Object)) { for (var param in oConfigs) { this[param] = oConfigs[param]; } } };
YAHOO.widget.LogMsg.prototype.msg = null;
YAHOO.widget.LogMsg.prototype.time = null;
YAHOO.widget.LogMsg.prototype.category = null;
YAHOO.widget.LogMsg.prototype.source = null;
YAHOO.widget.LogMsg.prototype.sourceDetail = null;
YAHOO.widget.LogWriter = function(sSource) {
				if (!sSource) { YAHOO.log("Could not instantiate LogWriter due to invalid source.", "error", "LogWriter"); return; }
				this._source = sSource;
};
YAHOO.widget.LogWriter.prototype.toString = function() { return "LogWriter " + this._sSource; };
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCategory) { YAHOO.widget.Logger.log(sMsg, sCategory, this._source); };
YAHOO.widget.LogWriter.prototype.getSource = function() { return this._sSource; };
YAHOO.widget.LogWriter.prototype.setSource = function(sSource) {
				if (!sSource) { YAHOO.log("Could not set source due to invalid source.", "error", this.toString()); return; } else { this._sSource = sSource; }
};
YAHOO.widget.LogWriter.prototype._source = null;
YAHOO.widget.LogReader = function(elContainer, oConfigs) {
				this._sName = YAHOO.widget.LogReader._index;
				YAHOO.widget.LogReader._index++;
				this._buffer = [];
				this._filterCheckboxes = {};
				this._lastTime = YAHOO.widget.Logger.getStartTime();
				if (oConfigs && (oConfigs.constructor == Object)) { for (var param in oConfigs) { this[param] = oConfigs[param]; } }
				this._initContainerEl(elContainer);
				if (!this._elContainer) {
								YAHOO.log("Could not instantiate LogReader due to an invalid container element " +
												elContainer, "error", this.toString());
								return;
				}
				this._initHeaderEl();
				this._initConsoleEl();
				this._initFooterEl();
				this._initDragDrop();
				this._initCategories();
				this._initSources();
				YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog, this);
				YAHOO.widget.Logger.logResetEvent.subscribe(this._onReset, this);
				YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate, this);
				YAHOO.widget.Logger.sourceCreateEvent.subscribe(this._onSourceCreate, this);
				this._filterLogs();
				YAHOO.log("LogReader initialized", null, this.toString());
};
YAHOO.widget.LogReader.prototype.logReaderEnabled = true;
YAHOO.widget.LogReader.prototype.width = null;
YAHOO.widget.LogReader.prototype.height = null;
YAHOO.widget.LogReader.prototype.top = null;
YAHOO.widget.LogReader.prototype.left = null;
YAHOO.widget.LogReader.prototype.right = null;
YAHOO.widget.LogReader.prototype.bottom = null;
YAHOO.widget.LogReader.prototype.fontSize = null;
YAHOO.widget.LogReader.prototype.footerEnabled = true;
YAHOO.widget.LogReader.prototype.verboseOutput = true;
YAHOO.widget.LogReader.prototype.newestOnTop = true;
YAHOO.widget.LogReader.prototype.outputBuffer = 100;
YAHOO.widget.LogReader.prototype.thresholdMax = 500;
YAHOO.widget.LogReader.prototype.thresholdMin = 100;
YAHOO.widget.LogReader.prototype.isCollapsed = false;
YAHOO.widget.LogReader.prototype.isPaused = false;
YAHOO.widget.LogReader.prototype.draggable = true;
YAHOO.widget.LogReader.prototype.toString = function() { return "LogReader instance" + this._sName; };
YAHOO.widget.LogReader.prototype.pause = function() {
				this.isPaused = true;
				this._btnPause.value = "Resume";
				this._timeout = null;
				this.logReaderEnabled = false;
};
YAHOO.widget.LogReader.prototype.resume = function() {
				this.isPaused = false;
				this._btnPause.value = "Pause";
				this.logReaderEnabled = true;
				this._printBuffer();
};
YAHOO.widget.LogReader.prototype.hide = function() { this._elContainer.style.display = "none"; };
YAHOO.widget.LogReader.prototype.show = function() { this._elContainer.style.display = "block"; };
YAHOO.widget.LogReader.prototype.collapse = function() {
				this._elConsole.style.display = "none";
				if (this._elFt) { this._elFt.style.display = "none"; }
				this._btnCollapse.value = "Expand";
				this.isCollapsed = true;
};
YAHOO.widget.LogReader.prototype.expand = function() {
				this._elConsole.style.display = "block";
				if (this._elFt) { this._elFt.style.display = "block"; }
				this._btnCollapse.value = "Collapse";
				this.isCollapsed = false;
};
YAHOO.widget.LogReader.prototype.getCheckbox = function(filter) { return this._filterCheckboxes[filter]; };
YAHOO.widget.LogReader.prototype.getCategories = function() { return this._categoryFilters; };
YAHOO.widget.LogReader.prototype.showCategory = function(sCategory) {
				var filtersArray = this._categoryFilters;
				if (filtersArray.indexOf) { if (filtersArray.indexOf(sCategory) > -1) { return; } } else { for (var i = 0; i < filtersArray.length; i++) { if (filtersArray[i] === sCategory) { return; } } }
				this._categoryFilters.push(sCategory);
				this._filterLogs();
				var elCheckbox = this.getCheckbox(sCategory);
				if (elCheckbox) { elCheckbox.checked = true; }
};
YAHOO.widget.LogReader.prototype.hideCategory = function(sCategory) {
				var filtersArray = this._categoryFilters;
				for (var i = 0; i < filtersArray.length; i++) { if (sCategory == filtersArray[i]) { filtersArray.splice(i, 1); break; } }
				this._filterLogs();
				var elCheckbox = this.getCheckbox(sCategory);
				if (elCheckbox) { elCheckbox.checked = false; }
};
YAHOO.widget.LogReader.prototype.getSources = function() { return this._sourceFilters; };
YAHOO.widget.LogReader.prototype.showSource = function(sSource) {
				var filtersArray = this._sourceFilters;
				if (filtersArray.indexOf) { if (filtersArray.indexOf(sSource) > -1) { return; } } else { for (var i = 0; i < filtersArray.length; i++) { if (sSource == filtersArray[i]) { return; } } }
				filtersArray.push(sSource);
				this._filterLogs();
				var elCheckbox = this.getCheckbox(sSource);
				if (elCheckbox) { elCheckbox.checked = true; }
};
YAHOO.widget.LogReader.prototype.hideSource = function(sSource) {
				var filtersArray = this._sourceFilters;
				for (var i = 0; i < filtersArray.length; i++) { if (sSource == filtersArray[i]) { filtersArray.splice(i, 1); break; } }
				this._filterLogs();
				var elCheckbox = this.getCheckbox(sSource);
				if (elCheckbox) { elCheckbox.checked = false; }
};
YAHOO.widget.LogReader.prototype.clearConsole = function() {
				this._timeout = null;
				this._buffer = [];
				this._consoleMsgCount = 0;
				var elConsole = this._elConsole;
				while (elConsole.hasChildNodes()) { elConsole.removeChild(elConsole.firstChild); }
};
YAHOO.widget.LogReader.prototype.setTitle = function(sTitle) { this._title.innerHTML = this.html2Text(sTitle); };
YAHOO.widget.LogReader.prototype.getLastTime = function() { return this._lastTime; };
YAHOO.widget.LogReader.prototype.formatMsg = function(oLogMsg) {
				var category = oLogMsg.category;
				var label = category.substring(0, 4).toUpperCase();
				var time = oLogMsg.time;
				if (time.toLocaleTimeString) { var localTime = time.toLocaleTimeString(); } else { localTime = time.toString(); }
				var msecs = time.getTime();
				var startTime = YAHOO.widget.Logger.getStartTime();
				var totalTime = msecs - startTime;
				var elapsedTime = msecs - this.getLastTime();
				var source = oLogMsg.source;
				var sourceDetail = oLogMsg.sourceDetail;
				var sourceAndDetail = (sourceDetail) ? source + " " + sourceDetail : source;
				var msg = this.html2Text(YAHOO.lang.dump(oLogMsg.msg));
				var output = (this.verboseOutput) ? ["<pre class=\"yui-log-verbose\"><p><span class='", category, "'>", label, "</span> ", totalTime, "ms (+", elapsedTime, ") ", localTime, ": ", "</p><p>", sourceAndDetail, ": </p><p>", msg, "</p></pre>"] : ["<pre><p><span class='", category, "'>", label, "</span> ", totalTime, "ms (+", elapsedTime, ") ", localTime, ": ", sourceAndDetail, ": ", msg, "</p></pre>"];
				return output.join("");
};
YAHOO.widget.LogReader.prototype.html2Text = function(sHtml) {
				if (sHtml) { sHtml += ""; return sHtml.replace(/&/g, "&#38;").replace(/</g, "&#60;").replace(/>/g, "&#62;"); }
				return "";
};
YAHOO.widget.LogReader._index = 0;
YAHOO.widget.LogReader.prototype._sName = null;
YAHOO.widget.LogReader.prototype._buffer = null;
YAHOO.widget.LogReader.prototype._consoleMsgCount = 0;
YAHOO.widget.LogReader.prototype._lastTime = null;
YAHOO.widget.LogReader.prototype._timeout = null;
YAHOO.widget.LogReader.prototype._filterCheckboxes = null;
YAHOO.widget.LogReader.prototype._categoryFilters = null;
YAHOO.widget.LogReader.prototype._sourceFilters = null;
YAHOO.widget.LogReader.prototype._elContainer = null;
YAHOO.widget.LogReader.prototype._elHd = null;
YAHOO.widget.LogReader.prototype._elCollapse = null;
YAHOO.widget.LogReader.prototype._btnCollapse = null;
YAHOO.widget.LogReader.prototype._title = null;
YAHOO.widget.LogReader.prototype._elConsole = null;
YAHOO.widget.LogReader.prototype._elFt = null;
YAHOO.widget.LogReader.prototype._elBtns = null;
YAHOO.widget.LogReader.prototype._elCategoryFilters = null;
YAHOO.widget.LogReader.prototype._elSourceFilters = null;
YAHOO.widget.LogReader.prototype._btnPause = null;
YAHOO.widget.LogReader.prototype._btnClear = null;
YAHOO.widget.LogReader.prototype._initContainerEl = function(elContainer) {
				elContainer = YAHOO.util.Dom.get(elContainer);
				if (elContainer && elContainer.tagName && (elContainer.tagName.toLowerCase() == "div")) {
								this._elContainer = elContainer;
								YAHOO.util.Dom.addClass(this._elContainer, "yui-log");
				} else {
								this._elContainer = document.body.appendChild(document.createElement("div"));
								YAHOO.util.Dom.addClass(this._elContainer, "yui-log");
								YAHOO.util.Dom.addClass(this._elContainer, "yui-log-container");
								var containerStyle = this._elContainer.style;
								if (this.width) { containerStyle.width = this.width; }
								if (this.right) { containerStyle.right = this.right; }
								if (this.top) { containerStyle.top = this.top; }
								if (this.left) {
												containerStyle.left = this.left;
												containerStyle.right = "auto";
								}
								if (this.bottom) {
												containerStyle.bottom = this.bottom;
												containerStyle.top = "auto";
								}
								if (this.fontSize) { containerStyle.fontSize = this.fontSize; }
								if (navigator.userAgent.toLowerCase().indexOf("opera") != -1) { document.body.style += ''; }
				}
};
YAHOO.widget.LogReader.prototype._initHeaderEl = function() {
				var oSelf = this;
				if (this._elHd) {
								YAHOO.util.Event.purgeElement(this._elHd, true);
								this._elHd.innerHTML = "";
				}
				this._elHd = this._elContainer.appendChild(document.createElement("div"));
				this._elHd.id = "yui-log-hd" + this._sName;
				this._elHd.className = "yui-log-hd";
				this._elCollapse = this._elHd.appendChild(document.createElement("div"));
				this._elCollapse.className = "yui-log-btns";
				this._btnCollapse = document.createElement("input");
				this._btnCollapse.type = "button";
				this._btnCollapse.className = "yui-log-button";
				this._btnCollapse.value = "Collapse";
				this._btnCollapse = this._elCollapse.appendChild(this._btnCollapse);
				YAHOO.util.Event.addListener(oSelf._btnCollapse, 'click', oSelf._onClickCollapseBtn, oSelf);
				this._title = this._elHd.appendChild(document.createElement("h4"));
				this._title.innerHTML = "Logger Console";
};
YAHOO.widget.LogReader.prototype._initConsoleEl = function() {
				if (this._elConsole) {
								YAHOO.util.Event.purgeElement(this._elConsole, true);
								this._elConsole.innerHTML = "";
				}
				this._elConsole = this._elContainer.appendChild(document.createElement("div"));
				this._elConsole.className = "yui-log-bd";
				if (this.height) { this._elConsole.style.height = this.height; }
};
YAHOO.widget.LogReader.prototype._initFooterEl = function() {
				var oSelf = this;
				if (this.footerEnabled) {
								if (this._elFt) {
												YAHOO.util.Event.purgeElement(this._elFt, true);
												this._elFt.innerHTML = "";
								}
								this._elFt = this._elContainer.appendChild(document.createElement("div"));
								this._elFt.className = "yui-log-ft";
								this._elBtns = this._elFt.appendChild(document.createElement("div"));
								this._elBtns.className = "yui-log-btns";
								this._btnPause = document.createElement("input");
								this._btnPause.type = "button";
								this._btnPause.className = "yui-log-button";
								this._btnPause.value = "Pause";
								this._btnPause = this._elBtns.appendChild(this._btnPause);
								YAHOO.util.Event.addListener(oSelf._btnPause, 'click', oSelf._onClickPauseBtn, oSelf);
								this._btnClear = document.createElement("input");
								this._btnClear.type = "button";
								this._btnClear.className = "yui-log-button";
								this._btnClear.value = "Clear";
								this._btnClear = this._elBtns.appendChild(this._btnClear);
								YAHOO.util.Event.addListener(oSelf._btnClear, 'click', oSelf._onClickClearBtn, oSelf);
								this._elCategoryFilters = this._elFt.appendChild(document.createElement("div"));
								this._elCategoryFilters.className = "yui-log-categoryfilters";
								this._elSourceFilters = this._elFt.appendChild(document.createElement("div"));
								this._elSourceFilters.className = "yui-log-sourcefilters";
				}
};
YAHOO.widget.LogReader.prototype._initDragDrop = function() {
				if (YAHOO.util.DD && this.draggable && this._elHd) {
								var ylog_dd = new YAHOO.util.DD(this._elContainer);
								ylog_dd.setHandleElId(this._elHd.id);
								this._elHd.style.cursor = "move";
				}
};
YAHOO.widget.LogReader.prototype._initCategories = function() {
				this._categoryFilters = [];
				var aInitialCategories = YAHOO.widget.Logger.categories;
				for (var j = 0; j < aInitialCategories.length; j++) {
								var sCategory = aInitialCategories[j];
								this._categoryFilters.push(sCategory);
								if (this._elCategoryFilters) { this._createCategoryCheckbox(sCategory); }
				}
};
YAHOO.widget.LogReader.prototype._initSources = function() {
				this._sourceFilters = [];
				var aInitialSources = YAHOO.widget.Logger.sources;
				for (var j = 0; j < aInitialSources.length; j++) {
								var sSource = aInitialSources[j];
								this._sourceFilters.push(sSource);
								if (this._elSourceFilters) { this._createSourceCheckbox(sSource); }
				}
};
YAHOO.widget.LogReader.prototype._createCategoryCheckbox = function(sCategory) {
				var oSelf = this;
				if (this._elFt) {
								var elParent = this._elCategoryFilters;
								var elFilter = elParent.appendChild(document.createElement("span"));
								elFilter.className = "yui-log-filtergrp";
								var chkCategory = document.createElement("input");
								chkCategory.id = "yui-log-filter-" + sCategory + this._sName;
								chkCategory.className = "yui-log-filter-" + sCategory;
								chkCategory.type = "checkbox";
								chkCategory.category = sCategory;
								chkCategory = elFilter.appendChild(chkCategory);
								chkCategory.checked = true;
								YAHOO.util.Event.addListener(chkCategory, 'click', oSelf._onCheckCategory, oSelf);
								var lblCategory = elFilter.appendChild(document.createElement("label"));
								lblCategory.htmlFor = chkCategory.id;
								lblCategory.className = sCategory;
								lblCategory.innerHTML = sCategory;
								this._filterCheckboxes[sCategory] = chkCategory;
				}
};
YAHOO.widget.LogReader.prototype._createSourceCheckbox = function(sSource) {
				var oSelf = this;
				if (this._elFt) {
								var elParent = this._elSourceFilters;
								var elFilter = elParent.appendChild(document.createElement("span"));
								elFilter.className = "yui-log-filtergrp";
								var chkSource = document.createElement("input");
								chkSource.id = "yui-log-filter" + sSource + this._sName;
								chkSource.className = "yui-log-filter" + sSource;
								chkSource.type = "checkbox";
								chkSource.source = sSource;
								chkSource = elFilter.appendChild(chkSource);
								chkSource.checked = true;
								YAHOO.util.Event.addListener(chkSource, 'click', oSelf._onCheckSource, oSelf);
								var lblSource = elFilter.appendChild(document.createElement("label"));
								lblSource.htmlFor = chkSource.id;
								lblSource.className = sSource;
								lblSource.innerHTML = sSource;
								this._filterCheckboxes[sSource] = chkSource;
				}
};
YAHOO.widget.LogReader.prototype._filterLogs = function() {
				if (this._elConsole !== null) {
								this.clearConsole();
								this._printToConsole(YAHOO.widget.Logger.getStack());
				}
};
YAHOO.widget.LogReader.prototype._printBuffer = function() {
				this._timeout = null;
				if (this._elConsole !== null) {
								var thresholdMax = this.thresholdMax;
								thresholdMax = (thresholdMax && !isNaN(thresholdMax)) ? thresholdMax : 500;
								if (this._consoleMsgCount < thresholdMax) {
												var entries = [];
												for (var i = 0; i < this._buffer.length; i++) { entries[i] = this._buffer[i]; }
												this._buffer = [];
												this._printToConsole(entries);
								} else { this._filterLogs(); }
								if (!this.newestOnTop) { this._elConsole.scrollTop = this._elConsole.scrollHeight; }
				}
};
YAHOO.widget.LogReader.prototype._printToConsole = function(aEntries) {
				var entriesLen = aEntries.length;
				var thresholdMin = this.thresholdMin;
				if (isNaN(thresholdMin) || (thresholdMin > this.thresholdMax)) { thresholdMin = 0; }
				var entriesStartIndex = (entriesLen > thresholdMin) ? (entriesLen - thresholdMin) : 0;
				var sourceFiltersLen = this._sourceFilters.length;
				var categoryFiltersLen = this._categoryFilters.length;
				for (var i = entriesStartIndex; i < entriesLen; i++) {
								var okToPrint = false;
								var okToFilterCats = false;
								var entry = aEntries[i];
								var source = entry.source;
								var category = entry.category;
								for (var j = 0; j < sourceFiltersLen; j++) { if (source == this._sourceFilters[j]) { okToFilterCats = true; break; } }
								if (okToFilterCats) { for (var k = 0; k < categoryFiltersLen; k++) { if (category == this._categoryFilters[k]) { okToPrint = true; break; } } }
								if (okToPrint) {
												var output = this.formatMsg(entry);
												if (this.newestOnTop) { this._elConsole.innerHTML = output + this._elConsole.innerHTML; } else { this._elConsole.innerHTML += output; }
												this._consoleMsgCount++;
												this._lastTime = entry.time.getTime();
								}
				}
};
YAHOO.widget.LogReader.prototype._onCategoryCreate = function(sType, aArgs, oSelf) {
				var category = aArgs[0];
				oSelf._categoryFilters.push(category);
				if (oSelf._elFt) { oSelf._createCategoryCheckbox(category); }
};
YAHOO.widget.LogReader.prototype._onSourceCreate = function(sType, aArgs, oSelf) {
				var source = aArgs[0];
				oSelf._sourceFilters.push(source);
				if (oSelf._elFt) { oSelf._createSourceCheckbox(source); }
};
YAHOO.widget.LogReader.prototype._onCheckCategory = function(v, oSelf) {
				var category = this.category;
				if (!this.checked) { oSelf.hideCategory(category); } else { oSelf.showCategory(category); }
};
YAHOO.widget.LogReader.prototype._onCheckSource = function(v, oSelf) {
				var source = this.source;
				if (!this.checked) { oSelf.hideSource(source); } else { oSelf.showSource(source); }
};
YAHOO.widget.LogReader.prototype._onClickCollapseBtn = function(v, oSelf) {
				if (!oSelf.isCollapsed) { oSelf.collapse(); } else { oSelf.expand(); }
};
YAHOO.widget.LogReader.prototype._onClickPauseBtn = function(v, oSelf) {
				if (!oSelf.isPaused) { oSelf.pause(); } else { oSelf.resume(); }
};
YAHOO.widget.LogReader.prototype._onClickClearBtn = function(v, oSelf) { oSelf.clearConsole(); };
YAHOO.widget.LogReader.prototype._onNewLog = function(sType, aArgs, oSelf) {
				var logEntry = aArgs[0];
				oSelf._buffer.push(logEntry);
				if (oSelf.logReaderEnabled === true && oSelf._timeout === null) { oSelf._timeout = setTimeout(function() { oSelf._printBuffer(); }, oSelf.outputBuffer); }
};
YAHOO.widget.LogReader.prototype._onReset = function(sType, aArgs, oSelf) { oSelf._filterLogs(); };
if (!YAHOO.widget.Logger) {
				YAHOO.widget.Logger = { loggerEnabled: true, _browserConsoleEnabled: false, categories: ["info", "warn", "error", "time", "window"], sources: ["global"], _stack: [], maxStackEntries: 2500, _startTime: new Date().getTime(), _lastTime: null };
				YAHOO.widget.Logger.log = function(sMsg, sCategory, sSource) {
								if (this.loggerEnabled) {
												if (!sCategory) { sCategory = "info"; } else { sCategory = sCategory.toLocaleLowerCase(); if (this._isNewCategory(sCategory)) { this._createNewCategory(sCategory); } }
												var sClass = "global";
												var sDetail = null;
												if (sSource) {
																var spaceIndex = sSource.indexOf(" ");
																if (spaceIndex > 0) {
																				sClass = sSource.substring(0, spaceIndex);
																				sDetail = sSource.substring(spaceIndex, sSource.length);
																} else { sClass = sSource; }
																if (this._isNewSource(sClass)) { this._createNewSource(sClass); }
												}
												var timestamp = new Date();
												var logEntry = new YAHOO.widget.LogMsg({ msg: sMsg, time: timestamp, category: sCategory, source: sClass, sourceDetail: sDetail });
												var stack = this._stack;
												var maxStackEntries = this.maxStackEntries;
												if (maxStackEntries && !isNaN(maxStackEntries) && (stack.length >= maxStackEntries)) { stack.shift(); }
												stack.push(logEntry);
												this.newLogEvent.fire(logEntry);
												if (this._browserConsoleEnabled) { this._printToBrowserConsole(logEntry); }
												return true;
								} else { return false; }
				};
				YAHOO.widget.Logger.reset = function() {
								this._stack = [];
								this._startTime = new Date().getTime();
								this.loggerEnabled = true;
								this.log("Logger reset");
								this.logResetEvent.fire();
				};
				YAHOO.widget.Logger.getStack = function() { return this._stack; };
				YAHOO.widget.Logger.getStartTime = function() { return this._startTime; };
				YAHOO.widget.Logger.disableBrowserConsole = function() {
								YAHOO.log("Logger output to the function console.log() has been disabled.");
								this._browserConsoleEnabled = false;
				};
				YAHOO.widget.Logger.enableBrowserConsole = function() {
								this._browserConsoleEnabled = true;
								YAHOO.log("Logger output to the function console.log() has been enabled.");
				};
				YAHOO.widget.Logger.categoryCreateEvent = new YAHOO.util.CustomEvent("categoryCreate", this, true);
				YAHOO.widget.Logger.sourceCreateEvent = new YAHOO.util.CustomEvent("sourceCreate", this, true);
				YAHOO.widget.Logger.newLogEvent = new YAHOO.util.CustomEvent("newLog", this, true);
				YAHOO.widget.Logger.logResetEvent = new YAHOO.util.CustomEvent("logReset", this, true);
				YAHOO.widget.Logger._createNewCategory = function(sCategory) {
								this.categories.push(sCategory);
								this.categoryCreateEvent.fire(sCategory);
				};
				YAHOO.widget.Logger._isNewCategory = function(sCategory) {
								for (var i = 0; i < this.categories.length; i++) { if (sCategory == this.categories[i]) { return false; } }
								return true;
				};
				YAHOO.widget.Logger._createNewSource = function(sSource) {
								this.sources.push(sSource);
								this.sourceCreateEvent.fire(sSource);
				};
				YAHOO.widget.Logger._isNewSource = function(sSource) {
								if (sSource) {
												for (var i = 0; i < this.sources.length; i++) { if (sSource == this.sources[i]) { return false; } }
												return true;
								}
				};
				YAHOO.widget.Logger._printToBrowserConsole = function(oEntry) {
								if (window.console && console.log) {
												var category = oEntry.category;
												var label = oEntry.category.substring(0, 4).toUpperCase();
												var time = oEntry.time;
												if (time.toLocaleTimeString) { var localTime = time.toLocaleTimeString(); } else { localTime = time.toString(); }
												var msecs = time.getTime();
												var elapsedTime = (YAHOO.widget.Logger._lastTime) ? (msecs - YAHOO.widget.Logger._lastTime) : 0;
												YAHOO.widget.Logger._lastTime = msecs;
												var output = localTime + " (" +
																elapsedTime + "ms): " +
																oEntry.source + ": " +
																oEntry.msg;
												console.log(output);
								}
				};
				YAHOO.widget.Logger._onWindowError = function(sMsg, sUrl, sLine) {
								try { YAHOO.widget.Logger.log(sMsg + ' (' + sUrl + ', line ' + sLine + ')', "window"); if (YAHOO.widget.Logger._origOnWindowError) { YAHOO.widget.Logger._origOnWindowError(); } } catch (e) { return false; }
				};
				if (window.onerror) { YAHOO.widget.Logger._origOnWindowError = window.onerror; }
				window.onerror = YAHOO.widget.Logger._onWindowError;
				YAHOO.widget.Logger.log("Logger initialized");
}
YAHOO.register("logger", YAHOO.widget.Logger, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
(function() {
				var Dom = YAHOO.util.Dom,
								Event = YAHOO.util.Event,
								Lang = YAHOO.lang,
								Overlay = YAHOO.widget.Overlay,
								Menu = YAHOO.widget.Menu,
								m_oButtons = {},
								m_oOverlayManager = null,
								m_oSubmitTrigger = null,
								m_oFocusedButton = null;

				function createInputElement(p_sType, p_sName, p_sValue, p_bChecked) {
								var oInput, sInput;
								if (Lang.isString(p_sType) && Lang.isString(p_sName)) {
												if (YAHOO.env.ua.ie) {
																sInput = "<input type=\"" + p_sType + "\" name=\"" +
																				p_sName + "\"";
																if (p_bChecked) { sInput += " checked"; }
																sInput += ">";
																oInput = document.createElement(sInput);
												} else {
																oInput = document.createElement("input");
																oInput.name = p_sName;
																oInput.type = p_sType;
																if (p_bChecked) { oInput.checked = true; }
												}
												oInput.value = p_sValue;
												return oInput;
								}
				}

				function setAttributesFromSrcElement(p_oElement, p_oAttributes) {
								var sSrcElementNodeName = p_oElement.nodeName.toUpperCase(),
												me = this,
												oAttribute, oRootNode, sText;

								function setAttributeFromDOMAttribute(p_sAttribute) { if (!(p_sAttribute in p_oAttributes)) { oAttribute = p_oElement.getAttributeNode(p_sAttribute); if (oAttribute && ("value" in oAttribute)) { p_oAttributes[p_sAttribute] = oAttribute.value; } } }

								function setFormElementProperties() {
												setAttributeFromDOMAttribute("type");
												if (p_oAttributes.type == "button") { p_oAttributes.type = "push"; }
												if (!("disabled" in p_oAttributes)) { p_oAttributes.disabled = p_oElement.disabled; }
												setAttributeFromDOMAttribute("name");
												setAttributeFromDOMAttribute("value");
												setAttributeFromDOMAttribute("title");
								}
								switch (sSrcElementNodeName) {
												case "A":
																p_oAttributes.type = "link";
																setAttributeFromDOMAttribute("href");
																setAttributeFromDOMAttribute("target");
																break;
												case "INPUT":
																setFormElementProperties();
																if (!("checked" in p_oAttributes)) { p_oAttributes.checked = p_oElement.checked; }
																break;
												case "BUTTON":
																setFormElementProperties();
																oRootNode = p_oElement.parentNode.parentNode;
																if (Dom.hasClass(oRootNode, this.CSS_CLASS_NAME + "-checked")) { p_oAttributes.checked = true; }
																if (Dom.hasClass(oRootNode, this.CSS_CLASS_NAME + "-disabled")) { p_oAttributes.disabled = true; }
																p_oElement.removeAttribute("value");
																p_oElement.setAttribute("type", "button");
																break;
								}
								p_oElement.removeAttribute("id");
								p_oElement.removeAttribute("name");
								if (!("tabindex" in p_oAttributes)) { p_oAttributes.tabindex = p_oElement.tabIndex; }
								if (!("label" in p_oAttributes)) { sText = sSrcElementNodeName == "INPUT" ? p_oElement.value : p_oElement.innerHTML; if (sText && sText.length > 0) { p_oAttributes.label = sText; } }
				}

				function initConfig(p_oConfig) {
								var oAttributes = p_oConfig.attributes,
												oSrcElement = oAttributes.srcelement,
												sSrcElementNodeName = oSrcElement.nodeName.toUpperCase(),
												me = this;
								if (sSrcElementNodeName == this.NODE_NAME) {
												p_oConfig.element = oSrcElement;
												p_oConfig.id = oSrcElement.id;
												Dom.getElementsBy(function(p_oElement) {
																switch (p_oElement.nodeName.toUpperCase()) {
																				case "BUTTON":
																				case "A":
																				case "INPUT":
																								setAttributesFromSrcElement.call(me, p_oElement, oAttributes);
																								break;
																}
												}, "*", oSrcElement);
								} else {
												switch (sSrcElementNodeName) {
																case "BUTTON":
																case "A":
																case "INPUT":
																				setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);
																				break;
												}
								}
				}
				YAHOO.widget.Button = function(p_oElement, p_oAttributes) {
								var fnSuperClass = YAHOO.widget.Button.superclass.constructor,
												oConfig, oElement;
								if (arguments.length == 1 && !Lang.isString(p_oElement) && !p_oElement.nodeName) {
												if (!p_oElement.id) { p_oElement.id = Dom.generateId(); }
												fnSuperClass.call(this, (this.createButtonElement(p_oElement.type)), p_oElement);
								} else {
												oConfig = { element: null, attributes: (p_oAttributes || {}) };
												if (Lang.isString(p_oElement)) {
																oElement = Dom.get(p_oElement);
																if (oElement) {
																				if (!oConfig.attributes.id) { oConfig.attributes.id = p_oElement; }
																				oConfig.attributes.srcelement = oElement;
																				initConfig.call(this, oConfig);
																				if (!oConfig.element) { oConfig.element = this.createButtonElement(oConfig.attributes.type); }
																				fnSuperClass.call(this, oConfig.element, oConfig.attributes);
																}
												} else if (p_oElement.nodeName) {
																if (!oConfig.attributes.id) {
																				if (p_oElement.id) { oConfig.attributes.id = p_oElement.id; } else { oConfig.attributes.id = Dom.generateId(); }
																}
																oConfig.attributes.srcelement = p_oElement;
																initConfig.call(this, oConfig);
																if (!oConfig.element) { oConfig.element = this.createButtonElement(oConfig.attributes.type); }
																fnSuperClass.call(this, oConfig.element, oConfig.attributes);
												}
								}
				};
				YAHOO.extend(YAHOO.widget.Button, YAHOO.util.Element, {
								_button: null,
								_menu: null,
								_hiddenFields: null,
								_onclickAttributeValue: null,
								_activationKeyPressed: false,
								_activationButtonPressed: false,
								_hasKeyEventHandlers: false,
								_hasMouseEventHandlers: false,
								NODE_NAME: "SPAN",
								CHECK_ACTIVATION_KEYS: [32],
								ACTIVATION_KEYS: [13, 32],
								OPTION_AREA_WIDTH: 20,
								CSS_CLASS_NAME: "yui-button",
								RADIO_DEFAULT_TITLE: "Unchecked.  Click to check.",
								RADIO_CHECKED_TITLE: "Checked.  Click to uncheck.",
								CHECKBOX_DEFAULT_TITLE: "Unchecked.  Click to check.",
								CHECKBOX_CHECKED_TITLE: "Checked.  Click to uncheck.",
								MENUBUTTON_DEFAULT_TITLE: "Menu collapsed.  Click to expand.",
								MENUBUTTON_MENU_VISIBLE_TITLE: "Menu expanded.  Click or press Esc to collapse.",
								SPLITBUTTON_DEFAULT_TITLE: ("Menu collapsed.  Click inside option " +
												"region or press Ctrl + Shift + M to show the menu."),
								SPLITBUTTON_OPTION_VISIBLE_TITLE: "Menu expanded.  Press Esc or Ctrl + Shift + M to hide the menu.",
								SUBMIT_TITLE: "Click to submit form.",
								_setType: function(p_sType) { if (p_sType == "split") { this.on("option", this._onOption); } },
								_setLabel: function(p_sLabel) {
												this._button.innerHTML = p_sLabel;
												var sClass, me;
												if (YAHOO.env.ua.gecko && Dom.inDocument(this.get("element"))) {
																me = this;
																sClass = this.CSS_CLASS_NAME;
																this.removeClass(sClass);
																window.setTimeout(function() { me.addClass(sClass); }, 0);
												}
								},
								_setTabIndex: function(p_nTabIndex) { this._button.tabIndex = p_nTabIndex; },
								_setTitle: function(p_sTitle) {
												var sTitle = p_sTitle;
												if (this.get("type") != "link") {
																if (!sTitle) {
																				switch (this.get("type")) {
																								case "radio":
																												sTitle = this.RADIO_DEFAULT_TITLE;
																												break;
																								case "checkbox":
																												sTitle = this.CHECKBOX_DEFAULT_TITLE;
																												break;
																								case "menu":
																												sTitle = this.MENUBUTTON_DEFAULT_TITLE;
																												break;
																								case "split":
																												sTitle = this.SPLITBUTTON_DEFAULT_TITLE;
																												break;
																								case "submit":
																												sTitle = this.SUBMIT_TITLE;
																												break;
																				}
																}
																this._button.title = sTitle;
												}
								},
								_setDisabled: function(p_bDisabled) {
												if (this.get("type") != "link") {
																if (p_bDisabled) {
																				if (this._menu) { this._menu.hide(); }
																				if (this.hasFocus()) { this.blur(); }
																				this._button.setAttribute("disabled", "disabled");
																				this.addStateCSSClasses("disabled");
																				this.removeStateCSSClasses("hover");
																				this.removeStateCSSClasses("active");
																				this.removeStateCSSClasses("focus");
																} else {
																				this._button.removeAttribute("disabled");
																				this.removeStateCSSClasses("disabled");
																}
												}
								},
								_setHref: function(p_sHref) { if (this.get("type") == "link") { this._button.href = p_sHref; } },
								_setTarget: function(p_sTarget) { if (this.get("type") == "link") { this._button.setAttribute("target", p_sTarget); } },
								_setChecked: function(p_bChecked) {
												var sType = this.get("type"),
																sTitle;
												if (sType == "checkbox" || sType == "radio") {
																if (p_bChecked) {
																				this.addStateCSSClasses("checked");
																				sTitle = (sType == "radio") ? this.RADIO_CHECKED_TITLE : this.CHECKBOX_CHECKED_TITLE;
																} else {
																				this.removeStateCSSClasses("checked");
																				sTitle = (sType == "radio") ? this.RADIO_DEFAULT_TITLE : this.CHECKBOX_DEFAULT_TITLE;
																}
																this.set("title", sTitle);
												}
								},
								_setMenu: function(p_oMenu) {
												var bLazyLoad = this.get("lazyloadmenu"),
																oButtonElement = this.get("element"),
																sMenuCSSClassName = Menu.prototype.CSS_CLASS_NAME,
																bInstance = false,
																oMenu, oMenuElement, oSrcElement, aItems, nItems, oItem, i;
												if (!Overlay) { return false; }
												if (!Menu) { return false; }

												function onAppendTo() {
																oMenu.render(oButtonElement.parentNode);
																this.removeListener("appendTo", onAppendTo);
												}

												function initMenu() {
																if (oMenu) {
																				Dom.addClass(oMenu.element, this.get("menuclassname"));
																				Dom.addClass(oMenu.element, "yui-" + this.get("type") + "-button-menu");
																				oMenu.showEvent.subscribe(this._onMenuShow, null, this);
																				oMenu.hideEvent.subscribe(this._onMenuHide, null, this);
																				oMenu.renderEvent.subscribe(this._onMenuRender, null, this);
																				if (oMenu instanceof Menu) {
																								oMenu.keyDownEvent.subscribe(this._onMenuKeyDown, this, true);
																								oMenu.subscribe("click", this._onMenuClick, this, true);
																								oMenu.itemAddedEvent.subscribe(this._onMenuItemAdded, this, true);
																								oSrcElement = oMenu.srcElement;
																								if (oSrcElement && oSrcElement.nodeName.toUpperCase() == "SELECT") {
																												oSrcElement.style.display = "none";
																												oSrcElement.parentNode.removeChild(oSrcElement);
																								}
																				} else if (oMenu instanceof Overlay) {
																								if (!m_oOverlayManager) { m_oOverlayManager = new YAHOO.widget.OverlayManager(); }
																								m_oOverlayManager.register(oMenu);
																				}
																				this._menu = oMenu;
																				if (!bInstance) {
																								if (bLazyLoad && !(oMenu instanceof Menu)) { oMenu.beforeShowEvent.subscribe(this._onOverlayBeforeShow, null, this); } else if (!bLazyLoad) {
																												if (Dom.inDocument(oButtonElement)) { oMenu.render(oButtonElement.parentNode); } else { this.on("appendTo", onAppendTo); }
																								}
																				}
																}
												}
												if (p_oMenu && (p_oMenu instanceof Menu)) {
																oMenu = p_oMenu;
																aItems = oMenu.getItems();
																nItems = aItems.length;
																bInstance = true;
																if (nItems > 0) {
																				i = nItems - 1;
																				do { oItem = aItems[i]; if (oItem) { oItem.cfg.subscribeToConfigEvent("selected", this._onMenuItemSelected, oItem, this); } }
																				while (i--);
																}
																initMenu.call(this);
												} else if (p_oMenu && (p_oMenu instanceof Overlay)) {
																oMenu = p_oMenu;
																bInstance = true;
																oMenu.cfg.setProperty("visible", false);
																oMenu.cfg.setProperty("context", [oButtonElement, "tl", "bl"]);
																initMenu.call(this);
												} else if (Lang.isArray(p_oMenu)) {
																this.on("appendTo", function() {
																				oMenu = new Menu(Dom.generateId(), { lazyload: bLazyLoad, itemdata: p_oMenu });
																				initMenu.call(this);
																});
												} else if (Lang.isString(p_oMenu)) {
																oMenuElement = Dom.get(p_oMenu);
																if (oMenuElement) {
																				if (Dom.hasClass(oMenuElement, sMenuCSSClassName) || oMenuElement.nodeName.toUpperCase() == "SELECT") {
																								oMenu = new Menu(p_oMenu, { lazyload: bLazyLoad });
																								initMenu.call(this);
																				} else {
																								oMenu = new Overlay(p_oMenu, { visible: false, context: [oButtonElement, "tl", "bl"] });
																								initMenu.call(this);
																				}
																}
												} else if (p_oMenu && p_oMenu.nodeName) {
																if (Dom.hasClass(p_oMenu, sMenuCSSClassName) || p_oMenu.nodeName.toUpperCase() == "SELECT") {
																				oMenu = new Menu(p_oMenu, { lazyload: bLazyLoad });
																				initMenu.call(this);
																} else {
																				if (!p_oMenu.id) { Dom.generateId(p_oMenu); }
																				oMenu = new Overlay(p_oMenu, { visible: false, context: [oButtonElement, "tl", "bl"] });
																				initMenu.call(this);
																}
												}
								},
								_setOnClick: function(p_oObject) {
												if (this._onclickAttributeValue && (this._onclickAttributeValue != p_oObject)) {
																this.removeListener("click", this._onclickAttributeValue.fn);
																this._onclickAttributeValue = null;
												}
												if (!this._onclickAttributeValue && Lang.isObject(p_oObject) && Lang.isFunction(p_oObject.fn)) {
																this.on("click", p_oObject.fn, p_oObject.obj, p_oObject.scope);
																this._onclickAttributeValue = p_oObject;
												}
								},
								_setSelectedMenuItem: function(p_nIndex) {
												var oMenu = this._menu,
																oMenuItem;
												if (oMenu && oMenu instanceof Menu) { oMenuItem = oMenu.getItem(p_nIndex); if (oMenuItem && !oMenuItem.cfg.getProperty("selected")) { oMenuItem.cfg.setProperty("selected", true); } }
								},
								_isActivationKey: function(p_nKeyCode) {
												var sType = this.get("type"),
																aKeyCodes = (sType == "checkbox" || sType == "radio") ? this.CHECK_ACTIVATION_KEYS : this.ACTIVATION_KEYS,
																nKeyCodes = aKeyCodes.length,
																i;
												if (nKeyCodes > 0) {
																i = nKeyCodes - 1;
																do { if (p_nKeyCode == aKeyCodes[i]) { return true; } }
																while (i--);
												}
								},
								_isSplitButtonOptionKey: function(p_oEvent) { return (p_oEvent.ctrlKey && p_oEvent.shiftKey && Event.getCharCode(p_oEvent) == 77); },
								_addListenersToForm: function() {
												var oForm = this.getForm(),
																onFormKeyPress = YAHOO.widget.Button.onFormKeyPress,
																bHasKeyPressListener, oSrcElement, aListeners, nListeners, i;
												if (oForm) {
																Event.on(oForm, "reset", this._onFormReset, null, this);
																Event.on(oForm, "submit", this.createHiddenFields, null, this);
																oSrcElement = this.get("srcelement");
																if (this.get("type") == "submit" || (oSrcElement && oSrcElement.type == "submit")) {
																				aListeners = Event.getListeners(oForm, "keypress");
																				bHasKeyPressListener = false;
																				if (aListeners) {
																								nListeners = aListeners.length;
																								if (nListeners > 0) {
																												i = nListeners - 1;
																												do { if (aListeners[i].fn == onFormKeyPress) { bHasKeyPressListener = true; break; } }
																												while (i--);
																								}
																				}
																				if (!bHasKeyPressListener) { Event.on(oForm, "keypress", onFormKeyPress); }
																}
												}
								},
								_originalMaxHeight: -1,
								_showMenu: function(p_oEvent) {
												YAHOO.widget.MenuManager.hideVisible();
												if (m_oOverlayManager) { m_oOverlayManager.hideAll(); }
												var oMenu = this._menu,
																nViewportHeight = Dom.getViewportHeight(),
																nMenuHeight, nScrollTop, nY;
												if (oMenu && (oMenu instanceof Menu)) {
																oMenu.cfg.applyConfig({ context: [this.get("id"), "tl", "bl"], constraintoviewport: false, clicktohide: false, visible: true });
																oMenu.cfg.fireQueue();
																oMenu.align("tl", "bl");
																if (p_oEvent.type == "mousedown") { Event.stopPropagation(p_oEvent); }
																if (this.get("focusmenu")) { this._menu.focus(); }
																nMenuHeight = oMenu.element.offsetHeight;
																if ((oMenu.cfg.getProperty("y") + nMenuHeight) > nViewportHeight) {
																				oMenu.align("bl", "tl");
																				nY = oMenu.cfg.getProperty("y");
																				nScrollTop = Dom.getDocumentScrollTop();
																				if (nScrollTop >= nY) {
																								if (this._originalMaxHeight == -1) { this._originalMaxHeight = oMenu.cfg.getProperty("maxheight"); }
																								oMenu.cfg.setProperty("maxheight", (nMenuHeight - ((nScrollTop - nY) + 20)));
																								oMenu.align("bl", "tl");
																				}
																}
												} else if (oMenu && (oMenu instanceof Overlay)) {
																oMenu.show();
																oMenu.align("tl", "bl");
																nMenuHeight = oMenu.element.offsetHeight;
																if ((oMenu.cfg.getProperty("y") + nMenuHeight) > nViewportHeight) { oMenu.align("bl", "tl"); }
												}
								},
								_hideMenu: function() { var oMenu = this._menu; if (oMenu) { oMenu.hide(); } },
								_onMouseOver: function(p_oEvent) {
												if (!this._hasMouseEventHandlers) {
																this.on("mouseout", this._onMouseOut);
																this.on("mousedown", this._onMouseDown);
																this.on("mouseup", this._onMouseUp);
																this._hasMouseEventHandlers = true;
												}
												this.addStateCSSClasses("hover");
												if (this._activationButtonPressed) { this.addStateCSSClasses("active"); }
												if (this._bOptionPressed) { this.addStateCSSClasses("activeoption"); }
								},
								_onMouseOut: function(p_oEvent) {
												this.removeStateCSSClasses("hover");
												if (this.get("type") != "menu") { this.removeStateCSSClasses("active"); }
												if (this._activationButtonPressed || this._bOptionPressed) { Event.on(document, "mouseup", this._onDocumentMouseUp, null, this); }
								},
								_onDocumentMouseUp: function(p_oEvent) {
												this._activationButtonPressed = false;
												this._bOptionPressed = false;
												var sType = this.get("type");
												if (sType == "menu" || sType == "split") {
																this.removeStateCSSClasses((sType == "menu" ? "active" : "activeoption"));
																this._hideMenu();
												}
												Event.removeListener(document, "mouseup", this._onDocumentMouseUp);
								},
								_onMouseDown: function(p_oEvent) {
												var sType, oElement, nX, me;

												function onMouseUp() {
																this._hideMenu();
																this.removeListener("mouseup", onMouseUp);
												}
												if ((p_oEvent.which || p_oEvent.button) == 1) {
																if (!this.hasFocus()) { this.focus(); }
																sType = this.get("type");
																if (sType == "split") {
																				oElement = this.get("element");
																				nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);
																				if ((oElement.offsetWidth - this.OPTION_AREA_WIDTH) < nX) { this.fireEvent("option", p_oEvent); } else {
																								this.addStateCSSClasses("active");
																								this._activationButtonPressed = true;
																				}
																} else if (sType == "menu") {
																				if (this.isActive()) {
																								this._hideMenu();
																								this._activationButtonPressed = false;
																				} else {
																								this._showMenu(p_oEvent);
																								this._activationButtonPressed = true;
																				}
																} else {
																				this.addStateCSSClasses("active");
																				this._activationButtonPressed = true;
																}
																if (sType == "split" || sType == "menu") {
																				me = this;
																				this._hideMenuTimerId = window.setTimeout(function() { me.on("mouseup", onMouseUp); }, 250);
																}
												}
								},
								_onMouseUp: function(p_oEvent) {
												var sType = this.get("type");
												if (this._hideMenuTimerId) { window.clearTimeout(this._hideMenuTimerId); }
												if (sType == "checkbox" || sType == "radio") { this.set("checked", !(this.get("checked"))); }
												this._activationButtonPressed = false;
												if (this.get("type") != "menu") { this.removeStateCSSClasses("active"); }
								},
								_onFocus: function(p_oEvent) {
												var oElement;
												this.addStateCSSClasses("focus");
												if (this._activationKeyPressed) { this.addStateCSSClasses("active"); }
												m_oFocusedButton = this;
												if (!this._hasKeyEventHandlers) {
																oElement = this._button;
																Event.on(oElement, "blur", this._onBlur, null, this);
																Event.on(oElement, "keydown", this._onKeyDown, null, this);
																Event.on(oElement, "keyup", this._onKeyUp, null, this);
																this._hasKeyEventHandlers = true;
												}
												this.fireEvent("focus", p_oEvent);
								},
								_onBlur: function(p_oEvent) {
												this.removeStateCSSClasses("focus");
												if (this.get("type") != "menu") { this.removeStateCSSClasses("active"); }
												if (this._activationKeyPressed) { Event.on(document, "keyup", this._onDocumentKeyUp, null, this); }
												m_oFocusedButton = null;
												this.fireEvent("blur", p_oEvent);
								},
								_onDocumentKeyUp: function(p_oEvent) {
												if (this._isActivationKey(Event.getCharCode(p_oEvent))) {
																this._activationKeyPressed = false;
																Event.removeListener(document, "keyup", this._onDocumentKeyUp);
												}
								},
								_onKeyDown: function(p_oEvent) {
												var oMenu = this._menu;
												if (this.get("type") == "split" && this._isSplitButtonOptionKey(p_oEvent)) { this.fireEvent("option", p_oEvent); } else if (this._isActivationKey(Event.getCharCode(p_oEvent))) {
																if (this.get("type") == "menu") { this._showMenu(p_oEvent); } else {
																				this._activationKeyPressed = true;
																				this.addStateCSSClasses("active");
																}
												}
												if (oMenu && oMenu.cfg.getProperty("visible") && Event.getCharCode(p_oEvent) == 27) {
																oMenu.hide();
																this.focus();
												}
								},
								_onKeyUp: function(p_oEvent) {
												var sType;
												if (this._isActivationKey(Event.getCharCode(p_oEvent))) {
																sType = this.get("type");
																if (sType == "checkbox" || sType == "radio") { this.set("checked", !(this.get("checked"))); }
																this._activationKeyPressed = false;
																if (this.get("type") != "menu") { this.removeStateCSSClasses("active"); }
												}
								},
								_onClick: function(p_oEvent) {
												var sType = this.get("type"),
																sTitle, oForm, oSrcElement, oElement, nX;
												switch (sType) {
																case "radio":
																case "checkbox":
																				if (this.get("checked")) { sTitle = (sType == "radio") ? this.RADIO_CHECKED_TITLE : this.CHECKBOX_CHECKED_TITLE; } else { sTitle = (sType == "radio") ? this.RADIO_DEFAULT_TITLE : this.CHECKBOX_DEFAULT_TITLE; }
																				this.set("title", sTitle);
																				break;
																case "submit":
																				this.submitForm();
																				break;
																case "reset":
																				oForm = this.getForm();
																				if (oForm) { oForm.reset(); }
																				break;
																case "menu":
																				sTitle = this._menu.cfg.getProperty("visible") ? this.MENUBUTTON_MENU_VISIBLE_TITLE : this.MENUBUTTON_DEFAULT_TITLE;
																				this.set("title", sTitle);
																				break;
																case "split":
																				oElement = this.get("element");
																				nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);
																				if ((oElement.offsetWidth - this.OPTION_AREA_WIDTH) < nX) { return false; } else {
																								this._hideMenu();
																								oSrcElement = this.get("srcelement");
																								if (oSrcElement && oSrcElement.type == "submit") { this.submitForm(); }
																				}
																				sTitle = this._menu.cfg.getProperty("visible") ? this.SPLITBUTTON_OPTION_VISIBLE_TITLE : this.SPLITBUTTON_DEFAULT_TITLE;
																				this.set("title", sTitle);
																				break;
												}
								},
								_onAppendTo: function(p_oEvent) {
												var me = this;
												window.setTimeout(function() { me._addListenersToForm(); }, 0);
								},
								_onFormReset: function(p_oEvent) {
												var sType = this.get("type"),
																oMenu = this._menu;
												if (sType == "checkbox" || sType == "radio") { this.resetValue("checked"); }
												if (oMenu && (oMenu instanceof Menu)) { this.resetValue("selectedMenuItem"); }
								},
								_onDocumentMouseDown: function(p_oEvent) {
												var oTarget = Event.getTarget(p_oEvent),
																oButtonElement = this.get("element"),
																oMenuElement = this._menu.element;
												if (oTarget != oButtonElement && !Dom.isAncestor(oButtonElement, oTarget) && oTarget != oMenuElement && !Dom.isAncestor(oMenuElement, oTarget)) {
																this._hideMenu();
																Event.removeListener(document, "mousedown", this._onDocumentMouseDown);
												}
								},
								_onOption: function(p_oEvent) {
												if (this.hasClass("yui-split-button-activeoption")) {
																this._hideMenu();
																this._bOptionPressed = false;
												} else {
																this._showMenu(p_oEvent);
																this._bOptionPressed = true;
												}
								},
								_onOverlayBeforeShow: function(p_sType) {
												var oMenu = this._menu;
												oMenu.render(this.get("element").parentNode);
												oMenu.beforeShowEvent.unsubscribe(this._onOverlayBeforeShow);
								},
								_onMenuShow: function(p_sType) {
												Event.on(document, "mousedown", this._onDocumentMouseDown, null, this);
												var sTitle, sState;
												if (this.get("type") == "split") {
																sTitle = this.SPLITBUTTON_OPTION_VISIBLE_TITLE;
																sState = "activeoption";
												} else {
																sTitle = this.MENUBUTTON_MENU_VISIBLE_TITLE;
																sState = "active";
												}
												this.addStateCSSClasses(sState);
												this.set("title", sTitle);
								},
								_onMenuHide: function(p_sType) {
												var oMenu = this._menu,
																sTitle, sState;
												if (oMenu && (oMenu instanceof Menu) && this._originalMaxHeight != -1) { this._menu.cfg.setProperty("maxheight", this._originalMaxHeight); }
												if (this.get("type") == "split") {
																sTitle = this.SPLITBUTTON_DEFAULT_TITLE;
																sState = "activeoption";
												} else {
																sTitle = this.MENUBUTTON_DEFAULT_TITLE;
																sState = "active";
												}
												this.removeStateCSSClasses(sState);
												this.set("title", sTitle);
												if (this.get("type") == "split") { this._bOptionPressed = false; }
								},
								_onMenuKeyDown: function(p_sType, p_aArgs) { var oEvent = p_aArgs[0]; if (Event.getCharCode(oEvent) == 27) { this.focus(); if (this.get("type") == "split") { this._bOptionPressed = false; } } },
								_onMenuRender: function(p_sType) {
												var oButtonElement = this.get("element"),
																oButtonParent = oButtonElement.parentNode,
																oMenuElement = this._menu.element;
												if (oButtonParent != oMenuElement.parentNode) { oButtonParent.appendChild(oMenuElement); }
												this.set("selectedMenuItem", this.get("selectedMenuItem"));
								},
								_onMenuItemSelected: function(p_sType, p_aArgs, p_nItem) { var bSelected = p_aArgs[0]; if (bSelected) { this.set("selectedMenuItem", p_nItem); } },
								_onMenuItemAdded: function(p_sType, p_aArgs, p_oItem) {
												var oItem = p_aArgs[0];
												oItem.cfg.subscribeToConfigEvent("selected", this._onMenuItemSelected, oItem.index, this);
								},
								_onMenuClick: function(p_sType, p_aArgs) {
												var oItem = p_aArgs[1],
																oSrcElement;
												if (oItem) {
																oSrcElement = this.get("srcelement");
																if (oSrcElement && oSrcElement.type == "submit") { this.submitForm(); }
																this._hideMenu();
												}
								},
								createButtonElement: function(p_sType) {
												var sNodeName = this.NODE_NAME,
																oElement = document.createElement(sNodeName);
												oElement.innerHTML = "<" + sNodeName + " class=\"first-child\">" +
																(p_sType == "link" ? "<a></a>" : "<button type=\"button\"></button>") + "</" + sNodeName + ">";
												return oElement;
								},
								addStateCSSClasses: function(p_sState) {
												var sType = this.get("type");
												if (Lang.isString(p_sState)) {
																if (p_sState != "activeoption") { this.addClass(this.CSS_CLASS_NAME + ("-" + p_sState)); }
																this.addClass("yui-" + sType + ("-button-" + p_sState));
												}
								},
								removeStateCSSClasses: function(p_sState) {
												var sType = this.get("type");
												if (Lang.isString(p_sState)) {
																this.removeClass(this.CSS_CLASS_NAME + ("-" + p_sState));
																this.removeClass("yui-" + sType + ("-button-" + p_sState));
												}
								},
								createHiddenFields: function() {
												this.removeHiddenFields();
												var oForm = this.getForm(),
																oButtonField, sType, bCheckable, oMenu, oMenuItem, sName, oValue, oMenuField;
												if (oForm && !this.get("disabled")) {
																sType = this.get("type");
																bCheckable = (sType == "checkbox" || sType == "radio");
																if (bCheckable || (m_oSubmitTrigger == this)) {
																				oButtonField = createInputElement((bCheckable ? sType : "hidden"), this.get("name"), this.get("value"), this.get("checked"));
																				if (oButtonField) {
																								if (bCheckable) { oButtonField.style.display = "none"; }
																								oForm.appendChild(oButtonField);
																				}
																}
																oMenu = this._menu;
																if (oMenu && (oMenu instanceof Menu)) {
																				oMenuField = oMenu.srcElement;
																				oMenuItem = oMenu.getItem(this.get("selectedMenuItem"));
																				if (oMenuItem) {
																								if (oMenuField && oMenuField.nodeName.toUpperCase() == "SELECT") {
																												oForm.appendChild(oMenuField);
																												oMenuField.selectedIndex = oMenuItem.index;
																								} else {
																												oValue = (oMenuItem.value === null || oMenuItem.value === "") ? oMenuItem.cfg.getProperty("text") : oMenuItem.value;
																												sName = this.get("name");
																												if (oValue && sName) {
																																oMenuField = createInputElement("hidden", (sName + "_options"), oValue);
																																oForm.appendChild(oMenuField);
																												}
																								}
																				}
																}
																if (oButtonField && oMenuField) { this._hiddenFields = [oButtonField, oMenuField]; } else if (!oButtonField && oMenuField) { this._hiddenFields = oMenuField; } else if (oButtonField && !oMenuField) { this._hiddenFields = oButtonField; }
																return this._hiddenFields;
												}
								},
								removeHiddenFields: function() {
												var oField = this._hiddenFields,
																nFields, i;

												function removeChild(p_oElement) { if (Dom.inDocument(p_oElement)) { p_oElement.parentNode.removeChild(p_oElement); } }
												if (oField) {
																if (Lang.isArray(oField)) {
																				nFields = oField.length;
																				if (nFields > 0) {
																								i = nFields - 1;
																								do { removeChild(oField[i]); }
																								while (i--);
																				}
																} else { removeChild(oField); }
																this._hiddenFields = null;
												}
								},
								submitForm: function() {
												var oForm = this.getForm(),
																oSrcElement = this.get("srcelement"),
																bSubmitForm = false,
																oEvent;
												if (oForm) {
																if (this.get("type") == "submit" || (oSrcElement && oSrcElement.type == "submit")) { m_oSubmitTrigger = this; }
																if (YAHOO.env.ua.ie) { bSubmitForm = oForm.fireEvent("onsubmit"); } else {
																				oEvent = document.createEvent("HTMLEvents");
																				oEvent.initEvent("submit", true, true);
																				bSubmitForm = oForm.dispatchEvent(oEvent);
																}
																if ((YAHOO.env.ua.ie || YAHOO.env.ua.webkit) && bSubmitForm) { oForm.submit(); }
												}
												return bSubmitForm;
								},
								init: function(p_oElement, p_oAttributes) {
												var sNodeName = p_oAttributes.type == "link" ? "a" : "button",
																oSrcElement = p_oAttributes.srcelement,
																oButton = p_oElement.getElementsByTagName(sNodeName)[0],
																oInput;
												if (!oButton) {
																oInput = p_oElement.getElementsByTagName("input")[0];
																if (oInput) {
																				oButton = document.createElement("button");
																				oButton.setAttribute("type", "button");
																				oInput.parentNode.replaceChild(oButton, oInput);
																}
												}
												this._button = oButton;
												YAHOO.widget.Button.superclass.init.call(this, p_oElement, p_oAttributes);
												m_oButtons[this.get("id")] = this;
												this.addClass(this.CSS_CLASS_NAME);
												this.addClass("yui-" + this.get("type") + "-button");
												Event.on(this._button, "focus", this._onFocus, null, this);
												this.on("mouseover", this._onMouseOver);
												this.on("click", this._onClick);
												this.on("appendTo", this._onAppendTo);
												var oContainer = this.get("container"),
																oElement = this.get("element"),
																bElInDoc = Dom.inDocument(oElement),
																oParentNode;
												if (oContainer) {
																if (oSrcElement && oSrcElement != oElement) { oParentNode = oSrcElement.parentNode; if (oParentNode) { oParentNode.removeChild(oSrcElement); } }
																if (Lang.isString(oContainer)) { Event.onContentReady(oContainer, function() { this.appendTo(oContainer); }, null, this); } else { this.appendTo(oContainer); }
												} else if (!bElInDoc && oSrcElement && oSrcElement != oElement) {
																oParentNode = oSrcElement.parentNode;
																if (oParentNode) {
																				this.fireEvent("beforeAppendTo", { type: "beforeAppendTo", target: oParentNode });
																				oParentNode.replaceChild(oElement, oSrcElement);
																				this.fireEvent("appendTo", { type: "appendTo", target: oParentNode });
																}
												} else if (this.get("type") != "link" && bElInDoc && oSrcElement && oSrcElement == oElement) { this._addListenersToForm(); }
								},
								initAttributes: function(p_oAttributes) {
												var oAttributes = p_oAttributes || {};
												YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);
												this.setAttributeConfig("type", { value: (oAttributes.type || "push"), validator: Lang.isString, writeOnce: true, method: this._setType });
												this.setAttributeConfig("label", { value: oAttributes.label, validator: Lang.isString, method: this._setLabel });
												this.setAttributeConfig("value", { value: oAttributes.value });
												this.setAttributeConfig("name", { value: oAttributes.name, validator: Lang.isString });
												this.setAttributeConfig("tabindex", { value: oAttributes.tabindex, validator: Lang.isNumber, method: this._setTabIndex });
												this.configureAttribute("title", { value: oAttributes.title, validator: Lang.isString, method: this._setTitle });
												this.setAttributeConfig("disabled", { value: (oAttributes.disabled || false), validator: Lang.isBoolean, method: this._setDisabled });
												this.setAttributeConfig("href", { value: oAttributes.href, validator: Lang.isString, method: this._setHref });
												this.setAttributeConfig("target", { value: oAttributes.target, validator: Lang.isString, method: this._setTarget });
												this.setAttributeConfig("checked", { value: (oAttributes.checked || false), validator: Lang.isBoolean, method: this._setChecked });
												this.setAttributeConfig("container", { value: oAttributes.container, writeOnce: true });
												this.setAttributeConfig("srcelement", { value: oAttributes.srcelement, writeOnce: true });
												this.setAttributeConfig("menu", { value: null, method: this._setMenu, writeOnce: true });
												this.setAttributeConfig("lazyloadmenu", { value: (oAttributes.lazyloadmenu === false ? false : true), validator: Lang.isBoolean, writeOnce: true });
												this.setAttributeConfig("menuclassname", { value: (oAttributes.menuclassname || "yui-button-menu"), validator: Lang.isString, method: this._setMenuClassName, writeOnce: true });
												this.setAttributeConfig("selectedMenuItem", { value: 0, validator: Lang.isNumber, method: this._setSelectedMenuItem });
												this.setAttributeConfig("onclick", { value: oAttributes.onclick, method: this._setOnClick });
												this.setAttributeConfig("focusmenu", { value: (oAttributes.focusmenu === false ? false : true), validator: Lang.isBoolean });
								},
								focus: function() { if (!this.get("disabled")) { this._button.focus(); } },
								blur: function() { if (!this.get("disabled")) { this._button.blur(); } },
								hasFocus: function() { return (m_oFocusedButton == this); },
								isActive: function() { return this.hasClass(this.CSS_CLASS_NAME + "-active"); },
								getMenu: function() { return this._menu; },
								getForm: function() { return this._button.form; },
								getHiddenFields: function() { return this._hiddenFields; },
								destroy: function() {
												var oElement = this.get("element"),
																oParentNode = oElement.parentNode,
																oMenu = this._menu,
																aButtons;
												if (oMenu) {
																if (m_oOverlayManager.find(oMenu)) { m_oOverlayManager.remove(oMenu); }
																oMenu.destroy();
												}
												Event.purgeElement(oElement);
												Event.purgeElement(this._button);
												Event.removeListener(document, "mouseup", this._onDocumentMouseUp);
												Event.removeListener(document, "keyup", this._onDocumentKeyUp);
												Event.removeListener(document, "mousedown", this._onDocumentMouseDown);
												var oForm = this.getForm();
												if (oForm) {
																Event.removeListener(oForm, "reset", this._onFormReset);
																Event.removeListener(oForm, "submit", this.createHiddenFields);
												}
												this.unsubscribeAll();
												if (oParentNode) { oParentNode.removeChild(oElement); }
												delete m_oButtons[this.get("id")];
												aButtons = Dom.getElementsByClassName(this.CSS_CLASS_NAME, this.NODE_NAME, oForm);
												if (Lang.isArray(aButtons) && aButtons.length === 0) { Event.removeListener(oForm, "keypress", YAHOO.widget.Button.onFormKeyPress); }
								},
								fireEvent: function(p_sType, p_aArgs) {
												if (this.DOM_EVENTS[p_sType] && this.get("disabled")) { return; }
												YAHOO.widget.Button.superclass.fireEvent.call(this, p_sType, p_aArgs);
								},
								toString: function() { return ("Button " + this.get("id")); }
				});
				YAHOO.widget.Button.onFormKeyPress = function(p_oEvent) {
								var oTarget = Event.getTarget(p_oEvent),
												nCharCode = Event.getCharCode(p_oEvent),
												sNodeName = oTarget.nodeName && oTarget.nodeName.toUpperCase(),
												sType = oTarget.type,
												bFormContainsYUIButtons = false,
												oButton, oYUISubmitButton, oPrecedingSubmitButton, oFollowingSubmitButton;

								function isSubmitButton(p_oElement) {
												var sId, oSrcElement;
												switch (p_oElement.nodeName.toUpperCase()) {
																case "INPUT":
																case "BUTTON":
																				if (p_oElement.type == "submit" && !p_oElement.disabled) {
																								if (!bFormContainsYUIButtons && !oPrecedingSubmitButton) { oPrecedingSubmitButton = p_oElement; }
																								if (oYUISubmitButton && !oFollowingSubmitButton) { oFollowingSubmitButton = p_oElement; }
																				}
																				break;
																default:
																				sId = p_oElement.id;
																				if (sId) {
																								oButton = m_oButtons[sId];
																								if (oButton) {
																												bFormContainsYUIButtons = true;
																												if (!oButton.get("disabled")) {
																																oSrcElement = oButton.get("srcelement");
																																if (!oYUISubmitButton && (oButton.get("type") == "submit" || (oSrcElement && oSrcElement.type == "submit"))) { oYUISubmitButton = oButton; }
																												}
																								}
																				}
																				break;
												}
								}
								if (nCharCode == 13 && ((sNodeName == "INPUT" && (sType == "text" || sType == "password" || sType == "checkbox" || sType == "radio" || sType == "file")) || sNodeName == "SELECT")) {
												Dom.getElementsBy(isSubmitButton, "*", this);
												if (oPrecedingSubmitButton) { oPrecedingSubmitButton.focus(); } else if (!oPrecedingSubmitButton && oYUISubmitButton) {
																if (oFollowingSubmitButton) { Event.preventDefault(p_oEvent); }
																oYUISubmitButton.submitForm();
												}
								}
				};
				YAHOO.widget.Button.addHiddenFieldsToForm = function(p_oForm) {
								var aButtons = Dom.getElementsByClassName(YAHOO.widget.Button.prototype.CSS_CLASS_NAME, "*", p_oForm),
												nButtons = aButtons.length,
												oButton, sId, i;
								if (nButtons > 0) { for (i = 0; i < nButtons; i++) { sId = aButtons[i].id; if (sId) { oButton = m_oButtons[sId]; if (oButton) { oButton.createHiddenFields(); } } } }
				};
})();
(function() {
				var Dom = YAHOO.util.Dom,
								Event = YAHOO.util.Event,
								Lang = YAHOO.lang,
								Button = YAHOO.widget.Button,
								m_oButtons = {};
				YAHOO.widget.ButtonGroup = function(p_oElement, p_oAttributes) {
								var fnSuperClass = YAHOO.widget.ButtonGroup.superclass.constructor,
												sNodeName, oElement, sId;
								if (arguments.length == 1 && !Lang.isString(p_oElement) && !p_oElement.nodeName) {
												if (!p_oElement.id) {
																sId = Dom.generateId();
																p_oElement.id = sId;
												}
												fnSuperClass.call(this, (this._createGroupElement()), p_oElement);
								} else if (Lang.isString(p_oElement)) { oElement = Dom.get(p_oElement); if (oElement) { if (oElement.nodeName.toUpperCase() == this.NODE_NAME) { fnSuperClass.call(this, oElement, p_oAttributes); } } } else {
												sNodeName = p_oElement.nodeName.toUpperCase();
												if (sNodeName && sNodeName == this.NODE_NAME) {
																if (!p_oElement.id) { p_oElement.id = Dom.generateId(); }
																fnSuperClass.call(this, p_oElement, p_oAttributes);
												}
								}
				};
				YAHOO.extend(YAHOO.widget.ButtonGroup, YAHOO.util.Element, {
								_buttons: null,
								NODE_NAME: "DIV",
								CSS_CLASS_NAME: "yui-buttongroup",
								_createGroupElement: function() { var oElement = document.createElement(this.NODE_NAME); return oElement; },
								_setDisabled: function(p_bDisabled) {
												var nButtons = this.getCount(),
																i;
												if (nButtons > 0) {
																i = nButtons - 1;
																do { this._buttons[i].set("disabled", p_bDisabled); }
																while (i--);
												}
								},
								_onKeyDown: function(p_oEvent) {
												var oTarget = Event.getTarget(p_oEvent),
																nCharCode = Event.getCharCode(p_oEvent),
																sId = oTarget.parentNode.parentNode.id,
																oButton = m_oButtons[sId],
																nIndex = -1;
												if (nCharCode == 37 || nCharCode == 38) { nIndex = (oButton.index === 0) ? (this._buttons.length - 1) : (oButton.index - 1); } else if (nCharCode == 39 || nCharCode == 40) { nIndex = (oButton.index === (this._buttons.length - 1)) ? 0 : (oButton.index + 1); }
												if (nIndex > -1) {
																this.check(nIndex);
																this.getButton(nIndex).focus();
												}
								},
								_onAppendTo: function(p_oEvent) {
												var aButtons = this._buttons,
																nButtons = aButtons.length,
																i;
												for (i = 0; i < nButtons; i++) { aButtons[i].appendTo(this.get("element")); }
								},
								_onButtonCheckedChange: function(p_oEvent, p_oButton) {
												var bChecked = p_oEvent.newValue,
																oCheckedButton = this.get("checkedButton");
												if (bChecked && oCheckedButton != p_oButton) {
																if (oCheckedButton) { oCheckedButton.set("checked", false, true); }
																this.set("checkedButton", p_oButton);
																this.set("value", p_oButton.get("value"));
												} else if (oCheckedButton && !oCheckedButton.set("checked")) { oCheckedButton.set("checked", true, true); }
								},
								init: function(p_oElement, p_oAttributes) {
												this._buttons = [];
												YAHOO.widget.ButtonGroup.superclass.init.call(this, p_oElement, p_oAttributes);
												this.addClass(this.CSS_CLASS_NAME);
												var aButtons = this.getElementsByClassName("yui-radio-button");
												if (aButtons.length > 0) { this.addButtons(aButtons); }

												function isRadioButton(p_oElement) { return (p_oElement.type == "radio"); }
												aButtons = Dom.getElementsBy(isRadioButton, "input", this.get("element"));
												if (aButtons.length > 0) { this.addButtons(aButtons); }
												this.on("keydown", this._onKeyDown);
												this.on("appendTo", this._onAppendTo);
												var oContainer = this.get("container");
												if (oContainer) {
																if (Lang.isString(oContainer)) { Event.onContentReady(oContainer, function() { this.appendTo(oContainer); }, null, this); } else { this.appendTo(oContainer); }
												}
								},
								initAttributes: function(p_oAttributes) {
												var oAttributes = p_oAttributes || {};
												YAHOO.widget.ButtonGroup.superclass.initAttributes.call(this, oAttributes);
												this.setAttributeConfig("name", { value: oAttributes.name, validator: Lang.isString });
												this.setAttributeConfig("disabled", { value: (oAttributes.disabled || false), validator: Lang.isBoolean, method: this._setDisabled });
												this.setAttributeConfig("value", { value: oAttributes.value });
												this.setAttributeConfig("container", { value: oAttributes.container, writeOnce: true });
												this.setAttributeConfig("checkedButton", { value: null });
								},
								addButton: function(p_oButton) {
												var oButton, oButtonElement, oGroupElement, nIndex, sButtonName, sGroupName;
												if (p_oButton instanceof Button && p_oButton.get("type") == "radio") { oButton = p_oButton; } else if (!Lang.isString(p_oButton) && !p_oButton.nodeName) {
																p_oButton.type = "radio";
																oButton = new Button(p_oButton);
												} else { oButton = new Button(p_oButton, { type: "radio" }); }
												if (oButton) {
																nIndex = this._buttons.length;
																sButtonName = oButton.get("name");
																sGroupName = this.get("name");
																oButton.index = nIndex;
																this._buttons[nIndex] = oButton;
																m_oButtons[oButton.get("id")] = oButton;
																if (sButtonName != sGroupName) { oButton.set("name", sGroupName); }
																if (this.get("disabled")) { oButton.set("disabled", true); }
																if (oButton.get("checked")) { this.set("checkedButton", oButton); }
																oButtonElement = oButton.get("element");
																oGroupElement = this.get("element");
																if (oButtonElement.parentNode != oGroupElement) { oGroupElement.appendChild(oButtonElement); }
																oButton.on("checkedChange", this._onButtonCheckedChange, oButton, this);
																return oButton;
												}
								},
								addButtons: function(p_aButtons) {
												var nButtons, oButton, aButtons, i;
												if (Lang.isArray(p_aButtons)) {
																nButtons = p_aButtons.length;
																aButtons = [];
																if (nButtons > 0) {
																				for (i = 0; i < nButtons; i++) { oButton = this.addButton(p_aButtons[i]); if (oButton) { aButtons[aButtons.length] = oButton; } }
																				if (aButtons.length > 0) { return aButtons; }
																}
												}
								},
								removeButton: function(p_nIndex) {
												var oButton = this.getButton(p_nIndex),
																nButtons, i;
												if (oButton) {
																this._buttons.splice(p_nIndex, 1);
																delete m_oButtons[oButton.get("id")];
																oButton.removeListener("checkedChange", this._onButtonCheckedChange);
																oButton.destroy();
																nButtons = this._buttons.length;
																if (nButtons > 0) {
																				i = this._buttons.length - 1;
																				do { this._buttons[i].index = i; }
																				while (i--);
																}
												}
								},
								getButton: function(p_nIndex) { if (Lang.isNumber(p_nIndex)) { return this._buttons[p_nIndex]; } },
								getButtons: function() { return this._buttons; },
								getCount: function() { return this._buttons.length; },
								focus: function(p_nIndex) {
												var oButton, nButtons, i;
												if (Lang.isNumber(p_nIndex)) { oButton = this._buttons[p_nIndex]; if (oButton) { oButton.focus(); } } else { nButtons = this.getCount(); for (i = 0; i < nButtons; i++) { oButton = this._buttons[i]; if (!oButton.get("disabled")) { oButton.focus(); break; } } }
								},
								check: function(p_nIndex) { var oButton = this.getButton(p_nIndex); if (oButton) { oButton.set("checked", true); } },
								destroy: function() {
												var nButtons = this._buttons.length,
																oElement = this.get("element"),
																oParentNode = oElement.parentNode,
																i;
												if (nButtons > 0) {
																i = this._buttons.length - 1;
																do { this._buttons[i].destroy(); }
																while (i--);
												}
												Event.purgeElement(oElement);
												oParentNode.removeChild(oElement);
								},
								toString: function() { return ("ButtonGroup " + this.get("id")); }
				});
})();
YAHOO.register("button", YAHOO.widget.Button, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
if (!YAHOO.util.DragDropMgr) {
				YAHOO.util.DragDropMgr = function() {
								var Event = YAHOO.util.Event;
								return {
												ids: {},
												handleIds: {},
												dragCurrent: null,
												dragOvers: {},
												deltaX: 0,
												deltaY: 0,
												preventDefault: true,
												stopPropagation: true,
												initialized: false,
												locked: false,
												interactionInfo: null,
												init: function() { this.initialized = true; },
												POINT: 0,
												INTERSECT: 1,
												STRICT_INTERSECT: 2,
												mode: 0,
												_execOnAll: function(sMethod, args) {
																for (var i in this.ids) {
																				for (var j in this.ids[i]) {
																								var oDD = this.ids[i][j];
																								if (!this.isTypeOfDD(oDD)) { continue; }
																								oDD[sMethod].apply(oDD, args);
																				}
																}
												},
												_onLoad: function() {
																this.init();
																Event.on(document, "mouseup", this.handleMouseUp, this, true);
																Event.on(document, "mousemove", this.handleMouseMove, this, true);
																Event.on(window, "unload", this._onUnload, this, true);
																Event.on(window, "resize", this._onResize, this, true);
												},
												_onResize: function(e) { this._execOnAll("resetConstraints", []); },
												lock: function() { this.locked = true; },
												unlock: function() { this.locked = false; },
												isLocked: function() { return this.locked; },
												locationCache: {},
												useCache: true,
												clickPixelThresh: 3,
												clickTimeThresh: 1000,
												dragThreshMet: false,
												clickTimeout: null,
												startX: 0,
												startY: 0,
												regDragDrop: function(oDD, sGroup) {
																if (!this.initialized) { this.init(); }
																if (!this.ids[sGroup]) { this.ids[sGroup] = {}; }
																this.ids[sGroup][oDD.id] = oDD;
												},
												removeDDFromGroup: function(oDD, sGroup) {
																if (!this.ids[sGroup]) { this.ids[sGroup] = {}; }
																var obj = this.ids[sGroup];
																if (obj && obj[oDD.id]) { delete obj[oDD.id]; }
												},
												_remove: function(oDD) {
																for (var g in oDD.groups) { if (g && this.ids[g][oDD.id]) { delete this.ids[g][oDD.id]; } }
																delete this.handleIds[oDD.id];
												},
												regHandle: function(sDDId, sHandleId) {
																if (!this.handleIds[sDDId]) { this.handleIds[sDDId] = {}; }
																this.handleIds[sDDId][sHandleId] = sHandleId;
												},
												isDragDrop: function(id) { return (this.getDDById(id)) ? true : false; },
												getRelated: function(p_oDD, bTargetsOnly) {
																var oDDs = [];
																for (var i in p_oDD.groups) {
																				for (var j in this.ids[i]) {
																								var dd = this.ids[i][j];
																								if (!this.isTypeOfDD(dd)) { continue; }
																								if (!bTargetsOnly || dd.isTarget) { oDDs[oDDs.length] = dd; }
																				}
																}
																return oDDs;
												},
												isLegalTarget: function(oDD, oTargetDD) {
																var targets = this.getRelated(oDD, true);
																for (var i = 0, len = targets.length; i < len; ++i) { if (targets[i].id == oTargetDD.id) { return true; } }
																return false;
												},
												isTypeOfDD: function(oDD) { return (oDD && oDD.__ygDragDrop); },
												isHandle: function(sDDId, sHandleId) { return (this.handleIds[sDDId] && this.handleIds[sDDId][sHandleId]); },
												getDDById: function(id) {
																for (var i in this.ids) { if (this.ids[i][id]) { return this.ids[i][id]; } }
																return null;
												},
												handleMouseDown: function(e, oDD) {
																this.currentTarget = YAHOO.util.Event.getTarget(e);
																this.dragCurrent = oDD;
																var el = oDD.getEl();
																this.startX = YAHOO.util.Event.getPageX(e);
																this.startY = YAHOO.util.Event.getPageY(e);
																this.deltaX = this.startX - el.offsetLeft;
																this.deltaY = this.startY - el.offsetTop;
																this.dragThreshMet = false;
																this.clickTimeout = setTimeout(function() {
																				var DDM = YAHOO.util.DDM;
																				DDM.startDrag(DDM.startX, DDM.startY);
																}, this.clickTimeThresh);
												},
												startDrag: function(x, y) {
																clearTimeout(this.clickTimeout);
																var dc = this.dragCurrent;
																if (dc) { dc.b4StartDrag(x, y); }
																if (dc) { dc.startDrag(x, y); }
																this.dragThreshMet = true;
												},
												handleMouseUp: function(e) {
																if (this.dragCurrent) {
																				clearTimeout(this.clickTimeout);
																				if (this.dragThreshMet) { this.fireEvents(e, true); } else {}
																				this.stopDrag(e);
																				this.stopEvent(e);
																}
												},
												stopEvent: function(e) {
																if (this.stopPropagation) { YAHOO.util.Event.stopPropagation(e); }
																if (this.preventDefault) { YAHOO.util.Event.preventDefault(e); }
												},
												stopDrag: function(e, silent) {
																if (this.dragCurrent && !silent) {
																				if (this.dragThreshMet) {
																								this.dragCurrent.b4EndDrag(e);
																								this.dragCurrent.endDrag(e);
																				}
																				this.dragCurrent.onMouseUp(e);
																}
																this.dragCurrent = null;
																this.dragOvers = {};
												},
												handleMouseMove: function(e) {
																var dc = this.dragCurrent;
																if (dc) {
																				if (YAHOO.util.Event.isIE && !e.button) { this.stopEvent(e); return this.handleMouseUp(e); }
																				if (!this.dragThreshMet) { var diffX = Math.abs(this.startX - YAHOO.util.Event.getPageX(e)); var diffY = Math.abs(this.startY - YAHOO.util.Event.getPageY(e)); if (diffX > this.clickPixelThresh || diffY > this.clickPixelThresh) { this.startDrag(this.startX, this.startY); } }
																				if (this.dragThreshMet) {
																								dc.b4Drag(e);
																								if (dc) { dc.onDrag(e); }
																								if (dc) { this.fireEvents(e, false); }
																				}
																				this.stopEvent(e);
																}
												},
												fireEvents: function(e, isDrop) {
																var dc = this.dragCurrent;
																if (!dc || dc.isLocked()) { return; }
																var x = YAHOO.util.Event.getPageX(e),
																				y = YAHOO.util.Event.getPageY(e),
																				pt = new YAHOO.util.Point(x, y),
																				pos = dc.getTargetCoord(pt.x, pt.y),
																				el = dc.getDragEl(),
																				curRegion = new YAHOO.util.Region(pos.y, pos.x + el.offsetWidth, pos.y + el.offsetHeight, pos.x),
																				oldOvers = [],
																				outEvts = [],
																				overEvts = [],
																				dropEvts = [],
																				enterEvts = [];
																for (var i in this.dragOvers) {
																				var ddo = this.dragOvers[i];
																				if (!this.isTypeOfDD(ddo)) { continue; }
																				if (!this.isOverTarget(pt, ddo, this.mode, curRegion)) { outEvts.push(ddo); }
																				oldOvers[i] = true;
																				delete this.dragOvers[i];
																}
																for (var sGroup in dc.groups) {
																				if ("string" != typeof sGroup) { continue; }
																				for (i in this.ids[sGroup]) {
																								var oDD = this.ids[sGroup][i];
																								if (!this.isTypeOfDD(oDD)) { continue; }
																								if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
																												if (this.isOverTarget(pt, oDD, this.mode, curRegion)) {
																																if (isDrop) { dropEvts.push(oDD); } else {
																																				if (!oldOvers[oDD.id]) { enterEvts.push(oDD); } else { overEvts.push(oDD); }
																																				this.dragOvers[oDD.id] = oDD;
																																}
																												}
																								}
																				}
																}
																this.interactionInfo = { out: outEvts, enter: enterEvts, over: overEvts, drop: dropEvts, point: pt, draggedRegion: curRegion, sourceRegion: this.locationCache[dc.id], validDrop: isDrop };
																if (isDrop && !dropEvts.length) {
																				this.interactionInfo.validDrop = false;
																				dc.onInvalidDrop(e);
																}
																if (this.mode) {
																				if (outEvts.length) { dc.b4DragOut(e, outEvts); if (dc) { dc.onDragOut(e, outEvts); } }
																				if (enterEvts.length) { if (dc) { dc.onDragEnter(e, enterEvts); } }
																				if (overEvts.length) {
																								if (dc) { dc.b4DragOver(e, overEvts); }
																								if (dc) { dc.onDragOver(e, overEvts); }
																				}
																				if (dropEvts.length) {
																								if (dc) { dc.b4DragDrop(e, dropEvts); }
																								if (dc) { dc.onDragDrop(e, dropEvts); }
																				}
																} else {
																				var len = 0;
																				for (i = 0, len = outEvts.length; i < len; ++i) {
																								if (dc) { dc.b4DragOut(e, outEvts[i].id); }
																								if (dc) { dc.onDragOut(e, outEvts[i].id); }
																				}
																				for (i = 0, len = enterEvts.length; i < len; ++i) { if (dc) { dc.onDragEnter(e, enterEvts[i].id); } }
																				for (i = 0, len = overEvts.length; i < len; ++i) {
																								if (dc) { dc.b4DragOver(e, overEvts[i].id); }
																								if (dc) { dc.onDragOver(e, overEvts[i].id); }
																				}
																				for (i = 0, len = dropEvts.length; i < len; ++i) {
																								if (dc) { dc.b4DragDrop(e, dropEvts[i].id); }
																								if (dc) { dc.onDragDrop(e, dropEvts[i].id); }
																				}
																}
												},
												getBestMatch: function(dds) {
																var winner = null;
																var len = dds.length;
																if (len == 1) { winner = dds[0]; } else { for (var i = 0; i < len; ++i) { var dd = dds[i]; if (this.mode == this.INTERSECT && dd.cursorIsOver) { winner = dd; break; } else { if (!winner || !winner.overlap || (dd.overlap && winner.overlap.getArea() < dd.overlap.getArea())) { winner = dd; } } } }
																return winner;
												},
												refreshCache: function(groups) {
																var g = groups || this.ids;
																for (var sGroup in g) {
																				if ("string" != typeof sGroup) { continue; }
																				for (var i in this.ids[sGroup]) { var oDD = this.ids[sGroup][i]; if (this.isTypeOfDD(oDD)) { var loc = this.getLocation(oDD); if (loc) { this.locationCache[oDD.id] = loc; } else { delete this.locationCache[oDD.id]; } } }
																}
												},
												verifyEl: function(el) {
																try { if (el) { var parent = el.offsetParent; if (parent) { return true; } } } catch (e) {}
																return false;
												},
												getLocation: function(oDD) {
																if (!this.isTypeOfDD(oDD)) { return null; }
																var el = oDD.getEl(),
																				pos, x1, x2, y1, y2, t, r, b, l;
																try { pos = YAHOO.util.Dom.getXY(el); } catch (e) {}
																if (!pos) { return null; }
																x1 = pos[0];
																x2 = x1 + el.offsetWidth;
																y1 = pos[1];
																y2 = y1 + el.offsetHeight;
																t = y1 - oDD.padding[0];
																r = x2 + oDD.padding[1];
																b = y2 + oDD.padding[2];
																l = x1 - oDD.padding[3];
																return new YAHOO.util.Region(t, r, b, l);
												},
												isOverTarget: function(pt, oTarget, intersect, curRegion) {
																var loc = this.locationCache[oTarget.id];
																if (!loc || !this.useCache) {
																				loc = this.getLocation(oTarget);
																				this.locationCache[oTarget.id] = loc;
																}
																if (!loc) { return false; }
																oTarget.cursorIsOver = loc.contains(pt);
																var dc = this.dragCurrent;
																if (!dc || (!intersect && !dc.constrainX && !dc.constrainY)) { return oTarget.cursorIsOver; }
																oTarget.overlap = null;
																if (!curRegion) {
																				var pos = dc.getTargetCoord(pt.x, pt.y);
																				var el = dc.getDragEl();
																				curRegion = new YAHOO.util.Region(pos.y, pos.x + el.offsetWidth, pos.y + el.offsetHeight, pos.x);
																}
																var overlap = curRegion.intersect(loc);
																if (overlap) { oTarget.overlap = overlap; return (intersect) ? true : oTarget.cursorIsOver; } else { return false; }
												},
												_onUnload: function(e, me) { this.unregAll(); },
												unregAll: function() {
																if (this.dragCurrent) {
																				this.stopDrag();
																				this.dragCurrent = null;
																}
																this._execOnAll("unreg", []);
																this.ids = {};
												},
												elementCache: {},
												getElWrapper: function(id) {
																var oWrapper = this.elementCache[id];
																if (!oWrapper || !oWrapper.el) { oWrapper = this.elementCache[id] = new this.ElementWrapper(YAHOO.util.Dom.get(id)); }
																return oWrapper;
												},
												getElement: function(id) { return YAHOO.util.Dom.get(id); },
												getCss: function(id) { var el = YAHOO.util.Dom.get(id); return (el) ? el.style : null; },
												ElementWrapper: function(el) {
																this.el = el || null;
																this.id = this.el && el.id;
																this.css = this.el && el.style;
												},
												getPosX: function(el) { return YAHOO.util.Dom.getX(el); },
												getPosY: function(el) { return YAHOO.util.Dom.getY(el); },
												swapNode: function(n1, n2) {
																if (n1.swapNode) { n1.swapNode(n2); } else {
																				var p = n2.parentNode;
																				var s = n2.nextSibling;
																				if (s == n1) { p.insertBefore(n1, n2); } else if (n2 == n1.nextSibling) { p.insertBefore(n2, n1); } else {
																								n1.parentNode.replaceChild(n2, n1);
																								p.insertBefore(n1, s);
																				}
																}
												},
												getScroll: function() {
																var t, l, dde = document.documentElement,
																				db = document.body;
																if (dde && (dde.scrollTop || dde.scrollLeft)) {
																				t = dde.scrollTop;
																				l = dde.scrollLeft;
																} else if (db) {
																				t = db.scrollTop;
																				l = db.scrollLeft;
																} else {}
																return { top: t, left: l };
												},
												getStyle: function(el, styleProp) { return YAHOO.util.Dom.getStyle(el, styleProp); },
												getScrollTop: function() { return this.getScroll().top; },
												getScrollLeft: function() { return this.getScroll().left; },
												moveToEl: function(moveEl, targetEl) {
																var aCoord = YAHOO.util.Dom.getXY(targetEl);
																YAHOO.util.Dom.setXY(moveEl, aCoord);
												},
												getClientHeight: function() { return YAHOO.util.Dom.getViewportHeight(); },
												getClientWidth: function() { return YAHOO.util.Dom.getViewportWidth(); },
												numericSort: function(a, b) { return (a - b); },
												_timeoutCount: 0,
												_addListeners: function() { var DDM = YAHOO.util.DDM; if (YAHOO.util.Event && document) { DDM._onLoad(); } else { if (DDM._timeoutCount > 2000) {} else { setTimeout(DDM._addListeners, 10); if (document && document.body) { DDM._timeoutCount += 1; } } } },
												handleWasClicked: function(node, id) {
																if (this.isHandle(id, node.id)) { return true; } else { var p = node.parentNode; while (p) { if (this.isHandle(id, p.id)) { return true; } else { p = p.parentNode; } } }
																return false;
												}
								};
				}();
				YAHOO.util.DDM = YAHOO.util.DragDropMgr;
				YAHOO.util.DDM._addListeners();
}
(function() {
				var Event = YAHOO.util.Event;
				var Dom = YAHOO.util.Dom;
				YAHOO.util.DragDrop = function(id, sGroup, config) { if (id) { this.init(id, sGroup, config); } };
				YAHOO.util.DragDrop.prototype = {
								id: null,
								config: null,
								dragElId: null,
								handleElId: null,
								invalidHandleTypes: null,
								invalidHandleIds: null,
								invalidHandleClasses: null,
								startPageX: 0,
								startPageY: 0,
								groups: null,
								locked: false,
								lock: function() { this.locked = true; },
								unlock: function() { this.locked = false; },
								isTarget: true,
								padding: null,
								_domRef: null,
								__ygDragDrop: true,
								constrainX: false,
								constrainY: false,
								minX: 0,
								maxX: 0,
								minY: 0,
								maxY: 0,
								deltaX: 0,
								deltaY: 0,
								maintainOffset: false,
								xTicks: null,
								yTicks: null,
								primaryButtonOnly: true,
								available: false,
								hasOuterHandles: false,
								cursorIsOver: false,
								overlap: null,
								b4StartDrag: function(x, y) {},
								startDrag: function(x, y) {},
								b4Drag: function(e) {},
								onDrag: function(e) {},
								onDragEnter: function(e, id) {},
								b4DragOver: function(e) {},
								onDragOver: function(e, id) {},
								b4DragOut: function(e) {},
								onDragOut: function(e, id) {},
								b4DragDrop: function(e) {},
								onDragDrop: function(e, id) {},
								onInvalidDrop: function(e) {},
								b4EndDrag: function(e) {},
								endDrag: function(e) {},
								b4MouseDown: function(e) {},
								onMouseDown: function(e) {},
								onMouseUp: function(e) {},
								onAvailable: function() {},
								getEl: function() {
												if (!this._domRef) { this._domRef = Dom.get(this.id); }
												return this._domRef;
								},
								getDragEl: function() { return Dom.get(this.dragElId); },
								init: function(id, sGroup, config) {
												this.initTarget(id, sGroup, config);
												Event.on(this._domRef || this.id, "mousedown", this.handleMouseDown, this, true);
								},
								initTarget: function(id, sGroup, config) {
												this.config = config || {};
												this.DDM = YAHOO.util.DDM;
												this.groups = {};
												if (typeof id !== "string") {
																this._domRef = id;
																id = Dom.generateId(id);
												}
												this.id = id;
												this.addToGroup((sGroup) ? sGroup : "default");
												this.handleElId = id;
												Event.onAvailable(id, this.handleOnAvailable, this, true);
												this.setDragElId(id);
												this.invalidHandleTypes = { A: "A" };
												this.invalidHandleIds = {};
												this.invalidHandleClasses = [];
												this.applyConfig();
								},
								applyConfig: function() {
												this.padding = this.config.padding || [0, 0, 0, 0];
												this.isTarget = (this.config.isTarget !== false);
												this.maintainOffset = (this.config.maintainOffset);
												this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);
								},
								handleOnAvailable: function() {
												this.available = true;
												this.resetConstraints();
												this.onAvailable();
								},
								setPadding: function(iTop, iRight, iBot, iLeft) { if (!iRight && 0 !== iRight) { this.padding = [iTop, iTop, iTop, iTop]; } else if (!iBot && 0 !== iBot) { this.padding = [iTop, iRight, iTop, iRight]; } else { this.padding = [iTop, iRight, iBot, iLeft]; } },
								setInitPosition: function(diffX, diffY) {
												var el = this.getEl();
												if (!this.DDM.verifyEl(el)) { return; }
												var dx = diffX || 0;
												var dy = diffY || 0;
												var p = Dom.getXY(el);
												this.initPageX = p[0] - dx;
												this.initPageY = p[1] - dy;
												this.lastPageX = p[0];
												this.lastPageY = p[1];
												this.setStartPosition(p);
								},
								setStartPosition: function(pos) {
												var p = pos || Dom.getXY(this.getEl());
												this.deltaSetXY = null;
												this.startPageX = p[0];
												this.startPageY = p[1];
								},
								addToGroup: function(sGroup) {
												this.groups[sGroup] = true;
												this.DDM.regDragDrop(this, sGroup);
								},
								removeFromGroup: function(sGroup) {
												if (this.groups[sGroup]) { delete this.groups[sGroup]; }
												this.DDM.removeDDFromGroup(this, sGroup);
								},
								setDragElId: function(id) { this.dragElId = id; },
								setHandleElId: function(id) {
												if (typeof id !== "string") { id = Dom.generateId(id); }
												this.handleElId = id;
												this.DDM.regHandle(this.id, id);
								},
								setOuterHandleElId: function(id) {
												if (typeof id !== "string") { id = Dom.generateId(id); }
												Event.on(id, "mousedown", this.handleMouseDown, this, true);
												this.setHandleElId(id);
												this.hasOuterHandles = true;
								},
								unreg: function() {
												Event.removeListener(this.id, "mousedown", this.handleMouseDown);
												this._domRef = null;
												this.DDM._remove(this);
								},
								isLocked: function() { return (this.DDM.isLocked() || this.locked); },
								handleMouseDown: function(e, oDD) {
												var button = e.which || e.button;
												if (this.primaryButtonOnly && button > 1) { return; }
												if (this.isLocked()) { return; }
												this.b4MouseDown(e);
												this.onMouseDown(e);
												this.DDM.refreshCache(this.groups);
												var pt = new YAHOO.util.Point(Event.getPageX(e), Event.getPageY(e));
												if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this)) {} else {
																if (this.clickValidator(e)) {
																				this.setStartPosition();
																				this.DDM.handleMouseDown(e, this);
																				this.DDM.stopEvent(e);
																} else {}
												}
								},
								clickValidator: function(e) { var target = Event.getTarget(e); return (this.isValidHandleChild(target) && (this.id == this.handleElId || this.DDM.handleWasClicked(target, this.id))); },
								getTargetCoord: function(iPageX, iPageY) {
												var x = iPageX - this.deltaX;
												var y = iPageY - this.deltaY;
												if (this.constrainX) {
																if (x < this.minX) { x = this.minX; }
																if (x > this.maxX) { x = this.maxX; }
												}
												if (this.constrainY) {
																if (y < this.minY) { y = this.minY; }
																if (y > this.maxY) { y = this.maxY; }
												}
												x = this.getTick(x, this.xTicks);
												y = this.getTick(y, this.yTicks);
												return { x: x, y: y };
								},
								addInvalidHandleType: function(tagName) {
												var type = tagName.toUpperCase();
												this.invalidHandleTypes[type] = type;
								},
								addInvalidHandleId: function(id) {
												if (typeof id !== "string") { id = Dom.generateId(id); }
												this.invalidHandleIds[id] = id;
								},
								addInvalidHandleClass: function(cssClass) { this.invalidHandleClasses.push(cssClass); },
								removeInvalidHandleType: function(tagName) {
												var type = tagName.toUpperCase();
												delete this.invalidHandleTypes[type];
								},
								removeInvalidHandleId: function(id) {
												if (typeof id !== "string") { id = Dom.generateId(id); }
												delete this.invalidHandleIds[id];
								},
								removeInvalidHandleClass: function(cssClass) { for (var i = 0, len = this.invalidHandleClasses.length; i < len; ++i) { if (this.invalidHandleClasses[i] == cssClass) { delete this.invalidHandleClasses[i]; } } },
								isValidHandleChild: function(node) {
												var valid = true;
												var nodeName;
												try { nodeName = node.nodeName.toUpperCase(); } catch (e) { nodeName = node.nodeName; }
												valid = valid && !this.invalidHandleTypes[nodeName];
												valid = valid && !this.invalidHandleIds[node.id];
												for (var i = 0, len = this.invalidHandleClasses.length; valid && i < len; ++i) { valid = !Dom.hasClass(node, this.invalidHandleClasses[i]); }
												return valid;
								},
								setXTicks: function(iStartX, iTickSize) {
												this.xTicks = [];
												this.xTickSize = iTickSize;
												var tickMap = {};
												for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
																if (!tickMap[i]) {
																				this.xTicks[this.xTicks.length] = i;
																				tickMap[i] = true;
																}
												}
												for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
																if (!tickMap[i]) {
																				this.xTicks[this.xTicks.length] = i;
																				tickMap[i] = true;
																}
												}
												this.xTicks.sort(this.DDM.numericSort);
								},
								setYTicks: function(iStartY, iTickSize) {
												this.yTicks = [];
												this.yTickSize = iTickSize;
												var tickMap = {};
												for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
																if (!tickMap[i]) {
																				this.yTicks[this.yTicks.length] = i;
																				tickMap[i] = true;
																}
												}
												for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
																if (!tickMap[i]) {
																				this.yTicks[this.yTicks.length] = i;
																				tickMap[i] = true;
																}
												}
												this.yTicks.sort(this.DDM.numericSort);
								},
								setXConstraint: function(iLeft, iRight, iTickSize) {
												this.leftConstraint = parseInt(iLeft, 10);
												this.rightConstraint = parseInt(iRight, 10);
												this.minX = this.initPageX - this.leftConstraint;
												this.maxX = this.initPageX + this.rightConstraint;
												if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }
												this.constrainX = true;
								},
								clearConstraints: function() {
												this.constrainX = false;
												this.constrainY = false;
												this.clearTicks();
								},
								clearTicks: function() {
												this.xTicks = null;
												this.yTicks = null;
												this.xTickSize = 0;
												this.yTickSize = 0;
								},
								setYConstraint: function(iUp, iDown, iTickSize) {
												this.topConstraint = parseInt(iUp, 10);
												this.bottomConstraint = parseInt(iDown, 10);
												this.minY = this.initPageY - this.topConstraint;
												this.maxY = this.initPageY + this.bottomConstraint;
												if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }
												this.constrainY = true;
								},
								resetConstraints: function() {
												if (this.initPageX || this.initPageX === 0) {
																var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
																var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;
																this.setInitPosition(dx, dy);
												} else { this.setInitPosition(); }
												if (this.constrainX) { this.setXConstraint(this.leftConstraint, this.rightConstraint, this.xTickSize); }
												if (this.constrainY) { this.setYConstraint(this.topConstraint, this.bottomConstraint, this.yTickSize); }
								},
								getTick: function(val, tickArray) {
												if (!tickArray) { return val; } else if (tickArray[0] >= val) { return tickArray[0]; } else {
																for (var i = 0, len = tickArray.length; i < len; ++i) { var next = i + 1; if (tickArray[next] && tickArray[next] >= val) { var diff1 = val - tickArray[i]; var diff2 = tickArray[next] - val; return (diff2 > diff1) ? tickArray[i] : tickArray[next]; } }
																return tickArray[tickArray.length - 1];
												}
								},
								toString: function() { return ("DragDrop " + this.id); }
				};
})();
YAHOO.util.DD = function(id, sGroup, config) { if (id) { this.init(id, sGroup, config); } };
YAHOO.extend(YAHOO.util.DD, YAHOO.util.DragDrop, {
				scroll: true,
				autoOffset: function(iPageX, iPageY) {
								var x = iPageX - this.startPageX;
								var y = iPageY - this.startPageY;
								this.setDelta(x, y);
				},
				setDelta: function(iDeltaX, iDeltaY) {
								this.deltaX = iDeltaX;
								this.deltaY = iDeltaY;
				},
				setDragElPos: function(iPageX, iPageY) {
								var el = this.getDragEl();
								this.alignElWithMouse(el, iPageX, iPageY);
				},
				alignElWithMouse: function(el, iPageX, iPageY) {
								var oCoord = this.getTargetCoord(iPageX, iPageY);
								if (!this.deltaSetXY) {
												var aCoord = [oCoord.x, oCoord.y];
												YAHOO.util.Dom.setXY(el, aCoord);
												var newLeft = parseInt(YAHOO.util.Dom.getStyle(el, "left"), 10);
												var newTop = parseInt(YAHOO.util.Dom.getStyle(el, "top"), 10);
												this.deltaSetXY = [newLeft - oCoord.x, newTop - oCoord.y];
								} else {
												YAHOO.util.Dom.setStyle(el, "left", (oCoord.x + this.deltaSetXY[0]) + "px");
												YAHOO.util.Dom.setStyle(el, "top", (oCoord.y + this.deltaSetXY[1]) + "px");
								}
								this.cachePosition(oCoord.x, oCoord.y);
								this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
				},
				cachePosition: function(iPageX, iPageY) {
								if (iPageX) {
												this.lastPageX = iPageX;
												this.lastPageY = iPageY;
								} else {
												var aCoord = YAHOO.util.Dom.getXY(this.getEl());
												this.lastPageX = aCoord[0];
												this.lastPageY = aCoord[1];
								}
				},
				autoScroll: function(x, y, h, w) {
								if (this.scroll) {
												var clientH = this.DDM.getClientHeight();
												var clientW = this.DDM.getClientWidth();
												var st = this.DDM.getScrollTop();
												var sl = this.DDM.getScrollLeft();
												var bot = h + y;
												var right = w + x;
												var toBot = (clientH + st - y - this.deltaY);
												var toRight = (clientW + sl - x - this.deltaX);
												var thresh = 40;
												var scrAmt = (document.all) ? 80 : 30;
												if (bot > clientH && toBot < thresh) { window.scrollTo(sl, st + scrAmt); }
												if (y < st && st > 0 && y - st < thresh) { window.scrollTo(sl, st - scrAmt); }
												if (right > clientW && toRight < thresh) { window.scrollTo(sl + scrAmt, st); }
												if (x < sl && sl > 0 && x - sl < thresh) { window.scrollTo(sl - scrAmt, st); }
								}
				},
				applyConfig: function() {
								YAHOO.util.DD.superclass.applyConfig.call(this);
								this.scroll = (this.config.scroll !== false);
				},
				b4MouseDown: function(e) {
								this.setStartPosition();
								this.autoOffset(YAHOO.util.Event.getPageX(e), YAHOO.util.Event.getPageY(e));
				},
				b4Drag: function(e) { this.setDragElPos(YAHOO.util.Event.getPageX(e), YAHOO.util.Event.getPageY(e)); },
				toString: function() { return ("DD " + this.id); }
});
YAHOO.util.DDProxy = function(id, sGroup, config) {
				if (id) {
								this.init(id, sGroup, config);
								this.initFrame();
				}
};
YAHOO.util.DDProxy.dragElId = "ygddfdiv";
YAHOO.extend(YAHOO.util.DDProxy, YAHOO.util.DD, {
				resizeFrame: true,
				centerFrame: false,
				createFrame: function() {
								var self = this,
												body = document.body;
								if (!body || !body.firstChild) { setTimeout(function() { self.createFrame(); }, 50); return; }
								var div = this.getDragEl(),
												Dom = YAHOO.util.Dom;
								if (!div) {
												div = document.createElement("div");
												div.id = this.dragElId;
												var s = div.style;
												s.position = "absolute";
												s.visibility = "hidden";
												s.cursor = "move";
												s.border = "2px solid #aaa";
												s.zIndex = 999;
												s.height = "25px";
												s.width = "25px";
												var _data = document.createElement('div');
												Dom.setStyle(_data, 'height', '100%');
												Dom.setStyle(_data, 'width', '100%');
												Dom.setStyle(_data, 'background-color', '#ccc');
												Dom.setStyle(_data, 'opacity', '0');
												div.appendChild(_data);
												body.insertBefore(div, body.firstChild);
								}
				},
				initFrame: function() { this.createFrame(); },
				applyConfig: function() {
								YAHOO.util.DDProxy.superclass.applyConfig.call(this);
								this.resizeFrame = (this.config.resizeFrame !== false);
								this.centerFrame = (this.config.centerFrame);
								this.setDragElId(this.config.dragElId || YAHOO.util.DDProxy.dragElId);
				},
				showFrame: function(iPageX, iPageY) {
								var el = this.getEl();
								var dragEl = this.getDragEl();
								var s = dragEl.style;
								this._resizeProxy();
								if (this.centerFrame) { this.setDelta(Math.round(parseInt(s.width, 10) / 2), Math.round(parseInt(s.height, 10) / 2)); }
								this.setDragElPos(iPageX, iPageY);
								YAHOO.util.Dom.setStyle(dragEl, "visibility", "visible");
				},
				_resizeProxy: function() {
								if (this.resizeFrame) {
												var DOM = YAHOO.util.Dom;
												var el = this.getEl();
												var dragEl = this.getDragEl();
												var bt = parseInt(DOM.getStyle(dragEl, "borderTopWidth"), 10);
												var br = parseInt(DOM.getStyle(dragEl, "borderRightWidth"), 10);
												var bb = parseInt(DOM.getStyle(dragEl, "borderBottomWidth"), 10);
												var bl = parseInt(DOM.getStyle(dragEl, "borderLeftWidth"), 10);
												if (isNaN(bt)) { bt = 0; }
												if (isNaN(br)) { br = 0; }
												if (isNaN(bb)) { bb = 0; }
												if (isNaN(bl)) { bl = 0; }
												var newWidth = Math.max(0, el.offsetWidth - br - bl);
												var newHeight = Math.max(0, el.offsetHeight - bt - bb);
												DOM.setStyle(dragEl, "width", newWidth + "px");
												DOM.setStyle(dragEl, "height", newHeight + "px");
								}
				},
				b4MouseDown: function(e) {
								this.setStartPosition();
								var x = YAHOO.util.Event.getPageX(e);
								var y = YAHOO.util.Event.getPageY(e);
								this.autoOffset(x, y);
				},
				b4StartDrag: function(x, y) { this.showFrame(x, y); },
				b4EndDrag: function(e) { YAHOO.util.Dom.setStyle(this.getDragEl(), "visibility", "hidden"); },
				endDrag: function(e) {
								var DOM = YAHOO.util.Dom;
								var lel = this.getEl();
								var del = this.getDragEl();
								DOM.setStyle(del, "visibility", "");
								DOM.setStyle(lel, "visibility", "hidden");
								YAHOO.util.DDM.moveToEl(lel, del);
								DOM.setStyle(del, "visibility", "hidden");
								DOM.setStyle(lel, "visibility", "");
				},
				toString: function() { return ("DDProxy " + this.id); }
});
YAHOO.util.DDTarget = function(id, sGroup, config) { if (id) { this.initTarget(id, sGroup, config); } };
YAHOO.extend(YAHOO.util.DDTarget, YAHOO.util.DragDrop, { toString: function() { return ("DDTarget " + this.id); } });
YAHOO.register("dragdrop", YAHOO.util.DragDropMgr, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
YAHOO.util.Anim = function(B, A, C, D) { if (!B) {} this.init(B, A, C, D); };
YAHOO.util.Anim.prototype = {
				toString: function() { var A = this.getEl(); var B = A.id || A.tagName || A; return ("Anim " + B); },
				patterns: { noNegatives: /width|height|opacity|padding/i, offsetAttribute: /^((width|height)|(top|left))$/, defaultUnit: /width|height|top$|bottom$|left$|right$/i, offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i },
				doMethod: function(A, C, B) { return this.method(this.currentFrame, C, B - C, this.totalFrames); },
				setAttribute: function(A, C, B) { if (this.patterns.noNegatives.test(A)) { C = (C > 0) ? C : 0; } YAHOO.util.Dom.setStyle(this.getEl(), A, C + B); },
				getAttribute: function(A) { var C = this.getEl(); var E = YAHOO.util.Dom.getStyle(C, A); if (E !== "auto" && !this.patterns.offsetUnit.test(E)) { return parseFloat(E); } var B = this.patterns.offsetAttribute.exec(A) || []; var F = !!(B[3]); var D = !!(B[2]); if (D || (YAHOO.util.Dom.getStyle(C, "position") == "absolute" && F)) { E = C["offset" + B[0].charAt(0).toUpperCase() + B[0].substr(1)]; } else { E = 0; } return E; },
				getDefaultUnit: function(A) { if (this.patterns.defaultUnit.test(A)) { return "px"; } return ""; },
				setRuntimeAttribute: function(B) {
								var G;
								var C;
								var D = this.attributes;
								this.runtimeAttributes[B] = {};
								var F = function(H) { return (typeof H !== "undefined"); };
								if (!F(D[B]["to"]) && !F(D[B]["by"])) { return false; } G = (F(D[B]["from"])) ? D[B]["from"] : this.getAttribute(B);
								if (F(D[B]["to"])) { C = D[B]["to"]; } else { if (F(D[B]["by"])) { if (G.constructor == Array) { C = []; for (var E = 0, A = G.length; E < A; ++E) { C[E] = G[E] + D[B]["by"][E] * 1; } } else { C = G + D[B]["by"] * 1; } } } this.runtimeAttributes[B].start = G;
								this.runtimeAttributes[B].end = C;
								this.runtimeAttributes[B].unit = (F(D[B].unit)) ? D[B]["unit"] : this.getDefaultUnit(B);
								return true;
				},
				init: function(C, H, G, A) {
								var B = false;
								var D = null;
								var F = 0;
								C = YAHOO.util.Dom.get(C);
								this.attributes = H || {};
								this.duration = !YAHOO.lang.isUndefined(G) ? G : 1;
								this.method = A || YAHOO.util.Easing.easeNone;
								this.useSeconds = true;
								this.currentFrame = 0;
								this.totalFrames = YAHOO.util.AnimMgr.fps;
								this.setEl = function(K) { C = YAHOO.util.Dom.get(K); };
								this.getEl = function() { return C; };
								this.isAnimated = function() { return B; };
								this.getStartTime = function() { return D; };
								this.runtimeAttributes = {};
								this.animate = function() {
												if (this.isAnimated()) { return false; } this.currentFrame = 0;
												this.totalFrames = (this.useSeconds) ? Math.ceil(YAHOO.util.AnimMgr.fps * this.duration) : this.duration;
												if (this.duration === 0 && this.useSeconds) { this.totalFrames = 1; } YAHOO.util.AnimMgr.registerElement(this);
												return true;
								};
								this.stop = function(K) {
												if (K) {
																this.currentFrame = this.totalFrames;
																this._onTween.fire();
												}
												YAHOO.util.AnimMgr.stop(this);
								};
								var J = function() {
												this.onStart.fire();
												this.runtimeAttributes = {};
												for (var K in this.attributes) { this.setRuntimeAttribute(K); } B = true;
												F = 0;
												D = new Date();
								};
								var I = function() {
												var M = { duration: new Date() - this.getStartTime(), currentFrame: this.currentFrame };
												M.toString = function() { return ("duration: " + M.duration + ", currentFrame: " + M.currentFrame); };
												this.onTween.fire(M);
												var L = this.runtimeAttributes;
												for (var K in L) { this.setAttribute(K, this.doMethod(K, L[K].start, L[K].end), L[K].unit); } F += 1;
								};
								var E = function() {
												var K = (new Date() - D) / 1000;
												var L = { duration: K, frames: F, fps: F / K };
												L.toString = function() { return ("duration: " + L.duration + ", frames: " + L.frames + ", fps: " + L.fps); };
												B = false;
												F = 0;
												this.onComplete.fire(L);
								};
								this._onStart = new YAHOO.util.CustomEvent("_start", this, true);
								this.onStart = new YAHOO.util.CustomEvent("start", this);
								this.onTween = new YAHOO.util.CustomEvent("tween", this);
								this._onTween = new YAHOO.util.CustomEvent("_tween", this, true);
								this.onComplete = new YAHOO.util.CustomEvent("complete", this);
								this._onComplete = new YAHOO.util.CustomEvent("_complete", this, true);
								this._onStart.subscribe(J);
								this._onTween.subscribe(I);
								this._onComplete.subscribe(E);
				}
};
YAHOO.util.AnimMgr = new function() {
				var C = null;
				var B = [];
				var A = 0;
				this.fps = 1000;
				this.delay = 1;
				this.registerElement = function(F) {
								B[B.length] = F;
								A += 1;
								F._onStart.fire();
								this.start();
				};
				this.unRegister = function(G, F) {
								G._onComplete.fire();
								F = F || E(G);
								if (F == -1) { return false; } B.splice(F, 1);
								A -= 1;
								if (A <= 0) { this.stop(); }
								return true;
				};
				this.start = function() { if (C === null) { C = setInterval(this.run, this.delay); } };
				this.stop = function(H) {
								if (!H) {
												clearInterval(C);
												for (var G = 0, F = B.length; G < F; ++G) { if (B[0].isAnimated()) { this.unRegister(B[0], 0); } } B = [];
												C = null;
												A = 0;
								} else { this.unRegister(H); }
				};
				this.run = function() { for (var H = 0, F = B.length; H < F; ++H) { var G = B[H]; if (!G || !G.isAnimated()) { continue; } if (G.currentFrame < G.totalFrames || G.totalFrames === null) { G.currentFrame += 1; if (G.useSeconds) { D(G); } G._onTween.fire(); } else { YAHOO.util.AnimMgr.stop(G, H); } } };
				var E = function(H) { for (var G = 0, F = B.length; G < F; ++G) { if (B[G] == H) { return G; } } return -1; };
				var D = function(G) { var J = G.totalFrames; var I = G.currentFrame; var H = (G.currentFrame * G.duration * 1000 / G.totalFrames); var F = (new Date() - G.getStartTime()); var K = 0; if (F < G.duration * 1000) { K = Math.round((F / H - 1) * G.currentFrame); } else { K = J - (I + 1); } if (K > 0 && isFinite(K)) { if (G.currentFrame + K >= J) { K = J - (I + 1); } G.currentFrame += K; } };
};
YAHOO.util.Bezier = new function() {
				this.getPosition = function(E, D) {
								var F = E.length;
								var C = [];
								for (var B = 0; B < F; ++B) { C[B] = [E[B][0], E[B][1]]; }
								for (var A = 1; A < F; ++A) {
												for (B = 0; B < F - A; ++B) {
																C[B][0] = (1 - D) * C[B][0] + D * C[parseInt(B + 1, 10)][0];
																C[B][1] = (1 - D) * C[B][1] + D * C[parseInt(B + 1, 10)][1];
												}
								}
								return [C[0][0], C[0][1]];
				};
};
(function() {
				YAHOO.util.ColorAnim = function(E, D, F, G) { YAHOO.util.ColorAnim.superclass.constructor.call(this, E, D, F, G); };
				YAHOO.extend(YAHOO.util.ColorAnim, YAHOO.util.Anim);
				var B = YAHOO.util;
				var C = B.ColorAnim.superclass;
				var A = B.ColorAnim.prototype;
				A.toString = function() { var D = this.getEl(); var E = D.id || D.tagName; return ("ColorAnim " + E); };
				A.patterns.color = /color$/i;
				A.patterns.rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
				A.patterns.hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
				A.patterns.hex3 = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
				A.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/;
				A.parseColor = function(D) { if (D.length == 3) { return D; } var E = this.patterns.hex.exec(D); if (E && E.length == 4) { return [parseInt(E[1], 16), parseInt(E[2], 16), parseInt(E[3], 16)]; } E = this.patterns.rgb.exec(D); if (E && E.length == 4) { return [parseInt(E[1], 10), parseInt(E[2], 10), parseInt(E[3], 10)]; } E = this.patterns.hex3.exec(D); if (E && E.length == 4) { return [parseInt(E[1] + E[1], 16), parseInt(E[2] + E[2], 16), parseInt(E[3] + E[3], 16)]; } return null; };
				A.getAttribute = function(D) {
								var F = this.getEl();
								if (this.patterns.color.test(D)) {
												var G = YAHOO.util.Dom.getStyle(F, D);
												if (this.patterns.transparent.test(G)) {
																var E = F.parentNode;
																G = B.Dom.getStyle(E, D);
																while (E && this.patterns.transparent.test(G)) {
																				E = E.parentNode;
																				G = B.Dom.getStyle(E, D);
																				if (E.tagName.toUpperCase() == "HTML") { G = "#fff"; }
																}
												}
								} else { G = C.getAttribute.call(this, D); }
								return G;
				};
				A.doMethod = function(E, I, F) { var H; if (this.patterns.color.test(E)) { H = []; for (var G = 0, D = I.length; G < D; ++G) { H[G] = C.doMethod.call(this, E, I[G], F[G]); } H = "rgb(" + Math.floor(H[0]) + "," + Math.floor(H[1]) + "," + Math.floor(H[2]) + ")"; } else { H = C.doMethod.call(this, E, I, F); } return H; };
				A.setRuntimeAttribute = function(E) {
								C.setRuntimeAttribute.call(this, E);
								if (this.patterns.color.test(E)) {
												var G = this.attributes;
												var I = this.parseColor(this.runtimeAttributes[E].start);
												var F = this.parseColor(this.runtimeAttributes[E].end);
												if (typeof G[E]["to"] === "undefined" && typeof G[E]["by"] !== "undefined") { F = this.parseColor(G[E].by); for (var H = 0, D = I.length; H < D; ++H) { F[H] = I[H] + F[H]; } } this.runtimeAttributes[E].start = I;
												this.runtimeAttributes[E].end = F;
								}
				};
})();
YAHOO.util.Easing = { easeNone: function(B, A, D, C) { return D * B / C + A; }, easeIn: function(B, A, D, C) { return D * (B /= C) * B + A; }, easeOut: function(B, A, D, C) { return -D * (B /= C) * (B - 2) + A; }, easeBoth: function(B, A, D, C) { if ((B /= C / 2) < 1) { return D / 2 * B * B + A; } return -D / 2 * ((--B) * (B - 2) - 1) + A; }, easeInStrong: function(B, A, D, C) { return D * (B /= C) * B * B * B + A; }, easeOutStrong: function(B, A, D, C) { return -D * ((B = B / C - 1) * B * B * B - 1) + A; }, easeBothStrong: function(B, A, D, C) { if ((B /= C / 2) < 1) { return D / 2 * B * B * B * B + A; } return -D / 2 * ((B -= 2) * B * B * B - 2) + A; }, elasticIn: function(C, A, G, F, B, E) { if (C == 0) { return A; } if ((C /= F) == 1) { return A + G; } if (!E) { E = F * 0.3; } if (!B || B < Math.abs(G)) { B = G; var D = E / 4; } else { var D = E / (2 * Math.PI) * Math.asin(G / B); } return -(B * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E)) + A; }, elasticOut: function(C, A, G, F, B, E) { if (C == 0) { return A; } if ((C /= F) == 1) { return A + G; } if (!E) { E = F * 0.3; } if (!B || B < Math.abs(G)) { B = G; var D = E / 4; } else { var D = E / (2 * Math.PI) * Math.asin(G / B); } return B * Math.pow(2, -10 * C) * Math.sin((C * F - D) * (2 * Math.PI) / E) + G + A; }, elasticBoth: function(C, A, G, F, B, E) { if (C == 0) { return A; } if ((C /= F / 2) == 2) { return A + G; } if (!E) { E = F * (0.3 * 1.5); } if (!B || B < Math.abs(G)) { B = G; var D = E / 4; } else { var D = E / (2 * Math.PI) * Math.asin(G / B); } if (C < 1) { return -0.5 * (B * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E)) + A; } return B * Math.pow(2, -10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E) * 0.5 + G + A; }, backIn: function(B, A, E, D, C) { if (typeof C == "undefined") { C = 1.70158; } return E * (B /= D) * B * ((C + 1) * B - C) + A; }, backOut: function(B, A, E, D, C) { if (typeof C == "undefined") { C = 1.70158; } return E * ((B = B / D - 1) * B * ((C + 1) * B + C) + 1) + A; }, backBoth: function(B, A, E, D, C) { if (typeof C == "undefined") { C = 1.70158; } if ((B /= D / 2) < 1) { return E / 2 * (B * B * (((C *= (1.525)) + 1) * B - C)) + A; } return E / 2 * ((B -= 2) * B * (((C *= (1.525)) + 1) * B + C) + 2) + A; }, bounceIn: function(B, A, D, C) { return D - YAHOO.util.Easing.bounceOut(C - B, 0, D, C) + A; }, bounceOut: function(B, A, D, C) { if ((B /= C) < (1 / 2.75)) { return D * (7.5625 * B * B) + A; } else { if (B < (2 / 2.75)) { return D * (7.5625 * (B -= (1.5 / 2.75)) * B + 0.75) + A; } else { if (B < (2.5 / 2.75)) { return D * (7.5625 * (B -= (2.25 / 2.75)) * B + 0.9375) + A; } } } return D * (7.5625 * (B -= (2.625 / 2.75)) * B + 0.984375) + A; }, bounceBoth: function(B, A, D, C) { if (B < C / 2) { return YAHOO.util.Easing.bounceIn(B * 2, 0, D, C) * 0.5 + A; } return YAHOO.util.Easing.bounceOut(B * 2 - C, 0, D, C) * 0.5 + D * 0.5 + A; } };
(function() {
				YAHOO.util.Motion = function(G, F, H, I) { if (G) { YAHOO.util.Motion.superclass.constructor.call(this, G, F, H, I); } };
				YAHOO.extend(YAHOO.util.Motion, YAHOO.util.ColorAnim);
				var D = YAHOO.util;
				var E = D.Motion.superclass;
				var B = D.Motion.prototype;
				B.toString = function() { var F = this.getEl(); var G = F.id || F.tagName; return ("Motion " + G); };
				B.patterns.points = /^points$/i;
				B.setAttribute = function(F, H, G) {
								if (this.patterns.points.test(F)) {
												G = G || "px";
												E.setAttribute.call(this, "left", H[0], G);
												E.setAttribute.call(this, "top", H[1], G);
								} else { E.setAttribute.call(this, F, H, G); }
				};
				B.getAttribute = function(F) { if (this.patterns.points.test(F)) { var G = [E.getAttribute.call(this, "left"), E.getAttribute.call(this, "top")]; } else { G = E.getAttribute.call(this, F); } return G; };
				B.doMethod = function(F, J, G) {
								var I = null;
								if (this.patterns.points.test(F)) {
												var H = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;
												I = D.Bezier.getPosition(this.runtimeAttributes[F], H);
								} else { I = E.doMethod.call(this, F, J, G); }
								return I;
				};
				B.setRuntimeAttribute = function(O) { if (this.patterns.points.test(O)) { var G = this.getEl(); var I = this.attributes; var F; var K = I["points"]["control"] || []; var H; var L, N; if (K.length > 0 && !(K[0] instanceof Array)) { K = [K]; } else { var J = []; for (L = 0, N = K.length; L < N; ++L) { J[L] = K[L]; } K = J; } if (D.Dom.getStyle(G, "position") == "static") { D.Dom.setStyle(G, "position", "relative"); } if (C(I["points"]["from"])) { D.Dom.setXY(G, I["points"]["from"]); } else { D.Dom.setXY(G, D.Dom.getXY(G)); } F = this.getAttribute("points"); if (C(I["points"]["to"])) { H = A.call(this, I["points"]["to"], F); var M = D.Dom.getXY(this.getEl()); for (L = 0, N = K.length; L < N; ++L) { K[L] = A.call(this, K[L], F); } } else { if (C(I["points"]["by"])) { H = [F[0] + I["points"]["by"][0], F[1] + I["points"]["by"][1]]; for (L = 0, N = K.length; L < N; ++L) { K[L] = [F[0] + K[L][0], F[1] + K[L][1]]; } } } this.runtimeAttributes[O] = [F]; if (K.length > 0) { this.runtimeAttributes[O] = this.runtimeAttributes[O].concat(K); } this.runtimeAttributes[O][this.runtimeAttributes[O].length] = H; } else { E.setRuntimeAttribute.call(this, O); } };
				var A = function(F, H) {
								var G = D.Dom.getXY(this.getEl());
								F = [F[0] - G[0] + H[0], F[1] - G[1] + H[1]];
								return F;
				};
				var C = function(F) { return (typeof F !== "undefined"); };
})();
(function() {
				YAHOO.util.Scroll = function(E, D, F, G) { if (E) { YAHOO.util.Scroll.superclass.constructor.call(this, E, D, F, G); } };
				YAHOO.extend(YAHOO.util.Scroll, YAHOO.util.ColorAnim);
				var B = YAHOO.util;
				var C = B.Scroll.superclass;
				var A = B.Scroll.prototype;
				A.toString = function() { var D = this.getEl(); var E = D.id || D.tagName; return ("Scroll " + E); };
				A.doMethod = function(D, G, E) { var F = null; if (D == "scroll") { F = [this.method(this.currentFrame, G[0], E[0] - G[0], this.totalFrames), this.method(this.currentFrame, G[1], E[1] - G[1], this.totalFrames)]; } else { F = C.doMethod.call(this, D, G, E); } return F; };
				A.getAttribute = function(D) { var F = null; var E = this.getEl(); if (D == "scroll") { F = [E.scrollLeft, E.scrollTop]; } else { F = C.getAttribute.call(this, D); } return F; };
				A.setAttribute = function(D, G, F) {
								var E = this.getEl();
								if (D == "scroll") {
												E.scrollLeft = G[0];
												E.scrollTop = G[1];
								} else { C.setAttribute.call(this, D, G, F); }
				};
})();
YAHOO.register("animation", YAHOO.util.Anim, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
YAHOO.util.Connect = {
				_msxml_progid: ["Microsoft.XMLHTTP", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP"],
				_http_headers: {},
				_has_http_headers: false,
				_use_default_post_header: true,
				_default_post_header: "application/x-www-form-urlencoded; charset=UTF-8",
				_default_form_header: "application/x-www-form-urlencoded",
				_use_default_xhr_header: true,
				_default_xhr_header: "XMLHttpRequest",
				_has_default_headers: true,
				_default_headers: {},
				_isFormSubmit: false,
				_isFileUpload: false,
				_formNode: null,
				_sFormData: null,
				_poll: {},
				_timeOut: {},
				_polling_interval: 50,
				_transaction_id: 0,
				_submitElementValue: null,
				_hasSubmitListener: (function() { if (YAHOO.util.Event) { YAHOO.util.Event.addListener(document, "click", function(q) { try { var S = YAHOO.util.Event.getTarget(q); if (S.type.toLowerCase() == "submit") { YAHOO.util.Connect._submitElementValue = encodeURIComponent(S.name) + "=" + encodeURIComponent(S.value); } } catch (q) {} }); return true; } return false; })(),
				startEvent: new YAHOO.util.CustomEvent("start"),
				completeEvent: new YAHOO.util.CustomEvent("complete"),
				successEvent: new YAHOO.util.CustomEvent("success"),
				failureEvent: new YAHOO.util.CustomEvent("failure"),
				uploadEvent: new YAHOO.util.CustomEvent("upload"),
				abortEvent: new YAHOO.util.CustomEvent("abort"),
				_customEvents: { onStart: ["startEvent", "start"], onComplete: ["completeEvent", "complete"], onSuccess: ["successEvent", "success"], onFailure: ["failureEvent", "failure"], onUpload: ["uploadEvent", "upload"], onAbort: ["abortEvent", "abort"] },
				setProgId: function(S) { this._msxml_progid.unshift(S); },
				setDefaultPostHeader: function(S) { if (typeof S == "string") { this._default_post_header = S; } else { if (typeof S == "boolean") { this._use_default_post_header = S; } } },
				setDefaultXhrHeader: function(S) { if (typeof S == "string") { this._default_xhr_header = S; } else { this._use_default_xhr_header = S; } },
				setPollingInterval: function(S) { if (typeof S == "number" && isFinite(S)) { this._polling_interval = S; } },
				createXhrObject: function(w) {
								var m, S;
								try {
												S = new XMLHttpRequest();
												m = { conn: S, tId: w };
								} catch (R) {
												for (var q = 0; q < this._msxml_progid.length; ++q) {
																try {
																				S = new ActiveXObject(this._msxml_progid[q]);
																				m = { conn: S, tId: w };
																				break;
																} catch (R) {}
												}
								} finally { return m; }
				},
				getConnectionObject: function(S) {
								var R;
								var m = this._transaction_id;
								try {
												if (!S) { R = this.createXhrObject(m); } else {
																R = {};
																R.tId = m;
																R.isUpload = true;
												}
												if (R) { this._transaction_id++; }
								} catch (q) {} finally { return R; }
				},
				asyncRequest: function(w, q, m, S) {
								var R = (this._isFileUpload) ? this.getConnectionObject(true) : this.getConnectionObject();
								if (!R) { return null; } else {
												if (m && m.customevents) { this.initCustomEvents(R, m); }
												if (this._isFormSubmit) { if (this._isFileUpload) { this.uploadFile(R, m, q, S); return R; } if (w.toUpperCase() == "GET") { if (this._sFormData.length !== 0) { q += ((q.indexOf("?") == -1) ? "?" : "&") + this._sFormData; } else { q += "?" + this._sFormData; } } else { if (w.toUpperCase() == "POST") { S = S ? this._sFormData + "&" + S : this._sFormData; } } } R.conn.open(w, q, true);
												if (this._use_default_xhr_header) { if (!this._default_headers["X-Requested-With"]) { this.initHeader("X-Requested-With", this._default_xhr_header, true); } }
												if (this._isFormSubmit == false && this._use_default_post_header) { this.initHeader("Content-Type", this._default_post_header); }
												if (this._has_default_headers || this._has_http_headers) { this.setHeader(R); } this.handleReadyState(R, m);
												R.conn.send(S || null);
												this.startEvent.fire(R);
												if (R.startEvent) { R.startEvent.fire(R); }
												return R;
								}
				},
				initCustomEvents: function(S, R) {
								for (var q in R.customevents) {
												if (this._customEvents[q][0]) {
																S[this._customEvents[q][0]] = new YAHOO.util.CustomEvent(this._customEvents[q][1], (R.scope) ? R.scope : null);
																S[this._customEvents[q][0]].subscribe(R.customevents[q]);
												}
								}
				},
				handleReadyState: function(q, R) {
								var S = this;
								if (R && R.timeout) { this._timeOut[q.tId] = window.setTimeout(function() { S.abort(q, R, true); }, R.timeout); } this._poll[q.tId] = window.setInterval(function() {
												if (q.conn && q.conn.readyState === 4) {
																window.clearInterval(S._poll[q.tId]);
																delete S._poll[q.tId];
																if (R && R.timeout) {
																				window.clearTimeout(S._timeOut[q.tId]);
																				delete S._timeOut[q.tId];
																}
																S.completeEvent.fire(q);
																if (q.completeEvent) { q.completeEvent.fire(q); } S.handleTransactionResponse(q, R);
												}
								}, this._polling_interval);
				},
				handleTransactionResponse: function(w, V, S) {
								var R, q;
								try { if (w.conn.status !== undefined && w.conn.status !== 0) { R = w.conn.status; } else { R = 13030; } } catch (m) { R = 13030; }
								if (R >= 200 && R < 300 || R === 1223) { q = this.createResponseObject(w, (V && V.argument) ? V.argument : undefined); if (V) { if (V.success) { if (!V.scope) { V.success(q); } else { V.success.apply(V.scope, [q]); } } } this.successEvent.fire(q); if (w.successEvent) { w.successEvent.fire(q); } } else {
												switch (R) {
																case 12002:
																case 12029:
																case 12030:
																case 12031:
																case 12152:
																case 13030:
																				q = this.createExceptionObject(w.tId, (V && V.argument) ? V.argument : undefined, (S ? S : false));
																				if (V) { if (V.failure) { if (!V.scope) { V.failure(q); } else { V.failure.apply(V.scope, [q]); } } }
																				break;
																default:
																				q = this.createResponseObject(w, (V && V.argument) ? V.argument : undefined);
																				if (V) { if (V.failure) { if (!V.scope) { V.failure(q); } else { V.failure.apply(V.scope, [q]); } } }
												}
												this.failureEvent.fire(q);
												if (w.failureEvent) { w.failureEvent.fire(q); }
								}
								this.releaseObject(w);
								q = null;
				},
				createResponseObject: function(S, d) {
								var m = {};
								var T = {};
								try { var R = S.conn.getAllResponseHeaders(); var V = R.split("\n"); for (var w = 0; w < V.length; w++) { var q = V[w].indexOf(":"); if (q != -1) { T[V[w].substring(0, q)] = V[w].substring(q + 2); } } } catch (N) {} m.tId = S.tId;
								m.status = (S.conn.status == 1223) ? 204 : S.conn.status;
								m.statusText = (S.conn.status == 1223) ? "No Content" : S.conn.statusText;
								m.getResponseHeader = T;
								m.getAllResponseHeaders = R;
								m.responseText = S.conn.responseText;
								m.responseXML = S.conn.responseXML;
								if (typeof d !== undefined) { m.argument = d; }
								return m;
				},
				createExceptionObject: function(N, m, S) {
								var V = 0;
								var d = "communication failure";
								var R = -1;
								var q = "transaction aborted";
								var w = {};
								w.tId = N;
								if (S) {
												w.status = R;
												w.statusText = q;
								} else {
												w.status = V;
												w.statusText = d;
								}
								if (m) { w.argument = m; }
								return w;
				},
				initHeader: function(S, m, R) {
								var q = (R) ? this._default_headers : this._http_headers;
								q[S] = m;
								if (R) { this._has_default_headers = true; } else { this._has_http_headers = true; }
				},
				setHeader: function(S) {
								if (this._has_default_headers) { for (var q in this._default_headers) { if (YAHOO.lang.hasOwnProperty(this._default_headers, q)) { S.conn.setRequestHeader(q, this._default_headers[q]); } } }
								if (this._has_http_headers) {
												for (var q in this._http_headers) { if (YAHOO.lang.hasOwnProperty(this._http_headers, q)) { S.conn.setRequestHeader(q, this._http_headers[q]); } } delete this._http_headers;
												this._http_headers = {};
												this._has_http_headers = false;
								}
				},
				resetDefaultHeaders: function() {
								delete this._default_headers;
								this._default_headers = {};
								this._has_default_headers = false;
				},
				setForm: function(M, w, q) {
								this.resetFormState();
								var f;
								if (typeof M == "string") { f = (document.getElementById(M) || document.forms[M]); } else { if (typeof M == "object") { f = M; } else { return; } }
								if (w) {
												var V = this.createFrame(q ? q : null);
												this._isFormSubmit = true;
												this._isFileUpload = true;
												this._formNode = f;
												return;
								}
								var S, T, d, p;
								var N = false;
								for (var m = 0; m < f.elements.length; m++) {
												S = f.elements[m];
												p = f.elements[m].disabled;
												T = f.elements[m].name;
												d = f.elements[m].value;
												if (!p && T) {
																switch (S.type) {
																				case "select-one":
																				case "select-multiple":
																								for (var R = 0; R < S.options.length; R++) { if (S.options[R].selected) { if (window.ActiveXObject) { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(S.options[R].attributes["value"].specified ? S.options[R].value : S.options[R].text) + "&"; } else { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(S.options[R].hasAttribute("value") ? S.options[R].value : S.options[R].text) + "&"; } } }
																								break;
																				case "radio":
																				case "checkbox":
																								if (S.checked) { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(d) + "&"; }
																								break;
																				case "file":
																				case undefined:
																				case "reset":
																				case "button":
																								break;
																				case "submit":
																								if (N === false) { if (this._hasSubmitListener && this._submitElementValue) { this._sFormData += this._submitElementValue + "&"; } else { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(d) + "&"; } N = true; }
																								break;
																				default:
																								this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(d) + "&";
																}
												}
								}
								this._isFormSubmit = true;
								this._sFormData = this._sFormData.substr(0, this._sFormData.length - 1);
								this.initHeader("Content-Type", this._default_form_header);
								return this._sFormData;
				},
				resetFormState: function() {
								this._isFormSubmit = false;
								this._isFileUpload = false;
								this._formNode = null;
								this._sFormData = "";
				},
				createFrame: function(S) {
								var q = "yuiIO" + this._transaction_id;
								var R;
								if (window.ActiveXObject) { R = document.createElement("<iframe id=\"" + q + "\" name=\"" + q + "\" />"); if (typeof S == "boolean") { R.src = "javascript:false"; } else { if (typeof secureURI == "string") { R.src = S; } } } else {
												R = document.createElement("iframe");
												R.id = q;
												R.name = q;
								}
								R.style.position = "absolute";
								R.style.top = "-1000px";
								R.style.left = "-1000px";
								document.body.appendChild(R);
				},
				appendPostData: function(S) {
								var m = [];
								var q = S.split("&");
								for (var R = 0; R < q.length; R++) {
												var w = q[R].indexOf("=");
												if (w != -1) {
																m[R] = document.createElement("input");
																m[R].type = "hidden";
																m[R].name = q[R].substring(0, w);
																m[R].value = q[R].substring(w + 1);
																this._formNode.appendChild(m[R]);
												}
								}
								return m;
				},
				uploadFile: function(m, p, w, R) {
								var N = "yuiIO" + m.tId;
								var T = "multipart/form-data";
								var f = document.getElementById(N);
								var U = this;
								var q = { action: this._formNode.getAttribute("action"), method: this._formNode.getAttribute("method"), target: this._formNode.getAttribute("target") };
								this._formNode.setAttribute("action", w);
								this._formNode.setAttribute("method", "POST");
								this._formNode.setAttribute("target", N);
								if (this._formNode.encoding) { this._formNode.setAttribute("encoding", T); } else { this._formNode.setAttribute("enctype", T); }
								if (R) { var M = this.appendPostData(R); } this._formNode.submit();
								this.startEvent.fire(m);
								if (m.startEvent) { m.startEvent.fire(m); }
								if (p && p.timeout) { this._timeOut[m.tId] = window.setTimeout(function() { U.abort(m, p, true); }, p.timeout); }
								if (M && M.length > 0) { for (var d = 0; d < M.length; d++) { this._formNode.removeChild(M[d]); } }
								for (var S in q) { if (YAHOO.lang.hasOwnProperty(q, S)) { if (q[S]) { this._formNode.setAttribute(S, q[S]); } else { this._formNode.removeAttribute(S); } } } this.resetFormState();
								var V = function() {
												if (p && p.timeout) {
																window.clearTimeout(U._timeOut[m.tId]);
																delete U._timeOut[m.tId];
												}
												U.completeEvent.fire(m);
												if (m.completeEvent) { m.completeEvent.fire(m); }
												var v = {};
												v.tId = m.tId;
												v.argument = p.argument;
												try {
																v.responseText = f.contentWindow.document.body ? f.contentWindow.document.body.innerHTML : f.contentWindow.document.documentElement.textContent;
																v.responseXML = f.contentWindow.document.XMLDocument ? f.contentWindow.document.XMLDocument : f.contentWindow.document;
												} catch (u) {}
												if (p && p.upload) { if (!p.scope) { p.upload(v); } else { p.upload.apply(p.scope, [v]); } } U.uploadEvent.fire(v);
												if (m.uploadEvent) { m.uploadEvent.fire(v); } YAHOO.util.Event.removeListener(f, "load", V);
												setTimeout(function() {
																document.body.removeChild(f);
																U.releaseObject(m);
												}, 100);
								};
								YAHOO.util.Event.addListener(f, "load", V);
				},
				abort: function(m, V, S) {
								var R;
								if (m.conn) {
												if (this.isCallInProgress(m)) {
																m.conn.abort();
																window.clearInterval(this._poll[m.tId]);
																delete this._poll[m.tId];
																if (S) {
																				window.clearTimeout(this._timeOut[m.tId]);
																				delete this._timeOut[m.tId];
																}
																R = true;
												}
								} else {
												if (m.isUpload === true) {
																var q = "yuiIO" + m.tId;
																var w = document.getElementById(q);
																if (w) {
																				YAHOO.util.Event.removeListener(w, "load", uploadCallback);
																				document.body.removeChild(w);
																				if (S) {
																								window.clearTimeout(this._timeOut[m.tId]);
																								delete this._timeOut[m.tId];
																				}
																				R = true;
																}
												} else { R = false; }
								}
								if (R === true) { this.abortEvent.fire(m); if (m.abortEvent) { m.abortEvent.fire(m); } this.handleTransactionResponse(m, V, true); }
								return R;
				},
				isCallInProgress: function(q) { if (q && q.conn) { return q.conn.readyState !== 4 && q.conn.readyState !== 0; } else { if (q && q.isUpload === true) { var S = "yuiIO" + q.tId; return document.getElementById(S) ? true : false; } else { return false; } } },
				releaseObject: function(S) { if (S.conn) { S.conn = null; } S = null; }
};
YAHOO.register("connection", YAHOO.util.Connect, { version: "2.3.1", build: "541" });
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
(function() {
				YAHOO.util.Config = function(owner) { if (owner) { this.init(owner); } };
				var Lang = YAHOO.lang,
								CustomEvent = YAHOO.util.CustomEvent,
								Config = YAHOO.util.Config;
				Config.CONFIG_CHANGED_EVENT = "configChanged";
				Config.BOOLEAN_TYPE = "boolean";
				Config.prototype = {
								owner: null,
								queueInProgress: false,
								config: null,
								initialConfig: null,
								eventQueue: null,
								configChangedEvent: null,
								init: function(owner) {
												this.owner = owner;
												this.configChangedEvent = this.createEvent(Config.CONFIG_CHANGED_EVENT);
												this.configChangedEvent.signature = CustomEvent.LIST;
												this.queueInProgress = false;
												this.config = {};
												this.initialConfig = {};
												this.eventQueue = [];
								},
								checkBoolean: function(val) { return (typeof val == Config.BOOLEAN_TYPE); },
								checkNumber: function(val) { return (!isNaN(val)); },
								fireEvent: function(key, value) { var property = this.config[key]; if (property && property.event) { property.event.fire(value); } },
								addProperty: function(key, propertyObject) {
												key = key.toLowerCase();
												this.config[key] = propertyObject;
												propertyObject.event = this.createEvent(key, { scope: this.owner });
												propertyObject.event.signature = CustomEvent.LIST;
												propertyObject.key = key;
												if (propertyObject.handler) { propertyObject.event.subscribe(propertyObject.handler, this.owner); }
												this.setProperty(key, propertyObject.value, true);
												if (!propertyObject.suppressEvent) { this.queueProperty(key, propertyObject.value); }
								},
								getConfig: function() {
												var cfg = {},
																prop, property;
												for (prop in this.config) { property = this.config[prop]; if (property && property.event) { cfg[prop] = property.value; } }
												return cfg;
								},
								getProperty: function(key) { var property = this.config[key.toLowerCase()]; if (property && property.event) { return property.value; } else { return undefined; } },
								resetProperty: function(key) { key = key.toLowerCase(); var property = this.config[key]; if (property && property.event) { if (this.initialConfig[key] && !Lang.isUndefined(this.initialConfig[key])) { this.setProperty(key, this.initialConfig[key]); return true; } } else { return false; } },
								setProperty: function(key, value, silent) {
												var property;
												key = key.toLowerCase();
												if (this.queueInProgress && !silent) { this.queueProperty(key, value); return true; } else {
																property = this.config[key];
																if (property && property.event) {
																				if (property.validator && !property.validator(value)) { return false; } else {
																								property.value = value;
																								if (!silent) {
																												this.fireEvent(key, value);
																												this.configChangedEvent.fire([key, value]);
																								}
																								return true;
																				}
																} else { return false; }
												}
								},
								queueProperty: function(key, value) {
												key = key.toLowerCase();
												var property = this.config[key],
																foundDuplicate = false,
																iLen, queueItem, queueItemKey, queueItemValue, sLen, supercedesCheck, qLen, queueItemCheck, queueItemCheckKey, queueItemCheckValue, i, s, q;
												if (property && property.event) {
																if (!Lang.isUndefined(value) && property.validator && !property.validator(value)) { return false; } else {
																				if (!Lang.isUndefined(value)) { property.value = value; } else { value = property.value; }
																				foundDuplicate = false;
																				iLen = this.eventQueue.length;
																				for (i = 0; i < iLen; i++) {
																								queueItem = this.eventQueue[i];
																								if (queueItem) {
																												queueItemKey = queueItem[0];
																												queueItemValue = queueItem[1];
																												if (queueItemKey == key) {
																																this.eventQueue[i] = null;
																																this.eventQueue.push([key, (!Lang.isUndefined(value) ? value : queueItemValue)]);
																																foundDuplicate = true;
																																break;
																												}
																								}
																				}
																				if (!foundDuplicate && !Lang.isUndefined(value)) { this.eventQueue.push([key, value]); }
																}
																if (property.supercedes) {
																				sLen = property.supercedes.length;
																				for (s = 0; s < sLen; s++) {
																								supercedesCheck = property.supercedes[s];
																								qLen = this.eventQueue.length;
																								for (q = 0; q < qLen; q++) {
																												queueItemCheck = this.eventQueue[q];
																												if (queueItemCheck) {
																																queueItemCheckKey = queueItemCheck[0];
																																queueItemCheckValue = queueItemCheck[1];
																																if (queueItemCheckKey == supercedesCheck.toLowerCase()) {
																																				this.eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
																																				this.eventQueue[q] = null;
																																				break;
																																}
																												}
																								}
																				}
																}
																return true;
												} else { return false; }
								},
								refireEvent: function(key) { key = key.toLowerCase(); var property = this.config[key]; if (property && property.event && !Lang.isUndefined(property.value)) { if (this.queueInProgress) { this.queueProperty(key); } else { this.fireEvent(key, property.value); } } },
								applyConfig: function(userConfig, init) {
												var sKey, oConfig;
												if (init) {
																oConfig = {};
																for (sKey in userConfig) { if (Lang.hasOwnProperty(userConfig, sKey)) { oConfig[sKey.toLowerCase()] = userConfig[sKey]; } }
																this.initialConfig = oConfig;
												}
												for (sKey in userConfig) { if (Lang.hasOwnProperty(userConfig, sKey)) { this.queueProperty(sKey, userConfig[sKey]); } }
								},
								refresh: function() { var prop; for (prop in this.config) { this.refireEvent(prop); } },
								fireQueue: function() {
												var i, queueItem, key, value, property;
												this.queueInProgress = true;
												for (i = 0; i < this.eventQueue.length; i++) {
																queueItem = this.eventQueue[i];
																if (queueItem) {
																				key = queueItem[0];
																				value = queueItem[1];
																				property = this.config[key];
																				property.value = value;
																				this.fireEvent(key, value);
																}
												}
												this.queueInProgress = false;
												this.eventQueue = [];
								},
								subscribeToConfigEvent: function(key, handler, obj, override) {
												var property = this.config[key.toLowerCase()];
												if (property && property.event) {
																if (!Config.alreadySubscribed(property.event, handler, obj)) { property.event.subscribe(handler, obj, override); }
																return true;
												} else { return false; }
								},
								unsubscribeFromConfigEvent: function(key, handler, obj) { var property = this.config[key.toLowerCase()]; if (property && property.event) { return property.event.unsubscribe(handler, obj); } else { return false; } },
								toString: function() {
												var output = "Config";
												if (this.owner) { output += " [" + this.owner.toString() + "]"; }
												return output;
								},
								outputEventQueue: function() {
												var output = "",
																queueItem, q, nQueue = this.eventQueue.length;
												for (q = 0; q < nQueue; q++) { queueItem = this.eventQueue[q]; if (queueItem) { output += queueItem[0] + "=" + queueItem[1] + ", "; } }
												return output;
								},
								destroy: function() {
												var oConfig = this.config,
																sProperty, oProperty;
												for (sProperty in oConfig) {
																if (Lang.hasOwnProperty(oConfig, sProperty)) {
																				oProperty = oConfig[sProperty];
																				oProperty.event.unsubscribeAll();
																				oProperty.event = null;
																}
												}
												this.configChangedEvent.unsubscribeAll();
												this.configChangedEvent = null;
												this.owner = null;
												this.config = null;
												this.initialConfig = null;
												this.eventQueue = null;
								}
				};
				Config.alreadySubscribed = function(evt, fn, obj) {
								var nSubscribers = evt.subscribers.length,
												subsc, i;
								if (nSubscribers > 0) {
												i = nSubscribers - 1;
												do { subsc = evt.subscribers[i]; if (subsc && subsc.obj == obj && subsc.fn == fn) { return true; } }
												while (i--);
								}
								return false;
				};
				YAHOO.lang.augmentProto(Config, YAHOO.util.EventProvider);
}());
YAHOO.widget.DateMath = {
				DAY: "D",
				WEEK: "W",
				YEAR: "Y",
				MONTH: "M",
				ONE_DAY_MS: 1000 * 60 * 60 * 24,
				WEEK_ONE_JAN_DATE: 1,
				add: function(date, field, amount) {
								var d = new Date(date.getTime());
								switch (field) {
												case this.MONTH:
																var newMonth = date.getMonth() + amount;
																var years = 0;
																if (newMonth < 0) {
																				while (newMonth < 0) {
																								newMonth += 12;
																								years -= 1;
																				}
																} else if (newMonth > 11) {
																				while (newMonth > 11) {
																								newMonth -= 12;
																								years += 1;
																				}
																}
																d.setMonth(newMonth);
																d.setFullYear(date.getFullYear() + years);
																break;
												case this.DAY:
																this._addDays(d, amount);
																break;
												case this.YEAR:
																d.setFullYear(date.getFullYear() + amount);
																break;
												case this.WEEK:
																this._addDays(d, (amount * 7));
																break;
								}
								return d;
				},
				_addDays: function(d, nDays) {
								if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420) { if (nDays < 0) { for (var min = -128; nDays < min; nDays -= min) { d.setDate(d.getDate() + min); } } else { for (var max = 96; nDays > max; nDays -= max) { d.setDate(d.getDate() + max); } } }
								d.setDate(d.getDate() + nDays);
				},
				subtract: function(date, field, amount) { return this.add(date, field, (amount * -1)); },
				before: function(date, compareTo) { var ms = compareTo.getTime(); if (date.getTime() < ms) { return true; } else { return false; } },
				after: function(date, compareTo) { var ms = compareTo.getTime(); if (date.getTime() > ms) { return true; } else { return false; } },
				between: function(date, dateBegin, dateEnd) { if (this.after(date, dateBegin) && this.before(date, dateEnd)) { return true; } else { return false; } },
				getJan1: function(calendarYear) { return this.getDate(calendarYear, 0, 1); },
				getDayOffset: function(date, calendarYear) { var beginYear = this.getJan1(calendarYear); var dayOffset = Math.ceil((date.getTime() - beginYear.getTime()) / this.ONE_DAY_MS); return dayOffset; },
				getWeekNumber: function(date, firstDayOfWeek, janDate) {
								firstDayOfWeek = firstDayOfWeek || 0;
								janDate = janDate || this.WEEK_ONE_JAN_DATE;
								var targetDate = this.clearTime(date),
												startOfWeek, endOfWeek;
								if (targetDate.getDay() === firstDayOfWeek) { startOfWeek = targetDate; } else { startOfWeek = this.getFirstDayOfWeek(targetDate, firstDayOfWeek); }
								var startYear = startOfWeek.getFullYear(),
												startTime = startOfWeek.getTime();
								endOfWeek = new Date(startOfWeek.getTime() + 6 * this.ONE_DAY_MS);
								var weekNum;
								if (startYear !== endOfWeek.getFullYear() && endOfWeek.getDate() >= janDate) { weekNum = 1; } else {
												var weekOne = this.clearTime(this.getDate(startYear, 0, janDate)),
																weekOneDayOne = this.getFirstDayOfWeek(weekOne, firstDayOfWeek);
												var daysDiff = Math.round((targetDate.getTime() - weekOneDayOne.getTime()) / this.ONE_DAY_MS);
												var rem = daysDiff % 7;
												var weeksDiff = (daysDiff - rem) / 7;
												weekNum = weeksDiff + 1;
								}
								return weekNum;
				},
				getFirstDayOfWeek: function(dt, startOfWeek) {
								startOfWeek = startOfWeek || 0;
								var dayOfWeekIndex = dt.getDay(),
												dayOfWeek = (dayOfWeekIndex - startOfWeek + 7) % 7;
								return this.subtract(dt, this.DAY, dayOfWeek);
				},
				isYearOverlapWeek: function(weekBeginDate) {
								var overlaps = false;
								var nextWeek = this.add(weekBeginDate, this.DAY, 6);
								if (nextWeek.getFullYear() != weekBeginDate.getFullYear()) { overlaps = true; }
								return overlaps;
				},
				isMonthOverlapWeek: function(weekBeginDate) {
								var overlaps = false;
								var nextWeek = this.add(weekBeginDate, this.DAY, 6);
								if (nextWeek.getMonth() != weekBeginDate.getMonth()) { overlaps = true; }
								return overlaps;
				},
				findMonthStart: function(date) { var start = this.getDate(date.getFullYear(), date.getMonth(), 1); return start; },
				findMonthEnd: function(date) { var start = this.findMonthStart(date); var nextMonth = this.add(start, this.MONTH, 1); var end = this.subtract(nextMonth, this.DAY, 1); return end; },
				clearTime: function(date) { date.setHours(12, 0, 0, 0); return date; },
				getDate: function(y, m, d) {
								var dt = null;
								if (YAHOO.lang.isUndefined(d)) { d = 1; }
								if (y >= 100) { dt = new Date(y, m, d); } else {
												dt = new Date();
												dt.setFullYear(y);
												dt.setMonth(m);
												dt.setDate(d);
												dt.setHours(0, 0, 0, 0);
								}
								return dt;
				}
};
YAHOO.widget.Calendar = function(id, containerId, config) { this.init.apply(this, arguments); };
YAHOO.widget.Calendar.IMG_ROOT = null;
YAHOO.widget.Calendar.DATE = "D";
YAHOO.widget.Calendar.MONTH_DAY = "MD";
YAHOO.widget.Calendar.WEEKDAY = "WD";
YAHOO.widget.Calendar.RANGE = "R";
YAHOO.widget.Calendar.MONTH = "M";
YAHOO.widget.Calendar.DISPLAY_DAYS = 42;
YAHOO.widget.Calendar.STOP_RENDER = "S";
YAHOO.widget.Calendar.SHORT = "short";
YAHOO.widget.Calendar.LONG = "long";
YAHOO.widget.Calendar.MEDIUM = "medium";
YAHOO.widget.Calendar.ONE_CHAR = "1char";
YAHOO.widget.Calendar._DEFAULT_CONFIG = { PAGEDATE: { key: "pagedate", value: null }, SELECTED: { key: "selected", value: null }, TITLE: { key: "title", value: "" }, CLOSE: { key: "close", value: false }, IFRAME: { key: "iframe", value: (YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6) ? true : false }, MINDATE: { key: "mindate", value: null }, MAXDATE: { key: "maxdate", value: null }, MULTI_SELECT: { key: "multi_select", value: false }, START_WEEKDAY: { key: "start_weekday", value: 0 }, SHOW_WEEKDAYS: { key: "show_weekdays", value: true }, SHOW_WEEK_HEADER: { key: "show_week_header", value: false }, SHOW_WEEK_FOOTER: { key: "show_week_footer", value: false }, HIDE_BLANK_WEEKS: { key: "hide_blank_weeks", value: false }, NAV_ARROW_LEFT: { key: "nav_arrow_left", value: null }, NAV_ARROW_RIGHT: { key: "nav_arrow_right", value: null }, MONTHS_SHORT: { key: "months_short", value: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] }, MONTHS_LONG: { key: "months_long", value: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] }, WEEKDAYS_1CHAR: { key: "weekdays_1char", value: ["S", "M", "T", "W", "T", "F", "S"] }, WEEKDAYS_SHORT: { key: "weekdays_short", value: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] }, WEEKDAYS_MEDIUM: { key: "weekdays_medium", value: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, WEEKDAYS_LONG: { key: "weekdays_long", value: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] }, LOCALE_MONTHS: { key: "locale_months", value: "long" }, LOCALE_WEEKDAYS: { key: "locale_weekdays", value: "short" }, DATE_DELIMITER: { key: "date_delimiter", value: "," }, DATE_FIELD_DELIMITER: { key: "date_field_delimiter", value: "/" }, DATE_RANGE_DELIMITER: { key: "date_range_delimiter", value: "-" }, MY_MONTH_POSITION: { key: "my_month_position", value: 1 }, MY_YEAR_POSITION: { key: "my_year_position", value: 2 }, MD_MONTH_POSITION: { key: "md_month_position", value: 1 }, MD_DAY_POSITION: { key: "md_day_position", value: 2 }, MDY_MONTH_POSITION: { key: "mdy_month_position", value: 1 }, MDY_DAY_POSITION: { key: "mdy_day_position", value: 2 }, MDY_YEAR_POSITION: { key: "mdy_year_position", value: 3 }, MY_LABEL_MONTH_POSITION: { key: "my_label_month_position", value: 1 }, MY_LABEL_YEAR_POSITION: { key: "my_label_year_position", value: 2 }, MY_LABEL_MONTH_SUFFIX: { key: "my_label_month_suffix", value: " " }, MY_LABEL_YEAR_SUFFIX: { key: "my_label_year_suffix", value: "" }, NAV: { key: "navigator", value: null } };
YAHOO.widget.Calendar._EVENT_TYPES = { BEFORE_SELECT: "beforeSelect", SELECT: "select", BEFORE_DESELECT: "beforeDeselect", DESELECT: "deselect", CHANGE_PAGE: "changePage", BEFORE_RENDER: "beforeRender", RENDER: "render", RESET: "reset", CLEAR: "clear", BEFORE_HIDE: "beforeHide", HIDE: "hide", BEFORE_SHOW: "beforeShow", SHOW: "show", BEFORE_HIDE_NAV: "beforeHideNav", HIDE_NAV: "hideNav", BEFORE_SHOW_NAV: "beforeShowNav", SHOW_NAV: "showNav", BEFORE_RENDER_NAV: "beforeRenderNav", RENDER_NAV: "renderNav" };
YAHOO.widget.Calendar._STYLES = { CSS_ROW_HEADER: "calrowhead", CSS_ROW_FOOTER: "calrowfoot", CSS_CELL: "calcell", CSS_CELL_SELECTOR: "selector", CSS_CELL_SELECTED: "selected", CSS_CELL_SELECTABLE: "selectable", CSS_CELL_RESTRICTED: "restricted", CSS_CELL_TODAY: "today", CSS_CELL_OOM: "oom", CSS_CELL_OOB: "previous", CSS_HEADER: "calheader", CSS_HEADER_TEXT: "calhead", CSS_BODY: "calbody", CSS_WEEKDAY_CELL: "calweekdaycell", CSS_WEEKDAY_ROW: "calweekdayrow", CSS_FOOTER: "calfoot", CSS_CALENDAR: "yui-calendar", CSS_SINGLE: "single", CSS_CONTAINER: "yui-calcontainer", CSS_NAV_LEFT: "calnavleft", CSS_NAV_RIGHT: "calnavright", CSS_NAV: "calnav", CSS_CLOSE: "calclose", CSS_CELL_TOP: "calcelltop", CSS_CELL_LEFT: "calcellleft", CSS_CELL_RIGHT: "calcellright", CSS_CELL_BOTTOM: "calcellbottom", CSS_CELL_HOVER: "calcellhover", CSS_CELL_HIGHLIGHT1: "highlight1", CSS_CELL_HIGHLIGHT2: "highlight2", CSS_CELL_HIGHLIGHT3: "highlight3", CSS_CELL_HIGHLIGHT4: "highlight4" };
YAHOO.widget.Calendar.prototype = {
				Config: null,
				parent: null,
				index: -1,
				cells: null,
				cellDates: null,
				id: null,
				containerId: null,
				oDomContainer: null,
				today: null,
				renderStack: null,
				_renderStack: null,
				oNavigator: null,
				_selectedDates: null,
				domEventMap: null,
				_parseArgs: function(args) {
								var nArgs = { id: null, container: null, config: null };
								if (args && args.length && args.length > 0) {
												switch (args.length) {
																case 1:
																				nArgs.id = null;
																				nArgs.container = args[0];
																				nArgs.config = null;
																				break;
																case 2:
																				if (YAHOO.lang.isObject(args[1]) && !args[1].tagName && !(args[1] instanceof String)) {
																								nArgs.id = null;
																								nArgs.container = args[0];
																								nArgs.config = args[1];
																				} else {
																								nArgs.id = args[0];
																								nArgs.container = args[1];
																								nArgs.config = null;
																				}
																				break;
																default:
																				nArgs.id = args[0];
																				nArgs.container = args[1];
																				nArgs.config = args[2];
																				break;
												}
								} else {}
								return nArgs;
				},
				init: function(id, container, config) {
								var nArgs = this._parseArgs(arguments);
								id = nArgs.id;
								container = nArgs.container;
								config = nArgs.config;
								this.oDomContainer = YAHOO.util.Dom.get(container);
								if (!this.oDomContainer.id) { this.oDomContainer.id = YAHOO.util.Dom.generateId(); }
								if (!id) { id = this.oDomContainer.id + "_t"; }
								this.id = id;
								this.containerId = this.oDomContainer.id;
								this.initEvents();
								this.today = new Date();
								YAHOO.widget.DateMath.clearTime(this.today);
								this.cfg = new YAHOO.util.Config(this);
								this.Options = {};
								this.Locale = {};
								this.initStyles();
								YAHOO.util.Dom.addClass(this.oDomContainer, this.Style.CSS_CONTAINER);
								YAHOO.util.Dom.addClass(this.oDomContainer, this.Style.CSS_SINGLE);
								this.cellDates = [];
								this.cells = [];
								this.renderStack = [];
								this._renderStack = [];
								this.setupConfig();
								if (config) { this.cfg.applyConfig(config, true); }
								this.cfg.fireQueue();
				},
				configIframe: function(type, args, obj) {
								var useIframe = args[0];
								if (!this.parent) {
												if (YAHOO.util.Dom.inDocument(this.oDomContainer)) {
																if (useIframe) {
																				var pos = YAHOO.util.Dom.getStyle(this.oDomContainer, "position");
																				if (pos == "absolute" || pos == "relative") {
																								if (!YAHOO.util.Dom.inDocument(this.iframe)) {
																												this.iframe = document.createElement("iframe");
																												this.iframe.src = "javascript:false;";
																												YAHOO.util.Dom.setStyle(this.iframe, "opacity", "0");
																												if (YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6) { YAHOO.util.Dom.addClass(this.iframe, "fixedsize"); }
																												this.oDomContainer.insertBefore(this.iframe, this.oDomContainer.firstChild);
																								}
																				}
																} else {
																				if (this.iframe) {
																								if (this.iframe.parentNode) { this.iframe.parentNode.removeChild(this.iframe); }
																								this.iframe = null;
																				}
																}
												}
								}
				},
				configTitle: function(type, args, obj) { var title = args[0]; if (title) { this.createTitleBar(title); } else { var close = this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.CLOSE.key); if (!close) { this.removeTitleBar(); } else { this.createTitleBar("&#160;"); } } },
				configClose: function(type, args, obj) {
								var close = args[0],
												title = this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.TITLE.key);
								if (close) {
												if (!title) { this.createTitleBar("&#160;"); }
												this.createCloseButton();
								} else { this.removeCloseButton(); if (!title) { this.removeTitleBar(); } }
				},
				initEvents: function() {
								var defEvents = YAHOO.widget.Calendar._EVENT_TYPES;
								this.beforeSelectEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SELECT);
								this.selectEvent = new YAHOO.util.CustomEvent(defEvents.SELECT);
								this.beforeDeselectEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_DESELECT);
								this.deselectEvent = new YAHOO.util.CustomEvent(defEvents.DESELECT);
								this.changePageEvent = new YAHOO.util.CustomEvent(defEvents.CHANGE_PAGE);
								this.beforeRenderEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_RENDER);
								this.renderEvent = new YAHOO.util.CustomEvent(defEvents.RENDER);
								this.resetEvent = new YAHOO.util.CustomEvent(defEvents.RESET);
								this.clearEvent = new YAHOO.util.CustomEvent(defEvents.CLEAR);
								this.beforeShowEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SHOW);
								this.showEvent = new YAHOO.util.CustomEvent(defEvents.SHOW);
								this.beforeHideEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_HIDE);
								this.hideEvent = new YAHOO.util.CustomEvent(defEvents.HIDE);
								this.beforeShowNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SHOW_NAV);
								this.showNavEvent = new YAHOO.util.CustomEvent(defEvents.SHOW_NAV);
								this.beforeHideNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_HIDE_NAV);
								this.hideNavEvent = new YAHOO.util.CustomEvent(defEvents.HIDE_NAV);
								this.beforeRenderNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_RENDER_NAV);
								this.renderNavEvent = new YAHOO.util.CustomEvent(defEvents.RENDER_NAV);
								this.beforeSelectEvent.subscribe(this.onBeforeSelect, this, true);
								this.selectEvent.subscribe(this.onSelect, this, true);
								this.beforeDeselectEvent.subscribe(this.onBeforeDeselect, this, true);
								this.deselectEvent.subscribe(this.onDeselect, this, true);
								this.changePageEvent.subscribe(this.onChangePage, this, true);
								this.renderEvent.subscribe(this.onRender, this, true);
								this.resetEvent.subscribe(this.onReset, this, true);
								this.clearEvent.subscribe(this.onClear, this, true);
				},
				doSelectCell: function(e, cal) {
								var cell, index, d, date;
								var target = YAHOO.util.Event.getTarget(e);
								var tagName = target.tagName.toLowerCase();
								var defSelector = false;
								while (tagName != "td" && !YAHOO.util.Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
												if (!defSelector && tagName == "a" && YAHOO.util.Dom.hasClass(target, cal.Style.CSS_CELL_SELECTOR)) { defSelector = true; }
												target = target.parentNode;
												tagName = target.tagName.toLowerCase();
												if (tagName == "html") { return; }
								}
								if (defSelector) { YAHOO.util.Event.preventDefault(e); }
								cell = target;
								if (YAHOO.util.Dom.hasClass(cell, cal.Style.CSS_CELL_SELECTABLE)) {
												index = cell.id.split("cell")[1];
												d = cal.cellDates[index];
												date = YAHOO.widget.DateMath.getDate(d[0], d[1] - 1, d[2]);
												var link;
												if (cal.Options.MULTI_SELECT) {
																link = cell.getElementsByTagName("a")[0];
																if (link) { link.blur(); }
																var cellDate = cal.cellDates[index];
																var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);
																if (cellDateIndex > -1) { cal.deselectCell(index); } else { cal.selectCell(index); }
												} else {
																link = cell.getElementsByTagName("a")[0];
																if (link) { link.blur(); }
																cal.selectCell(index);
												}
								}
				},
				doCellMouseOver: function(e, cal) {
								var target;
								if (e) { target = YAHOO.util.Event.getTarget(e); } else { target = this; }
								while (target.tagName && target.tagName.toLowerCase() != "td") { target = target.parentNode; if (!target.tagName || target.tagName.toLowerCase() == "html") { return; } }
								if (YAHOO.util.Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) { YAHOO.util.Dom.addClass(target, cal.Style.CSS_CELL_HOVER); }
				},
				doCellMouseOut: function(e, cal) {
								var target;
								if (e) { target = YAHOO.util.Event.getTarget(e); } else { target = this; }
								while (target.tagName && target.tagName.toLowerCase() != "td") { target = target.parentNode; if (!target.tagName || target.tagName.toLowerCase() == "html") { return; } }
								if (YAHOO.util.Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) { YAHOO.util.Dom.removeClass(target, cal.Style.CSS_CELL_HOVER); }
				},
				setupConfig: function() {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								this.cfg.addProperty(defCfg.PAGEDATE.key, { value: new Date(), handler: this.configPageDate });
								this.cfg.addProperty(defCfg.SELECTED.key, { value: [], handler: this.configSelected });
								this.cfg.addProperty(defCfg.TITLE.key, { value: defCfg.TITLE.value, handler: this.configTitle });
								this.cfg.addProperty(defCfg.CLOSE.key, { value: defCfg.CLOSE.value, handler: this.configClose });
								this.cfg.addProperty(defCfg.IFRAME.key, { value: defCfg.IFRAME.value, handler: this.configIframe, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.MINDATE.key, { value: defCfg.MINDATE.value, handler: this.configMinDate });
								this.cfg.addProperty(defCfg.MAXDATE.key, { value: defCfg.MAXDATE.value, handler: this.configMaxDate });
								this.cfg.addProperty(defCfg.MULTI_SELECT.key, { value: defCfg.MULTI_SELECT.value, handler: this.configOptions, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.START_WEEKDAY.key, { value: defCfg.START_WEEKDAY.value, handler: this.configOptions, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.SHOW_WEEKDAYS.key, { value: defCfg.SHOW_WEEKDAYS.value, handler: this.configOptions, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.SHOW_WEEK_HEADER.key, { value: defCfg.SHOW_WEEK_HEADER.value, handler: this.configOptions, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.SHOW_WEEK_FOOTER.key, { value: defCfg.SHOW_WEEK_FOOTER.value, handler: this.configOptions, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.HIDE_BLANK_WEEKS.key, { value: defCfg.HIDE_BLANK_WEEKS.value, handler: this.configOptions, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.NAV_ARROW_LEFT.key, { value: defCfg.NAV_ARROW_LEFT.value, handler: this.configOptions });
								this.cfg.addProperty(defCfg.NAV_ARROW_RIGHT.key, { value: defCfg.NAV_ARROW_RIGHT.value, handler: this.configOptions });
								this.cfg.addProperty(defCfg.MONTHS_SHORT.key, { value: defCfg.MONTHS_SHORT.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.MONTHS_LONG.key, { value: defCfg.MONTHS_LONG.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.WEEKDAYS_1CHAR.key, { value: defCfg.WEEKDAYS_1CHAR.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.WEEKDAYS_SHORT.key, { value: defCfg.WEEKDAYS_SHORT.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.WEEKDAYS_MEDIUM.key, { value: defCfg.WEEKDAYS_MEDIUM.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.WEEKDAYS_LONG.key, { value: defCfg.WEEKDAYS_LONG.value, handler: this.configLocale });
								var refreshLocale = function() {
												this.cfg.refireEvent(defCfg.LOCALE_MONTHS.key);
												this.cfg.refireEvent(defCfg.LOCALE_WEEKDAYS.key);
								};
								this.cfg.subscribeToConfigEvent(defCfg.START_WEEKDAY.key, refreshLocale, this, true);
								this.cfg.subscribeToConfigEvent(defCfg.MONTHS_SHORT.key, refreshLocale, this, true);
								this.cfg.subscribeToConfigEvent(defCfg.MONTHS_LONG.key, refreshLocale, this, true);
								this.cfg.subscribeToConfigEvent(defCfg.WEEKDAYS_1CHAR.key, refreshLocale, this, true);
								this.cfg.subscribeToConfigEvent(defCfg.WEEKDAYS_SHORT.key, refreshLocale, this, true);
								this.cfg.subscribeToConfigEvent(defCfg.WEEKDAYS_MEDIUM.key, refreshLocale, this, true);
								this.cfg.subscribeToConfigEvent(defCfg.WEEKDAYS_LONG.key, refreshLocale, this, true);
								this.cfg.addProperty(defCfg.LOCALE_MONTHS.key, { value: defCfg.LOCALE_MONTHS.value, handler: this.configLocaleValues });
								this.cfg.addProperty(defCfg.LOCALE_WEEKDAYS.key, { value: defCfg.LOCALE_WEEKDAYS.value, handler: this.configLocaleValues });
								this.cfg.addProperty(defCfg.DATE_DELIMITER.key, { value: defCfg.DATE_DELIMITER.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.DATE_FIELD_DELIMITER.key, { value: defCfg.DATE_FIELD_DELIMITER.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.DATE_RANGE_DELIMITER.key, { value: defCfg.DATE_RANGE_DELIMITER.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.MY_MONTH_POSITION.key, { value: defCfg.MY_MONTH_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_YEAR_POSITION.key, { value: defCfg.MY_YEAR_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MD_MONTH_POSITION.key, { value: defCfg.MD_MONTH_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MD_DAY_POSITION.key, { value: defCfg.MD_DAY_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MDY_MONTH_POSITION.key, { value: defCfg.MDY_MONTH_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MDY_DAY_POSITION.key, { value: defCfg.MDY_DAY_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MDY_YEAR_POSITION.key, { value: defCfg.MDY_YEAR_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_LABEL_MONTH_POSITION.key, { value: defCfg.MY_LABEL_MONTH_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_LABEL_YEAR_POSITION.key, { value: defCfg.MY_LABEL_YEAR_POSITION.value, handler: this.configLocale, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_LABEL_MONTH_SUFFIX.key, { value: defCfg.MY_LABEL_MONTH_SUFFIX.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.MY_LABEL_YEAR_SUFFIX.key, { value: defCfg.MY_LABEL_YEAR_SUFFIX.value, handler: this.configLocale });
								this.cfg.addProperty(defCfg.NAV.key, { value: defCfg.NAV.value, handler: this.configNavigator });
				},
				configPageDate: function(type, args, obj) { this.cfg.setProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key, this._parsePageDate(args[0]), true); },
				configMinDate: function(type, args, obj) {
								var val = args[0];
								if (YAHOO.lang.isString(val)) {
												val = this._parseDate(val);
												this.cfg.setProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.MINDATE.key, YAHOO.widget.DateMath.getDate(val[0], (val[1] - 1), val[2]));
								}
				},
				configMaxDate: function(type, args, obj) {
								var val = args[0];
								if (YAHOO.lang.isString(val)) {
												val = this._parseDate(val);
												this.cfg.setProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.MAXDATE.key, YAHOO.widget.DateMath.getDate(val[0], (val[1] - 1), val[2]));
								}
				},
				configSelected: function(type, args, obj) {
								var selected = args[0];
								var cfgSelected = YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key;
								if (selected) { if (YAHOO.lang.isString(selected)) { this.cfg.setProperty(cfgSelected, this._parseDates(selected), true); } }
								if (!this._selectedDates) { this._selectedDates = this.cfg.getProperty(cfgSelected); }
				},
				configOptions: function(type, args, obj) { this.Options[type.toUpperCase()] = args[0]; },
				configLocale: function(type, args, obj) {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								this.Locale[type.toUpperCase()] = args[0];
								this.cfg.refireEvent(defCfg.LOCALE_MONTHS.key);
								this.cfg.refireEvent(defCfg.LOCALE_WEEKDAYS.key);
				},
				configLocaleValues: function(type, args, obj) {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								type = type.toLowerCase();
								var val = args[0];
								switch (type) {
												case defCfg.LOCALE_MONTHS.key:
																switch (val) {
																				case YAHOO.widget.Calendar.SHORT:
																								this.Locale.LOCALE_MONTHS = this.cfg.getProperty(defCfg.MONTHS_SHORT.key).concat();
																								break;
																				case YAHOO.widget.Calendar.LONG:
																								this.Locale.LOCALE_MONTHS = this.cfg.getProperty(defCfg.MONTHS_LONG.key).concat();
																								break;
																}
																break;
												case defCfg.LOCALE_WEEKDAYS.key:
																switch (val) {
																				case YAHOO.widget.Calendar.ONE_CHAR:
																								this.Locale.LOCALE_WEEKDAYS = this.cfg.getProperty(defCfg.WEEKDAYS_1CHAR.key).concat();
																								break;
																				case YAHOO.widget.Calendar.SHORT:
																								this.Locale.LOCALE_WEEKDAYS = this.cfg.getProperty(defCfg.WEEKDAYS_SHORT.key).concat();
																								break;
																				case YAHOO.widget.Calendar.MEDIUM:
																								this.Locale.LOCALE_WEEKDAYS = this.cfg.getProperty(defCfg.WEEKDAYS_MEDIUM.key).concat();
																								break;
																				case YAHOO.widget.Calendar.LONG:
																								this.Locale.LOCALE_WEEKDAYS = this.cfg.getProperty(defCfg.WEEKDAYS_LONG.key).concat();
																								break;
																}
																var START_WEEKDAY = this.cfg.getProperty(defCfg.START_WEEKDAY.key);
																if (START_WEEKDAY > 0) { for (var w = 0; w < START_WEEKDAY; ++w) { this.Locale.LOCALE_WEEKDAYS.push(this.Locale.LOCALE_WEEKDAYS.shift()); } }
																break;
								}
				},
				configNavigator: function(type, args, obj) {
								var val = args[0];
								if (YAHOO.widget.CalendarNavigator && (val === true || YAHOO.lang.isObject(val))) {
												if (!this.oNavigator) {
																this.oNavigator = new YAHOO.widget.CalendarNavigator(this);

																function erase() { if (!this.pages) { this.oNavigator.erase(); } }
																this.beforeRenderEvent.subscribe(erase, this, true);
												}
								} else {
												if (this.oNavigator) {
																this.oNavigator.destroy();
																this.oNavigator = null;
												}
								}
				},
				initStyles: function() {
								var defStyle = YAHOO.widget.Calendar._STYLES;
								this.Style = { CSS_ROW_HEADER: defStyle.CSS_ROW_HEADER, CSS_ROW_FOOTER: defStyle.CSS_ROW_FOOTER, CSS_CELL: defStyle.CSS_CELL, CSS_CELL_SELECTOR: defStyle.CSS_CELL_SELECTOR, CSS_CELL_SELECTED: defStyle.CSS_CELL_SELECTED, CSS_CELL_SELECTABLE: defStyle.CSS_CELL_SELECTABLE, CSS_CELL_RESTRICTED: defStyle.CSS_CELL_RESTRICTED, CSS_CELL_TODAY: defStyle.CSS_CELL_TODAY, CSS_CELL_OOM: defStyle.CSS_CELL_OOM, CSS_CELL_OOB: defStyle.CSS_CELL_OOB, CSS_HEADER: defStyle.CSS_HEADER, CSS_HEADER_TEXT: defStyle.CSS_HEADER_TEXT, CSS_BODY: defStyle.CSS_BODY, CSS_WEEKDAY_CELL: defStyle.CSS_WEEKDAY_CELL, CSS_WEEKDAY_ROW: defStyle.CSS_WEEKDAY_ROW, CSS_FOOTER: defStyle.CSS_FOOTER, CSS_CALENDAR: defStyle.CSS_CALENDAR, CSS_SINGLE: defStyle.CSS_SINGLE, CSS_CONTAINER: defStyle.CSS_CONTAINER, CSS_NAV_LEFT: defStyle.CSS_NAV_LEFT, CSS_NAV_RIGHT: defStyle.CSS_NAV_RIGHT, CSS_NAV: defStyle.CSS_NAV, CSS_CLOSE: defStyle.CSS_CLOSE, CSS_CELL_TOP: defStyle.CSS_CELL_TOP, CSS_CELL_LEFT: defStyle.CSS_CELL_LEFT, CSS_CELL_RIGHT: defStyle.CSS_CELL_RIGHT, CSS_CELL_BOTTOM: defStyle.CSS_CELL_BOTTOM, CSS_CELL_HOVER: defStyle.CSS_CELL_HOVER, CSS_CELL_HIGHLIGHT1: defStyle.CSS_CELL_HIGHLIGHT1, CSS_CELL_HIGHLIGHT2: defStyle.CSS_CELL_HIGHLIGHT2, CSS_CELL_HIGHLIGHT3: defStyle.CSS_CELL_HIGHLIGHT3, CSS_CELL_HIGHLIGHT4: defStyle.CSS_CELL_HIGHLIGHT4 };
				},
				buildMonthLabel: function() { var pageDate = this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key); var monthLabel = this.Locale.LOCALE_MONTHS[pageDate.getMonth()] + this.Locale.MY_LABEL_MONTH_SUFFIX; var yearLabel = pageDate.getFullYear() + this.Locale.MY_LABEL_YEAR_SUFFIX; if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) { return yearLabel + $loc('year_suffix') + monthLabel; } else { return monthLabel + ' ' + yearLabel; } },
				buildDayLabel: function(workingDate) { return workingDate.getDate(); },
				createTitleBar: function(strTitle) {
								var tDiv = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.CalendarGroup.CSS_2UPTITLE, "div", this.oDomContainer)[0] || document.createElement("div");
								tDiv.className = YAHOO.widget.CalendarGroup.CSS_2UPTITLE;
								tDiv.innerHTML = strTitle;
								this.oDomContainer.insertBefore(tDiv, this.oDomContainer.firstChild);
								YAHOO.util.Dom.addClass(this.oDomContainer, "withtitle");
								return tDiv;
				},
				removeTitleBar: function() {
								var tDiv = YAHOO.util.Dom.getElementsByClassName(YAHOO.widget.CalendarGroup.CSS_2UPTITLE, "div", this.oDomContainer)[0] || null;
								if (tDiv) {
												YAHOO.util.Event.purgeElement(tDiv);
												this.oDomContainer.removeChild(tDiv);
								}
								YAHOO.util.Dom.removeClass(this.oDomContainer, "withtitle");
				},
				createCloseButton: function() {
								var Dom = YAHOO.util.Dom,
												Event = YAHOO.util.Event,
												cssClose = YAHOO.widget.CalendarGroup.CSS_2UPCLOSE,
												DEPR_CLOSE_PATH = "us/my/bn/x_d.gif";
								var lnk = Dom.getElementsByClassName("link-close", "a", this.oDomContainer)[0];
								if (!lnk) {
												lnk = document.createElement("a");
												Event.addListener(lnk, "click", function(e, cal) {
																cal.hide();
																Event.preventDefault(e);
												}, this);
								}
								lnk.href = "#";
								lnk.className = "link-close";
								if (YAHOO.widget.Calendar.IMG_ROOT !== null) {
												var img = Dom.getElementsByClassName(cssClose, "img", lnk)[0] || document.createElement("img");
												img.src = YAHOO.widget.Calendar.IMG_ROOT + DEPR_CLOSE_PATH;
												img.className = cssClose;
												lnk.appendChild(img);
								} else { lnk.innerHTML = '<span class="' + cssClose + ' ' + this.Style.CSS_CLOSE + '"></span>'; }
								this.oDomContainer.appendChild(lnk);
								return lnk;
				},
				removeCloseButton: function() {
								var btn = YAHOO.util.Dom.getElementsByClassName("link-close", "a", this.oDomContainer)[0] || null;
								if (btn) {
												YAHOO.util.Event.purgeElement(btn);
												this.oDomContainer.removeChild(btn);
								}
				},
				renderHeader: function(html) {
								var colSpan = 7;
								var DEPR_NAV_LEFT = "us/tr/callt.gif";
								var DEPR_NAV_RIGHT = "us/tr/calrt.gif";
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								if (this.cfg.getProperty(defCfg.SHOW_WEEK_HEADER.key)) { colSpan += 1; }
								if (this.cfg.getProperty(defCfg.SHOW_WEEK_FOOTER.key)) { colSpan += 1; }
								html[html.length] = "<thead>";
								html[html.length] = "<tr>";
								html[html.length] = '<th colspan="' + colSpan + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
								html[html.length] = '<div class="' + this.Style.CSS_HEADER + '">';
								var renderLeft, renderRight = false;
								if (this.parent) {
												if (this.index === 0) { renderLeft = true; }
												if (this.index == (this.parent.cfg.getProperty("pages") - 1)) { renderRight = true; }
								} else {
												renderLeft = true;
												renderRight = true;
								}
								if (renderLeft) {
												var leftArrow = this.cfg.getProperty(defCfg.NAV_ARROW_LEFT.key);
												if (leftArrow === null && YAHOO.widget.Calendar.IMG_ROOT !== null) { leftArrow = YAHOO.widget.Calendar.IMG_ROOT + DEPR_NAV_LEFT; }
												var leftStyle = (leftArrow === null) ? "" : ' style="background-image:url(' + leftArrow + ')"';
												html[html.length] = '<a class="' + this.Style.CSS_NAV_LEFT + '"' + leftStyle + ' >&#160;</a>';
								}
								var lbl = this.buildMonthLabel();
								var cal = this.parent || this;
								if (cal.cfg.getProperty("navigator")) { lbl = "<a class=\"" + this.Style.CSS_NAV + "\" href=\"#\">" + lbl + "</a>"; }
								html[html.length] = lbl;
								if (renderRight) {
												var rightArrow = this.cfg.getProperty(defCfg.NAV_ARROW_RIGHT.key);
												if (rightArrow === null && YAHOO.widget.Calendar.IMG_ROOT !== null) { rightArrow = YAHOO.widget.Calendar.IMG_ROOT + DEPR_NAV_RIGHT; }
												var rightStyle = (rightArrow === null) ? "" : ' style="background-image:url(' + rightArrow + ')"';
												html[html.length] = '<a class="' + this.Style.CSS_NAV_RIGHT + '"' + rightStyle + ' >&#160;</a>';
								}
								html[html.length] = '</div>\n</th>\n</tr>';
								if (this.cfg.getProperty(defCfg.SHOW_WEEKDAYS.key)) { html = this.buildWeekdays(html); }
								html[html.length] = '</thead>';
								return html;
				},
				buildWeekdays: function(html) {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								html[html.length] = '<tr class="' + this.Style.CSS_WEEKDAY_ROW + '">';
								if (this.cfg.getProperty(defCfg.SHOW_WEEK_HEADER.key)) { html[html.length] = '<th>&#160;</th>'; }
								for (var i = 0; i < this.Locale.LOCALE_WEEKDAYS.length; ++i) { html[html.length] = '<th class="calweekdaycell">' + this.Locale.LOCALE_WEEKDAYS[i] + '</th>'; }
								if (this.cfg.getProperty(defCfg.SHOW_WEEK_FOOTER.key)) { html[html.length] = '<th>&#160;</th>'; }
								html[html.length] = '</tr>';
								return html;
				},
				renderBody: function(workingDate, html) {
								var DM = YAHOO.widget.DateMath,
												CAL = YAHOO.widget.Calendar,
												D = YAHOO.util.Dom,
												defCfg = CAL._DEFAULT_CONFIG;
								var startDay = this.cfg.getProperty(defCfg.START_WEEKDAY.key);
								this.preMonthDays = workingDate.getDay();
								if (startDay > 0) { this.preMonthDays -= startDay; }
								if (this.preMonthDays < 0) { this.preMonthDays += 7; }
								this.monthDays = DM.findMonthEnd(workingDate).getDate();
								this.postMonthDays = CAL.DISPLAY_DAYS - this.preMonthDays - this.monthDays;
								workingDate = DM.subtract(workingDate, DM.DAY, this.preMonthDays);
								var weekNum, weekClass, weekPrefix = "w",
												cellPrefix = "_cell",
												workingDayPrefix = "wd",
												dayPrefix = "d",
												cellRenderers, renderer, todayYear = this.today.getFullYear(),
												todayMonth = this.today.getMonth(),
												todayDate = this.today.getDate(),
												useDate = this.cfg.getProperty(defCfg.PAGEDATE.key),
												hideBlankWeeks = this.cfg.getProperty(defCfg.HIDE_BLANK_WEEKS.key),
												showWeekFooter = this.cfg.getProperty(defCfg.SHOW_WEEK_FOOTER.key),
												showWeekHeader = this.cfg.getProperty(defCfg.SHOW_WEEK_HEADER.key),
												mindate = this.cfg.getProperty(defCfg.MINDATE.key),
												maxdate = this.cfg.getProperty(defCfg.MAXDATE.key);
								if (mindate) { mindate = DM.clearTime(mindate); }
								if (maxdate) { maxdate = DM.clearTime(maxdate); }
								html[html.length] = '<tbody class="m' + (useDate.getMonth() + 1) + ' ' + this.Style.CSS_BODY + '">';
								var i = 0,
												tempDiv = document.createElement("div"),
												cell = document.createElement("td");
								tempDiv.appendChild(cell);
								var cal = this.parent || this;
								for (var r = 0; r < 6; r++) {
												weekNum = DM.getWeekNumber(workingDate, startDay);
												weekClass = weekPrefix + weekNum;
												if (r !== 0 && hideBlankWeeks === true && workingDate.getMonth() != useDate.getMonth()) { break; } else {
																html[html.length] = '<tr class="' + weekClass + '">';
																if (showWeekHeader) { html = this.renderRowHeader(weekNum, html); }
																for (var d = 0; d < 7; d++) {
																				cellRenderers = [];
																				this.clearElement(cell);
																				cell.className = this.Style.CSS_CELL;
																				cell.id = this.id + cellPrefix + i;
																				if (workingDate.getDate() == todayDate && workingDate.getMonth() == todayMonth && workingDate.getFullYear() == todayYear) { cellRenderers[cellRenderers.length] = cal.renderCellStyleToday; }
																				var workingArray = [workingDate.getFullYear(), workingDate.getMonth() + 1, workingDate.getDate()];
																				this.cellDates[this.cellDates.length] = workingArray;
																				if (workingDate.getMonth() != useDate.getMonth()) { cellRenderers[cellRenderers.length] = cal.renderCellNotThisMonth; } else {
																								D.addClass(cell, workingDayPrefix + workingDate.getDay());
																								D.addClass(cell, dayPrefix + workingDate.getDate());
																								for (var s = 0; s < this.renderStack.length; ++s) {
																												renderer = null;
																												var rArray = this.renderStack[s],
																																type = rArray[0],
																																month, day, year;
																												switch (type) {
																																case CAL.DATE:
																																				month = rArray[1][1];
																																				day = rArray[1][2];
																																				year = rArray[1][0];
																																				if (workingDate.getMonth() + 1 == month && workingDate.getDate() == day && workingDate.getFullYear() == year) {
																																								renderer = rArray[2];
																																								this.renderStack.splice(s, 1);
																																				}
																																				break;
																																case CAL.MONTH_DAY:
																																				month = rArray[1][0];
																																				day = rArray[1][1];
																																				if (workingDate.getMonth() + 1 == month && workingDate.getDate() == day) {
																																								renderer = rArray[2];
																																								this.renderStack.splice(s, 1);
																																				}
																																				break;
																																case CAL.RANGE:
																																				var date1 = rArray[1][0],
																																								date2 = rArray[1][1],
																																								d1month = date1[1],
																																								d1day = date1[2],
																																								d1year = date1[0],
																																								d1 = DM.getDate(d1year, d1month - 1, d1day),
																																								d2month = date2[1],
																																								d2day = date2[2],
																																								d2year = date2[0],
																																								d2 = DM.getDate(d2year, d2month - 1, d2day);
																																				if (workingDate.getTime() >= d1.getTime() && workingDate.getTime() <= d2.getTime()) { renderer = rArray[2]; if (workingDate.getTime() == d2.getTime()) { this.renderStack.splice(s, 1); } }
																																				break;
																																case CAL.WEEKDAY:
																																				var weekday = rArray[1][0];
																																				if (workingDate.getDay() + 1 == weekday) { renderer = rArray[2]; }
																																				break;
																																case CAL.MONTH:
																																				month = rArray[1][0];
																																				if (workingDate.getMonth() + 1 == month) { renderer = rArray[2]; }
																																				break;
																												}
																												if (renderer) { cellRenderers[cellRenderers.length] = renderer; }
																								}
																				}
																				if (this._indexOfSelectedFieldArray(workingArray) > -1) { cellRenderers[cellRenderers.length] = cal.renderCellStyleSelected; }
																				if ((mindate && (workingDate.getTime() < mindate.getTime())) || (maxdate && (workingDate.getTime() > maxdate.getTime()))) { cellRenderers[cellRenderers.length] = cal.renderOutOfBoundsDate; } else {
																								cellRenderers[cellRenderers.length] = cal.styleCellDefault;
																								cellRenderers[cellRenderers.length] = cal.renderCellDefault;
																				}
																				for (var x = 0; x < cellRenderers.length; ++x) { if (cellRenderers[x].call(cal, workingDate, cell) == CAL.STOP_RENDER) { break; } }
																				workingDate.setTime(workingDate.getTime() + DM.ONE_DAY_MS);
																				workingDate = DM.clearTime(workingDate);
																				if (i >= 0 && i <= 6) { D.addClass(cell, this.Style.CSS_CELL_TOP); }
																				if ((i % 7) === 0) { D.addClass(cell, this.Style.CSS_CELL_LEFT); }
																				if (((i + 1) % 7) === 0) { D.addClass(cell, this.Style.CSS_CELL_RIGHT); }
																				var postDays = this.postMonthDays;
																				if (hideBlankWeeks && postDays >= 7) { var blankWeeks = Math.floor(postDays / 7); for (var p = 0; p < blankWeeks; ++p) { postDays -= 7; } }
																				if (i >= ((this.preMonthDays + postDays + this.monthDays) - 7)) { D.addClass(cell, this.Style.CSS_CELL_BOTTOM); }
																				html[html.length] = tempDiv.innerHTML;
																				i++;
																}
																if (showWeekFooter) { html = this.renderRowFooter(weekNum, html); }
																html[html.length] = '</tr>';
												}
								}
								html[html.length] = '</tbody>';
								return html;
				},
				renderFooter: function(html) { return html; },
				render: function() {
								this.beforeRenderEvent.fire();
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								var workingDate = YAHOO.widget.DateMath.findMonthStart(this.cfg.getProperty(defCfg.PAGEDATE.key));
								this.resetRenderers();
								this.cellDates.length = 0;
								YAHOO.util.Event.purgeElement(this.oDomContainer, true);
								var html = [];
								html[html.length] = '<table cellSpacing="0" class="' + this.Style.CSS_CALENDAR + ' y' + workingDate.getFullYear() + '" id="' + this.id + '">';
								html = this.renderHeader(html);
								html = this.renderBody(workingDate, html);
								html = this.renderFooter(html);
								html[html.length] = '</table>';
								this.oDomContainer.innerHTML = html.join("\n");
								this.applyListeners();
								this.cells = this.oDomContainer.getElementsByTagName("td");
								this.cfg.refireEvent(defCfg.TITLE.key);
								this.cfg.refireEvent(defCfg.CLOSE.key);
								this.cfg.refireEvent(defCfg.IFRAME.key);
								this.renderEvent.fire();
				},
				applyListeners: function() {
								var root = this.oDomContainer;
								var cal = this.parent || this;
								var anchor = "a";
								var mousedown = "mousedown";
								var linkLeft = YAHOO.util.Dom.getElementsByClassName(this.Style.CSS_NAV_LEFT, anchor, root);
								var linkRight = YAHOO.util.Dom.getElementsByClassName(this.Style.CSS_NAV_RIGHT, anchor, root);
								if (linkLeft && linkLeft.length > 0) {
												this.linkLeft = linkLeft[0];
												YAHOO.util.Event.addListener(this.linkLeft, mousedown, cal.previousMonth, cal, true);
								}
								if (linkRight && linkRight.length > 0) {
												this.linkRight = linkRight[0];
												YAHOO.util.Event.addListener(this.linkRight, mousedown, cal.nextMonth, cal, true);
								}
								if (cal.cfg.getProperty("navigator") !== null) { this.applyNavListeners(); }
								if (this.domEventMap) {
												var el, elements;
												for (var cls in this.domEventMap) {
																if (YAHOO.lang.hasOwnProperty(this.domEventMap, cls)) {
																				var items = this.domEventMap[cls];
																				if (!(items instanceof Array)) { items = [items]; }
																				for (var i = 0; i < items.length; i++) {
																								var item = items[i];
																								elements = YAHOO.util.Dom.getElementsByClassName(cls, item.tag, this.oDomContainer);
																								for (var c = 0; c < elements.length; c++) {
																												el = elements[c];
																												YAHOO.util.Event.addListener(el, item.event, item.handler, item.scope, item.correct);
																								}
																				}
																}
												}
								}
								YAHOO.util.Event.addListener(this.oDomContainer, "click", this.doSelectCell, this);
								YAHOO.util.Event.addListener(this.oDomContainer, "mouseover", this.doCellMouseOver, this);
								YAHOO.util.Event.addListener(this.oDomContainer, "mouseout", this.doCellMouseOut, this);
				},
				applyNavListeners: function() {
								var E = YAHOO.util.Event;
								var calParent = this.parent || this;
								var cal = this;
								var navBtns = YAHOO.util.Dom.getElementsByClassName(this.Style.CSS_NAV, "a", this.oDomContainer);
								if (navBtns.length > 0) {
												function show(e, obj) {
																var target = E.getTarget(e);
																if (this === target || YAHOO.util.Dom.isAncestor(this, target)) { E.preventDefault(e); }
																var navigator = calParent.oNavigator;
																if (navigator) {
																				var pgdate = cal.cfg.getProperty("pagedate");
																				navigator.setYear(pgdate.getFullYear());
																				navigator.setMonth(pgdate.getMonth());
																				navigator.show();
																}
												}
												E.addListener(navBtns, "click", show);
								}
				},
				getDateByCellId: function(id) { var date = this.getDateFieldsByCellId(id); return YAHOO.widget.DateMath.getDate(date[0], date[1] - 1, date[2]); },
				getDateFieldsByCellId: function(id) {
								id = id.toLowerCase().split("_cell")[1];
								id = parseInt(id, 10);
								return this.cellDates[id];
				},
				getCellIndex: function(date) {
								var idx = -1;
								if (date) {
												var m = date.getMonth(),
																y = date.getFullYear(),
																d = date.getDate(),
																dates = this.cellDates;
												for (var i = 0; i < dates.length; ++i) { var cellDate = dates[i]; if (cellDate[0] === y && cellDate[1] === m + 1 && cellDate[2] === d) { idx = i; break; } }
								}
								return idx;
				},
				renderOutOfBoundsDate: function(workingDate, cell) {
								YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_OOB);
								cell.innerHTML = workingDate.getDate();
								return YAHOO.widget.Calendar.STOP_RENDER;
				},
				renderRowHeader: function(weekNum, html) { html[html.length] = '<th class="calrowhead">' + weekNum + '</th>'; return html; },
				renderRowFooter: function(weekNum, html) { html[html.length] = '<th class="calrowfoot">' + weekNum + '</th>'; return html; },
				renderCellDefault: function(workingDate, cell) { cell.innerHTML = '<a href="#" class="' + this.Style.CSS_CELL_SELECTOR + '">' + this.buildDayLabel(workingDate) + "</a>"; },
				styleCellDefault: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_SELECTABLE); },
				renderCellStyleHighlight1: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT1); },
				renderCellStyleHighlight2: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT2); },
				renderCellStyleHighlight3: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT3); },
				renderCellStyleHighlight4: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT4); },
				renderCellStyleToday: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_TODAY); },
				renderCellStyleSelected: function(workingDate, cell) { YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_SELECTED); },
				renderCellNotThisMonth: function(workingDate, cell) {
								YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_OOM);
								cell.innerHTML = workingDate.getDate();
								return YAHOO.widget.Calendar.STOP_RENDER;
				},
				renderBodyCellRestricted: function(workingDate, cell) {
								YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL);
								YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_RESTRICTED);
								cell.innerHTML = workingDate.getDate();
								return YAHOO.widget.Calendar.STOP_RENDER;
				},
				addMonths: function(count) {
								var cfgPageDate = YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key;
								this.cfg.setProperty(cfgPageDate, YAHOO.widget.DateMath.add(this.cfg.getProperty(cfgPageDate), YAHOO.widget.DateMath.MONTH, count));
								this.resetRenderers();
								this.changePageEvent.fire();
				},
				subtractMonths: function(count) {
								var cfgPageDate = YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key;
								this.cfg.setProperty(cfgPageDate, YAHOO.widget.DateMath.subtract(this.cfg.getProperty(cfgPageDate), YAHOO.widget.DateMath.MONTH, count));
								this.resetRenderers();
								this.changePageEvent.fire();
				},
				addYears: function(count) {
								var cfgPageDate = YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key;
								this.cfg.setProperty(cfgPageDate, YAHOO.widget.DateMath.add(this.cfg.getProperty(cfgPageDate), YAHOO.widget.DateMath.YEAR, count));
								this.resetRenderers();
								this.changePageEvent.fire();
				},
				subtractYears: function(count) {
								var cfgPageDate = YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key;
								this.cfg.setProperty(cfgPageDate, YAHOO.widget.DateMath.subtract(this.cfg.getProperty(cfgPageDate), YAHOO.widget.DateMath.YEAR, count));
								this.resetRenderers();
								this.changePageEvent.fire();
				},
				nextMonth: function() { this.addMonths(1); },
				previousMonth: function() { this.subtractMonths(1); },
				nextYear: function() { this.addYears(1); },
				previousYear: function() { this.subtractYears(1); },
				reset: function() {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								this.cfg.resetProperty(defCfg.SELECTED.key);
								this.cfg.resetProperty(defCfg.PAGEDATE.key);
								this.resetEvent.fire();
				},
				clear: function() {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								this.cfg.setProperty(defCfg.SELECTED.key, []);
								this.cfg.setProperty(defCfg.PAGEDATE.key, new Date(this.today.getTime()));
								this.clearEvent.fire();
				},
				select: function(date) {
								var aToBeSelected = this._toFieldArray(date);
								var validDates = [];
								var selected = [];
								var cfgSelected = YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key;
								for (var a = 0; a < aToBeSelected.length; ++a) {
												var toSelect = aToBeSelected[a];
												if (!this.isDateOOB(this._toDate(toSelect))) {
																if (validDates.length === 0) {
																				this.beforeSelectEvent.fire();
																				selected = this.cfg.getProperty(cfgSelected);
																}
																validDates.push(toSelect);
																if (this._indexOfSelectedFieldArray(toSelect) == -1) { selected[selected.length] = toSelect; }
												}
								}
								if (validDates.length > 0) {
												if (this.parent) { this.parent.cfg.setProperty(cfgSelected, selected); } else { this.cfg.setProperty(cfgSelected, selected); }
												this.selectEvent.fire(validDates);
								}
								return this.getSelectedDates();
				},
				selectCell: function(cellIndex) {
								var cell = this.cells[cellIndex];
								var cellDate = this.cellDates[cellIndex];
								var dCellDate = this._toDate(cellDate);
								var selectable = YAHOO.util.Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);
								if (selectable) {
												this.beforeSelectEvent.fire();
												var cfgSelected = YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key;
												var selected = this.cfg.getProperty(cfgSelected);
												var selectDate = cellDate.concat();
												if (this._indexOfSelectedFieldArray(selectDate) == -1) { selected[selected.length] = selectDate; }
												if (this.parent) { this.parent.cfg.setProperty(cfgSelected, selected); } else { this.cfg.setProperty(cfgSelected, selected); }
												this.renderCellStyleSelected(dCellDate, cell);
												this.selectEvent.fire([selectDate]);
												this.doCellMouseOut.call(cell, null, this);
								}
								return this.getSelectedDates();
				},
				deselect: function(date) {
								var aToBeDeselected = this._toFieldArray(date);
								var validDates = [];
								var selected = [];
								var cfgSelected = YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key;
								for (var a = 0; a < aToBeDeselected.length; ++a) {
												var toDeselect = aToBeDeselected[a];
												if (!this.isDateOOB(this._toDate(toDeselect))) {
																if (validDates.length === 0) {
																				this.beforeDeselectEvent.fire();
																				selected = this.cfg.getProperty(cfgSelected);
																}
																validDates.push(toDeselect);
																var index = this._indexOfSelectedFieldArray(toDeselect);
																if (index != -1) { selected.splice(index, 1); }
												}
								}
								if (validDates.length > 0) {
												if (this.parent) { this.parent.cfg.setProperty(cfgSelected, selected); } else { this.cfg.setProperty(cfgSelected, selected); }
												this.deselectEvent.fire(validDates);
								}
								return this.getSelectedDates();
				},
				deselectCell: function(cellIndex) {
								var cell = this.cells[cellIndex];
								var cellDate = this.cellDates[cellIndex];
								var cellDateIndex = this._indexOfSelectedFieldArray(cellDate);
								var selectable = YAHOO.util.Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);
								if (selectable) {
												this.beforeDeselectEvent.fire();
												var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
												var selected = this.cfg.getProperty(defCfg.SELECTED.key);
												var dCellDate = this._toDate(cellDate);
												var selectDate = cellDate.concat();
												if (cellDateIndex > -1) {
																if (this.cfg.getProperty(defCfg.PAGEDATE.key).getMonth() == dCellDate.getMonth() && this.cfg.getProperty(defCfg.PAGEDATE.key).getFullYear() == dCellDate.getFullYear()) { YAHOO.util.Dom.removeClass(cell, this.Style.CSS_CELL_SELECTED); }
																selected.splice(cellDateIndex, 1);
												}
												if (this.parent) { this.parent.cfg.setProperty(defCfg.SELECTED.key, selected); } else { this.cfg.setProperty(defCfg.SELECTED.key, selected); }
												this.deselectEvent.fire(selectDate);
								}
								return this.getSelectedDates();
				},
				deselectAll: function() {
								this.beforeDeselectEvent.fire();
								var cfgSelected = YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key;
								var selected = this.cfg.getProperty(cfgSelected);
								var count = selected.length;
								var sel = selected.concat();
								if (this.parent) { this.parent.cfg.setProperty(cfgSelected, []); } else { this.cfg.setProperty(cfgSelected, []); }
								if (count > 0) { this.deselectEvent.fire(sel); }
								return this.getSelectedDates();
				},
				_toFieldArray: function(date) {
								var returnDate = [];
								if (date instanceof Date) {
												returnDate = [
																[date.getFullYear(), date.getMonth() + 1, date.getDate()]
												];
								} else if (YAHOO.lang.isString(date)) { returnDate = this._parseDates(date); } else if (YAHOO.lang.isArray(date)) {
												for (var i = 0; i < date.length; ++i) {
																var d = date[i];
																returnDate[returnDate.length] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
												}
								}
								return returnDate;
				},
				toDate: function(dateFieldArray) { return this._toDate(dateFieldArray); },
				_toDate: function(dateFieldArray) { if (dateFieldArray instanceof Date) { return dateFieldArray; } else { return YAHOO.widget.DateMath.getDate(dateFieldArray[0], dateFieldArray[1] - 1, dateFieldArray[2]); } },
				_fieldArraysAreEqual: function(array1, array2) {
								var match = false;
								if (array1[0] == array2[0] && array1[1] == array2[1] && array1[2] == array2[2]) { match = true; }
								return match;
				},
				_indexOfSelectedFieldArray: function(find) {
								var selected = -1;
								var seldates = this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key);
								for (var s = 0; s < seldates.length; ++s) { var sArray = seldates[s]; if (find[0] == sArray[0] && find[1] == sArray[1] && find[2] == sArray[2]) { selected = s; break; } }
								return selected;
				},
				isDateOOM: function(date) { return (date.getMonth() != this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key).getMonth()); },
				isDateOOB: function(date) {
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								var minDate = this.cfg.getProperty(defCfg.MINDATE.key);
								var maxDate = this.cfg.getProperty(defCfg.MAXDATE.key);
								var dm = YAHOO.widget.DateMath;
								if (minDate) { minDate = dm.clearTime(minDate); }
								if (maxDate) { maxDate = dm.clearTime(maxDate); }
								var clearedDate = new Date(date.getTime());
								clearedDate = dm.clearTime(clearedDate);
								return ((minDate && clearedDate.getTime() < minDate.getTime()) || (maxDate && clearedDate.getTime() > maxDate.getTime()));
				},
				_parsePageDate: function(date) {
								var parsedDate;
								var defCfg = YAHOO.widget.Calendar._DEFAULT_CONFIG;
								if (date) {
												if (date instanceof Date) { parsedDate = YAHOO.widget.DateMath.findMonthStart(date); } else {
																var month, year, aMonthYear;
																aMonthYear = date.split(this.cfg.getProperty(defCfg.DATE_FIELD_DELIMITER.key));
																month = parseInt(aMonthYear[this.cfg.getProperty(defCfg.MY_MONTH_POSITION.key) - 1], 10) - 1;
																year = parseInt(aMonthYear[this.cfg.getProperty(defCfg.MY_YEAR_POSITION.key) - 1], 10);
																parsedDate = YAHOO.widget.DateMath.getDate(year, month, 1);
												}
								} else { parsedDate = YAHOO.widget.DateMath.getDate(this.today.getFullYear(), this.today.getMonth(), 1); }
								return parsedDate;
				},
				onBeforeSelect: function() {
								if (this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.MULTI_SELECT.key) === false) {
												if (this.parent) {
																this.parent.callChildFunction("clearAllBodyCellStyles", this.Style.CSS_CELL_SELECTED);
																this.parent.deselectAll();
												} else {
																this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED);
																this.deselectAll();
												}
								}
				},
				onSelect: function(selected) {},
				onBeforeDeselect: function() {},
				onDeselect: function(deselected) {},
				onChangePage: function() { this.render(); },
				onRender: function() {},
				onReset: function() { this.render(); },
				onClear: function() { this.render(); },
				validate: function() { return true; },
				_parseDate: function(sDate) {
								var aDate = sDate.split(this.Locale.DATE_FIELD_DELIMITER);
								var rArray;
								if (aDate.length == 2) {
												rArray = [aDate[this.Locale.MD_MONTH_POSITION - 1], aDate[this.Locale.MD_DAY_POSITION - 1]];
												rArray.type = YAHOO.widget.Calendar.MONTH_DAY;
								} else {
												rArray = [aDate[this.Locale.MDY_YEAR_POSITION - 1], aDate[this.Locale.MDY_MONTH_POSITION - 1], aDate[this.Locale.MDY_DAY_POSITION - 1]];
												rArray.type = YAHOO.widget.Calendar.DATE;
								}
								for (var i = 0; i < rArray.length; i++) { rArray[i] = parseInt(rArray[i], 10); }
								return rArray;
				},
				_parseDates: function(sDates) {
								var aReturn = [];
								var aDates = sDates.split(this.Locale.DATE_DELIMITER);
								for (var d = 0; d < aDates.length; ++d) {
												var sDate = aDates[d];
												if (sDate.indexOf(this.Locale.DATE_RANGE_DELIMITER) != -1) {
																var aRange = sDate.split(this.Locale.DATE_RANGE_DELIMITER);
																var dateStart = this._parseDate(aRange[0]);
																var dateEnd = this._parseDate(aRange[1]);
																var fullRange = this._parseRange(dateStart, dateEnd);
																aReturn = aReturn.concat(fullRange);
												} else {
																var aDate = this._parseDate(sDate);
																aReturn.push(aDate);
												}
								}
								return aReturn;
				},
				_parseRange: function(startDate, endDate) {
								var dCurrent = YAHOO.widget.DateMath.add(YAHOO.widget.DateMath.getDate(startDate[0], startDate[1] - 1, startDate[2]), YAHOO.widget.DateMath.DAY, 1);
								var dEnd = YAHOO.widget.DateMath.getDate(endDate[0], endDate[1] - 1, endDate[2]);
								var results = [];
								results.push(startDate);
								while (dCurrent.getTime() <= dEnd.getTime()) {
												results.push([dCurrent.getFullYear(), dCurrent.getMonth() + 1, dCurrent.getDate()]);
												dCurrent = YAHOO.widget.DateMath.add(dCurrent, YAHOO.widget.DateMath.DAY, 1);
								}
								return results;
				},
				resetRenderers: function() { this.renderStack = this._renderStack.concat(); },
				removeRenderers: function() {
								this._renderStack = [];
								this.renderStack = [];
				},
				clearElement: function(cell) {
								cell.innerHTML = "&#160;";
								cell.className = "";
				},
				addRenderer: function(sDates, fnRender) { var aDates = this._parseDates(sDates); for (var i = 0; i < aDates.length; ++i) { var aDate = aDates[i]; if (aDate.length == 2) { if (aDate[0] instanceof Array) { this._addRenderer(YAHOO.widget.Calendar.RANGE, aDate, fnRender); } else { this._addRenderer(YAHOO.widget.Calendar.MONTH_DAY, aDate, fnRender); } } else if (aDate.length == 3) { this._addRenderer(YAHOO.widget.Calendar.DATE, aDate, fnRender); } } },
				_addRenderer: function(type, aDates, fnRender) {
								var add = [type, aDates, fnRender];
								this.renderStack.unshift(add);
								this._renderStack = this.renderStack.concat();
				},
				addMonthRenderer: function(month, fnRender) { this._addRenderer(YAHOO.widget.Calendar.MONTH, [month], fnRender); },
				addWeekdayRenderer: function(weekday, fnRender) { this._addRenderer(YAHOO.widget.Calendar.WEEKDAY, [weekday], fnRender); },
				clearAllBodyCellStyles: function(style) { for (var c = 0; c < this.cells.length; ++c) { YAHOO.util.Dom.removeClass(this.cells[c], style); } },
				setMonth: function(month) {
								var cfgPageDate = YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key;
								var current = this.cfg.getProperty(cfgPageDate);
								current.setMonth(parseInt(month, 10));
								this.cfg.setProperty(cfgPageDate, current);
				},
				setYear: function(year) {
								var cfgPageDate = YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key;
								var current = this.cfg.getProperty(cfgPageDate);
								current.setFullYear(parseInt(year, 10));
								this.cfg.setProperty(cfgPageDate, current);
				},
				getSelectedDates: function() {
								var returnDates = [];
								var selected = this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.SELECTED.key);
								for (var d = 0; d < selected.length; ++d) {
												var dateArray = selected[d];
												var date = YAHOO.widget.DateMath.getDate(dateArray[0], dateArray[1] - 1, dateArray[2]);
												returnDates.push(date);
								}
								returnDates.sort(function(a, b) { return a - b; });
								return returnDates;
				},
				hide: function() {
								if (this.beforeHideEvent.fire()) {
												this.oDomContainer.style.display = "none";
												this.hideEvent.fire();
								}
				},
				show: function() {
								if (this.beforeShowEvent.fire()) {
												this.oDomContainer.style.display = "block";
												this.showEvent.fire();
								}
				},
				browser: (function() { var ua = navigator.userAgent.toLowerCase(); if (ua.indexOf('opera') != -1) { return 'opera'; } else if (ua.indexOf('msie 7') != -1) { return 'ie7'; } else if (ua.indexOf('msie') != -1) { return 'ie'; } else if (ua.indexOf('safari') != -1) { return 'safari'; } else if (ua.indexOf('gecko') != -1) { return 'gecko'; } else { return false; } })(),
				toString: function() { return "Calendar " + this.id; }
};
YAHOO.widget.Calendar_Core = YAHOO.widget.Calendar;
YAHOO.widget.Cal_Core = YAHOO.widget.Calendar;
YAHOO.widget.CalendarGroup = function(id, containerId, config) { if (arguments.length > 0) { this.init.apply(this, arguments); } };
YAHOO.widget.CalendarGroup.prototype = {
				init: function(id, container, config) {
								var nArgs = this._parseArgs(arguments);
								id = nArgs.id;
								container = nArgs.container;
								config = nArgs.config;
								this.oDomContainer = YAHOO.util.Dom.get(container);
								if (!this.oDomContainer.id) { this.oDomContainer.id = YAHOO.util.Dom.generateId(); }
								if (!id) { id = this.oDomContainer.id + "_t"; }
								this.id = id;
								this.containerId = this.oDomContainer.id;
								this.initEvents();
								this.initStyles();
								this.pages = [];
								YAHOO.util.Dom.addClass(this.oDomContainer, YAHOO.widget.CalendarGroup.CSS_CONTAINER);
								YAHOO.util.Dom.addClass(this.oDomContainer, YAHOO.widget.CalendarGroup.CSS_MULTI_UP);
								this.cfg = new YAHOO.util.Config(this);
								this.Options = {};
								this.Locale = {};
								this.setupConfig();
								if (config) { this.cfg.applyConfig(config, true); }
								this.cfg.fireQueue();
								if (YAHOO.env.ua.opera) {
												this.renderEvent.subscribe(this._fixWidth, this, true);
												this.showEvent.subscribe(this._fixWidth, this, true);
								}
				},
				setupConfig: function() {
								var defCfg = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG;
								this.cfg.addProperty(defCfg.PAGES.key, { value: defCfg.PAGES.value, validator: this.cfg.checkNumber, handler: this.configPages });
								this.cfg.addProperty(defCfg.PAGEDATE.key, { value: new Date(), handler: this.configPageDate });
								this.cfg.addProperty(defCfg.SELECTED.key, { value: [], handler: this.configSelected });
								this.cfg.addProperty(defCfg.TITLE.key, { value: defCfg.TITLE.value, handler: this.configTitle });
								this.cfg.addProperty(defCfg.CLOSE.key, { value: defCfg.CLOSE.value, handler: this.configClose });
								this.cfg.addProperty(defCfg.IFRAME.key, { value: defCfg.IFRAME.value, handler: this.configIframe, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.MINDATE.key, { value: defCfg.MINDATE.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.MAXDATE.key, { value: defCfg.MAXDATE.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.MULTI_SELECT.key, { value: defCfg.MULTI_SELECT.value, handler: this.delegateConfig, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.START_WEEKDAY.key, { value: defCfg.START_WEEKDAY.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.SHOW_WEEKDAYS.key, { value: defCfg.SHOW_WEEKDAYS.value, handler: this.delegateConfig, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.SHOW_WEEK_HEADER.key, { value: defCfg.SHOW_WEEK_HEADER.value, handler: this.delegateConfig, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.SHOW_WEEK_FOOTER.key, { value: defCfg.SHOW_WEEK_FOOTER.value, handler: this.delegateConfig, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.HIDE_BLANK_WEEKS.key, { value: defCfg.HIDE_BLANK_WEEKS.value, handler: this.delegateConfig, validator: this.cfg.checkBoolean });
								this.cfg.addProperty(defCfg.NAV_ARROW_LEFT.key, { value: defCfg.NAV_ARROW_LEFT.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.NAV_ARROW_RIGHT.key, { value: defCfg.NAV_ARROW_RIGHT.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.MONTHS_SHORT.key, { value: defCfg.MONTHS_SHORT.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.MONTHS_LONG.key, { value: defCfg.MONTHS_LONG.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.WEEKDAYS_1CHAR.key, { value: defCfg.WEEKDAYS_1CHAR.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.WEEKDAYS_SHORT.key, { value: defCfg.WEEKDAYS_SHORT.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.WEEKDAYS_MEDIUM.key, { value: defCfg.WEEKDAYS_MEDIUM.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.WEEKDAYS_LONG.key, { value: defCfg.WEEKDAYS_LONG.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.LOCALE_MONTHS.key, { value: defCfg.LOCALE_MONTHS.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.LOCALE_WEEKDAYS.key, { value: defCfg.LOCALE_WEEKDAYS.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.DATE_DELIMITER.key, { value: defCfg.DATE_DELIMITER.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.DATE_FIELD_DELIMITER.key, { value: defCfg.DATE_FIELD_DELIMITER.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.DATE_RANGE_DELIMITER.key, { value: defCfg.DATE_RANGE_DELIMITER.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.MY_MONTH_POSITION.key, { value: defCfg.MY_MONTH_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_YEAR_POSITION.key, { value: defCfg.MY_YEAR_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MD_MONTH_POSITION.key, { value: defCfg.MD_MONTH_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MD_DAY_POSITION.key, { value: defCfg.MD_DAY_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MDY_MONTH_POSITION.key, { value: defCfg.MDY_MONTH_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MDY_DAY_POSITION.key, { value: defCfg.MDY_DAY_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MDY_YEAR_POSITION.key, { value: defCfg.MDY_YEAR_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_LABEL_MONTH_POSITION.key, { value: defCfg.MY_LABEL_MONTH_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_LABEL_YEAR_POSITION.key, { value: defCfg.MY_LABEL_YEAR_POSITION.value, handler: this.delegateConfig, validator: this.cfg.checkNumber });
								this.cfg.addProperty(defCfg.MY_LABEL_MONTH_SUFFIX.key, { value: defCfg.MY_LABEL_MONTH_SUFFIX.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.MY_LABEL_YEAR_SUFFIX.key, { value: defCfg.MY_LABEL_YEAR_SUFFIX.value, handler: this.delegateConfig });
								this.cfg.addProperty(defCfg.NAV.key, { value: defCfg.NAV.value, handler: this.configNavigator });
				},
				initEvents: function() {
								var me = this;
								var strEvent = "Event";
								var sub = function(fn, obj, bOverride) {
												for (var p = 0; p < me.pages.length; ++p) {
																var cal = me.pages[p];
																cal[this.type + strEvent].subscribe(fn, obj, bOverride);
												}
								};
								var unsub = function(fn, obj) {
												for (var p = 0; p < me.pages.length; ++p) {
																var cal = me.pages[p];
																cal[this.type + strEvent].unsubscribe(fn, obj);
												}
								};
								var defEvents = YAHOO.widget.Calendar._EVENT_TYPES;
								this.beforeSelectEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SELECT);
								this.beforeSelectEvent.subscribe = sub;
								this.beforeSelectEvent.unsubscribe = unsub;
								this.selectEvent = new YAHOO.util.CustomEvent(defEvents.SELECT);
								this.selectEvent.subscribe = sub;
								this.selectEvent.unsubscribe = unsub;
								this.beforeDeselectEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_DESELECT);
								this.beforeDeselectEvent.subscribe = sub;
								this.beforeDeselectEvent.unsubscribe = unsub;
								this.deselectEvent = new YAHOO.util.CustomEvent(defEvents.DESELECT);
								this.deselectEvent.subscribe = sub;
								this.deselectEvent.unsubscribe = unsub;
								this.changePageEvent = new YAHOO.util.CustomEvent(defEvents.CHANGE_PAGE);
								this.changePageEvent.subscribe = sub;
								this.changePageEvent.unsubscribe = unsub;
								this.beforeRenderEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_RENDER);
								this.beforeRenderEvent.subscribe = sub;
								this.beforeRenderEvent.unsubscribe = unsub;
								this.renderEvent = new YAHOO.util.CustomEvent(defEvents.RENDER);
								this.renderEvent.subscribe = sub;
								this.renderEvent.unsubscribe = unsub;
								this.resetEvent = new YAHOO.util.CustomEvent(defEvents.RESET);
								this.resetEvent.subscribe = sub;
								this.resetEvent.unsubscribe = unsub;
								this.clearEvent = new YAHOO.util.CustomEvent(defEvents.CLEAR);
								this.clearEvent.subscribe = sub;
								this.clearEvent.unsubscribe = unsub;
								this.beforeShowEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SHOW);
								this.showEvent = new YAHOO.util.CustomEvent(defEvents.SHOW);
								this.beforeHideEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_HIDE);
								this.hideEvent = new YAHOO.util.CustomEvent(defEvents.HIDE);
								this.beforeShowNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_SHOW_NAV);
								this.showNavEvent = new YAHOO.util.CustomEvent(defEvents.SHOW_NAV);
								this.beforeHideNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_HIDE_NAV);
								this.hideNavEvent = new YAHOO.util.CustomEvent(defEvents.HIDE_NAV);
								this.beforeRenderNavEvent = new YAHOO.util.CustomEvent(defEvents.BEFORE_RENDER_NAV);
								this.renderNavEvent = new YAHOO.util.CustomEvent(defEvents.RENDER_NAV);
				},
				configPages: function(type, args, obj) {
								var pageCount = args[0];
								var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
								var sep = "_";
								var groupCalClass = "groupcal";
								var firstClass = "first-of-type";
								var lastClass = "last-of-type";
								for (var p = 0; p < pageCount; ++p) {
												var calId = this.id + sep + p;
												var calContainerId = this.containerId + sep + p;
												var childConfig = this.cfg.getConfig();
												childConfig.close = false;
												childConfig.title = false;
												childConfig.navigator = null;
												var cal = this.constructChild(calId, calContainerId, childConfig);
												var caldate = cal.cfg.getProperty(cfgPageDate);
												this._setMonthOnDate(caldate, caldate.getMonth() + p);
												cal.cfg.setProperty(cfgPageDate, caldate);
												YAHOO.util.Dom.removeClass(cal.oDomContainer, this.Style.CSS_SINGLE);
												YAHOO.util.Dom.addClass(cal.oDomContainer, groupCalClass);
												if (p === 0) { YAHOO.util.Dom.addClass(cal.oDomContainer, firstClass); }
												if (p == (pageCount - 1)) { YAHOO.util.Dom.addClass(cal.oDomContainer, lastClass); }
												cal.parent = this;
												cal.index = p;
												this.pages[this.pages.length] = cal;
								}
				},
				configPageDate: function(type, args, obj) {
								var val = args[0];
								var firstPageDate;
								var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												if (p === 0) {
																firstPageDate = cal._parsePageDate(val);
																cal.cfg.setProperty(cfgPageDate, firstPageDate);
												} else {
																var pageDate = new Date(firstPageDate);
																this._setMonthOnDate(pageDate, pageDate.getMonth() + p);
																cal.cfg.setProperty(cfgPageDate, pageDate);
												}
								}
				},
				configSelected: function(type, args, obj) {
								var cfgSelected = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.SELECTED.key;
								this.delegateConfig(type, args, obj);
								var selected = (this.pages.length > 0) ? this.pages[0].cfg.getProperty(cfgSelected) : [];
								this.cfg.setProperty(cfgSelected, selected, true);
				},
				delegateConfig: function(type, args, obj) {
								var val = args[0];
								var cal;
								for (var p = 0; p < this.pages.length; p++) {
												cal = this.pages[p];
												cal.cfg.setProperty(type, val);
								}
				},
				setChildFunction: function(fnName, fn) { var pageCount = this.cfg.getProperty(YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGES.key); for (var p = 0; p < pageCount; ++p) { this.pages[p][fnName] = fn; } },
				callChildFunction: function(fnName, args) {
								var pageCount = this.cfg.getProperty(YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGES.key);
								for (var p = 0; p < pageCount; ++p) {
												var page = this.pages[p];
												if (page[fnName]) {
																var fn = page[fnName];
																fn.call(page, args);
												}
								}
				},
				constructChild: function(id, containerId, config) {
								var container = document.getElementById(containerId);
								if (!container) {
												container = document.createElement("div");
												container.id = containerId;
												this.oDomContainer.appendChild(container);
								}
								return new YAHOO.widget.Calendar(id, containerId, config);
				},
				setMonth: function(month) {
								month = parseInt(month, 10);
								var currYear;
								var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												var pageDate = cal.cfg.getProperty(cfgPageDate);
												if (p === 0) { currYear = pageDate.getFullYear(); } else { pageDate.setFullYear(currYear); }
												this._setMonthOnDate(pageDate, month + p);
												cal.cfg.setProperty(cfgPageDate, pageDate);
								}
				},
				setYear: function(year) {
								var cfgPageDate = YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGEDATE.key;
								year = parseInt(year, 10);
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												var pageDate = cal.cfg.getProperty(cfgPageDate);
												if ((pageDate.getMonth() + 1) == 1 && p > 0) { year += 1; }
												cal.setYear(year);
								}
				},
				render: function() {
								this.renderHeader();
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.render();
								}
								this.renderFooter();
				},
				select: function(date) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.select(date);
								}
								return this.getSelectedDates();
				},
				selectCell: function(cellIndex) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.selectCell(cellIndex);
								}
								return this.getSelectedDates();
				},
				deselect: function(date) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.deselect(date);
								}
								return this.getSelectedDates();
				},
				deselectAll: function() {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.deselectAll();
								}
								return this.getSelectedDates();
				},
				deselectCell: function(cellIndex) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.deselectCell(cellIndex);
								}
								return this.getSelectedDates();
				},
				reset: function() {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.reset();
								}
				},
				clear: function() {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.clear();
								}
				},
				nextMonth: function() {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.nextMonth();
								}
				},
				previousMonth: function() {
								for (var p = this.pages.length - 1; p >= 0; --p) {
												var cal = this.pages[p];
												cal.previousMonth();
								}
				},
				nextYear: function() {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.nextYear();
								}
				},
				previousYear: function() {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.previousYear();
								}
				},
				getSelectedDates: function() {
								var returnDates = [];
								var selected = this.cfg.getProperty(YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.SELECTED.key);
								for (var d = 0; d < selected.length; ++d) {
												var dateArray = selected[d];
												var date = YAHOO.widget.DateMath.getDate(dateArray[0], dateArray[1] - 1, dateArray[2]);
												returnDates.push(date);
								}
								returnDates.sort(function(a, b) { return a - b; });
								return returnDates;
				},
				addRenderer: function(sDates, fnRender) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.addRenderer(sDates, fnRender);
								}
				},
				addMonthRenderer: function(month, fnRender) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.addMonthRenderer(month, fnRender);
								}
				},
				addWeekdayRenderer: function(weekday, fnRender) {
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												cal.addWeekdayRenderer(weekday, fnRender);
								}
				},
				removeRenderers: function() { this.callChildFunction("removeRenderers"); },
				renderHeader: function() {},
				renderFooter: function() {},
				addMonths: function(count) { this.callChildFunction("addMonths", count); },
				subtractMonths: function(count) { this.callChildFunction("subtractMonths", count); },
				addYears: function(count) { this.callChildFunction("addYears", count); },
				subtractYears: function(count) { this.callChildFunction("subtractYears", count); },
				getCalendarPage: function(date) {
								var cal = null;
								if (date) {
												var y = date.getFullYear(),
																m = date.getMonth();
												var pages = this.pages;
												for (var i = 0; i < pages.length; ++i) { var pageDate = pages[i].cfg.getProperty("pagedate"); if (pageDate.getFullYear() === y && pageDate.getMonth() === m) { cal = pages[i]; break; } }
								}
								return cal;
				},
				_setMonthOnDate: function(date, iMonth) {
								if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420 && (iMonth < 0 || iMonth > 11)) {
												var DM = YAHOO.widget.DateMath;
												var newDate = DM.add(date, DM.MONTH, iMonth - date.getMonth());
												date.setTime(newDate.getTime());
								} else { date.setMonth(iMonth); }
				},
				_fixWidth: function() {
								var w = 0;
								for (var p = 0; p < this.pages.length; ++p) {
												var cal = this.pages[p];
												w += cal.oDomContainer.offsetWidth;
								}
								if (w > 0) { this.oDomContainer.style.width = w + "px"; }
				},
				toString: function() { return "CalendarGroup " + this.id; }
};
YAHOO.widget.CalendarGroup.CSS_CONTAINER = "yui-calcontainer";
YAHOO.widget.CalendarGroup.CSS_MULTI_UP = "multi";
YAHOO.widget.CalendarGroup.CSS_2UPTITLE = "title";
YAHOO.widget.CalendarGroup.CSS_2UPCLOSE = "close-icon";
YAHOO.lang.augmentProto(YAHOO.widget.CalendarGroup, YAHOO.widget.Calendar, "buildDayLabel", "buildMonthLabel", "renderOutOfBoundsDate", "renderRowHeader", "renderRowFooter", "renderCellDefault", "styleCellDefault", "renderCellStyleHighlight1", "renderCellStyleHighlight2", "renderCellStyleHighlight3", "renderCellStyleHighlight4", "renderCellStyleToday", "renderCellStyleSelected", "renderCellNotThisMonth", "renderBodyCellRestricted", "initStyles", "configTitle", "configClose", "configIframe", "configNavigator", "createTitleBar", "createCloseButton", "removeTitleBar", "removeCloseButton", "hide", "show", "toDate", "_toDate", "_parseArgs", "browser");
YAHOO.widget.CalendarGroup._DEFAULT_CONFIG = YAHOO.widget.Calendar._DEFAULT_CONFIG;
YAHOO.widget.CalendarGroup._DEFAULT_CONFIG.PAGES = { key: "pages", value: 2 };
YAHOO.widget.CalGrp = YAHOO.widget.CalendarGroup;
YAHOO.widget.Calendar2up = function(id, containerId, config) { this.init(id, containerId, config); };
YAHOO.extend(YAHOO.widget.Calendar2up, YAHOO.widget.CalendarGroup);
YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up;
YAHOO.widget.CalendarNavigator = function(cal) { this.init(cal); };
(function() {
				var CN = YAHOO.widget.CalendarNavigator;
				CN.CLASSES = { NAV: "yui-cal-nav", NAV_VISIBLE: "yui-cal-nav-visible", MASK: "yui-cal-nav-mask", YEAR: "yui-cal-nav-y", MONTH: "yui-cal-nav-m", BUTTONS: "yui-cal-nav-b", BUTTON: "yui-cal-nav-btn", ERROR: "yui-cal-nav-e", YEAR_CTRL: "yui-cal-nav-yc", MONTH_CTRL: "yui-cal-nav-mc", INVALID: "yui-invalid", DEFAULT: "yui-default" };
				CN._DEFAULT_CFG = { strings: { month: "Month", year: "Year", submit: "Okay", cancel: "Cancel", invalidYear: "Year needs to be a number" }, monthFormat: YAHOO.widget.Calendar.LONG, initialFocus: "year" };
				CN.ID_SUFFIX = "_nav";
				CN.MONTH_SUFFIX = "_month";
				CN.YEAR_SUFFIX = "_year";
				CN.ERROR_SUFFIX = "_error";
				CN.CANCEL_SUFFIX = "_cancel";
				CN.SUBMIT_SUFFIX = "_submit";
				CN.YR_MAX_DIGITS = 4;
				CN.YR_MINOR_INC = 1;
				CN.YR_MAJOR_INC = 10;
				CN.UPDATE_DELAY = 50;
				CN.YR_PATTERN = /^\d+$/;
				CN.TRIM = /^\s*(.*?)\s*$/;
})();
YAHOO.widget.CalendarNavigator.prototype = {
				id: null,
				cal: null,
				navEl: null,
				maskEl: null,
				yearEl: null,
				monthEl: null,
				errorEl: null,
				submitEl: null,
				cancelEl: null,
				firstCtrl: null,
				lastCtrl: null,
				_doc: null,
				_year: null,
				_month: 0,
				__rendered: false,
				init: function(cal) {
								var calBox = cal.oDomContainer;
								this.cal = cal;
								this.id = calBox.id + YAHOO.widget.CalendarNavigator.ID_SUFFIX;
								this._doc = calBox.ownerDocument;
								var ie = YAHOO.env.ua.ie;
								this.__isIEQuirks = (ie && ((ie <= 6) || (ie === 7 && this._doc.compatMode == "BackCompat")));
				},
				show: function() {
								var CLASSES = YAHOO.widget.CalendarNavigator.CLASSES;
								if (this.cal.beforeShowNavEvent.fire()) {
												if (!this.__rendered) { this.render(); }
												this.clearErrors();
												this._updateMonthUI();
												this._updateYearUI();
												this._show(this.navEl, true);
												this.setInitialFocus();
												this.showMask();
												YAHOO.util.Dom.addClass(this.cal.oDomContainer, CLASSES.NAV_VISIBLE);
												this.cal.showNavEvent.fire();
								}
				},
				hide: function() {
								var CLASSES = YAHOO.widget.CalendarNavigator.CLASSES;
								if (this.cal.beforeHideNavEvent.fire()) {
												this._show(this.navEl, false);
												this.hideMask();
												YAHOO.util.Dom.removeClass(this.cal.oDomContainer, CLASSES.NAV_VISIBLE);
												this.cal.hideNavEvent.fire();
								}
				},
				showMask: function() { this._show(this.maskEl, true); if (this.__isIEQuirks) { this._syncMask(); } },
				hideMask: function() { this._show(this.maskEl, false); },
				getMonth: function() { return this._month; },
				getYear: function() { return this._year; },
				setMonth: function(nMonth) {
								if (nMonth >= 0 && nMonth < 12) { this._month = nMonth; }
								this._updateMonthUI();
				},
				setYear: function(nYear) {
								var yrPattern = YAHOO.widget.CalendarNavigator.YR_PATTERN;
								if (YAHOO.lang.isNumber(nYear) && yrPattern.test(nYear + "")) { this._year = nYear; }
								this._updateYearUI();
				},
				render: function() {
								this.cal.beforeRenderNavEvent.fire();
								if (!this.__rendered) {
												this.createNav();
												this.createMask();
												this.applyListeners();
												this.__rendered = true;
								}
								this.cal.renderNavEvent.fire();
				},
				createNav: function() {
								var NAV = YAHOO.widget.CalendarNavigator;
								var doc = this._doc;
								var d = doc.createElement("div");
								d.className = NAV.CLASSES.NAV;
								var htmlBuf = this.renderNavContents([]);
								d.innerHTML = htmlBuf.join('');
								this.cal.oDomContainer.appendChild(d);
								this.navEl = d;
								this.yearEl = doc.getElementById(this.id + NAV.YEAR_SUFFIX);
								this.monthEl = doc.getElementById(this.id + NAV.MONTH_SUFFIX);
								this.errorEl = doc.getElementById(this.id + NAV.ERROR_SUFFIX);
								this.submitEl = doc.getElementById(this.id + NAV.SUBMIT_SUFFIX);
								this.cancelEl = doc.getElementById(this.id + NAV.CANCEL_SUFFIX);
								if (YAHOO.env.ua.gecko && this.yearEl && this.yearEl.type == "text") { this.yearEl.setAttribute("autocomplete", "off"); }
								this._setFirstLastElements();
				},
				createMask: function() {
								var C = YAHOO.widget.CalendarNavigator.CLASSES;
								var d = this._doc.createElement("div");
								d.className = C.MASK;
								this.cal.oDomContainer.appendChild(d);
								this.maskEl = d;
				},
				_syncMask: function() {
								var c = this.cal.oDomContainer;
								if (c && this.maskEl) {
												var r = YAHOO.util.Dom.getRegion(c);
												YAHOO.util.Dom.setStyle(this.maskEl, "width", r.right - r.left + "px");
												YAHOO.util.Dom.setStyle(this.maskEl, "height", r.bottom - r.top + "px");
								}
				},
				renderNavContents: function(html) {
								var NAV = YAHOO.widget.CalendarNavigator,
												C = NAV.CLASSES,
												h = html;
								h[h.length] = '<div class="' + C.MONTH + '">';
								this.renderMonth(h);
								h[h.length] = '</div>';
								h[h.length] = '<div class="' + C.YEAR + '">';
								this.renderYear(h);
								h[h.length] = '</div>';
								h[h.length] = '<div class="' + C.BUTTONS + '">';
								this.renderButtons(h);
								h[h.length] = '</div>';
								h[h.length] = '<div class="' + C.ERROR + '" id="' + this.id + NAV.ERROR_SUFFIX + '"></div>';
								return h;
				},
				renderMonth: function(html) {
								var NAV = YAHOO.widget.CalendarNavigator,
												C = NAV.CLASSES;
								var id = this.id + NAV.MONTH_SUFFIX,
												mf = this.__getCfg("monthFormat"),
												months = this.cal.cfg.getProperty((mf == YAHOO.widget.Calendar.SHORT) ? "MONTHS_SHORT" : "MONTHS_LONG"),
												h = html;
								if (months && months.length > 0) {
												h[h.length] = '<label for="' + id + '">';
												h[h.length] = this.__getCfg("month", true);
												h[h.length] = '</label>';
												h[h.length] = '<select name="' + id + '" id="' + id + '" class="' + C.MONTH_CTRL + '">';
												for (var i = 0; i < months.length; i++) {
																h[h.length] = '<option value="' + i + '">';
																h[h.length] = months[i];
																h[h.length] = '</option>';
												}
												h[h.length] = '</select>';
								}
								return h;
				},
				renderYear: function(html) {
								var NAV = YAHOO.widget.CalendarNavigator,
												C = NAV.CLASSES;
								var id = this.id + NAV.YEAR_SUFFIX,
												size = NAV.YR_MAX_DIGITS,
												h = html;
								h[h.length] = '<label for="' + id + '">';
								h[h.length] = this.__getCfg("year", true);
								h[h.length] = '</label>';
								h[h.length] = '<input type="text" name="' + id + '" id="' + id + '" class="' + C.YEAR_CTRL + '" maxlength="' + size + '"/>';
								return h;
				},
				renderButtons: function(html) {
								var C = YAHOO.widget.CalendarNavigator.CLASSES;
								var h = html;
								h[h.length] = '<span class="' + C.BUTTON + ' ' + C.DEFAULT + '">';
								h[h.length] = '<button type="button" id="' + this.id + '_submit' + '">';
								h[h.length] = this.__getCfg("submit", true);
								h[h.length] = '</button>';
								h[h.length] = '</span>';
								h[h.length] = '<span class="' + C.BUTTON + '">';
								h[h.length] = '<button type="button" id="' + this.id + '_cancel' + '">';
								h[h.length] = this.__getCfg("cancel", true);
								h[h.length] = '</button>';
								h[h.length] = '</span>';
								return h;
				},
				applyListeners: function() {
								var E = YAHOO.util.Event;

								function yearUpdateHandler() { if (this.validate()) { this.setYear(this._getYearFromUI()); } }

								function monthUpdateHandler() { this.setMonth(this._getMonthFromUI()); }
								E.on(this.submitEl, "click", this.submit, this, true);
								E.on(this.cancelEl, "click", this.cancel, this, true);
								E.on(this.yearEl, "blur", yearUpdateHandler, this, true);
								E.on(this.monthEl, "change", monthUpdateHandler, this, true);
								if (this.__isIEQuirks) { YAHOO.util.Event.on(this.cal.oDomContainer, "resize", this._syncMask, this, true); }
								this.applyKeyListeners();
				},
				purgeListeners: function() {
								var E = YAHOO.util.Event;
								E.removeListener(this.submitEl, "click", this.submit);
								E.removeListener(this.cancelEl, "click", this.cancel);
								E.removeListener(this.yearEl, "blur");
								E.removeListener(this.monthEl, "change");
								if (this.__isIEQuirks) { E.removeListener(this.cal.oDomContainer, "resize", this._syncMask); }
								this.purgeKeyListeners();
				},
				applyKeyListeners: function() {
								var E = YAHOO.util.Event,
												ua = YAHOO.env.ua;
								var arrowEvt = (ua.ie || ua.webkit) ? "keydown" : "keypress";
								var tabEvt = (ua.ie || ua.opera || ua.webkit) ? "keydown" : "keypress";
								E.on(this.yearEl, "keypress", this._handleEnterKey, this, true);
								E.on(this.yearEl, arrowEvt, this._handleDirectionKeys, this, true);
								E.on(this.lastCtrl, tabEvt, this._handleTabKey, this, true);
								E.on(this.firstCtrl, tabEvt, this._handleShiftTabKey, this, true);
				},
				purgeKeyListeners: function() {
								var E = YAHOO.util.Event,
												ua = YAHOO.env.ua;
								var arrowEvt = (ua.ie || ua.webkit) ? "keydown" : "keypress";
								var tabEvt = (ua.ie || ua.opera || ua.webkit) ? "keydown" : "keypress";
								E.removeListener(this.yearEl, "keypress", this._handleEnterKey);
								E.removeListener(this.yearEl, arrowEvt, this._handleDirectionKeys);
								E.removeListener(this.lastCtrl, tabEvt, this._handleTabKey);
								E.removeListener(this.firstCtrl, tabEvt, this._handleShiftTabKey);
				},
				submit: function() {
								if (this.validate()) {
												this.hide();
												this.setMonth(this._getMonthFromUI());
												this.setYear(this._getYearFromUI());
												var cal = this.cal;
												var nav = this;

												function update() {
																cal.setYear(nav.getYear());
																cal.setMonth(nav.getMonth());
																cal.render();
												}
												var delay = YAHOO.widget.CalendarNavigator.UPDATE_DELAY;
												if (delay > 0) { window.setTimeout(update, delay); } else { update(); }
								}
				},
				cancel: function() { this.hide(); },
				validate: function() {
								if (this._getYearFromUI() !== null) { this.clearErrors(); return true; } else {
												this.setYearError();
												this.setError(this.__getCfg("invalidYear", true));
												return false;
								}
				},
				setError: function(msg) {
								if (this.errorEl) {
												this.errorEl.innerHTML = msg;
												this._show(this.errorEl, true);
								}
				},
				clearError: function() {
								if (this.errorEl) {
												this.errorEl.innerHTML = "";
												this._show(this.errorEl, false);
								}
				},
				setYearError: function() { YAHOO.util.Dom.addClass(this.yearEl, YAHOO.widget.CalendarNavigator.CLASSES.INVALID); },
				clearYearError: function() { YAHOO.util.Dom.removeClass(this.yearEl, YAHOO.widget.CalendarNavigator.CLASSES.INVALID); },
				clearErrors: function() {
								this.clearError();
								this.clearYearError();
				},
				setInitialFocus: function() {
								var el = this.submitEl,
												f = this.__getCfg("initialFocus");
								if (f && f.toLowerCase) { f = f.toLowerCase(); if (f == "year") { el = this.yearEl; try { this.yearEl.select(); } catch (err) {} } else if (f == "month") { el = this.monthEl; } }
								if (el && YAHOO.lang.isFunction(el.focus)) { try { el.focus(); } catch (err) {} }
				},
				erase: function() {
								if (this.__rendered) {
												this.purgeListeners();
												this.yearEl = null;
												this.monthEl = null;
												this.errorEl = null;
												this.submitEl = null;
												this.cancelEl = null;
												this.firstCtrl = null;
												this.lastCtrl = null;
												if (this.navEl) { this.navEl.innerHTML = ""; }
												var p = this.navEl.parentNode;
												if (p) { p.removeChild(this.navEl); }
												this.navEl = null;
												var pm = this.maskEl.parentNode;
												if (pm) { pm.removeChild(this.maskEl); }
												this.maskEl = null;
												this.__rendered = false;
								}
				},
				destroy: function() {
								this.erase();
								this._doc = null;
								this.cal = null;
								this.id = null;
				},
				_show: function(el, bShow) { if (el) { YAHOO.util.Dom.setStyle(el, "display", (bShow) ? "block" : "none"); } },
				_getMonthFromUI: function() { if (this.monthEl) { return this.monthEl.selectedIndex; } else { return 0; } },
				_getYearFromUI: function() {
								var NAV = YAHOO.widget.CalendarNavigator;
								var yr = null;
								if (this.yearEl) {
												var value = this.yearEl.value;
												value = value.replace(NAV.TRIM, "$1");
												if (NAV.YR_PATTERN.test(value)) { yr = parseInt(value, 10); }
								}
								return yr;
				},
				_updateYearUI: function() { if (this.yearEl && this._year !== null) { this.yearEl.value = this._year; } },
				_updateMonthUI: function() { if (this.monthEl) { this.monthEl.selectedIndex = this._month; } },
				_setFirstLastElements: function() {
								this.firstCtrl = this.monthEl;
								this.lastCtrl = this.cancelEl;
								if (this.__isMac) {
												if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420) {
																this.firstCtrl = this.monthEl;
																this.lastCtrl = this.yearEl;
												}
												if (YAHOO.env.ua.gecko) {
																this.firstCtrl = this.yearEl;
																this.lastCtrl = this.yearEl;
												}
								}
				},
				_handleEnterKey: function(e) {
								var KEYS = YAHOO.util.KeyListener.KEY;
								if (YAHOO.util.Event.getCharCode(e) == KEYS.ENTER) {
												YAHOO.util.Event.preventDefault(e);
												this.submit();
								}
				},
				_handleDirectionKeys: function(e) {
								var E = YAHOO.util.Event,
												KEYS = YAHOO.util.KeyListener.KEY,
												NAV = YAHOO.widget.CalendarNavigator;
								var value = (this.yearEl.value) ? parseInt(this.yearEl.value, 10) : null;
								if (isFinite(value)) {
												var dir = false;
												switch (E.getCharCode(e)) {
																case KEYS.UP:
																				this.yearEl.value = value + NAV.YR_MINOR_INC;
																				dir = true;
																				break;
																case KEYS.DOWN:
																				this.yearEl.value = Math.max(value - NAV.YR_MINOR_INC, 0);
																				dir = true;
																				break;
																case KEYS.PAGE_UP:
																				this.yearEl.value = value + NAV.YR_MAJOR_INC;
																				dir = true;
																				break;
																case KEYS.PAGE_DOWN:
																				this.yearEl.value = Math.max(value - NAV.YR_MAJOR_INC, 0);
																				dir = true;
																				break;
																default:
																				break;
												}
												if (dir) { E.preventDefault(e); try { this.yearEl.select(); } catch (err) {} }
								}
				},
				_handleTabKey: function(e) {
								var E = YAHOO.util.Event,
												KEYS = YAHOO.util.KeyListener.KEY;
								if (E.getCharCode(e) == KEYS.TAB && !e.shiftKey) {
												try {
																E.preventDefault(e);
																this.firstCtrl.focus();
												} catch (err) {}
								}
				},
				_handleShiftTabKey: function(e) {
								var E = YAHOO.util.Event,
												KEYS = YAHOO.util.KeyListener.KEY;
								if (e.shiftKey && E.getCharCode(e) == KEYS.TAB) {
												try {
																E.preventDefault(e);
																this.lastCtrl.focus();
												} catch (err) {}
								}
				},
				__getCfg: function(prop, bIsStr) { var DEF_CFG = YAHOO.widget.CalendarNavigator._DEFAULT_CFG; var cfg = this.cal.cfg.getProperty("navigator"); if (bIsStr) { return (cfg !== true && cfg.strings && cfg.strings[prop]) ? cfg.strings[prop] : DEF_CFG.strings[prop]; } else { return (cfg !== true && cfg[prop]) ? cfg[prop] : DEF_CFG[prop]; } },
				__isMac: (navigator.userAgent.toLowerCase().indexOf("macintosh") != -1)
};
YAHOO.register("calendar", YAHOO.widget.Calendar, { version: "2.5.2", build: "1076" });
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
(function() {
				YAHOO.util.Config = function(owner) {
								if (owner) { this.init(owner); }
								if (!owner) {}
				};
				var Lang = YAHOO.lang,
								CustomEvent = YAHOO.util.CustomEvent,
								Config = YAHOO.util.Config;
				Config.CONFIG_CHANGED_EVENT = "configChanged";
				Config.BOOLEAN_TYPE = "boolean";
				Config.prototype = {
								owner: null,
								queueInProgress: false,
								config: null,
								initialConfig: null,
								eventQueue: null,
								configChangedEvent: null,
								init: function(owner) {
												this.owner = owner;
												this.configChangedEvent = this.createEvent(Config.CONFIG_CHANGED_EVENT);
												this.configChangedEvent.signature = CustomEvent.LIST;
												this.queueInProgress = false;
												this.config = {};
												this.initialConfig = {};
												this.eventQueue = [];
								},
								checkBoolean: function(val) { return (typeof val == Config.BOOLEAN_TYPE); },
								checkNumber: function(val) { return (!isNaN(val)); },
								fireEvent: function(key, value) { var property = this.config[key]; if (property && property.event) { property.event.fire(value); } },
								addProperty: function(key, propertyObject) {
												key = key.toLowerCase();
												this.config[key] = propertyObject;
												propertyObject.event = this.createEvent(key, { scope: this.owner });
												propertyObject.event.signature = CustomEvent.LIST;
												propertyObject.key = key;
												if (propertyObject.handler) { propertyObject.event.subscribe(propertyObject.handler, this.owner); }
												this.setProperty(key, propertyObject.value, true);
												if (!propertyObject.suppressEvent) { this.queueProperty(key, propertyObject.value); }
								},
								getConfig: function() {
												var cfg = {},
																prop, property;
												for (prop in this.config) { property = this.config[prop]; if (property && property.event) { cfg[prop] = property.value; } }
												return cfg;
								},
								getProperty: function(key) { var property = this.config[key.toLowerCase()]; if (property && property.event) { return property.value; } else { return undefined; } },
								resetProperty: function(key) { key = key.toLowerCase(); var property = this.config[key]; if (property && property.event) { if (this.initialConfig[key] && !Lang.isUndefined(this.initialConfig[key])) { this.setProperty(key, this.initialConfig[key]); return true; } } else { return false; } },
								setProperty: function(key, value, silent) {
												var property;
												key = key.toLowerCase();
												if (this.queueInProgress && !silent) { this.queueProperty(key, value); return true; } else {
																property = this.config[key];
																if (property && property.event) {
																				if (property.validator && !property.validator(value)) { return false; } else {
																								property.value = value;
																								if (!silent) {
																												this.fireEvent(key, value);
																												this.configChangedEvent.fire([key, value]);
																								}
																								return true;
																				}
																} else { return false; }
												}
								},
								queueProperty: function(key, value) {
												key = key.toLowerCase();
												var property = this.config[key],
																foundDuplicate = false,
																iLen, queueItem, queueItemKey, queueItemValue, sLen, supercedesCheck, qLen, queueItemCheck, queueItemCheckKey, queueItemCheckValue, i, s, q;
												if (property && property.event) {
																if (!Lang.isUndefined(value) && property.validator && !property.validator(value)) { return false; } else {
																				if (!Lang.isUndefined(value)) { property.value = value; } else { value = property.value; }
																				foundDuplicate = false;
																				iLen = this.eventQueue.length;
																				for (i = 0; i < iLen; i++) {
																								queueItem = this.eventQueue[i];
																								if (queueItem) {
																												queueItemKey = queueItem[0];
																												queueItemValue = queueItem[1];
																												if (queueItemKey == key) {
																																this.eventQueue[i] = null;
																																this.eventQueue.push([key, (!Lang.isUndefined(value) ? value : queueItemValue)]);
																																foundDuplicate = true;
																																break;
																												}
																								}
																				}
																				if (!foundDuplicate && !Lang.isUndefined(value)) { this.eventQueue.push([key, value]); }
																}
																if (property.supercedes) {
																				sLen = property.supercedes.length;
																				for (s = 0; s < sLen; s++) {
																								supercedesCheck = property.supercedes[s];
																								qLen = this.eventQueue.length;
																								for (q = 0; q < qLen; q++) {
																												queueItemCheck = this.eventQueue[q];
																												if (queueItemCheck) {
																																queueItemCheckKey = queueItemCheck[0];
																																queueItemCheckValue = queueItemCheck[1];
																																if (queueItemCheckKey == supercedesCheck.toLowerCase()) {
																																				this.eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
																																				this.eventQueue[q] = null;
																																				break;
																																}
																												}
																								}
																				}
																}
																return true;
												} else { return false; }
								},
								refireEvent: function(key) { key = key.toLowerCase(); var property = this.config[key]; if (property && property.event && !Lang.isUndefined(property.value)) { if (this.queueInProgress) { this.queueProperty(key); } else { this.fireEvent(key, property.value); } } },
								applyConfig: function(userConfig, init) {
												var sKey, oValue, oConfig;
												if (init) {
																oConfig = {};
																for (sKey in userConfig) { if (Lang.hasOwnProperty(userConfig, sKey)) { oConfig[sKey.toLowerCase()] = userConfig[sKey]; } }
																this.initialConfig = oConfig;
												}
												for (sKey in userConfig) { if (Lang.hasOwnProperty(userConfig, sKey)) { this.queueProperty(sKey, userConfig[sKey]); } }
								},
								refresh: function() { var prop; for (prop in this.config) { this.refireEvent(prop); } },
								fireQueue: function() {
												var i, queueItem, key, value, property;
												this.queueInProgress = true;
												for (i = 0; i < this.eventQueue.length; i++) {
																queueItem = this.eventQueue[i];
																if (queueItem) {
																				key = queueItem[0];
																				value = queueItem[1];
																				property = this.config[key];
																				property.value = value;
																				this.fireEvent(key, value);
																}
												}
												this.queueInProgress = false;
												this.eventQueue = [];
								},
								subscribeToConfigEvent: function(key, handler, obj, override) {
												var property = this.config[key.toLowerCase()];
												if (property && property.event) {
																if (!Config.alreadySubscribed(property.event, handler, obj)) { property.event.subscribe(handler, obj, override); }
																return true;
												} else { return false; }
								},
								unsubscribeFromConfigEvent: function(key, handler, obj) { var property = this.config[key.toLowerCase()]; if (property && property.event) { return property.event.unsubscribe(handler, obj); } else { return false; } },
								toString: function() {
												var output = "Config";
												if (this.owner) { output += " [" + this.owner.toString() + "]"; }
												return output;
								},
								outputEventQueue: function() {
												var output = "",
																queueItem, q, nQueue = this.eventQueue.length;
												for (q = 0; q < nQueue; q++) { queueItem = this.eventQueue[q]; if (queueItem) { output += queueItem[0] + "=" + queueItem[1] + ", "; } }
												return output;
								},
								destroy: function() {
												var oConfig = this.config,
																sProperty, oProperty;
												for (sProperty in oConfig) {
																if (Lang.hasOwnProperty(oConfig, sProperty)) {
																				oProperty = oConfig[sProperty];
																				oProperty.event.unsubscribeAll();
																				oProperty.event = null;
																}
												}
												this.configChangedEvent.unsubscribeAll();
												this.configChangedEvent = null;
												this.owner = null;
												this.config = null;
												this.initialConfig = null;
												this.eventQueue = null;
								}
				};
				Config.alreadySubscribed = function(evt, fn, obj) {
								var nSubscribers = evt.subscribers.length,
												subsc, i;
								if (nSubscribers > 0) {
												i = nSubscribers - 1;
												do { subsc = evt.subscribers[i]; if (subsc && subsc.obj == obj && subsc.fn == fn) { return true; } }
												while (i--);
								}
								return false;
				};
				YAHOO.lang.augmentProto(Config, YAHOO.util.EventProvider);
}());
(function() {
				YAHOO.widget.Module = function(el, userConfig) { if (el) { this.init(el, userConfig); } else {} };
				var Dom = YAHOO.util.Dom,
								Config = YAHOO.util.Config,
								Event = YAHOO.util.Event,
								CustomEvent = YAHOO.util.CustomEvent,
								Module = YAHOO.widget.Module,
								m_oModuleTemplate, m_oHeaderTemplate, m_oBodyTemplate, m_oFooterTemplate, EVENT_TYPES = { "BEFORE_INIT": "beforeInit", "INIT": "init", "APPEND": "append", "BEFORE_RENDER": "beforeRender", "RENDER": "render", "CHANGE_HEADER": "changeHeader", "CHANGE_BODY": "changeBody", "CHANGE_FOOTER": "changeFooter", "CHANGE_CONTENT": "changeContent", "DESTORY": "destroy", "BEFORE_SHOW": "beforeShow", "SHOW": "show", "BEFORE_HIDE": "beforeHide", "HIDE": "hide" },
								DEFAULT_CONFIG = { "VISIBLE": { key: "visible", value: true, validator: YAHOO.lang.isBoolean }, "EFFECT": { key: "effect", suppressEvent: true, supercedes: ["visible"] }, "MONITOR_RESIZE": { key: "monitorresize", value: true }, "APPEND_TO_DOCUMENT_BODY": { key: "appendtodocumentbody", value: false } };
				Module.IMG_ROOT = null;
				Module.IMG_ROOT_SSL = null;
				Module.CSS_MODULE = "yui-module";
				Module.CSS_HEADER = "hd";
				Module.CSS_BODY = "bd";
				Module.CSS_FOOTER = "ft";
				Module.RESIZE_MONITOR_SECURE_URL = "javascript:false;";
				Module.textResizeEvent = new CustomEvent("textResize");

				function createModuleTemplate() {
								if (!m_oModuleTemplate) {
												m_oModuleTemplate = document.createElement("div");
												m_oModuleTemplate.innerHTML = ("<div class=\"" +
																Module.CSS_HEADER + "\"></div>" + "<div class=\"" +
																Module.CSS_BODY + "\"></div><div class=\"" +
																Module.CSS_FOOTER + "\"></div>");
												m_oHeaderTemplate = m_oModuleTemplate.firstChild;
												m_oBodyTemplate = m_oHeaderTemplate.nextSibling;
												m_oFooterTemplate = m_oBodyTemplate.nextSibling;
								}
								return m_oModuleTemplate;
				}

				function createHeader() {
								if (!m_oHeaderTemplate) { createModuleTemplate(); }
								return (m_oHeaderTemplate.cloneNode(false));
				}

				function createBody() {
								if (!m_oBodyTemplate) { createModuleTemplate(); }
								return (m_oBodyTemplate.cloneNode(false));
				}

				function createFooter() {
								if (!m_oFooterTemplate) { createModuleTemplate(); }
								return (m_oFooterTemplate.cloneNode(false));
				}
				Module.prototype = {
								constructor: Module,
								element: null,
								header: null,
								body: null,
								footer: null,
								id: null,
								imageRoot: Module.IMG_ROOT,
								initEvents: function() {
												var SIGNATURE = CustomEvent.LIST;
												this.beforeInitEvent = this.createEvent(EVENT_TYPES.BEFORE_INIT);
												this.beforeInitEvent.signature = SIGNATURE;
												this.initEvent = this.createEvent(EVENT_TYPES.INIT);
												this.initEvent.signature = SIGNATURE;
												this.appendEvent = this.createEvent(EVENT_TYPES.APPEND);
												this.appendEvent.signature = SIGNATURE;
												this.beforeRenderEvent = this.createEvent(EVENT_TYPES.BEFORE_RENDER);
												this.beforeRenderEvent.signature = SIGNATURE;
												this.renderEvent = this.createEvent(EVENT_TYPES.RENDER);
												this.renderEvent.signature = SIGNATURE;
												this.changeHeaderEvent = this.createEvent(EVENT_TYPES.CHANGE_HEADER);
												this.changeHeaderEvent.signature = SIGNATURE;
												this.changeBodyEvent = this.createEvent(EVENT_TYPES.CHANGE_BODY);
												this.changeBodyEvent.signature = SIGNATURE;
												this.changeFooterEvent = this.createEvent(EVENT_TYPES.CHANGE_FOOTER);
												this.changeFooterEvent.signature = SIGNATURE;
												this.changeContentEvent = this.createEvent(EVENT_TYPES.CHANGE_CONTENT);
												this.changeContentEvent.signature = SIGNATURE;
												this.destroyEvent = this.createEvent(EVENT_TYPES.DESTORY);
												this.destroyEvent.signature = SIGNATURE;
												this.beforeShowEvent = this.createEvent(EVENT_TYPES.BEFORE_SHOW);
												this.beforeShowEvent.signature = SIGNATURE;
												this.showEvent = this.createEvent(EVENT_TYPES.SHOW);
												this.showEvent.signature = SIGNATURE;
												this.beforeHideEvent = this.createEvent(EVENT_TYPES.BEFORE_HIDE);
												this.beforeHideEvent.signature = SIGNATURE;
												this.hideEvent = this.createEvent(EVENT_TYPES.HIDE);
												this.hideEvent.signature = SIGNATURE;
								},
								platform: function() { var ua = navigator.userAgent.toLowerCase(); if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) { return "windows"; } else if (ua.indexOf("macintosh") != -1) { return "mac"; } else { return false; } }(),
								browser: function() { var ua = navigator.userAgent.toLowerCase(); if (ua.indexOf('opera') != -1) { return 'opera'; } else if (ua.indexOf('msie 7') != -1) { return 'ie7'; } else if (ua.indexOf('msie') != -1) { return 'ie'; } else if (ua.indexOf('safari') != -1) { return 'safari'; } else if (ua.indexOf('gecko') != -1) { return 'gecko'; } else { return false; } }(),
								isSecure: function() { if (window.location.href.toLowerCase().indexOf("https") === 0) { return true; } else { return false; } }(),
								initDefaultConfig: function() {
												this.cfg.addProperty(DEFAULT_CONFIG.VISIBLE.key, { handler: this.configVisible, value: DEFAULT_CONFIG.VISIBLE.value, validator: DEFAULT_CONFIG.VISIBLE.validator });
												this.cfg.addProperty(DEFAULT_CONFIG.EFFECT.key, { suppressEvent: DEFAULT_CONFIG.EFFECT.suppressEvent, supercedes: DEFAULT_CONFIG.EFFECT.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.MONITOR_RESIZE.key, { handler: this.configMonitorResize, value: DEFAULT_CONFIG.MONITOR_RESIZE.value });
												this.cfg.addProperty(DEFAULT_CONFIG.APPEND_TO_DOCUMENT_BODY.key, { value: DEFAULT_CONFIG.APPEND_TO_DOCUMENT_BODY.value });
								},
								init: function(el, userConfig) {
												var elId, i, child;
												this.initEvents();
												this.beforeInitEvent.fire(Module);
												this.cfg = new Config(this);
												if (this.isSecure) { this.imageRoot = Module.IMG_ROOT_SSL; }
												if (typeof el == "string") {
																elId = el;
																el = document.getElementById(el);
																if (!el) {
																				el = (createModuleTemplate()).cloneNode(false);
																				el.id = elId;
																}
												}
												this.element = el;
												if (el.id) { this.id = el.id; }
												child = this.element.firstChild;
												if (child) {
																var fndHd = false,
																				fndBd = false,
																				fndFt = false;
																do {
																				if (1 == child.nodeType) {
																								if (!fndHd && Dom.hasClass(child, Module.CSS_HEADER)) {
																												this.header = child;
																												fndHd = true;
																								} else if (!fndBd && Dom.hasClass(child, Module.CSS_BODY)) {
																												this.body = child;
																												fndBd = true;
																								} else if (!fndFt && Dom.hasClass(child, Module.CSS_FOOTER)) {
																												this.footer = child;
																												fndFt = true;
																								}
																				}
																} while ((child = child.nextSibling));
												}
												this.initDefaultConfig();
												Dom.addClass(this.element, Module.CSS_MODULE);
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												if (!Config.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) { this.renderEvent.subscribe(this.cfg.fireQueue, this.cfg, true); }
												this.initEvent.fire(Module);
								},
								initResizeMonitor: function() {
												var oDoc, oIFrame, sHTML;

												function fireTextResize() { Module.textResizeEvent.fire(); }
												if (!YAHOO.env.ua.opera) {
																oIFrame = Dom.get("_yuiResizeMonitor");
																if (!oIFrame) {
																				oIFrame = document.createElement("iframe");
																				if (this.isSecure && Module.RESIZE_MONITOR_SECURE_URL && YAHOO.env.ua.ie) { oIFrame.src = Module.RESIZE_MONITOR_SECURE_URL; }
																				if (YAHOO.env.ua.gecko) {
																								sHTML = "<html><head><script " +
																												"type=\"text/javascript\">" +
																												"window.onresize=function(){window.parent." +
																												"YAHOO.widget.Module.textResizeEvent." +
																												"fire();};window.parent.YAHOO.widget.Module." +
																												"textResizeEvent.fire();</script></head>" +
																												"<body></body></html>";
																								oIFrame.src = "data:text/html;charset=utf-8," +
																												encodeURIComponent(sHTML);
																				}
																				oIFrame.id = "_yuiResizeMonitor";
																				oIFrame.style.position = "absolute";
																				oIFrame.style.visibility = "hidden";
																				var fc = document.body.firstChild;
																				if (fc) { document.body.insertBefore(oIFrame, fc); } else { document.body.appendChild(oIFrame); }
																				oIFrame.style.width = "10em";
																				oIFrame.style.height = "10em";
																				oIFrame.style.top = (-1 * oIFrame.offsetHeight) + "px";
																				oIFrame.style.left = (-1 * oIFrame.offsetWidth) + "px";
																				oIFrame.style.borderWidth = "0";
																				oIFrame.style.visibility = "visible";
																				if (YAHOO.env.ua.webkit) {
																								oDoc = oIFrame.contentWindow.document;
																								oDoc.open();
																								oDoc.close();
																				}
																}
																if (oIFrame && oIFrame.contentWindow) {
																				Module.textResizeEvent.subscribe(this.onDomResize, this, true);
																				if (!Module.textResizeInitialized) {
																								if (!Event.on(oIFrame.contentWindow, "resize", fireTextResize)) { Event.on(oIFrame, "resize", fireTextResize); }
																								Module.textResizeInitialized = true;
																				}
																				this.resizeMonitor = oIFrame;
																}
												}
								},
								onDomResize: function(e, obj) {
												var nLeft = -1 * this.resizeMonitor.offsetWidth,
																nTop = -1 * this.resizeMonitor.offsetHeight;
												this.resizeMonitor.style.top = nTop + "px";
												this.resizeMonitor.style.left = nLeft + "px";
								},
								setHeader: function(headerContent) {
												var oHeader = this.header || (this.header = createHeader());
												if (typeof headerContent == "string") { oHeader.innerHTML = headerContent; } else {
																oHeader.innerHTML = "";
																oHeader.appendChild(headerContent);
												}
												this.changeHeaderEvent.fire(headerContent);
												this.changeContentEvent.fire();
								},
								appendToHeader: function(element) {
												var oHeader = this.header || (this.header = createHeader());
												oHeader.appendChild(element);
												this.changeHeaderEvent.fire(element);
												this.changeContentEvent.fire();
								},
								setBody: function(bodyContent) {
												var oBody = this.body || (this.body = createBody());
												if (typeof bodyContent == "string") { oBody.innerHTML = bodyContent; } else {
																oBody.innerHTML = "";
																oBody.appendChild(bodyContent);
												}
												this.changeBodyEvent.fire(bodyContent);
												this.changeContentEvent.fire();
								},
								appendToBody: function(element) {
												var oBody = this.body || (this.body = createBody());
												oBody.appendChild(element);
												this.changeBodyEvent.fire(element);
												this.changeContentEvent.fire();
								},
								setFooter: function(footerContent) {
												var oFooter = this.footer || (this.footer = createFooter());
												if (typeof footerContent == "string") { oFooter.innerHTML = footerContent; } else {
																oFooter.innerHTML = "";
																oFooter.appendChild(footerContent);
												}
												this.changeFooterEvent.fire(footerContent);
												this.changeContentEvent.fire();
								},
								appendToFooter: function(element) {
												var oFooter = this.footer || (this.footer = createFooter());
												oFooter.appendChild(element);
												this.changeFooterEvent.fire(element);
												this.changeContentEvent.fire();
								},
								render: function(appendToNode, moduleElement) {
												var me = this,
																firstChild;

												function appendTo(parentNode) {
																if (typeof parentNode == "string") { parentNode = document.getElementById(parentNode); }
																if (parentNode) {
																				me._addToParent(parentNode, me.element);
																				me.appendEvent.fire();
																}
												}
												this.beforeRenderEvent.fire();
												if (!moduleElement) { moduleElement = this.element; }
												if (appendToNode) { appendTo(appendToNode); } else { if (!Dom.inDocument(this.element)) { return false; } }
												if (this.header && !Dom.inDocument(this.header)) { firstChild = moduleElement.firstChild; if (firstChild) { moduleElement.insertBefore(this.header, firstChild); } else { moduleElement.appendChild(this.header); } }
												if (this.body && !Dom.inDocument(this.body)) { if (this.footer && Dom.isAncestor(this.moduleElement, this.footer)) { moduleElement.insertBefore(this.body, this.footer); } else { moduleElement.appendChild(this.body); } }
												if (this.footer && !Dom.inDocument(this.footer)) { moduleElement.appendChild(this.footer); }
												this.renderEvent.fire();
												return true;
								},
								destroy: function() {
												var parent, e;
												if (this.element) {
																Event.purgeElement(this.element, true);
																parent = this.element.parentNode;
												}
												if (parent) { parent.removeChild(this.element); }
												this.element = null;
												this.header = null;
												this.body = null;
												this.footer = null;
												Module.textResizeEvent.unsubscribe(this.onDomResize, this);
												this.cfg.destroy();
												this.cfg = null;
												this.destroyEvent.fire();
												for (e in this) { if (e instanceof CustomEvent) { e.unsubscribeAll(); } }
								},
								show: function() { this.cfg.setProperty("visible", true); },
								hide: function() { this.cfg.setProperty("visible", false); },
								configVisible: function(type, args, obj) {
												var visible = args[0];
												if (visible) {
																this.beforeShowEvent.fire();
																Dom.setStyle(this.element, "display", "block");
																this.showEvent.fire();
												} else {
																this.beforeHideEvent.fire();
																Dom.setStyle(this.element, "display", "none");
																this.hideEvent.fire();
												}
								},
								configMonitorResize: function(type, args, obj) {
												var monitor = args[0];
												if (monitor) { this.initResizeMonitor(); } else {
																Module.textResizeEvent.unsubscribe(this.onDomResize, this, true);
																this.resizeMonitor = null;
												}
								},
								_addToParent: function(parentNode, element) { if (!this.cfg.getProperty("appendtodocumentbody") && parentNode === document.body && parentNode.firstChild) { parentNode.insertBefore(element, parentNode.firstChild); } else { parentNode.appendChild(element); } },
								toString: function() { return "Module " + this.id; }
				};
				YAHOO.lang.augmentProto(Module, YAHOO.util.EventProvider);
}());
(function() {
				YAHOO.widget.Overlay = function(el, userConfig) { YAHOO.widget.Overlay.superclass.constructor.call(this, el, userConfig); };
				var Lang = YAHOO.lang,
								CustomEvent = YAHOO.util.CustomEvent,
								Module = YAHOO.widget.Module,
								Event = YAHOO.util.Event,
								Dom = YAHOO.util.Dom,
								Config = YAHOO.util.Config,
								Overlay = YAHOO.widget.Overlay,
								m_oIFrameTemplate, EVENT_TYPES = { "BEFORE_MOVE": "beforeMove", "MOVE": "move" },
								DEFAULT_CONFIG = { "X": { key: "x", validator: Lang.isNumber, suppressEvent: true, supercedes: ["iframe"] }, "Y": { key: "y", validator: Lang.isNumber, suppressEvent: true, supercedes: ["iframe"] }, "XY": { key: "xy", suppressEvent: true, supercedes: ["iframe"] }, "CONTEXT": { key: "context", suppressEvent: true, supercedes: ["iframe"] }, "FIXED_CENTER": { key: "fixedcenter", value: false, validator: Lang.isBoolean, supercedes: ["iframe", "visible"] }, "WIDTH": { key: "width", suppressEvent: true, supercedes: ["context", "fixedcenter", "iframe"] }, "HEIGHT": { key: "height", suppressEvent: true, supercedes: ["context", "fixedcenter", "iframe"] }, "ZINDEX": { key: "zindex", value: null }, "CONSTRAIN_TO_VIEWPORT": { key: "constraintoviewport", value: false, validator: Lang.isBoolean, supercedes: ["iframe", "x", "y", "xy"] }, "IFRAME": { key: "iframe", value: (YAHOO.env.ua.ie == 6 ? true : false), validator: Lang.isBoolean, supercedes: ["zindex"] } };
				Overlay.IFRAME_SRC = "javascript:false;";
				Overlay.IFRAME_OFFSET = 3;
				Overlay.TOP_LEFT = "tl";
				Overlay.TOP_RIGHT = "tr";
				Overlay.BOTTOM_LEFT = "bl";
				Overlay.BOTTOM_RIGHT = "br";
				Overlay.CSS_OVERLAY = "yui-overlay";
				Overlay.windowScrollEvent = new CustomEvent("windowScroll");
				Overlay.windowResizeEvent = new CustomEvent("windowResize");
				Overlay.windowScrollHandler = function(e) {
								if (YAHOO.env.ua.ie) {
												if (!window.scrollEnd) { window.scrollEnd = -1; }
												clearTimeout(window.scrollEnd);
												window.scrollEnd = setTimeout(function() { Overlay.windowScrollEvent.fire(); }, 1);
								} else { Overlay.windowScrollEvent.fire(); }
				};
				Overlay.windowResizeHandler = function(e) {
								if (YAHOO.env.ua.ie) {
												if (!window.resizeEnd) { window.resizeEnd = -1; }
												clearTimeout(window.resizeEnd);
												window.resizeEnd = setTimeout(function() { Overlay.windowResizeEvent.fire(); }, 100);
								} else { Overlay.windowResizeEvent.fire(); }
				};
				Overlay._initialized = null;
				if (Overlay._initialized === null) {
								Event.on(window, "scroll", Overlay.windowScrollHandler);
								Event.on(window, "resize", Overlay.windowResizeHandler);
								Overlay._initialized = true;
				}
				YAHOO.extend(Overlay, Module, {
								init: function(el, userConfig) {
												Overlay.superclass.init.call(this, el);
												this.beforeInitEvent.fire(Overlay);
												Dom.addClass(this.element, Overlay.CSS_OVERLAY);
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												if (this.platform == "mac" && YAHOO.env.ua.gecko) {
																if (!Config.alreadySubscribed(this.showEvent, this.showMacGeckoScrollbars, this)) { this.showEvent.subscribe(this.showMacGeckoScrollbars, this, true); }
																if (!Config.alreadySubscribed(this.hideEvent, this.hideMacGeckoScrollbars, this)) { this.hideEvent.subscribe(this.hideMacGeckoScrollbars, this, true); }
												}
												this.initEvent.fire(Overlay);
								},
								initEvents: function() {
												Overlay.superclass.initEvents.call(this);
												var SIGNATURE = CustomEvent.LIST;
												this.beforeMoveEvent = this.createEvent(EVENT_TYPES.BEFORE_MOVE);
												this.beforeMoveEvent.signature = SIGNATURE;
												this.moveEvent = this.createEvent(EVENT_TYPES.MOVE);
												this.moveEvent.signature = SIGNATURE;
								},
								initDefaultConfig: function() {
												Overlay.superclass.initDefaultConfig.call(this);
												this.cfg.addProperty(DEFAULT_CONFIG.X.key, { handler: this.configX, validator: DEFAULT_CONFIG.X.validator, suppressEvent: DEFAULT_CONFIG.X.suppressEvent, supercedes: DEFAULT_CONFIG.X.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.Y.key, { handler: this.configY, validator: DEFAULT_CONFIG.Y.validator, suppressEvent: DEFAULT_CONFIG.Y.suppressEvent, supercedes: DEFAULT_CONFIG.Y.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.XY.key, { handler: this.configXY, suppressEvent: DEFAULT_CONFIG.XY.suppressEvent, supercedes: DEFAULT_CONFIG.XY.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.CONTEXT.key, { handler: this.configContext, suppressEvent: DEFAULT_CONFIG.CONTEXT.suppressEvent, supercedes: DEFAULT_CONFIG.CONTEXT.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.FIXED_CENTER.key, { handler: this.configFixedCenter, value: DEFAULT_CONFIG.FIXED_CENTER.value, validator: DEFAULT_CONFIG.FIXED_CENTER.validator, supercedes: DEFAULT_CONFIG.FIXED_CENTER.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.WIDTH.key, { handler: this.configWidth, suppressEvent: DEFAULT_CONFIG.WIDTH.suppressEvent, supercedes: DEFAULT_CONFIG.WIDTH.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.HEIGHT.key, { handler: this.configHeight, suppressEvent: DEFAULT_CONFIG.HEIGHT.suppressEvent, supercedes: DEFAULT_CONFIG.HEIGHT.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.ZINDEX.key, { handler: this.configzIndex, value: DEFAULT_CONFIG.ZINDEX.value });
												this.cfg.addProperty(DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.key, { handler: this.configConstrainToViewport, value: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.value, validator: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.validator, supercedes: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.IFRAME.key, { handler: this.configIframe, value: DEFAULT_CONFIG.IFRAME.value, validator: DEFAULT_CONFIG.IFRAME.validator, supercedes: DEFAULT_CONFIG.IFRAME.supercedes });
								},
								moveTo: function(x, y) { this.cfg.setProperty("xy", [x, y]); },
								hideMacGeckoScrollbars: function() {
												Dom.removeClass(this.element, "show-scrollbars");
												Dom.addClass(this.element, "hide-scrollbars");
								},
								showMacGeckoScrollbars: function() {
												Dom.removeClass(this.element, "hide-scrollbars");
												Dom.addClass(this.element, "show-scrollbars");
								},
								configVisible: function(type, args, obj) {
												var visible = args[0],
																currentVis = Dom.getStyle(this.element, "visibility"),
																effect = this.cfg.getProperty("effect"),
																effectInstances = [],
																isMacGecko = (this.platform == "mac" && YAHOO.env.ua.gecko),
																alreadySubscribed = Config.alreadySubscribed,
																eff, ei, e, i, j, k, h, nEffects, nEffectInstances;
												if (currentVis == "inherit") {
																e = this.element.parentNode;
																while (e.nodeType != 9 && e.nodeType != 11) {
																				currentVis = Dom.getStyle(e, "visibility");
																				if (currentVis != "inherit") { break; }
																				e = e.parentNode;
																}
																if (currentVis == "inherit") { currentVis = "visible"; }
												}
												if (effect) {
																if (effect instanceof Array) {
																				nEffects = effect.length;
																				for (i = 0; i < nEffects; i++) {
																								eff = effect[i];
																								effectInstances[effectInstances.length] = eff.effect(this, eff.duration);
																				}
																} else { effectInstances[effectInstances.length] = effect.effect(this, effect.duration); }
												}
												if (visible) {
																if (isMacGecko) { this.showMacGeckoScrollbars(); }
																if (effect) {
																				if (visible) {
																								if (currentVis != "visible" || currentVis === "") {
																												this.beforeShowEvent.fire();
																												nEffectInstances = effectInstances.length;
																												for (j = 0; j < nEffectInstances; j++) {
																																ei = effectInstances[j];
																																if (j === 0 && !alreadySubscribed(ei.animateInCompleteEvent, this.showEvent.fire, this.showEvent)) { ei.animateInCompleteEvent.subscribe(this.showEvent.fire, this.showEvent, true); }
																																ei.animateIn();
																												}
																								}
																				}
																} else {
																				if (currentVis != "visible" || currentVis === "") {
																								this.beforeShowEvent.fire();
																								Dom.setStyle(this.element, "visibility", "visible");
																								this.cfg.refireEvent("iframe");
																								this.showEvent.fire();
																				}
																}
												} else {
																if (isMacGecko) { this.hideMacGeckoScrollbars(); }
																if (effect) {
																				if (currentVis == "visible") {
																								this.beforeHideEvent.fire();
																								nEffectInstances = effectInstances.length;
																								for (k = 0; k < nEffectInstances; k++) {
																												h = effectInstances[k];
																												if (k === 0 && !alreadySubscribed(h.animateOutCompleteEvent, this.hideEvent.fire, this.hideEvent)) { h.animateOutCompleteEvent.subscribe(this.hideEvent.fire, this.hideEvent, true); }
																												h.animateOut();
																								}
																				} else if (currentVis === "") { Dom.setStyle(this.element, "visibility", "hidden"); }
																} else {
																				if (currentVis == "visible" || currentVis === "") {
																								this.beforeHideEvent.fire();
																								Dom.setStyle(this.element, "visibility", "hidden");
																								this.hideEvent.fire();
																				}
																}
												}
								},
								doCenterOnDOMEvent: function() { if (this.cfg.getProperty("visible")) { this.center(); } },
								configFixedCenter: function(type, args, obj) {
												var val = args[0],
																alreadySubscribed = Config.alreadySubscribed,
																windowResizeEvent = Overlay.windowResizeEvent,
																windowScrollEvent = Overlay.windowScrollEvent;
												if (val) {
																this.center();
																if (!alreadySubscribed(this.beforeShowEvent, this.center, this)) { this.beforeShowEvent.subscribe(this.center); }
																if (!alreadySubscribed(windowResizeEvent, this.doCenterOnDOMEvent, this)) { windowResizeEvent.subscribe(this.doCenterOnDOMEvent, this, true); }
																if (!alreadySubscribed(windowScrollEvent, this.doCenterOnDOMEvent, this)) { windowScrollEvent.subscribe(this.doCenterOnDOMEvent, this, true); }
												} else {
																this.beforeShowEvent.unsubscribe(this.center);
																windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
																windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
												}
								},
								configHeight: function(type, args, obj) {
												var height = args[0],
																el = this.element;
												Dom.setStyle(el, "height", height);
												this.cfg.refireEvent("iframe");
								},
								configWidth: function(type, args, obj) {
												var width = args[0],
																el = this.element;
												Dom.setStyle(el, "width", width);
												this.cfg.refireEvent("iframe");
								},
								configzIndex: function(type, args, obj) {
												var zIndex = args[0],
																el = this.element;
												if (!zIndex) { zIndex = Dom.getStyle(el, "zIndex"); if (!zIndex || isNaN(zIndex)) { zIndex = 0; } }
												if (this.iframe || this.cfg.getProperty("iframe") === true) { if (zIndex <= 0) { zIndex = 1; } }
												Dom.setStyle(el, "zIndex", zIndex);
												this.cfg.setProperty("zIndex", zIndex, true);
												if (this.iframe) { this.stackIframe(); }
								},
								configXY: function(type, args, obj) {
												var pos = args[0],
																x = pos[0],
																y = pos[1];
												this.cfg.setProperty("x", x);
												this.cfg.setProperty("y", y);
												this.beforeMoveEvent.fire([x, y]);
												x = this.cfg.getProperty("x");
												y = this.cfg.getProperty("y");
												this.cfg.refireEvent("iframe");
												this.moveEvent.fire([x, y]);
								},
								configX: function(type, args, obj) {
												var x = args[0],
																y = this.cfg.getProperty("y");
												this.cfg.setProperty("x", x, true);
												this.cfg.setProperty("y", y, true);
												this.beforeMoveEvent.fire([x, y]);
												x = this.cfg.getProperty("x");
												y = this.cfg.getProperty("y");
												Dom.setX(this.element, x, true);
												this.cfg.setProperty("xy", [x, y], true);
												this.cfg.refireEvent("iframe");
												this.moveEvent.fire([x, y]);
								},
								configY: function(type, args, obj) {
												var x = this.cfg.getProperty("x"),
																y = args[0];
												this.cfg.setProperty("x", x, true);
												this.cfg.setProperty("y", y, true);
												this.beforeMoveEvent.fire([x, y]);
												x = this.cfg.getProperty("x");
												y = this.cfg.getProperty("y");
												Dom.setY(this.element, y, true);
												this.cfg.setProperty("xy", [x, y], true);
												this.cfg.refireEvent("iframe");
												this.moveEvent.fire([x, y]);
								},
								showIframe: function() {
												var oIFrame = this.iframe,
																oParentNode;
												if (oIFrame) {
																oParentNode = this.element.parentNode;
																if (oParentNode != oIFrame.parentNode) { this._addToParent(oParentNode, oIFrame); }
																oIFrame.style.display = "block";
												}
								},
								hideIframe: function() { if (this.iframe) { this.iframe.style.display = "none"; } },
								syncIframe: function() {
												var oIFrame = this.iframe,
																oElement = this.element,
																nOffset = Overlay.IFRAME_OFFSET,
																nDimensionOffset = (nOffset * 2),
																aXY;
												if (oIFrame) {
																oIFrame.style.width = (oElement.offsetWidth + nDimensionOffset + "px");
																oIFrame.style.height = (oElement.offsetHeight + nDimensionOffset + "px");
																aXY = this.cfg.getProperty("xy");
																if (!Lang.isArray(aXY) || (isNaN(aXY[0]) || isNaN(aXY[1]))) {
																				this.syncPosition();
																				aXY = this.cfg.getProperty("xy");
																}
																Dom.setXY(oIFrame, [(aXY[0] - nOffset), (aXY[1] - nOffset)]);
												}
								},
								stackIframe: function() { if (this.iframe) { var overlayZ = Dom.getStyle(this.element, "zIndex"); if (!YAHOO.lang.isUndefined(overlayZ) && !isNaN(overlayZ)) { Dom.setStyle(this.iframe, "zIndex", (overlayZ - 1)); } } },
								configIframe: function(type, args, obj) {
												var bIFrame = args[0];

												function createIFrame() {
																var oIFrame = this.iframe,
																				oElement = this.element,
																				oParent, aXY;
																if (!oIFrame) {
																				if (!m_oIFrameTemplate) {
																								m_oIFrameTemplate = document.createElement("iframe");
																								if (this.isSecure) { m_oIFrameTemplate.src = Overlay.IFRAME_SRC; }
																								if (YAHOO.env.ua.ie) {
																												m_oIFrameTemplate.style.filter = "alpha(opacity=0)";
																												m_oIFrameTemplate.frameBorder = 0;
																								} else { m_oIFrameTemplate.style.opacity = "0"; }
																								m_oIFrameTemplate.style.position = "absolute";
																								m_oIFrameTemplate.style.border = "none";
																								m_oIFrameTemplate.style.margin = "0";
																								m_oIFrameTemplate.style.padding = "0";
																								m_oIFrameTemplate.style.display = "none";
																				}
																				oIFrame = m_oIFrameTemplate.cloneNode(false);
																				oParent = oElement.parentNode;
																				var parentNode = oParent || document.body;
																				this._addToParent(parentNode, oIFrame);
																				this.iframe = oIFrame;
																}
																this.showIframe();
																this.syncIframe();
																this.stackIframe();
																if (!this._hasIframeEventListeners) {
																				this.showEvent.subscribe(this.showIframe);
																				this.hideEvent.subscribe(this.hideIframe);
																				this.changeContentEvent.subscribe(this.syncIframe);
																				this._hasIframeEventListeners = true;
																}
												}

												function onBeforeShow() {
																createIFrame.call(this);
																this.beforeShowEvent.unsubscribe(onBeforeShow);
																this._iframeDeferred = false;
												}
												if (bIFrame) {
																if (this.cfg.getProperty("visible")) { createIFrame.call(this); } else {
																				if (!this._iframeDeferred) {
																								this.beforeShowEvent.subscribe(onBeforeShow);
																								this._iframeDeferred = true;
																				}
																}
												} else {
																this.hideIframe();
																if (this._hasIframeEventListeners) {
																				this.showEvent.unsubscribe(this.showIframe);
																				this.hideEvent.unsubscribe(this.hideIframe);
																				this.changeContentEvent.unsubscribe(this.syncIframe);
																				this._hasIframeEventListeners = false;
																}
												}
								},
								configConstrainToViewport: function(type, args, obj) { var val = args[0]; if (val) { if (!Config.alreadySubscribed(this.beforeMoveEvent, this.enforceConstraints, this)) { this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true); } } else { this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this); } },
								configContext: function(type, args, obj) {
												var contextArgs = args[0],
																contextEl, elementMagnetCorner, contextMagnetCorner;
												if (contextArgs) {
																contextEl = contextArgs[0];
																elementMagnetCorner = contextArgs[1];
																contextMagnetCorner = contextArgs[2];
																if (contextEl) {
																				if (typeof contextEl == "string") { this.cfg.setProperty("context", [document.getElementById(contextEl), elementMagnetCorner, contextMagnetCorner], true); }
																				if (elementMagnetCorner && contextMagnetCorner) { this.align(elementMagnetCorner, contextMagnetCorner); }
																}
												}
								},
								align: function(elementAlign, contextAlign) {
												var contextArgs = this.cfg.getProperty("context"),
																me = this,
																context, element, contextRegion;

												function doAlign(v, h) {
																switch (elementAlign) {
																				case Overlay.TOP_LEFT:
																								me.moveTo(h, v);
																								break;
																				case Overlay.TOP_RIGHT:
																								me.moveTo((h - element.offsetWidth), v);
																								break;
																				case Overlay.BOTTOM_LEFT:
																								me.moveTo(h, (v - element.offsetHeight));
																								break;
																				case Overlay.BOTTOM_RIGHT:
																								me.moveTo((h - element.offsetWidth), (v - element.offsetHeight));
																								break;
																}
												}
												if (contextArgs) {
																context = contextArgs[0];
																element = this.element;
																me = this;
																if (!elementAlign) { elementAlign = contextArgs[1]; }
																if (!contextAlign) { contextAlign = contextArgs[2]; }
																if (element && context) {
																				contextRegion = Dom.getRegion(context);
																				switch (contextAlign) {
																								case Overlay.TOP_LEFT:
																												doAlign(contextRegion.top, contextRegion.left);
																												break;
																								case Overlay.TOP_RIGHT:
																												doAlign(contextRegion.top, contextRegion.right);
																												break;
																								case Overlay.BOTTOM_LEFT:
																												doAlign(contextRegion.bottom, contextRegion.left);
																												break;
																								case Overlay.BOTTOM_RIGHT:
																												doAlign(contextRegion.bottom, contextRegion.right);
																												break;
																				}
																}
												}
								},
								enforceConstraints: function(type, args, obj) {
												var pos = args[0],
																x = pos[0],
																y = pos[1],
																offsetHeight = this.element.offsetHeight,
																offsetWidth = this.element.offsetWidth,
																viewPortWidth = Dom.getViewportWidth(),
																viewPortHeight = Dom.getViewportHeight(),
																scrollX = Dom.getDocumentScrollLeft(),
																scrollY = Dom.getDocumentScrollTop(),
																topConstraint = scrollY + 10,
																leftConstraint = scrollX + 10,
																bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10,
																rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
												if (x < leftConstraint) { x = leftConstraint; } else if (x > rightConstraint) { x = rightConstraint; }
												if (y < topConstraint) { y = topConstraint; } else if (y > bottomConstraint) { y = bottomConstraint; }
												this.cfg.setProperty("x", x, true);
												this.cfg.setProperty("y", y, true);
												this.cfg.setProperty("xy", [x, y], true);
								},
								center: function() {
												var scrollX = Dom.getDocumentScrollLeft(),
																scrollY = Dom.getDocumentScrollTop(),
																viewPortWidth = Dom.getClientWidth(),
																viewPortHeight = Dom.getClientHeight(),
																elementWidth = this.element.offsetWidth,
																elementHeight = this.element.offsetHeight,
																x = (viewPortWidth / 2) - (elementWidth / 2) + scrollX,
																y = (viewPortHeight / 2) - (elementHeight / 2) + scrollY;
												this.cfg.setProperty("xy", [parseInt(x, 10), parseInt(y, 10)]);
												this.cfg.refireEvent("iframe");
								},
								syncPosition: function() {
												var pos = Dom.getXY(this.element);
												this.cfg.setProperty("x", pos[0], true);
												this.cfg.setProperty("y", pos[1], true);
												this.cfg.setProperty("xy", pos, true);
								},
								onDomResize: function(e, obj) {
												var me = this;
												Overlay.superclass.onDomResize.call(this, e, obj);
												setTimeout(function() {
																me.syncPosition();
																me.cfg.refireEvent("iframe");
																me.cfg.refireEvent("context");
												}, 0);
								},
								bringToTop: function() {
												var aOverlays = [],
																oElement = this.element;

												function compareZIndexDesc(p_oOverlay1, p_oOverlay2) {
																var sZIndex1 = Dom.getStyle(p_oOverlay1, "zIndex"),
																				sZIndex2 = Dom.getStyle(p_oOverlay2, "zIndex"),
																				nZIndex1 = (!sZIndex1 || isNaN(sZIndex1)) ? 0 : parseInt(sZIndex1, 10),
																				nZIndex2 = (!sZIndex2 || isNaN(sZIndex2)) ? 0 : parseInt(sZIndex2, 10);
																if (nZIndex1 > nZIndex2) { return -1; } else if (nZIndex1 < nZIndex2) { return 1; } else { return 0; }
												}

												function isOverlayElement(p_oElement) {
																var oOverlay = Dom.hasClass(p_oElement, Overlay.CSS_OVERLAY),
																				Panel = YAHOO.widget.Panel;
																if (oOverlay && !Dom.isAncestor(oElement, oOverlay)) {
																				if (Panel && Dom.hasClass(p_oElement, Panel.CSS_PANEL)) { aOverlays[aOverlays.length] = p_oElement.parentNode; } else { aOverlays[aOverlays.length] = p_oElement; }
																}
												}
												Dom.getElementsBy(isOverlayElement, "DIV", document.body);
												aOverlays.sort(compareZIndexDesc);
												var oTopOverlay = aOverlays[0],
																nTopZIndex;
												if (oTopOverlay) { nTopZIndex = Dom.getStyle(oTopOverlay, "zIndex"); if (!isNaN(nTopZIndex) && oTopOverlay != oElement) { this.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2)); } }
								},
								destroy: function() {
												if (this.iframe) { this.iframe.parentNode.removeChild(this.iframe); }
												this.iframe = null;
												Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
												Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
												Overlay.superclass.destroy.call(this);
								},
								toString: function() { return "Overlay " + this.id; }
				});
}());
(function() {
				YAHOO.widget.OverlayManager = function(userConfig) { this.init(userConfig); };
				var Overlay = YAHOO.widget.Overlay,
								Event = YAHOO.util.Event,
								Dom = YAHOO.util.Dom,
								Config = YAHOO.util.Config,
								CustomEvent = YAHOO.util.CustomEvent,
								OverlayManager = YAHOO.widget.OverlayManager;
				OverlayManager.CSS_FOCUSED = "focused";
				OverlayManager.prototype = {
								constructor: OverlayManager,
								overlays: null,
								initDefaultConfig: function() {
												this.cfg.addProperty("overlays", { suppressEvent: true });
												this.cfg.addProperty("focusevent", { value: "mousedown" });
								},
								init: function(userConfig) {
												this.cfg = new Config(this);
												this.initDefaultConfig();
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												this.cfg.fireQueue();
												var activeOverlay = null;
												this.getActive = function() { return activeOverlay; };
												this.focus = function(overlay) {
																var o = this.find(overlay);
																if (o) {
																				if (activeOverlay != o) {
																								if (activeOverlay) { activeOverlay.blur(); }
																								this.bringToTop(o);
																								activeOverlay = o;
																								Dom.addClass(activeOverlay.element, OverlayManager.CSS_FOCUSED);
																								o.focusEvent.fire();
																				}
																}
												};
												this.remove = function(overlay) {
																var o = this.find(overlay),
																				originalZ;
																if (o) {
																				if (activeOverlay == o) { activeOverlay = null; }
																				var bDestroyed = (o.element === null && o.cfg === null) ? true : false;
																				if (!bDestroyed) {
																								originalZ = Dom.getStyle(o.element, "zIndex");
																								o.cfg.setProperty("zIndex", -1000, true);
																				}
																				this.overlays.sort(this.compareZIndexDesc);
																				this.overlays = this.overlays.slice(0, (this.overlays.length - 1));
																				o.hideEvent.unsubscribe(o.blur);
																				o.destroyEvent.unsubscribe(this._onOverlayDestroy, o);
																				if (!bDestroyed) {
																								Event.removeListener(o.element, this.cfg.getProperty("focusevent"), this._onOverlayElementFocus);
																								o.cfg.setProperty("zIndex", originalZ, true);
																								o.cfg.setProperty("manager", null);
																				}
																				o.focusEvent.unsubscribeAll();
																				o.blurEvent.unsubscribeAll();
																				o.focusEvent = null;
																				o.blurEvent = null;
																				o.focus = null;
																				o.blur = null;
																}
												};
												this.blurAll = function() {
																var nOverlays = this.overlays.length,
																				i;
																if (nOverlays > 0) {
																				i = nOverlays - 1;
																				do { this.overlays[i].blur(); }
																				while (i--);
																}
												};
												this._onOverlayBlur = function(p_sType, p_aArgs) { activeOverlay = null; };
												var overlays = this.cfg.getProperty("overlays");
												if (!this.overlays) { this.overlays = []; }
												if (overlays) {
																this.register(overlays);
																this.overlays.sort(this.compareZIndexDesc);
												}
								},
								_onOverlayElementFocus: function(p_oEvent) {
												var oTarget = Event.getTarget(p_oEvent),
																oClose = this.close;
												if (oClose && (oTarget == oClose || Dom.isAncestor(oClose, oTarget))) { this.blur(); } else { this.focus(); }
								},
								_onOverlayDestroy: function(p_sType, p_aArgs, p_oOverlay) { this.remove(p_oOverlay); },
								register: function(overlay) {
												var mgr = this,
																zIndex, regcount, i, nOverlays;
												if (overlay instanceof Overlay) {
																overlay.cfg.addProperty("manager", { value: this });
																overlay.focusEvent = overlay.createEvent("focus");
																overlay.focusEvent.signature = CustomEvent.LIST;
																overlay.blurEvent = overlay.createEvent("blur");
																overlay.blurEvent.signature = CustomEvent.LIST;
																overlay.focus = function() { mgr.focus(this); };
																overlay.blur = function() {
																				if (mgr.getActive() == this) {
																								Dom.removeClass(this.element, OverlayManager.CSS_FOCUSED);
																								this.blurEvent.fire();
																				}
																};
																overlay.blurEvent.subscribe(mgr._onOverlayBlur);
																overlay.hideEvent.subscribe(overlay.blur);
																overlay.destroyEvent.subscribe(this._onOverlayDestroy, overlay, this);
																Event.on(overlay.element, this.cfg.getProperty("focusevent"), this._onOverlayElementFocus, null, overlay);
																zIndex = Dom.getStyle(overlay.element, "zIndex");
																if (!isNaN(zIndex)) { overlay.cfg.setProperty("zIndex", parseInt(zIndex, 10)); } else { overlay.cfg.setProperty("zIndex", 0); }
																this.overlays.push(overlay);
																this.bringToTop(overlay);
																return true;
												} else if (overlay instanceof Array) {
																regcount = 0;
																nOverlays = overlay.length;
																for (i = 0; i < nOverlays; i++) { if (this.register(overlay[i])) { regcount++; } }
																if (regcount > 0) { return true; }
												} else { return false; }
								},
								bringToTop: function(p_oOverlay) {
												var oOverlay = this.find(p_oOverlay),
																nTopZIndex, oTopOverlay, aOverlays;
												if (oOverlay) {
																aOverlays = this.overlays;
																aOverlays.sort(this.compareZIndexDesc);
																oTopOverlay = aOverlays[0];
																if (oTopOverlay) {
																				nTopZIndex = Dom.getStyle(oTopOverlay.element, "zIndex");
																				if (!isNaN(nTopZIndex) && oTopOverlay != oOverlay) { oOverlay.cfg.setProperty("zIndex", (parseInt(nTopZIndex, 10) + 2)); }
																				aOverlays.sort(this.compareZIndexDesc);
																}
												}
								},
								find: function(overlay) {
												var aOverlays = this.overlays,
																nOverlays = aOverlays.length,
																i;
												if (nOverlays > 0) {
																i = nOverlays - 1;
																if (overlay instanceof Overlay) {
																				do { if (aOverlays[i] == overlay) { return aOverlays[i]; } }
																				while (i--);
																} else if (typeof overlay == "string") {
																				do { if (aOverlays[i].id == overlay) { return aOverlays[i]; } }
																				while (i--);
																}
																return null;
												}
								},
								compareZIndexDesc: function(o1, o2) {
												var zIndex1 = (o1.cfg) ? o1.cfg.getProperty("zIndex") : null,
																zIndex2 = (o2.cfg) ? o2.cfg.getProperty("zIndex") : null;
												if (zIndex1 === null && zIndex2 === null) { return 0; } else if (zIndex1 === null) { return 1; } else if (zIndex2 === null) { return -1; } else if (zIndex1 > zIndex2) { return -1; } else if (zIndex1 < zIndex2) { return 1; } else { return 0; }
								},
								showAll: function() {
												var aOverlays = this.overlays,
																nOverlays = aOverlays.length,
																i;
												if (nOverlays > 0) {
																i = nOverlays - 1;
																do { aOverlays[i].show(); }
																while (i--);
												}
								},
								hideAll: function() {
												var aOverlays = this.overlays,
																nOverlays = aOverlays.length,
																i;
												if (nOverlays > 0) {
																i = nOverlays - 1;
																do { aOverlays[i].hide(); }
																while (i--);
												}
								},
								toString: function() { return "OverlayManager"; }
				};
}());
(function() {
				YAHOO.widget.Tooltip = function(el, userConfig) { YAHOO.widget.Tooltip.superclass.constructor.call(this, el, userConfig); };
				var Lang = YAHOO.lang,
								Event = YAHOO.util.Event,
								Dom = YAHOO.util.Dom,
								Tooltip = YAHOO.widget.Tooltip,
								m_oShadowTemplate, DEFAULT_CONFIG = { "PREVENT_OVERLAP": { key: "preventoverlap", value: true, validator: Lang.isBoolean, supercedes: ["x", "y", "xy"] }, "SHOW_DELAY": { key: "showdelay", value: 200, validator: Lang.isNumber }, "AUTO_DISMISS_DELAY": { key: "autodismissdelay", value: 5000, validator: Lang.isNumber }, "HIDE_DELAY": { key: "hidedelay", value: 250, validator: Lang.isNumber }, "TEXT": { key: "text", suppressEvent: true }, "CONTAINER": { key: "container" } };
				Tooltip.CSS_TOOLTIP = "yui-tt";

				function restoreOriginalWidth(p_sType, p_aArgs, p_oObject) {
								var sOriginalWidth = p_oObject[0],
												sNewWidth = p_oObject[1],
												oConfig = this.cfg,
												sCurrentWidth = oConfig.getProperty("width");
								if (sCurrentWidth == sNewWidth) { oConfig.setProperty("width", sOriginalWidth); }
								this.unsubscribe("hide", this._onHide, p_oObject);
				}

				function setWidthToOffsetWidth(p_sType, p_aArgs) {
								var oBody = document.body,
												oConfig = this.cfg,
												sOriginalWidth = oConfig.getProperty("width"),
												sNewWidth, oClone;
								if ((!sOriginalWidth || sOriginalWidth == "auto") && (oConfig.getProperty("container") != oBody || oConfig.getProperty("x") >= Dom.getViewportWidth() || oConfig.getProperty("y") >= Dom.getViewportHeight())) {
												oClone = this.element.cloneNode(true);
												oClone.style.visibility = "hidden";
												oClone.style.top = "0px";
												oClone.style.left = "0px";
												oBody.appendChild(oClone);
												sNewWidth = (oClone.offsetWidth + "px");
												oBody.removeChild(oClone);
												oClone = null;
												oConfig.setProperty("width", sNewWidth);
												oConfig.refireEvent("xy");
												this.subscribe("hide", restoreOriginalWidth, [(sOriginalWidth || ""), sNewWidth]);
								}
				}

				function onDOMReady(p_sType, p_aArgs, p_oObject) { this.render(p_oObject); }

				function onInit() { Event.onDOMReady(onDOMReady, this.cfg.getProperty("container"), this); }
				YAHOO.extend(Tooltip, YAHOO.widget.Overlay, {
								init: function(el, userConfig) {
												Tooltip.superclass.init.call(this, el);
												this.beforeInitEvent.fire(Tooltip);
												Dom.addClass(this.element, Tooltip.CSS_TOOLTIP);
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												this.cfg.queueProperty("visible", false);
												this.cfg.queueProperty("constraintoviewport", true);
												this.setBody("");
												this.subscribe("beforeShow", setWidthToOffsetWidth);
												this.subscribe("init", onInit);
												this.subscribe("render", this.onRender);
												this.initEvent.fire(Tooltip);
								},
								initDefaultConfig: function() {
												Tooltip.superclass.initDefaultConfig.call(this);
												this.cfg.addProperty(DEFAULT_CONFIG.PREVENT_OVERLAP.key, { value: DEFAULT_CONFIG.PREVENT_OVERLAP.value, validator: DEFAULT_CONFIG.PREVENT_OVERLAP.validator, supercedes: DEFAULT_CONFIG.PREVENT_OVERLAP.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.SHOW_DELAY.key, { handler: this.configShowDelay, value: 200, validator: DEFAULT_CONFIG.SHOW_DELAY.validator });
												this.cfg.addProperty(DEFAULT_CONFIG.AUTO_DISMISS_DELAY.key, { handler: this.configAutoDismissDelay, value: DEFAULT_CONFIG.AUTO_DISMISS_DELAY.value, validator: DEFAULT_CONFIG.AUTO_DISMISS_DELAY.validator });
												this.cfg.addProperty(DEFAULT_CONFIG.HIDE_DELAY.key, { handler: this.configHideDelay, value: DEFAULT_CONFIG.HIDE_DELAY.value, validator: DEFAULT_CONFIG.HIDE_DELAY.validator });
												this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, { handler: this.configText, suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent });
												this.cfg.addProperty(DEFAULT_CONFIG.CONTAINER.key, { handler: this.configContainer, value: document.body });
								},
								configText: function(type, args, obj) { var text = args[0]; if (text) { this.setBody(text); } },
								configContainer: function(type, args, obj) { var container = args[0]; if (typeof container == 'string') { this.cfg.setProperty("container", document.getElementById(container), true); } },
								_removeEventListeners: function() {
												var aElements = this._context,
																nElements, oElement, i;
												if (aElements) {
																nElements = aElements.length;
																if (nElements > 0) {
																				i = nElements - 1;
																				do {
																								oElement = aElements[i];
																								Event.removeListener(oElement, "mouseover", this.onContextMouseOver);
																								Event.removeListener(oElement, "mousemove", this.onContextMouseMove);
																								Event.removeListener(oElement, "mouseout", this.onContextMouseOut);
																				}
																				while (i--);
																}
												}
								},
								configContext: function(type, args, obj) {
												var context = args[0],
																aElements, nElements, oElement, i;
												if (context) {
																if (!(context instanceof Array)) {
																				if (typeof context == "string") { this.cfg.setProperty("context", [document.getElementById(context)], true); } else { this.cfg.setProperty("context", [context], true); }
																				context = this.cfg.getProperty("context");
																}
																this._removeEventListeners();
																this._context = context;
																aElements = this._context;
																if (aElements) {
																				nElements = aElements.length;
																				if (nElements > 0) {
																								i = nElements - 1;
																								do {
																												oElement = aElements[i];
																												Event.on(oElement, "mouseover", this.onContextMouseOver, this);
																												Event.on(oElement, "mousemove", this.onContextMouseMove, this);
																												Event.on(oElement, "mouseout", this.onContextMouseOut, this);
																								}
																								while (i--);
																				}
																}
												}
								},
								onContextMouseMove: function(e, obj) {
												obj.pageX = Event.getPageX(e);
												obj.pageY = Event.getPageY(e);
								},
								onContextMouseOver: function(e, obj) {
												var context = this;
												if (obj.hideProcId) {
																clearTimeout(obj.hideProcId);
																obj.hideProcId = null;
												}
												Event.on(context, "mousemove", obj.onContextMouseMove, obj);
												if (context.title) {
																obj._tempTitle = context.title;
																context.title = "";
												}
												obj.showProcId = obj.doShow(e, context);
								},
								onContextMouseOut: function(e, obj) {
												var el = this;
												if (obj._tempTitle) {
																el.title = obj._tempTitle;
																obj._tempTitle = null;
												}
												if (obj.showProcId) {
																clearTimeout(obj.showProcId);
																obj.showProcId = null;
												}
												if (obj.hideProcId) {
																clearTimeout(obj.hideProcId);
																obj.hideProcId = null;
												}
												obj.hideProcId = setTimeout(function() { obj.hide(); }, obj.cfg.getProperty("hidedelay"));
								},
								doShow: function(e, context) {
												var yOffset = 25,
																me = this;
												if (YAHOO.env.ua.opera && context.tagName && context.tagName.toUpperCase() == "A") { yOffset += 12; }
												return setTimeout(function() {
																if (me._tempTitle) { me.setBody(me._tempTitle); } else { me.cfg.refireEvent("text"); }
																me.moveTo(me.pageX, me.pageY + yOffset);
																if (me.cfg.getProperty("preventoverlap")) { me.preventOverlap(me.pageX, me.pageY); }
																Event.removeListener(context, "mousemove", me.onContextMouseMove);
																me.show();
																me.hideProcId = me.doHide();
												}, this.cfg.getProperty("showdelay"));
								},
								doHide: function() { var me = this; return setTimeout(function() { me.hide(); }, this.cfg.getProperty("autodismissdelay")); },
								preventOverlap: function(pageX, pageY) {
												var height = this.element.offsetHeight,
																mousePoint = new YAHOO.util.Point(pageX, pageY),
																elementRegion = Dom.getRegion(this.element);
												elementRegion.top -= 5;
												elementRegion.left -= 5;
												elementRegion.right += 5;
												elementRegion.bottom += 5;
												if (elementRegion.contains(mousePoint)) { this.cfg.setProperty("y", (pageY - height - 5)); }
								},
								onRender: function(p_sType, p_aArgs) {
												function sizeShadow() {
																var oElement = this.element,
																				oShadow = this._shadow;
																if (oShadow) {
																				oShadow.style.width = (oElement.offsetWidth + 6) + "px";
																				oShadow.style.height = (oElement.offsetHeight + 1) + "px";
																}
												}

												function addShadowVisibleClass() { Dom.addClass(this._shadow, "yui-tt-shadow-visible"); }

												function removeShadowVisibleClass() { Dom.removeClass(this._shadow, "yui-tt-shadow-visible"); }

												function createShadow() {
																var oShadow = this._shadow,
																				oElement, Module, nIE, me;
																if (!oShadow) {
																				oElement = this.element;
																				Module = YAHOO.widget.Module;
																				nIE = YAHOO.env.ua.ie;
																				me = this;
																				if (!m_oShadowTemplate) {
																								m_oShadowTemplate = document.createElement("div");
																								m_oShadowTemplate.className = "yui-tt-shadow";
																				}
																				oShadow = m_oShadowTemplate.cloneNode(false);
																				oElement.appendChild(oShadow);
																				this._shadow = oShadow;
																				addShadowVisibleClass.call(this);
																				this.subscribe("beforeShow", addShadowVisibleClass);
																				this.subscribe("beforeHide", removeShadowVisibleClass);
																				if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {
																								window.setTimeout(function() { sizeShadow.call(me); }, 0);
																								this.cfg.subscribeToConfigEvent("width", sizeShadow);
																								this.cfg.subscribeToConfigEvent("height", sizeShadow);
																								this.subscribe("changeContent", sizeShadow);
																								Module.textResizeEvent.subscribe(sizeShadow, this, true);
																								this.subscribe("destroy", function() { Module.textResizeEvent.unsubscribe(sizeShadow, this); });
																				}
																}
												}

												function onBeforeShow() {
																createShadow.call(this);
																this.unsubscribe("beforeShow", onBeforeShow);
												}
												if (this.cfg.getProperty("visible")) { createShadow.call(this); } else { this.subscribe("beforeShow", onBeforeShow); }
								},
								destroy: function() {
												this._removeEventListeners();
												Tooltip.superclass.destroy.call(this);
								},
								toString: function() { return "Tooltip " + this.id; }
				});
}());
(function() {
				YAHOO.widget.Panel = function(el, userConfig) { YAHOO.widget.Panel.superclass.constructor.call(this, el, userConfig); };
				var Lang = YAHOO.lang,
								DD = YAHOO.util.DD,
								Dom = YAHOO.util.Dom,
								Event = YAHOO.util.Event,
								Overlay = YAHOO.widget.Overlay,
								CustomEvent = YAHOO.util.CustomEvent,
								Config = YAHOO.util.Config,
								Panel = YAHOO.widget.Panel,
								m_oMaskTemplate, m_oUnderlayTemplate, m_oCloseIconTemplate, EVENT_TYPES = { "SHOW_MASK": "showMask", "HIDE_MASK": "hideMask", "DRAG": "drag" },
								DEFAULT_CONFIG = { "CLOSE": { key: "close", value: true, validator: Lang.isBoolean, supercedes: ["visible"] }, "DRAGGABLE": { key: "draggable", value: (DD ? true : false), validator: Lang.isBoolean, supercedes: ["visible"] }, "UNDERLAY": { key: "underlay", value: "shadow", supercedes: ["visible"] }, "MODAL": { key: "modal", value: false, validator: Lang.isBoolean, supercedes: ["visible", "zindex"] }, "KEY_LISTENERS": { key: "keylisteners", suppressEvent: true, supercedes: ["visible"] } };
				Panel.CSS_PANEL = "yui-panel";
				Panel.CSS_PANEL_CONTAINER = "yui-panel-container";

				function createHeader(p_sType, p_aArgs) { if (!this.header) { this.setHeader("&#160;"); } }

				function restoreOriginalWidth(p_sType, p_aArgs, p_oObject) {
								var sOriginalWidth = p_oObject[0],
												sNewWidth = p_oObject[1],
												oConfig = this.cfg,
												sCurrentWidth = oConfig.getProperty("width");
								if (sCurrentWidth == sNewWidth) { oConfig.setProperty("width", sOriginalWidth); }
								this.unsubscribe("hide", restoreOriginalWidth, p_oObject);
				}

				function setWidthToOffsetWidth(p_sType, p_aArgs) {
								var nIE = YAHOO.env.ua.ie,
												oConfig, sOriginalWidth, sNewWidth;
								if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {
												oConfig = this.cfg;
												sOriginalWidth = oConfig.getProperty("width");
												if (!sOriginalWidth || sOriginalWidth == "auto") {
																sNewWidth = (this.element.offsetWidth + "px");
																oConfig.setProperty("width", sNewWidth);
																this.subscribe("hide", restoreOriginalWidth, [(sOriginalWidth || ""), sNewWidth]);
												}
								}
				}

				function onElementFocus() { this.blur(); }

				function addFocusEventHandlers(p_sType, p_aArgs) {
								var me = this;

								function isFocusable(el) {
												var sTagName = el.tagName.toUpperCase(),
																bFocusable = false;
												switch (sTagName) {
																case "A":
																case "BUTTON":
																case "SELECT":
																case "TEXTAREA":
																				if (!Dom.isAncestor(me.element, el)) {
																								Event.on(el, "focus", onElementFocus, el, true);
																								bFocusable = true;
																				}
																				break;
																case "INPUT":
																				if (el.type != "hidden" && !Dom.isAncestor(me.element, el)) {
																								Event.on(el, "focus", onElementFocus, el, true);
																								bFocusable = true;
																				}
																				break;
												}
												return bFocusable;
								}
								this.focusableElements = Dom.getElementsBy(isFocusable);
				}

				function removeFocusEventHandlers(p_sType, p_aArgs) {
								var aElements = this.focusableElements,
												nElements = aElements.length,
												el2, i;
								for (i = 0; i < nElements; i++) {
												el2 = aElements[i];
												Event.removeListener(el2, "focus", onElementFocus);
								}
				}
				YAHOO.extend(Panel, Overlay, {
								init: function(el, userConfig) {
												Panel.superclass.init.call(this, el);
												this.beforeInitEvent.fire(Panel);
												Dom.addClass(this.element, Panel.CSS_PANEL);
												this.buildWrapper();
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												this.subscribe("showMask", addFocusEventHandlers);
												this.subscribe("hideMask", removeFocusEventHandlers);
												if (this.cfg.getProperty("draggable")) { this.subscribe("beforeRender", createHeader); }
												this.initEvent.fire(Panel);
								},
								initEvents: function() {
												Panel.superclass.initEvents.call(this);
												var SIGNATURE = CustomEvent.LIST;
												this.showMaskEvent = this.createEvent(EVENT_TYPES.SHOW_MASK);
												this.showMaskEvent.signature = SIGNATURE;
												this.hideMaskEvent = this.createEvent(EVENT_TYPES.HIDE_MASK);
												this.hideMaskEvent.signature = SIGNATURE;
												this.dragEvent = this.createEvent(EVENT_TYPES.DRAG);
												this.dragEvent.signature = SIGNATURE;
								},
								initDefaultConfig: function() {
												Panel.superclass.initDefaultConfig.call(this);
												this.cfg.addProperty(DEFAULT_CONFIG.CLOSE.key, { handler: this.configClose, value: DEFAULT_CONFIG.CLOSE.value, validator: DEFAULT_CONFIG.CLOSE.validator, supercedes: DEFAULT_CONFIG.CLOSE.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.DRAGGABLE.key, { handler: this.configDraggable, value: DEFAULT_CONFIG.DRAGGABLE.value, validator: DEFAULT_CONFIG.DRAGGABLE.validator, supercedes: DEFAULT_CONFIG.DRAGGABLE.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.UNDERLAY.key, { handler: this.configUnderlay, value: DEFAULT_CONFIG.UNDERLAY.value, supercedes: DEFAULT_CONFIG.UNDERLAY.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.MODAL.key, { handler: this.configModal, value: DEFAULT_CONFIG.MODAL.value, validator: DEFAULT_CONFIG.MODAL.validator, supercedes: DEFAULT_CONFIG.MODAL.supercedes });
												this.cfg.addProperty(DEFAULT_CONFIG.KEY_LISTENERS.key, { handler: this.configKeyListeners, suppressEvent: DEFAULT_CONFIG.KEY_LISTENERS.suppressEvent, supercedes: DEFAULT_CONFIG.KEY_LISTENERS.supercedes });
								},
								configClose: function(type, args, obj) {
												var val = args[0],
																oClose = this.close;

												function doHide(e, obj) { obj.hide(); }
												if (val) {
																if (!oClose) {
																				if (!m_oCloseIconTemplate) {
																								m_oCloseIconTemplate = document.createElement("span");
																								m_oCloseIconTemplate.innerHTML = "&#160;";
																								m_oCloseIconTemplate.className = "container-close";
																				}
																				oClose = m_oCloseIconTemplate.cloneNode(true);
																				this.innerElement.appendChild(oClose);
																				Event.on(oClose, "click", doHide, this);
																				this.close = oClose;
																} else { oClose.style.display = "block"; }
												} else { if (oClose) { oClose.style.display = "none"; } }
								},
								configDraggable: function(type, args, obj) {
												var val = args[0];
												if (val) {
																if (!DD) { this.cfg.setProperty("draggable", false); return; }
																if (this.header) {
																				Dom.setStyle(this.header, "cursor", "move");
																				this.registerDragDrop();
																}
																if (!Config.alreadySubscribed(this.beforeRenderEvent, createHeader, null)) { this.subscribe("beforeRender", createHeader); }
																this.subscribe("beforeShow", setWidthToOffsetWidth);
												} else {
																if (this.dd) { this.dd.unreg(); }
																if (this.header) { Dom.setStyle(this.header, "cursor", "auto"); }
																this.unsubscribe("beforeRender", createHeader);
																this.unsubscribe("beforeShow", setWidthToOffsetWidth);
												}
								},
								configUnderlay: function(type, args, obj) {
												var UA = YAHOO.env.ua,
																bMacGecko = (this.platform == "mac" && UA.gecko),
																sUnderlay = args[0].toLowerCase(),
																oUnderlay = this.underlay,
																oElement = this.element;

												function createUnderlay() {
																var nIE;
																if (!oUnderlay) {
																				if (!m_oUnderlayTemplate) {
																								m_oUnderlayTemplate = document.createElement("div");
																								m_oUnderlayTemplate.className = "underlay";
																				}
																				oUnderlay = m_oUnderlayTemplate.cloneNode(false);
																				this.element.appendChild(oUnderlay);
																				this.underlay = oUnderlay;
																				nIE = UA.ie;
																				if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {
																								this.sizeUnderlay();
																								this.cfg.subscribeToConfigEvent("width", this.sizeUnderlay);
																								this.cfg.subscribeToConfigEvent("height", this.sizeUnderlay);
																								this.changeContentEvent.subscribe(this.sizeUnderlay);
																								YAHOO.widget.Module.textResizeEvent.subscribe(this.sizeUnderlay, this, true);
																				}
																}
												}

												function onBeforeShow() {
																createUnderlay.call(this);
																this._underlayDeferred = false;
																this.beforeShowEvent.unsubscribe(onBeforeShow);
												}

												function destroyUnderlay() {
																if (this._underlayDeferred) {
																				this.beforeShowEvent.unsubscribe(onBeforeShow);
																				this._underlayDeferred = false;
																}
																if (oUnderlay) {
																				this.cfg.unsubscribeFromConfigEvent("width", this.sizeUnderlay);
																				this.cfg.unsubscribeFromConfigEvent("height", this.sizeUnderlay);
																				this.changeContentEvent.unsubscribe(this.sizeUnderlay);
																				YAHOO.widget.Module.textResizeEvent.unsubscribe(this.sizeUnderlay, this, true);
																				this.element.removeChild(oUnderlay);
																				this.underlay = null;
																}
												}
												switch (sUnderlay) {
																case "shadow":
																				Dom.removeClass(oElement, "matte");
																				Dom.addClass(oElement, "shadow");
																				break;
																case "matte":
																				if (!bMacGecko) { destroyUnderlay.call(this); }
																				Dom.removeClass(oElement, "shadow");
																				Dom.addClass(oElement, "matte");
																				break;
																default:
																				if (!bMacGecko) { destroyUnderlay.call(this); }
																				Dom.removeClass(oElement, "shadow");
																				Dom.removeClass(oElement, "matte");
																				break;
												}
												if ((sUnderlay == "shadow") || (bMacGecko && !oUnderlay)) {
																if (this.cfg.getProperty("visible")) { createUnderlay.call(this); } else {
																				if (!this._underlayDeferred) {
																								this.beforeShowEvent.subscribe(onBeforeShow);
																								this._underlayDeferred = true;
																				}
																}
												}
								},
								configModal: function(type, args, obj) {
												var modal = args[0];
												if (modal) {
																if (!this._hasModalityEventListeners) {
																				this.subscribe("beforeShow", this.buildMask);
																				this.subscribe("beforeShow", this.bringToTop);
																				this.subscribe("beforeShow", this.showMask);
																				this.subscribe("hide", this.hideMask);
																				Overlay.windowResizeEvent.subscribe(this.sizeMask, this, true);
																				this._hasModalityEventListeners = true;
																}
												} else {
																if (this._hasModalityEventListeners) {
																				if (this.cfg.getProperty("visible")) {
																								this.hideMask();
																								this.removeMask();
																				}
																				this.unsubscribe("beforeShow", this.buildMask);
																				this.unsubscribe("beforeShow", this.bringToTop);
																				this.unsubscribe("beforeShow", this.showMask);
																				this.unsubscribe("hide", this.hideMask);
																				Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
																				this._hasModalityEventListeners = false;
																}
												}
								},
								removeMask: function() {
												var oMask = this.mask,
																oParentNode;
												if (oMask) {
																this.hideMask();
																oParentNode = oMask.parentNode;
																if (oParentNode) { oParentNode.removeChild(oMask); }
																this.mask = null;
												}
								},
								configKeyListeners: function(type, args, obj) {
												var listeners = args[0],
																listener, nListeners, i;
												if (listeners) {
																if (listeners instanceof Array) {
																				nListeners = listeners.length;
																				for (i = 0; i < nListeners; i++) {
																								listener = listeners[i];
																								if (!Config.alreadySubscribed(this.showEvent, listener.enable, listener)) { this.showEvent.subscribe(listener.enable, listener, true); }
																								if (!Config.alreadySubscribed(this.hideEvent, listener.disable, listener)) {
																												this.hideEvent.subscribe(listener.disable, listener, true);
																												this.destroyEvent.subscribe(listener.disable, listener, true);
																								}
																				}
																} else {
																				if (!Config.alreadySubscribed(this.showEvent, listeners.enable, listeners)) { this.showEvent.subscribe(listeners.enable, listeners, true); }
																				if (!Config.alreadySubscribed(this.hideEvent, listeners.disable, listeners)) {
																								this.hideEvent.subscribe(listeners.disable, listeners, true);
																								this.destroyEvent.subscribe(listeners.disable, listeners, true);
																				}
																}
												}
								},
								configHeight: function(type, args, obj) {
												var height = args[0],
																el = this.innerElement;
												Dom.setStyle(el, "height", height);
												this.cfg.refireEvent("iframe");
								},
								configWidth: function(type, args, obj) {
												var width = args[0],
																el = this.innerElement;
												Dom.setStyle(el, "width", width);
												this.cfg.refireEvent("iframe");
								},
								configzIndex: function(type, args, obj) {
												Panel.superclass.configzIndex.call(this, type, args, obj);
												if (this.mask || this.cfg.getProperty("modal") === true) {
																var panelZ = Dom.getStyle(this.element, "zIndex");
																if (!panelZ || isNaN(panelZ)) { panelZ = 0; }
																if (panelZ === 0) { this.cfg.setProperty("zIndex", 1); } else { this.stackMask(); }
												}
								},
								buildWrapper: function() {
												var elementParent = this.element.parentNode,
																originalElement = this.element,
																wrapper = document.createElement("div");
												wrapper.className = Panel.CSS_PANEL_CONTAINER;
												wrapper.id = originalElement.id + "_c";
												if (elementParent) { elementParent.insertBefore(wrapper, originalElement); }
												wrapper.appendChild(originalElement);
												this.element = wrapper;
												this.innerElement = originalElement;
												Dom.setStyle(this.innerElement, "visibility", "inherit");
								},
								sizeUnderlay: function() {
												var oUnderlay = this.underlay,
																oElement;
												if (oUnderlay) {
																oElement = this.element;
																oUnderlay.style.width = oElement.offsetWidth + "px";
																oUnderlay.style.height = oElement.offsetHeight + "px";
												}
								},
								registerDragDrop: function() {
												var me = this;
												if (this.header) {
																if (!DD) { return; }
																this.dd = new DD(this.element.id, this.id);
																if (!this.header.id) { this.header.id = this.id + "_h"; }
																this.dd.startDrag = function() {
																				var offsetHeight, offsetWidth, viewPortWidth, viewPortHeight, scrollX, scrollY, topConstraint, leftConstraint, bottomConstraint, rightConstraint;
																				if (YAHOO.env.ua.ie == 6) { Dom.addClass(me.element, "drag"); }
																				if (me.cfg.getProperty("constraintoviewport")) {
																								offsetHeight = me.element.offsetHeight;
																								offsetWidth = me.element.offsetWidth;
																								viewPortWidth = Dom.getViewportWidth();
																								viewPortHeight = Dom.getViewportHeight();
																								scrollX = Dom.getDocumentScrollLeft();
																								scrollY = Dom.getDocumentScrollTop();
																								topConstraint = scrollY + 10;
																								leftConstraint = scrollX + 10;
																								bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
																								rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;
																								this.minX = leftConstraint;
																								this.maxX = rightConstraint;
																								this.constrainX = true;
																								this.minY = topConstraint;
																								this.maxY = bottomConstraint;
																								this.constrainY = true;
																				} else {
																								this.constrainX = false;
																								this.constrainY = false;
																				}
																				me.dragEvent.fire("startDrag", arguments);
																};
																this.dd.onDrag = function() {
																				me.syncPosition();
																				me.cfg.refireEvent("iframe");
																				if (this.platform == "mac" && YAHOO.env.ua.gecko) { this.showMacGeckoScrollbars(); }
																				me.dragEvent.fire("onDrag", arguments);
																};
																this.dd.endDrag = function() {
																				if (YAHOO.env.ua.ie == 6) { Dom.removeClass(me.element, "drag"); }
																				me.dragEvent.fire("endDrag", arguments);
																				me.moveEvent.fire(me.cfg.getProperty("xy"));
																};
																this.dd.setHandleElId(this.header.id);
																this.dd.addInvalidHandleType("INPUT");
																this.dd.addInvalidHandleType("SELECT");
																this.dd.addInvalidHandleType("TEXTAREA");
												}
								},
								buildMask: function() {
												var oMask = this.mask;
												if (!oMask) {
																if (!m_oMaskTemplate) {
																				m_oMaskTemplate = document.createElement("div");
																				m_oMaskTemplate.className = "mask";
																				m_oMaskTemplate.innerHTML = "&#160;";
																}
																oMask = m_oMaskTemplate.cloneNode(true);
																oMask.id = this.id + "_mask";
																document.body.insertBefore(oMask, document.body.firstChild);
																this.mask = oMask;
																this.stackMask();
												}
								},
								hideMask: function() {
												if (this.cfg.getProperty("modal") && this.mask) {
																this.mask.style.display = "none";
																this.hideMaskEvent.fire();
																Dom.removeClass(document.body, "masked");
												}
								},
								showMask: function() {
												if (this.cfg.getProperty("modal") && this.mask) {
																Dom.addClass(document.body, "masked");
																this.sizeMask();
																this.mask.style.display = "block";
																this.showMaskEvent.fire();
												}
								},
								sizeMask: function() {
												if (this.mask) {
																this.mask.style.height = Dom.getDocumentHeight() + "px";
																this.mask.style.width = Dom.getDocumentWidth() + "px";
												}
								},
								stackMask: function() { if (this.mask) { var panelZ = Dom.getStyle(this.element, "zIndex"); if (!YAHOO.lang.isUndefined(panelZ) && !isNaN(panelZ)) { Dom.setStyle(this.mask, "zIndex", panelZ - 1); } } },
								render: function(appendToNode) { return Panel.superclass.render.call(this, appendToNode, this.innerElement); },
								destroy: function() {
												Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
												this.removeMask();
												if (this.close) { Event.purgeElement(this.close); }
												Panel.superclass.destroy.call(this);
								},
								toString: function() { return "Panel " + this.id; }
				});
}());
(function() {
				YAHOO.widget.Dialog = function(el, userConfig) { YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig); };
				var Event = YAHOO.util.Event,
								CustomEvent = YAHOO.util.CustomEvent,
								Dom = YAHOO.util.Dom,
								KeyListener = YAHOO.util.KeyListener,
								Connect = YAHOO.util.Connect,
								Dialog = YAHOO.widget.Dialog,
								Lang = YAHOO.lang,
								EVENT_TYPES = { "BEFORE_SUBMIT": "beforeSubmit", "SUBMIT": "submit", "MANUAL_SUBMIT": "manualSubmit", "ASYNC_SUBMIT": "asyncSubmit", "FORM_SUBMIT": "formSubmit", "CANCEL": "cancel" },
								DEFAULT_CONFIG = { "POST_METHOD": { key: "postmethod", value: "async" }, "BUTTONS": { key: "buttons", value: "none" } };
				Dialog.CSS_DIALOG = "yui-dialog";

				function removeButtonEventHandlers() {
								var aButtons = this._aButtons,
												nButtons, oButton, i;
								if (Lang.isArray(aButtons)) {
												nButtons = aButtons.length;
												if (nButtons > 0) {
																i = nButtons - 1;
																do {
																				oButton = aButtons[i];
																				if (YAHOO.widget.Button && oButton instanceof YAHOO.widget.Button) { oButton.destroy(); } else if (oButton.tagName.toUpperCase() == "BUTTON") {
																								Event.purgeElement(oButton);
																								Event.purgeElement(oButton, false);
																				}
																}
																while (i--);
												}
								}
				}
				YAHOO.extend(Dialog, YAHOO.widget.Panel, {
								form: null,
								initDefaultConfig: function() {
												Dialog.superclass.initDefaultConfig.call(this);
												this.callback = { success: null, failure: null, argument: null };
												this.cfg.addProperty(DEFAULT_CONFIG.POST_METHOD.key, { handler: this.configPostMethod, value: DEFAULT_CONFIG.POST_METHOD.value, validator: function(val) { if (val != "form" && val != "async" && val != "none" && val != "manual") { return false; } else { return true; } } });
												this.cfg.addProperty(DEFAULT_CONFIG.BUTTONS.key, { handler: this.configButtons, value: DEFAULT_CONFIG.BUTTONS.value });
								},
								initEvents: function() {
												Dialog.superclass.initEvents.call(this);
												var SIGNATURE = CustomEvent.LIST;
												this.beforeSubmitEvent = this.createEvent(EVENT_TYPES.BEFORE_SUBMIT);
												this.beforeSubmitEvent.signature = SIGNATURE;
												this.submitEvent = this.createEvent(EVENT_TYPES.SUBMIT);
												this.submitEvent.signature = SIGNATURE;
												this.manualSubmitEvent = this.createEvent(EVENT_TYPES.MANUAL_SUBMIT);
												this.manualSubmitEvent.signature = SIGNATURE;
												this.asyncSubmitEvent = this.createEvent(EVENT_TYPES.ASYNC_SUBMIT);
												this.asyncSubmitEvent.signature = SIGNATURE;
												this.formSubmitEvent = this.createEvent(EVENT_TYPES.FORM_SUBMIT);
												this.formSubmitEvent.signature = SIGNATURE;
												this.cancelEvent = this.createEvent(EVENT_TYPES.CANCEL);
												this.cancelEvent.signature = SIGNATURE;
								},
								init: function(el, userConfig) {
												Dialog.superclass.init.call(this, el);
												this.beforeInitEvent.fire(Dialog);
												Dom.addClass(this.element, Dialog.CSS_DIALOG);
												this.cfg.setProperty("visible", false);
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												this.showEvent.subscribe(this.focusFirst, this, true);
												this.beforeHideEvent.subscribe(this.blurButtons, this, true);
												this.subscribe("changeBody", this.registerForm);
												this.initEvent.fire(Dialog);
								},
								doSubmit: function() {
												var oForm = this.form,
																bUseFileUpload = false,
																bUseSecureFileUpload = false,
																aElements, nElements, i, sMethod;
												switch (this.cfg.getProperty("postmethod")) {
																case "async":
																				aElements = oForm.elements;
																				nElements = aElements.length;
																				if (nElements > 0) {
																								i = nElements - 1;
																								do { if (aElements[i].type == "file") { bUseFileUpload = true; break; } }
																								while (i--);
																				}
																				if (bUseFileUpload && YAHOO.env.ua.ie && this.isSecure) { bUseSecureFileUpload = true; }
																				sMethod = (oForm.getAttribute("method") || "POST").toUpperCase();
																				Connect.setForm(oForm, bUseFileUpload, bUseSecureFileUpload);
																				Connect.asyncRequest(sMethod, oForm.getAttribute("action"), this.callback);
																				this.asyncSubmitEvent.fire();
																				break;
																case "form":
																				oForm.submit();
																				this.formSubmitEvent.fire();
																				break;
																case "none":
																case "manual":
																				this.manualSubmitEvent.fire();
																				break;
												}
								},
								registerForm: function() {
												var form = this.element.getElementsByTagName("form")[0],
																me = this,
																firstElement, lastElement;
												if (this.form) {
																if (this.form == form && Dom.isAncestor(this.element, this.form)) { return; } else {
																				Event.purgeElement(this.form);
																				this.form = null;
																}
												}
												if (!form) {
																form = document.createElement("form");
																form.name = "frm_" + this.id;
																this.body.appendChild(form);
												}
												if (form) {
																this.form = form;
																Event.on(form, "submit", function(e) {
																				Event.stopEvent(e);
																				this.submit();
																				this.form.blur();
																}, this, true);
																this.firstFormElement = function() {
																				var f, el, nElements = form.elements.length;
																				for (f = 0; f < nElements; f++) { el = form.elements[f]; if (el.focus && !el.disabled && el.type != "hidden") { return el; } }
																				return null;
																}();
																this.lastFormElement = function() {
																				var f, el, nElements = form.elements.length;
																				for (f = nElements - 1; f >= 0; f--) { el = form.elements[f]; if (el.focus && !el.disabled && el.type != "hidden") { return el; } }
																				return null;
																}();
																if (this.cfg.getProperty("modal")) {
																				firstElement = this.firstFormElement || this.firstButton;
																				if (firstElement) {
																								this.preventBackTab = new KeyListener(firstElement, { shift: true, keys: 9 }, { fn: me.focusLast, scope: me, correctScope: true });
																								this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
																								this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
																				}
																				lastElement = this.lastButton || this.lastFormElement;
																				if (lastElement) {
																								this.preventTabOut = new KeyListener(lastElement, { shift: false, keys: 9 }, { fn: me.focusFirst, scope: me, correctScope: true });
																								this.showEvent.subscribe(this.preventTabOut.enable, this.preventTabOut, true);
																								this.hideEvent.subscribe(this.preventTabOut.disable, this.preventTabOut, true);
																				}
																}
												}
								},
								configClose: function(type, args, obj) {
												var val = args[0];

												function doCancel(e, obj) { obj.cancel(); }
												if (val) {
																if (!this.close) {
																				this.close = document.createElement("div");
																				Dom.addClass(this.close, "container-close");
																				this.close.innerHTML = "&#160;";
																				this.innerElement.appendChild(this.close);
																				Event.on(this.close, "click", doCancel, this);
																} else { this.close.style.display = "block"; }
												} else { if (this.close) { this.close.style.display = "none"; } }
								},
								configButtons: function(type, args, obj) {
												var Button = YAHOO.widget.Button,
																aButtons = args[0],
																oInnerElement = this.innerElement,
																oButton, oButtonEl, oYUIButton, nButtons, oSpan, oFooter, i;
												removeButtonEventHandlers.call(this);
												this._aButtons = null;
												if (Lang.isArray(aButtons)) {
																oSpan = document.createElement("span");
																oSpan.className = "button-group";
																nButtons = aButtons.length;
																this._aButtons = [];
																for (i = 0; i < nButtons; i++) {
																				oButton = aButtons[i];
																				if (Button) {
																								oYUIButton = new Button({ label: oButton.text, container: oSpan });
																								oButtonEl = oYUIButton.get("element");
																								if (oButton.isDefault) {
																												oYUIButton.addClass("default");
																												this.defaultHtmlButton = oButtonEl;
																								}
																								if (Lang.isFunction(oButton.handler)) { oYUIButton.set("onclick", { fn: oButton.handler, obj: this, scope: this }); } else if (Lang.isObject(oButton.handler) && Lang.isFunction(oButton.handler.fn)) { oYUIButton.set("onclick", { fn: oButton.handler.fn, obj: ((!Lang.isUndefined(oButton.handler.obj)) ? oButton.handler.obj : this), scope: (oButton.handler.scope || this) }); }
																								this._aButtons[this._aButtons.length] = oYUIButton;
																				} else {
																								oButtonEl = document.createElement("button");
																								oButtonEl.setAttribute("type", "button");
																								if (oButton.isDefault) {
																												oButtonEl.className = "default";
																												this.defaultHtmlButton = oButtonEl;
																								}
																								oButtonEl.innerHTML = oButton.text;
																								if (Lang.isFunction(oButton.handler)) { Event.on(oButtonEl, "click", oButton.handler, this, true); } else if (Lang.isObject(oButton.handler) && Lang.isFunction(oButton.handler.fn)) { Event.on(oButtonEl, "click", oButton.handler.fn, ((!Lang.isUndefined(oButton.handler.obj)) ? oButton.handler.obj : this), (oButton.handler.scope || this)); }
																								oSpan.appendChild(oButtonEl);
																								this._aButtons[this._aButtons.length] = oButtonEl;
																				}
																				oButton.htmlButton = oButtonEl;
																				if (i === 0) { this.firstButton = oButtonEl; }
																				if (i == (nButtons - 1)) { this.lastButton = oButtonEl; }
																}
																this.setFooter(oSpan);
																oFooter = this.footer;
																if (Dom.inDocument(this.element) && !Dom.isAncestor(oInnerElement, oFooter)) { oInnerElement.appendChild(oFooter); }
																this.buttonSpan = oSpan;
												} else {
																oSpan = this.buttonSpan;
																oFooter = this.footer;
																if (oSpan && oFooter) {
																				oFooter.removeChild(oSpan);
																				this.buttonSpan = null;
																				this.firstButton = null;
																				this.lastButton = null;
																				this.defaultHtmlButton = null;
																}
												}
												this.cfg.refireEvent("iframe");
												this.cfg.refireEvent("underlay");
								},
								getButtons: function() { var aButtons = this._aButtons; if (aButtons) { return aButtons; } },
								focusFirst: function(type, args, obj) {
												var oElement = this.firstFormElement,
																oEvent;
												if (args) { oEvent = args[1]; if (oEvent) { Event.stopEvent(oEvent); } }
												if (oElement) {
																try { oElement.focus(); } catch (oException) {}
												} else { this.focusDefaultButton(); }
								},
								focusLast: function(type, args, obj) {
												var aButtons = this.cfg.getProperty("buttons"),
																oElement = this.lastFormElement,
																oEvent;
												if (args) { oEvent = args[1]; if (oEvent) { Event.stopEvent(oEvent); } }
												if (aButtons && Lang.isArray(aButtons)) { this.focusLastButton(); } else {
																if (oElement) {
																				try { oElement.focus(); } catch (oException) {}
																}
												}
								},
								focusDefaultButton: function() {
												var oElement = this.defaultHtmlButton;
												if (oElement) {
																try { oElement.focus(); } catch (oException) {}
												}
								},
								blurButtons: function() {
												var aButtons = this.cfg.getProperty("buttons"),
																nButtons, oButton, oElement, i;
												if (aButtons && Lang.isArray(aButtons)) {
																nButtons = aButtons.length;
																if (nButtons > 0) {
																				i = (nButtons - 1);
																				do {
																								oButton = aButtons[i];
																								if (oButton) {
																												oElement = oButton.htmlButton;
																												if (oElement) {
																																try { oElement.blur(); } catch (oException) {}
																												}
																								}
																				}
																				while (i--);
																}
												}
								},
								focusFirstButton: function() {
												var aButtons = this.cfg.getProperty("buttons"),
																oButton, oElement;
												if (aButtons && Lang.isArray(aButtons)) {
																oButton = aButtons[0];
																if (oButton) {
																				oElement = oButton.htmlButton;
																				if (oElement) {
																								try { oElement.focus(); } catch (oException) {}
																				}
																}
												}
								},
								focusLastButton: function() {
												var aButtons = this.cfg.getProperty("buttons"),
																nButtons, oButton, oElement;
												if (aButtons && Lang.isArray(aButtons)) {
																nButtons = aButtons.length;
																if (nButtons > 0) {
																				oButton = aButtons[(nButtons - 1)];
																				if (oButton) {
																								oElement = oButton.htmlButton;
																								if (oElement) {
																												try { oElement.focus(); } catch (oException) {}
																								}
																				}
																}
												}
								},
								configPostMethod: function(type, args, obj) {
												var postmethod = args[0];
												this.registerForm();
								},
								validate: function() { return true; },
								submit: function() {
												if (this.validate()) {
																this.beforeSubmitEvent.fire();
																this.doSubmit();
																this.submitEvent.fire();
																this.hide();
																return true;
												} else { return false; }
								},
								cancel: function() {
												this.cancelEvent.fire();
												this.hide();
								},
								getData: function() {
												var oForm = this.form,
																aElements, nTotalElements, oData, sName, oElement, nElements, sType, sTagName, aOptions, nOptions, aValues, oOption, sValue, oRadio, oCheckbox, i, n;

												function isFormElement(p_oElement) { var sTag = p_oElement.tagName.toUpperCase(); return ((sTag == "INPUT" || sTag == "TEXTAREA" || sTag == "SELECT") && p_oElement.name == sName); }
												if (oForm) {
																aElements = oForm.elements;
																nTotalElements = aElements.length;
																oData = {};
																for (i = 0; i < nTotalElements; i++) {
																				sName = aElements[i].name;
																				oElement = Dom.getElementsBy(isFormElement, "*", oForm);
																				nElements = oElement.length;
																				if (nElements > 0) {
																								if (nElements == 1) {
																												oElement = oElement[0];
																												sType = oElement.type;
																												sTagName = oElement.tagName.toUpperCase();
																												switch (sTagName) {
																																case "INPUT":
																																				if (sType == "checkbox") { oData[sName] = oElement.checked; } else if (sType != "radio") { oData[sName] = oElement.value; }
																																				break;
																																case "TEXTAREA":
																																				oData[sName] = oElement.value;
																																				break;
																																case "SELECT":
																																				aOptions = oElement.options;
																																				nOptions = aOptions.length;
																																				aValues = [];
																																				for (n = 0; n < nOptions; n++) {
																																								oOption = aOptions[n];
																																								if (oOption.selected) {
																																												sValue = oOption.value;
																																												if (!sValue || sValue === "") { sValue = oOption.text; }
																																												aValues[aValues.length] = sValue;
																																								}
																																				}
																																				oData[sName] = aValues;
																																				break;
																												}
																								} else {
																												sType = oElement[0].type;
																												switch (sType) {
																																case "radio":
																																				for (n = 0; n < nElements; n++) { oRadio = oElement[n]; if (oRadio.checked) { oData[sName] = oRadio.value; break; } }
																																				break;
																																case "checkbox":
																																				aValues = [];
																																				for (n = 0; n < nElements; n++) { oCheckbox = oElement[n]; if (oCheckbox.checked) { aValues[aValues.length] = oCheckbox.value; } }
																																				oData[sName] = aValues;
																																				break;
																												}
																								}
																				}
																}
												}
												return oData;
								},
								destroy: function() {
												removeButtonEventHandlers.call(this);
												this._aButtons = null;
												var aForms = this.element.getElementsByTagName("form"),
																oForm;
												if (aForms.length > 0) {
																oForm = aForms[0];
																if (oForm) {
																				Event.purgeElement(oForm);
																				if (oForm.parentNode) { oForm.parentNode.removeChild(oForm); }
																				this.form = null;
																}
												}
												Dialog.superclass.destroy.call(this);
								},
								toString: function() { return "Dialog " + this.id; }
				});
}());
(function() {
				YAHOO.widget.SimpleDialog = function(el, userConfig) { YAHOO.widget.SimpleDialog.superclass.constructor.call(this, el, userConfig); };
				var Dom = YAHOO.util.Dom,
								SimpleDialog = YAHOO.widget.SimpleDialog,
								DEFAULT_CONFIG = { "ICON": { key: "icon", value: "none", suppressEvent: true }, "TEXT": { key: "text", value: "", suppressEvent: true, supercedes: ["icon"] } };
				SimpleDialog.ICON_BLOCK = "blckicon";
				SimpleDialog.ICON_ALARM = "alrticon";
				SimpleDialog.ICON_HELP = "hlpicon";
				SimpleDialog.ICON_INFO = "infoicon";
				SimpleDialog.ICON_WARN = "warnicon";
				SimpleDialog.ICON_TIP = "tipicon";
				SimpleDialog.ICON_CSS_CLASSNAME = "yui-icon";
				SimpleDialog.CSS_SIMPLEDIALOG = "yui-simple-dialog";
				YAHOO.extend(SimpleDialog, YAHOO.widget.Dialog, {
								initDefaultConfig: function() {
												SimpleDialog.superclass.initDefaultConfig.call(this);
												this.cfg.addProperty(DEFAULT_CONFIG.ICON.key, { handler: this.configIcon, value: DEFAULT_CONFIG.ICON.value, suppressEvent: DEFAULT_CONFIG.ICON.suppressEvent });
												this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, { handler: this.configText, value: DEFAULT_CONFIG.TEXT.value, suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent, supercedes: DEFAULT_CONFIG.TEXT.supercedes });
								},
								init: function(el, userConfig) {
												SimpleDialog.superclass.init.call(this, el);
												this.beforeInitEvent.fire(SimpleDialog);
												Dom.addClass(this.element, SimpleDialog.CSS_SIMPLEDIALOG);
												this.cfg.queueProperty("postmethod", "manual");
												if (userConfig) { this.cfg.applyConfig(userConfig, true); }
												this.beforeRenderEvent.subscribe(function() { if (!this.body) { this.setBody(""); } }, this, true);
												this.initEvent.fire(SimpleDialog);
								},
								registerForm: function() {
												SimpleDialog.superclass.registerForm.call(this);
												this.form.innerHTML += "<input type=\"hidden\" name=\"" +
																this.id + "\" value=\"\"/>";
								},
								configIcon: function(type, args, obj) {
												var sIcon = args[0],
																oBody = this.body,
																sCSSClass = SimpleDialog.ICON_CSS_CLASSNAME,
																oIcon, oIconParent;
												if (sIcon && sIcon != "none") {
																oIcon = Dom.getElementsByClassName(sCSSClass, "*", oBody);
																if (oIcon) {
																				oIconParent = oIcon.parentNode;
																				if (oIconParent) {
																								oIconParent.removeChild(oIcon);
																								oIcon = null;
																				}
																}
																if (sIcon.indexOf(".") == -1) {
																				oIcon = document.createElement("span");
																				oIcon.className = (sCSSClass + " " + sIcon);
																				oIcon.innerHTML = "&#160;";
																} else {
																				oIcon = document.createElement("img");
																				oIcon.src = (this.imageRoot + sIcon);
																				oIcon.className = sCSSClass;
																}
																if (oIcon) { oBody.insertBefore(oIcon, oBody.firstChild); }
												}
								},
								configText: function(type, args, obj) {
												var text = args[0];
												if (text) {
																this.setBody(text);
																this.cfg.refireEvent("icon");
												}
								},
								toString: function() { return "SimpleDialog " + this.id; }
				});
}());
(function() {
				YAHOO.widget.ContainerEffect = function(overlay, attrIn, attrOut, targetElement, animClass) {
								if (!animClass) { animClass = YAHOO.util.Anim; }
								this.overlay = overlay;
								this.attrIn = attrIn;
								this.attrOut = attrOut;
								this.targetElement = targetElement || overlay.element;
								this.animClass = animClass;
				};
				var Dom = YAHOO.util.Dom,
								CustomEvent = YAHOO.util.CustomEvent,
								Easing = YAHOO.util.Easing,
								ContainerEffect = YAHOO.widget.ContainerEffect;
				ContainerEffect.FADE = function(overlay, dur) {
								var fade = new ContainerEffect(overlay, { attributes: { opacity: { from: 0, to: 1 } }, duration: dur, method: Easing.easeIn }, { attributes: { opacity: { to: 0 } }, duration: dur, method: Easing.easeOut }, overlay.element);
								fade.handleStartAnimateIn = function(type, args, obj) {
												Dom.addClass(obj.overlay.element, "hide-select");
												if (!obj.overlay.underlay) { obj.overlay.cfg.refireEvent("underlay"); }
												if (obj.overlay.underlay) {
																obj.initialUnderlayOpacity = Dom.getStyle(obj.overlay.underlay, "opacity");
																obj.overlay.underlay.style.filter = null;
												}
												Dom.setStyle(obj.overlay.element, "visibility", "visible");
												Dom.setStyle(obj.overlay.element, "opacity", 0);
								};
								fade.handleCompleteAnimateIn = function(type, args, obj) {
												Dom.removeClass(obj.overlay.element, "hide-select");
												if (obj.overlay.element.style.filter) { obj.overlay.element.style.filter = null; }
												if (obj.overlay.underlay) { Dom.setStyle(obj.overlay.underlay, "opacity", obj.initialUnderlayOpacity); }
												obj.overlay.cfg.refireEvent("iframe");
												obj.animateInCompleteEvent.fire();
								};
								fade.handleStartAnimateOut = function(type, args, obj) { Dom.addClass(obj.overlay.element, "hide-select"); if (obj.overlay.underlay) { obj.overlay.underlay.style.filter = null; } };
								fade.handleCompleteAnimateOut = function(type, args, obj) {
												Dom.removeClass(obj.overlay.element, "hide-select");
												if (obj.overlay.element.style.filter) { obj.overlay.element.style.filter = null; }
												Dom.setStyle(obj.overlay.element, "visibility", "hidden");
												Dom.setStyle(obj.overlay.element, "opacity", 1);
												obj.overlay.cfg.refireEvent("iframe");
												obj.animateOutCompleteEvent.fire();
								};
								fade.init();
								return fade;
				};
				ContainerEffect.SLIDE = function(overlay, dur) {
								var x = overlay.cfg.getProperty("x") || Dom.getX(overlay.element),
												y = overlay.cfg.getProperty("y") || Dom.getY(overlay.element),
												clientWidth = Dom.getClientWidth(),
												offsetWidth = overlay.element.offsetWidth,
												slide = new ContainerEffect(overlay, { attributes: { points: { to: [x, y] } }, duration: dur, method: Easing.easeIn }, { attributes: { points: { to: [(clientWidth + 25), y] } }, duration: dur, method: Easing.easeOut }, overlay.element, YAHOO.util.Motion);
								slide.handleStartAnimateIn = function(type, args, obj) {
												obj.overlay.element.style.left = ((-25) - offsetWidth) + "px";
												obj.overlay.element.style.top = y + "px";
								};
								slide.handleTweenAnimateIn = function(type, args, obj) {
												var pos = Dom.getXY(obj.overlay.element),
																currentX = pos[0],
																currentY = pos[1];
												if (Dom.getStyle(obj.overlay.element, "visibility") == "hidden" && currentX < x) { Dom.setStyle(obj.overlay.element, "visibility", "visible"); }
												obj.overlay.cfg.setProperty("xy", [currentX, currentY], true);
												obj.overlay.cfg.refireEvent("iframe");
								};
								slide.handleCompleteAnimateIn = function(type, args, obj) {
												obj.overlay.cfg.setProperty("xy", [x, y], true);
												obj.startX = x;
												obj.startY = y;
												obj.overlay.cfg.refireEvent("iframe");
												obj.animateInCompleteEvent.fire();
								};
								slide.handleStartAnimateOut = function(type, args, obj) {
												var vw = Dom.getViewportWidth(),
																pos = Dom.getXY(obj.overlay.element),
																yso = pos[1],
																currentTo = obj.animOut.attributes.points.to;
												obj.animOut.attributes.points.to = [(vw + 25), yso];
								};
								slide.handleTweenAnimateOut = function(type, args, obj) {
												var pos = Dom.getXY(obj.overlay.element),
																xto = pos[0],
																yto = pos[1];
												obj.overlay.cfg.setProperty("xy", [xto, yto], true);
												obj.overlay.cfg.refireEvent("iframe");
								};
								slide.handleCompleteAnimateOut = function(type, args, obj) {
												Dom.setStyle(obj.overlay.element, "visibility", "hidden");
												obj.overlay.cfg.setProperty("xy", [x, y]);
												obj.animateOutCompleteEvent.fire();
								};
								slide.init();
								return slide;
				};
				ContainerEffect.prototype = {
								init: function() {
												this.beforeAnimateInEvent = this.createEvent("beforeAnimateIn");
												this.beforeAnimateInEvent.signature = CustomEvent.LIST;
												this.beforeAnimateOutEvent = this.createEvent("beforeAnimateOut");
												this.beforeAnimateOutEvent.signature = CustomEvent.LIST;
												this.animateInCompleteEvent = this.createEvent("animateInComplete");
												this.animateInCompleteEvent.signature = CustomEvent.LIST;
												this.animateOutCompleteEvent = this.createEvent("animateOutComplete");
												this.animateOutCompleteEvent.signature = CustomEvent.LIST;
												this.animIn = new this.animClass(this.targetElement, this.attrIn.attributes, this.attrIn.duration, this.attrIn.method);
												this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
												this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);
												this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this);
												this.animOut = new this.animClass(this.targetElement, this.attrOut.attributes, this.attrOut.duration, this.attrOut.method);
												this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
												this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
												this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this);
								},
								animateIn: function() {
												this.beforeAnimateInEvent.fire();
												this.animIn.animate();
								},
								animateOut: function() {
												this.beforeAnimateOutEvent.fire();
												this.animOut.animate();
								},
								handleStartAnimateIn: function(type, args, obj) {},
								handleTweenAnimateIn: function(type, args, obj) {},
								handleCompleteAnimateIn: function(type, args, obj) {},
								handleStartAnimateOut: function(type, args, obj) {},
								handleTweenAnimateOut: function(type, args, obj) {},
								handleCompleteAnimateOut: function(type, args, obj) {},
								toString: function() {
												var output = "ContainerEffect";
												if (this.overlay) { output += " [" + this.overlay.toString() + "]"; }
												return output;
								}
				};
				YAHOO.lang.augmentProto(ContainerEffect, YAHOO.util.EventProvider);
})();
YAHOO.register("container", YAHOO.widget.Module, { version: "2.3.1", build: "541" });
YAHOO.namespace("IP.control");
YAHOO.namespace("IP.event");
YAHOO.namespace("IP.net");
YAHOO.namespace("IP.util");
YAHOO.namespace("IP.widget");
var IP = YAHOO.IP;
var $D = YAHOO.util.Dom;
var $ = $D.get;
var $E = YAHOO.util.Event;
var log = YAHOO.log;
if (typeof console === "undefined" && !window.console) { console = { log: function() {}, debug: function() {}, warn: function() {} }; }
document.getElementByHandle = function(attributeValue, parentElement, tagName) { return document.getElementByClassName('_' + attributeValue, parentElement, tagName); };
document.getElementsByHandle = function(attributeValue, parentElement, tagName) { return document.getElementsByClassName('_' + attributeValue, parentElement, tagName); };
document._getElementsByClassName = (function() {
				var usingSafari = (navigator.userAgent.indexOf('AppleWebKit') > -1);
				var implementationFunction;
				if (false && document.getElementsByClassName) {
								var _nativeGetElementsByClassName = document.getElementsByClassName;
								implementationFunction = function(firstOnly, className, parentElement, tagName) {
												parentElement = $(parentElement);
												var elements;
												if (!parentElement) {
																console.warn('The parentElement was not specified for document._getElementsByClassName');
																elements = _nativeGetElementsByClassName.call(document, className);
												} else { elements = parentElement.getElementsByClassName(className); }
												if (elements && firstOnly) { return elements[0]; } else { return elements; }
								};
				} else if (document.evaluate && !usingSafari) {
								implementationFunction = function(firstOnly, className, parentElement, tagName) {
												tagName = tagName || '*';
												var paddedClassName = ' ' + className + ' ';
												parentElement = $(parentElement);
												if (!parentElement) {
																console.warn('The parentElement was not specified for document._getElementsByClassName');
																parentElement = document;
												}
												var results = document.evaluate(".//" + tagName + "[contains(concat(' ', @class, ' '), '" + paddedClassName + "')]", parentElement, null, 0, null);
												var nextElement = results.iterateNext();
												if (firstOnly) { return nextElement; } else {
																var elements = [];
																while (nextElement) {
																				elements.push(nextElement);
																				nextElement = results.iterateNext();
																}
																return elements;
												}
								};
				} else {
								implementationFunction = function(firstOnly, className, parentElement, tagName) {
												tagName = tagName || '*';
												var paddedClassName = ' ' + className + ' ';
												parentElement = $(parentElement);
												if (!parentElement) {
																console.warn('The parentElement was not specified for document._getElementsByClassName');
																parentElement = document.body;
												}
												var children = parentElement.getElementsByTagName(tagName);
												var childrenLength = children.length;
												var elements = [];
												for (var i = 0; i < childrenLength; i++) {
																var child = children[i];
																var childClassName = child.className;
																var match = false;
																if (childClassName == className) { match = true; } else { var paddedChildClassName = ' ' + childClassName + ' '; var index = paddedChildClassName.indexOf(paddedClassName); if (index > -1) { match = true; } }
																if (match) {
																				if (firstOnly) { return child; } else { elements.push(child); }
																}
												}
												if (firstOnly) { return null; } else { return elements; }
								};
				}
				return implementationFunction;
})();
document.getElementByClassName = function(className, parentNode, tagName) { return document._getElementsByClassName(true, className, parentNode, tagName); };
document.getElementsByClassName = function(className, parentNode, tagName) { return document._getElementsByClassName(false, className, parentNode, tagName); };
YAHOO.util.Event.on(window, 'unload', function() {
				document.getElementsByClassName = null;
				document.getElementByClassName = null;
				document._getElementsByClassName = null;
				document.getElementsByHandle = null;
				document.getElementByHandle = null;
});
if (!window.Element) { Element = new Object(); }
Element.show = function(element) {
				element = $(element);
				element.style.display = '';
};
Element.hide = function(element) {
				element = $(element);
				element.style.display = 'none';
};
Element.isVisible = function(element) { element = $(element); return (element.style.display != 'none'); };
Element.remove = function(element) {
				var garbageBin = document.getElementById('element_garbage_bin');
				if (!garbageBin) {
								garbageBin = document.createElement('DIV');
								garbageBin.id = 'element_garbage_bin';
								garbageBin.style.display = 'none';
								document.body.appendChild(garbageBin);
				}
				garbageBin.appendChild(element);
				garbageBin.innerHTML = '';
};
if (!YAHOO.lang.hasOwnProperty(Function, "bind")) { Function.prototype.bind = function(object, args) { var __method = this; return function() { var callargs = args || arguments; return __method.apply(object || window, callargs); }; }; }
if (!YAHOO.lang.hasOwnProperty(Function, "bindAsEventListener")) { Function.prototype.bindAsEventListener = function(object, args) { var __method = this; return function(event) { return __method.apply(object, [(event || window.event)].concat(args).concat(arguments)); }; }; }
if (!YAHOO.lang.hasOwnProperty(Array, "indexOf")) {
				Array.prototype.indexOf = function(obj) {
								var thisLength = this.length;
								for (var i = 0; i < thisLength; i++) { if (this[i] == obj) { return i; } }
								return -1;
				};
}
if (!YAHOO.lang.hasOwnProperty(Array, "insert")) {
				Array.prototype.insert = function(index, object) {
								if (index >= 0) {
												var newArray = this.slice();
												var tail = newArray.splice(index);
												newArray[index] = object;
												return newArray.concat(tail);
								}
				};
}
if (!YAHOO.lang.hasOwnProperty(Array, "remove")) { Array.prototype.remove = function(item) { var index = this.indexOf(item); if (index > -1) { this.splice(index, 1); } }; }
if (!YAHOO.lang.hasOwnProperty(String, "trim")) { String.prototype.trim = function() { return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"); }; }
if (!YAHOO.lang.hasOwnProperty(String, "pad")) {
				String.prototype.pad = function(l, s, t) {
								s = s || ' ';
								var returnValue;
								l -= this.length;
								if (l > 0) {
												s = new Array(Math.ceil(l / s.length) + 1).join(s);
												returnValue = s.substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2)) + this + s.substr(0, l - t);
								} else { returnValue = this; }
								return returnValue;
				};
}
if (!YAHOO.lang.hasOwnProperty(String, "stripTags")) { String.prototype.stripTags = function() { return this.replace(/<\/?[^>]+>/gi, ''); }; }
if (!YAHOO.lang.hasOwnProperty(String, "escapeHTML")) {
				String.prototype.escapeHTML = function() {
								var div = document.createElement('div');
								var text = document.createTextNode(this);
								div.appendChild(text);
								return div.innerHTML;
				};
}
if (!YAHOO.lang.hasOwnProperty(String, "unescapeHTML")) {
				String.prototype.unescapeHTML = function() {
								var div = document.createElement('div');
								div.innerHTML = this.stripTags();
								return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
				};
}
if (!YAHOO.lang.hasOwnProperty(String, "truncate")) {
				String.prototype.truncate = function(length, truncation) {
								length = length || 30;
								truncation = truncation === undefined ? '...' : truncation;
								return this.length > length ? this.slice(0, length - truncation.length) + truncation : this;
				};
}
YAHOO.util.Event.getEl = function(id) { return $D.get(id); };
IP.net.Message = function(action, data, successCallback, failureCallback) {
				this.action = action;
				this.data = data;
				this.successCallback = successCallback;
				this.failureCallback = failureCallback;
};
IP.net.Message.prototype = {
				action: null,
				data: null,
				successCallback: null,
				failureCallback: null,
				getDataJSONString: function() {
								var dataString = null;
								if (this.data) { dataString = YAHOO.lang.JSON.stringify(this.data); }
								return dataString;
				}
};
IP.net.Message.prototype.toString = function() {
				var string = 'Message: { action:' + this.action + ', data:' + this.getDataJSONString();
				if (this.successCallback) { string += ', has successCallback'; }
				if (this.failureCallback) { string += ', has failureCallback'; }
				string += ' }';
				return string;
};
IP.net.Messenger = function(id, message, url) {
				if (!(message instanceof IP.net.Message)) { throw new TypeError('The message is not an instance of IP.net.Message'); }
				this.id = id;
				this.message = message;
				this.url = url;
				this.attempts = 0;
				this._requests = {};
				this._completed = false;
				this.resend = this.resend.bind(this);
				this._checkRequestTimeouts = this._checkRequestTimeouts.bind(this);
				this._checkRequestTimeoutsExecuter = new IP.util.PeriodicalExecuter(this._checkRequestTimeouts, IP.net.Messenger.TIMEOUT_CHECK_PERIOD);
				YAHOO.util.Connect.resetDefaultHeaders();
				YAHOO.util.Connect.setDefaultPostHeader(false);
				YAHOO.util.Connect.initHeader('Content-Type', 'application/x-www-form-urlencoded', true);
};
IP.net.Messenger.TIMEOUT_CHECK_PERIOD = 5000;
IP.net.Messenger.RETRY_SEND_REQUEST_DELAY = 3000;
IP.net.Messenger.UNRESPONSIVE_REQUEST_TIMEOUT = 20000;
IP.net.Messenger.BAD_CONNECTION_STATUS = { 0: true, 404: true, 408: true, 502: true, 503: true, 504: true };
IP.net.Messenger.prototype = {
				id: null,
				message: null,
				url: null,
				attempts: null,
				_requests: null,
				startTime: null,
				lastReattemptTime: null,
				toString: function() {
								var stringArray = [];
								stringArray.push('Messenger: { ');
								stringArray.push('id: ' + this.id);
								stringArray.push(', action: "' + this.message.action + '"');
								stringArray.push(', data: "' + decodeURIComponent(this.message.data) + '"');
								stringArray.push(' }');
								return stringArray.join('');
				},
				_sendNewRequest: function() {
								var parameters = "id=" + this.id + "&action=" + this.message.action + "&data=" + this.message.data;
								this.lastReattemptTime = IP.Util.getCurrentTimestamp();
								this.attempts += 1;
								var callbackContext = { attempt: this.attempts, startTime: this.lastReattemptTime };
								var callback = { success: this._requestSuccessHandler, failure: this._requestFailureHandler, scope: this, argument: callbackContext };
								var requestTransaction = YAHOO.util.Connect.asyncRequest('POST', this.url, callback, parameters);
								this._requests[requestTransaction.tId] = requestTransaction;
				},
				_processResponseInfo: function(responseInfo) {
								if (responseInfo.processed) { return; }
								responseInfo.processed = true;
								responseInfo.message = this.message;
								var statusString = new String(responseInfo.status);
								responseInfo.status = new String(statusString);
								responseInfo.badConnection = IP.net.Messenger.BAD_CONNECTION_STATUS[statusString] || statusString.match(/^12(\d){3}$/);
								if (!responseInfo.badConnection) {
												try {
																var responseData = eval('(' + responseInfo.responseText + ')');
																responseInfo.responseData = responseData;
																responseInfo.id = responseData.id;
																responseInfo.sessionStatus = responseData.session;
																responseInfo.messageStatus = new String(responseData.status);
																responseInfo.data = responseData.data;
																if (typeof responseInfo.data == 'string') { responseInfo.data = new String(responseInfo.data); }
												} catch (e) {
																var responseText;
																try { responseText = responseInfo.responseText; } catch (e) {}
																var errorMessage = 'Error: processing the responseInfo. Response status: ' + statusString + '. ';
																if (responseText) { errorMessage += 'ResponseText: ' + responseText + '. '; }
																IP.util.Logger.logError(errorMessage + this, e);
												}
								}
				},
				_checkRequestTimeouts: function() { var currentTime = IP.Util.getCurrentTimestamp(); var unresponsiveDuration = currentTime - this.lastReattemptTime; if (unresponsiveDuration >= IP.net.Messenger.UNRESPONSIVE_REQUEST_TIMEOUT) { this.resendAfterDelay(); } },
				send: function() {
								this.startTime = IP.Util.getCurrentTimestamp();
								this._sendNewRequest();
				},
				resend: function() { this._sendNewRequest(); },
				resendAfterDelay: function() { setTimeout(this.resend, IP.net.Messenger.RETRY_SEND_REQUEST_DELAY); },
				_removeTransaction: function(transactionId) { delete this._requests[transactionId]; },
				_abortAndRemoveTransactionsExcept: function(transactionIdToSkip) {
								for (var transactionId in this._requests) {
												if (transactionId == transactionIdToSkip) { continue; }
												var transaction = this._requests[transactionId];
												if (YAHOO.util.Connect.isCallInProgress(transaction)) { YAHOO.util.Connect.abort(transaction); }
												this._removeTransaction(transactionId);
								}
				},
				isCompleted: function() { return this._completed; },
				complete: function() {
								this._completed = true;
								this._checkRequestTimeoutsExecuter.stop();
				},
				getRequestSuccessCallback: function() { return this._requestSuccessCallback; },
				setRequestSuccessCallback: function(callback) { this._requestSuccessCallback = callback; },
				getRequestFailureCallback: function() { return this._requestFailureCallback; },
				setRequestFailureCallback: function(callback) { this._requestFailureCallback = callback; },
				getRequestExceptionCallback: function() { return this._requestExceptionCallback; },
				setRequestExceptionCallback: function(callback) { this._requestExceptionCallback = callback; },
				setSessionLoggedOutCallback: function(callback) { this._sessionLoggedOutCallback = callback; },
				_requestSuccessHandler: function(responseInfo) {
								try {
												if (responseInfo.status == -1) { return; }
												this._processResponseInfo(responseInfo);
												var messageStatus = responseInfo.messageStatus;
												var sessionStatus = responseInfo.sessionStatus;
												if (!messageStatus) { this._requestFailureHandler(responseInfo); return; } else if (messageStatus.indexOf('completed') !== 0) { this._removeTransaction(responseInfo.tId); return; } else if (sessionStatus && (sessionStatus == 'logged_out')) {
																this._removeTransaction(responseInfo.tId);
																if (this._sessionLoggedOutCallback) { this._sessionLoggedOutCallback(this, responseInfo); }
																return;
												}
												if (this.isCompleted()) { this._removeTransaction(responseInfo.tId); return; } else {
																this.complete();
																this._abortAndRemoveTransactionsExcept(responseInfo.tId);
												}
												if (this._requestSuccessCallback) {
																try { this._requestSuccessCallback(this, responseInfo); } catch (e) { IP.util.Logger.logError('The requestSuccessCallback had errors. Response text: "' + responseInfo.responseText + '"' + this, e); }
												}
												if (this.message.successCallback) {
																try { this.message.successCallback(responseInfo); } catch (e) { IP.util.Logger.logError('The message successCallback method had errors. Response text: "' + responseInfo.responseText + '"' + this, e); }
												}
												this._removeTransaction(responseInfo.tId);
								} catch (e) { this._requestExceptionHandler(responseInfo, e); }
				},
				_requestFailureHandler: function(responseInfo) {
								try {
												this._processResponseInfo(responseInfo);
												if (this.isCompleted()) {
																if (this.attempts > 1) { IP.util.Logger.logError('<b>onFailure</b> on attempt ' + responseInfo.argument.attempt + '--already completed. ' + this); }
																this._removeTransaction(responseInfo.tId);
																return;
												}
												var statusText = responseInfo.statusText;
												var attemptToReconnect = responseInfo.badConnection;
												if (attemptToReconnect) { this.resendAfterDelay(); } else {
																if (this.attempts > 1) { IP.util.Logger.logError('<b>onFailure</b>--completed on attempt ' + responseInfo.argument.attempt + '. ' + this); }
																this.complete();
																this._abortAndRemoveTransactionsExcept(responseInfo.tId);
																if (this._requestFailureCallback) {
																				try { this._requestFailureCallback(this, responseInfo); } catch (e) { IP.util.Logger.logError('The messageFailureEvent firing had errors. Response text: "' + responseInfo.responseText + '"' + this, e); }
																}
																if (this.message.failureCallback) {
																				try { this.message.failureCallback(responseInfo); } catch (e) { IP.util.Logger.logError('The message failureCallback method had errors. Response text: "' + responseInfo.responseText + '"' + this, e); }
																}
																this._removeTransaction(responseInfo.tId);
												}
								} catch (e) { this._requestExceptionHandler(responseInfo, e); }
				},
				_requestExceptionHandler: function(responseInfo, exception) {
								IP.util.Logger.logError('<b>Request exception:</b> ' + this);
								responseInfo = this._processResponseInfo(responseInfo);
								if (exception) { IP.util.Logger.logError('Exception: ', exception); }
								if (this.isCompleted()) {
												if (this.attempts > 1) { IP.util.Logger.logError('onException--already completed. ' + this); }
												return;
								}
								if (this._requestExceptionCallback) {
												try { this._requestExceptionCallback(this, responseInfo, exception); } catch (e) { IP.util.Logger.logError('The Messenger.onException had errors. ', e); }
								}
				}
};
IP.net.MessageCenter = function(url, disableRandomizingURL) {
				this._state = IP.net.MessageCenter.NORMAL_CONNECTION_STATE;
				this.url = url;
				this.disableRandomizingURL = disableRandomizingURL;
				this._checkMessengerTimeouts = this._checkMessengerTimeouts.bind(this);
				this._messengerExceptionHandler = this._messengerExceptionHandler.bind(this);
				this._messengerFailureHandler = this._messengerFailureHandler.bind(this);
				this._messengerSuccessHandler = this._messengerSuccessHandler.bind(this);
				this._messengerSessionLoggedOutHandler = this._messengerSessionLoggedOutHandler.bind(this);
				this.connectionStateChangeEvent = new YAHOO.util.CustomEvent('connectionStateChange', this);
				this.messageFailedEvent = new YAHOO.util.CustomEvent('messageFailed', this);
				this._messengers = {};
				this._checkMessengerTimeoutsExecuter = new IP.util.PeriodicalExecuter(this._checkMessengerTimeouts, IP.net.MessageCenter.TIMEOUT_CHECK_PERIOD);
};
IP.net.MessageCenter.TIMEOUT_CHECK_PERIOD = 5000;
IP.net.MessageCenter.UNRESPONSIVE_CONNECTION_TIMEOUT = 80000;
IP.net.MessageCenter.FAILED_CONNECTION_TIMEOUT = 120000;
IP.net.MessageCenter.NORMAL_CONNECTION_STATE = 0;
IP.net.MessageCenter.UNRESPONSIVE_CONNECTION_STATE = 1;
IP.net.MessageCenter.FAILED_CONNECTION_STATE = 2;
IP.net.MessageCenter.USER_LOGGED_OUT_STATE = 3;
IP.net.MessageCenter.prototype = {
				_state: null,
				messengers: null,
				url: null,
				message: null,
				send: function(message) {
								if (!(message instanceof IP.net.Message)) { throw new TypeError('The message is not an instance of IP.net.Message'); }
								message.data = encodeURIComponent(message.getDataJSONString());
								if ((this._state == IP.net.MessageCenter.USER_LOGGED_OUT_STATE) && (message.action != 'report_js_errors')) { return; }
								var currentTime = IP.Util.getCurrentTimestamp();
								var randomNumber = new String(Math.floor(Math.random() * 100));
								var id = currentTime + randomNumber.pad(3, '0', 0);
								var messenger = this._createMessenger(id, message, this.url);
								this._messengers[id] = messenger;
								messenger.send();
				},
				_createMessenger: function(id, message) {
								var url = this.url;
								if (!this.disableRandomizingURL) { url += '&r=' + (Math.random() * 100); }
								var messenger = new IP.net.Messenger(id, message, url);
								messenger.setRequestSuccessCallback(this._messengerSuccessHandler);
								messenger.setRequestFailureCallback(this._messengerFailureHandler);
								messenger.setRequestExceptionCallback(this._messengerExceptionHandler);
								messenger.setSessionLoggedOutCallback(this._messengerSessionLoggedOutHandler);
								return messenger;
				},
				_removeMessenger: function(messenger) { if (this._messengers[messenger.id]) { delete this._messengers[messenger.id]; } },
				_checkMessengerTimeouts: function() {
								var currentTime = IP.Util.getCurrentTimestamp();
								for (var id in this._messengers) {
												var messenger = this._messengers[id];
												if (messenger) {
																var startTime = messenger.startTime;
																var duration = currentTime - startTime;
																if ((this._state == IP.net.MessageCenter.NORMAL_CONNECTION_STATE) && (duration > IP.net.MessageCenter.UNRESPONSIVE_CONNECTION_TIMEOUT)) {
																				this._state = IP.net.MessageCenter.UNRESPONSIVE_CONNECTION_STATE;
																				IP.util.Logger.logDebug('Entering UNRESPONSIVE CONNECTION STATE. Request ' + id + ' has not responded for ' + duration + ' ms. ' + messenger);
																				try { this.connectionStateChangeEvent.fire(this._state); } catch (e) { IP.util.Logger.logError('The MessageCenter.connectionStateChangeEvent firing had errors when changing to unresponsive connection state. ', e); }
																				this._sessionChecker.setSessionExists(true);
																} else if ((this._state == IP.net.MessageCenter.UNRESPONSIVE_CONNECTION_STATE) && (duration > IP.net.MessageCenter.FAILED_CONNECTION_TIMEOUT)) {
																				this._state = IP.net.MessageCenter.FAILED_CONNECTION_STATE;
																				IP.util.Logger.logDebug('Entering FAILED CONNECTION STATE. Request ' + id + ' has not responded for ' + duration + ' ms. ' + messenger);
																				try { this.connectionStateChangeEvent.fire(this._state); } catch (e) { IP.util.Logger.logError('The MessageCenter.connectionStateChangeEvent firing had errors when changing to failed connection state. ', e); }
																}
												}
								}
				},
				_messengerSuccessHandler: function(messenger, responseInfo) {
								this._removeMessenger(messenger);
								if (responseInfo.responseData.session == "logged_out") {
												this._state = IP.net.MessageCenter.USER_LOGGED_OUT_STATE;
												this.connectionStateChangeEvent.fire(this._state);
												this._sessionChecker.setSessionExists(false);
												return;
								}
								if (this._state != IP.net.MessageCenter.NORMAL_CONNECTION_STATE) {
												this._state = IP.net.MessageCenter.NORMAL_CONNECTION_STATE;
												IP.util.Logger.logDebug('Entering NORMAL CONNECTION STATE. Request ' + messenger.id + ' succeeded.');
												try { this.connectionStateChangeEvent.fire(this._state); } catch (e) { IP.util.Logger.logError('The MessageCenter.connectionStateChangeEvent firing had errors when changing to normal state. ', e); }
												this._sessionChecker.setSessionExists(true);
								}
				},
				_messengerFailureHandler: function(messenger, responseInfo) {
								try { this.messageFailedEvent.fire(messenger, responseInfo); } catch (e) { IP.util.Logger.logError('The messageFailedEvent firing had errors. ', e); }
								this._removeMessenger(messenger);
				},
				_messengerExceptionHandler: function(messenger, responseInfo, exception) { messenger.resendAfterDelay(); },
				_messengerSessionLoggedOutHandler: function(messenger, responseInfo) { this.checkConnection(); },
				getCurrentState: function() { return this._state; },
				isOffline: function() {
								if (this._state == IP.net.MessageCenter.FAILED_CONNECTION_STATE || this._state == IP.net.MessageCenter.USER_LOGGED_OUT_STATE) { return true; } else { return false; }
				},
				beginSessionStatusMonitoring: function(config) {
								this._sessionChecker = new IP.net.SessionChecker(config);
								this._sessionChecker.sessionStateChangedEvent.subscribe(function(event, newState) {
												if (newState == IP.net.SessionChecker.LOGGED_OUT_STATE) { this._state = IP.net.MessageCenter.USER_LOGGED_OUT_STATE; } else { this._state = IP.net.MessageCenter.NORMAL_CONNECTION_STATE; }
												this.connectionStateChangeEvent.fire(this._state);
								}.bind(this));
								this._sessionChecker.start();
				},
				checkConnection: function() { this._sessionChecker.checkNow(); },
				updateSessionId: function(sessionId) { this._sessionChecker.updateSessionId(sessionId); }
};
IP.net.QueuedMessageCenter = function(url) {
				IP.net.QueuedMessageCenter.superclass.constructor.call(this, url);
				this._messageQueue = [];
				this._messageQueueReady = true;
				this.flushMessageQueue = this.flushMessageQueue.bind(this);
				this._flushRequestSuccessHandler = this._flushRequestSuccessHandler.bind(this);
				this._flushRequestFailureHandler = this._flushRequestFailureHandler.bind(this);
				this.messageQueuedEvent = new YAHOO.util.CustomEvent('messageQueued', this);
				this.flushStartEvent = new YAHOO.util.CustomEvent('flushStart', this);
				this.flushSuccessEvent = new YAHOO.util.CustomEvent('flushSuccess', this);
				this.flushFailureEvent = new YAHOO.util.CustomEvent('flushFailure', this);
				this.flushPartialSuccessEvent = new YAHOO.util.CustomEvent('flushPartialSuccess', this);
				this._flushMessageQueueExecuter = new IP.util.PeriodicalExecuter(this.flushMessageQueue, 20000);
};
YAHOO.lang.extend(IP.net.QueuedMessageCenter, IP.net.MessageCenter, {
				messageQueue: null,
				_flushMessageQueueExecuter: null,
				_lastSentMessages: null,
				_messageQueueReady: null,
				queueMessage: function(message) {
								if (!(message instanceof IP.net.Message)) { throw new TypeError('The message is not an instance of IP.net.Message'); }
								this._messageQueue.push(message);
								this.messageQueuedEvent.fire(message);
				},
				flushMessageQueue: function() {
								if (this._messageQueueReady && (this._messageQueue.length > 0)) {
												this._messageQueueReady = false;
												this.flushStartEvent.fire(this._messageQueue.concat());
												this._lastSentMessages = this._messageQueue.concat();
												this._messageQueue.splice(0, this._messageQueue.length);
												var message = new IP.net.Message("flush_queue", this._lastSentMessages, this._flushRequestSuccessHandler, this._flushRequestFailureHandler);
												this.send(message);
								}
				},
				hasMoreToSend: function() { return (this._messageQueue.length > 0); },
				_flushRequestSuccessHandler: function(responseInfo) {
								this._messageQueueReady = true;
								var responseData = responseInfo.data || [];
								var failedMessages = [];
								var successfulMessages = [];
								var lastSentMessagesLength = this._lastSentMessages.length;
								for (var i = 0; i < lastSentMessagesLength; i++) {
												var message = this._lastSentMessages[i];
												var messageResponseData = responseData[i];
												if (messageResponseData.error) {
																if (message.failureCallback) { message.failureCallback(messageResponseData); }
																failedMessages.push(message);
												} else { successfulMessages.push(message); if (message.successCallback) { message.successCallback(messageResponseData); } }
								}
								if (failedMessages.length) { this.flushPartialSuccessEvent.fire(failedMessages, successfulMessages); } else { this.flushSuccessEvent.fire(this._lastSentMessages, responseData); }
								this._lastSentMessages = null;
				},
				_flushRequestFailureHandler: function(responseInfo) {
								this._messageQueueReady = true;
								var responseData = responseInfo.data;
								var lastSentMessagesLength = this._lastSentMessages.length;
								for (var i = 0; i < lastSentMessagesLength; i++) { var message = this._lastSentMessages[i]; var messageResponseData = responseData[i]; if (message.failureCallback) { message.failureCallback(); } }
								this.flushFailureEvent.fire(this._lastSentMessages, responseData);
								this._lastSentMessages = null;
				},
				_messengerFailureHandler: function(messenger, responseInfo) {
								IP.util.Logger.logInfo('failing');
								var status = 'Not available';
								var responseText = 'None';
								status = responseInfo.status;
								responseText = responseInfo.responseText.escapeHTML();
								var message = responseInfo.message;
								var errorString = '<b>SERVER ERROR. Status:</b> ' + status + '. <b>Parameters:</b> action=' + message.action + ', data=' + decodeURIComponent(message.data) + '. <b>Response:</b> ' + responseText + '. <b>Attempt #' + responseInfo.argument.attempt + '</b>.';
								IP.util.Logger.logError(errorString);
								IP.net.QueuedMessageCenter.superclass._messengerFailureHandler.call(this, messenger, responseInfo);
				}
});
IP.util.BinarySort = {
				insert: function(array, item, comparator) {
								var index = IP.util.BinarySort.search(array, item, comparator);
								if (index < 0) { array.splice(Math.abs(index) - 1, 0, item); } else { array.splice(index, 0, item); }
				},
				search: function(array, item, comparator) {
								comparator = comparator || IP.util.BinarySort.defaultComparator;
								var left = -1;
								var right = array.length;
								var mid;
								while (right - left > 1) {
												mid = (left + right) >>> 1;
												if (comparator(item, array[mid]) > 0) { left = mid; } else { right = mid; }
								}
								if (array[right] != item) { return -(right + 1); }
								return right;
				},
				defaultComparator: function(a, b) {
								if (a < b) { return -1; } else if (a > b) { return 1; } else { return 0; }
				}
};
IP.util.SortedSet = function(setItemArray) { this._init(setItemArray); };
IP.util.SortedSet.prototype = {
				_data: null,
				_sortedData: null,
				_init: function(setItemArray) {
								this._data = {};
								this._sortedData = new Array();
								if (setItemArray && setItemArray.length > 0) { var setItemArrayLength = setItemArray.length; for (var i = 0; i <= setItemArrayLength; i++) { this.add(setItemArray[i]); } }
				},
				toString: function() {
								var string = 'SortedSet: {';
								string += ' size: ' + this.size();
								string += ' }';
								return string;
				},
				add: function(item) {
								if (this.idInUse(item.getSetItemId())) { throw new Error("Duplicate id violation when adding item with id: " + item.getSetItemId() + "."); }
								this._data[item.getSetItemId()] = item;
								IP.util.BinarySort.insert(this._sortedData, item, this._sortingFunction);
				},
				idInUse: function(id) { return this.getItemById(id) !== undefined; },
				remove: function(item) { return this.removeItemById(item.getSetItemId()); },
				removeItemById: function(id) {
								var itemToRemove = this._data[id];
								if (itemToRemove) {
												this._sortedData.remove(itemToRemove);
												delete this._data[id];
								}
								return itemToRemove;
				},
				removeAll: function() {
								this._data = {};
								this._sortedData = [];
				},
				replace: function(newItem, oldItem) {
								var index = this.indexOf(oldItem);
								this._sortedData.splice(index, 1, newItem);
								delete this._data[oldItem.getSetItemId()];
								this._data[newItem.getSetItemId()] = newItem;
				},
				getItemById: function(id) { return this._data[id]; },
				updateItemId: function(newId, oldId) {
								if (this.idInUse(newId)) { throw new Error("Duplicate id violation when updating item. Old id: " + oldId + ", new id: " + newId + "."); }
								this._data[newId] = this._data[oldId];
								delete this._data[oldId];
				},
				getItemByIndex: function(index) { return this.getSortedData()[index]; },
				indexOf: function(setItem) { return this.getSortedData().indexOf(setItem); },
				firstItem: function() { return this.getItemByIndex(0); },
				lastItem: function() { return this.getItemByIndex(this.size() - 1); },
				getSortedData: function() { return this._sortedData; },
				size: function() { return this._sortedData.length; },
				isEmpty: function() { return this.size() === 0; },
				_sortingFunction: function(a, b) {
								if (parseInt(a.getSetItemId()) < parseInt(b.getSetItemId())) { return -1; }
								if (parseInt(a.getSetItemId()) > parseInt(b.getSetItemId())) { return 1; }
								if (parseInt(a.getSetItemId()) == parseInt(b.getSetItemId())) { return 0; }
				},
				setSortingFunction: function(newFunction) {
								if (YAHOO.lang.isFunction(newFunction)) {
												this._sortingFunction = newFunction;
												this.sort();
								} else { throw new Error("Not a valid function."); }
				},
				sort: function() { this._sortedData.sort(this._sortingFunction); }
};
IP.util.SetItem = function(id) { this.id = id; };
IP.util.SetItem.prototype = {
				id: null,
				getSetItemId: function() {
								var id = this.id;
								if (YAHOO.lang.isFunction(id)) {
												if (!id.setItemId) {
																var currentTime = IP.Util.getCurrentTimestamp();
																var randomNumber = new String(Math.floor(Math.random() * 100));
																id.setItemId = id.toString() + currentTime + randomNumber.pad(3, '0', 0);
												}
												id = id.setItemId;
								}
								return id;
				}
};
IP.util.FactorySet = function(setItemArray) { IP.util.FactorySet.superclass.constructor.call(this, setItemArray); };
YAHOO.lang.extend(IP.util.FactorySet, IP.util.SortedSet, {
				_init: function(setItemArray) {
								this._nextId = 1;
								IP.util.FactorySet.superclass._init.call(this, setItemArray);
								this._itemOrder = [];
								this.setSortingFunction(this.defaultSortingFunction.bind(this));
				},
				add: function(item) {
								if (this.idInUse(item.getSetItemId())) { throw new Error("Duplicate id violation when adding item with id: " + item.getSetItemId() + "."); }
								this._itemOrder[this._itemOrder.length] = item.getSetItemId();
								IP.util.FactorySet.superclass.add.call(this, item);
								var id = item.getSetItemId();
								if (id >= this._nextId) { this._nextId = id + 1; }
				},
				removeItemById: function(id) {
								var item = IP.util.FactorySet.superclass.removeItemById.call(this, id);
								this._itemOrder.remove(id);
								return item;
				},
				removeAll: function() {
								IP.util.FactorySet.superclass.removeAll.call(this);
								this._itemOrder = [];
								this._nextId = 1;
				},
				replace: function(newItem, oldItem) {
								var index = this._itemOrder.indexOf(oldItem.getSetItemId());
								this._itemOrder.splice(index, 1, newItem.getSetItemId());
								IP.util.FactorySet.superclass.replace.call(this, newItem, oldItem);
				},
				updateItemId: function(newId, oldId) {
								IP.util.FactorySet.superclass.updateItemId.call(this, newId, oldId);
								if (newId >= this._nextId) { this._nextId = newId + 1; }
								var index = this._itemOrder.indexOf(oldId);
								if (index > -1) { this._itemOrder.splice(index, 1, newId); }
				},
				setIndex: function(item, index) {
								var itemId = item.getSetItemId();
								var currentIndex = this._itemOrder.indexOf(itemId);
								this._itemOrder.splice(currentIndex, 1);
								this._itemOrder.splice(index, 0, itemId);
								this._sortedData.splice(currentIndex, 1);
								this._sortedData.splice(index, 0, item);
				},
				getNextId: function() { return this._nextId; },
				setNextId: function(nextId) { if (YAHOO.lang.isNumber(nextId)) { this._nextId = nextId; } },
				defaultSortingFunction: function(itemA, itemB) { var indexA = this._itemOrder.indexOf(itemA.getSetItemId()); var indexB = this._itemOrder.indexOf(itemB.getSetItemId()); return (IP.util.BinarySort.defaultComparator(indexA, indexB)); }
});
IP.util.PeriodicalExecuter = function(callback, interval) {
				this.callback = callback;
				this.interval = interval;
				this._currentlyExecuting = false;
				this.restart();
};
IP.util.PeriodicalExecuter.prototype = {
				restart: function() {
								this.stop();
								this._timer = setInterval(this._timerEventHandler.bind(this), this.interval);
				},
				stop: function() {
								if (!this._timer) { return; }
								clearInterval(this._timer);
								this._timer = null;
				},
				_timerEventHandler: function() {
								if (!this._currentlyExecuting) {
												try {
																this._currentlyExecuting = true;
																this.callback(this);
												} finally { this._currentlyExecuting = false; }
								}
				}
};
IP.Util = (function() {
				return {
								usingFirefox: function() {
												if (this._usingGecko == undefined) { this._usingGecko = (navigator.userAgent.indexOf('Gecko') > -1) && (navigator.userAgent.indexOf('KHTML') == -1); }
												return this._usingGecko;
								},
								usingFirefox2: function() {
												if (this._usingFirefox2 == undefined) { this._usingFirefox2 = this.usingFirefox() && (navigator.userAgent.indexOf('Firefox/2') > -1); }
												return this._usingFirefox2;
								},
								usingFirefox3: function() {
												if (this._usingFirefox3 == undefined) { this._usingFirefox3 = this.usingFirefox() && (navigator.userAgent.indexOf('Firefox/3') > -1); }
												return this._usingFirefox3;
								},
								usingSafari: function() {
												if (this._usingSafari == undefined) { this._usingSafari = (navigator.userAgent.indexOf('AppleWebKit') > -1); }
												return this._usingSafari;
								},
								usingSafari2: function() {
												if (this._usingSafari2 == undefined) { this._usingSafari2 = (/Safari\/4\d\d(\.\d+)?/).test(navigator.userAgent); }
												return this._usingSafari2;
								},
								usingIE: function() {
												if (this._usingIE == undefined) { this._usingIE = (navigator.userAgent.indexOf('MSIE') > -1); }
												return this._usingIE;
								},
								usingIE6: function() {
												if (this._usingIE6 == undefined) { this._usingIE6 = (navigator.userAgent.indexOf('MSIE 6') > -1); }
												return this._usingIE6;
								},
								isHexColor: function(s) { var hexColorRegularExpression = /^#[A-F0-9]{3}([A-F0-9]{3})?$/i; return hexColorRegularExpression.test(s); },
								deferExecution: function(fn) { setTimeout(fn, 50); },
								deferExecutionOverArray: function(array, fn, startIndex, endIndex) {
												var arrayLength = array.length;
												var index = startIndex;
												if (YAHOO.lang.isUndefined(index)) { index = 0; }
												if (YAHOO.lang.isUndefined(endIndex)) { endIndex = arrayLength; }
												var executeFunction = function() {
																if ((index >= endIndex) || (index >= arrayLength)) { return; }
																fn(array[index]);
																index++;
																IP.Util.deferExecution(executeFunction);
												};
												IP.Util.deferExecution(executeFunction);
								},
								trimTrailing: function(s) { try { return s.replace(/\s+$/g, ""); } catch (e) { return s; } },
								scrubHTML: function(text) {
												text = new String(text);
												text = text.replace(/\son\w+\s*=\s*(["|']).*?\1/img, '');
												if (IP.Util.usingIE()) {
																text = text.replace(/<br(\s)*(\/)?>/gi, '&lt;br$1\/&gt;');
																text = text.replace(/\r\n/g, '<br />');
																text = text.escapeHTML();
																text = text.replace(/&lt;br \/&gt;/gi, '\r\n');
																text = text.replace(/&amp;lt;br(\s)*\/&amp;gt;/gi, '&lt;br$1\/&gt;');
												} else { text = text.escapeHTML(); }
												text = text.replace(/&lt;a(\s.*href=.*?)&gt;(.*?)&lt;\/a&gt;/img, "<a$1>$2</a>");
												text = text.replace(/&lt;b&gt;/gi, "<b>");
												text = text.replace(/&lt;\/b&gt;/gi, "</b>");
												text = text.replace(/&lt;i&gt;/gi, "<i>");
												text = text.replace(/&lt;\/i&gt;/gi, "</i>");
												text = text.replace(/&lt;u&gt;/gi, "<u>");
												text = text.replace(/&lt;\/u&gt;/gi, "</u>");
												return text;
								},
								stripEventHandlers: function(text) {
												text = new String(text);
												text = text.replace(/\son\w+\s*=\s*(["|']).*?\1/img, '');
												return text;
								},
								unscrubHTML: function(text) {
												text = new String(text);
												text = text.replace(/<a(\s.*href=.*?)>(.*?)<\/a>/img, "&lt;a$1&gt;$2&lt;/a&gt;");
												text = text.replace(/<b>/gi, "&lt;b&gt;");
												text = text.replace(/<\/b>/gi, "&lt;\/b&gt;");
												text = text.replace(/<i>/gi, "&lt;i&gt;");
												text = text.replace(/<\/i>/gi, "&lt;\/i&gt;");
												text = text.replace(/<u>/gi, "&lt;u&gt;");
												text = text.replace(/<\/u>/gi, "&lt;\/u&gt;");
												if (IP.Util.usingIE()) {
																text = text.replace(/&lt;br(\s)*\/&gt;/gi, '&amp;lt;br$1\/&amp;gt;');
																text = text.replace(/\r\n/g, '&lt;br \/&gt;');
																text = text.unescapeHTML();
																text = text.replace(/<br \/>/gi, '\r\n');
																text = text.replace(/&lt;br(\s)*\/&gt;/gi, '<br$1\/>');
												} else { text = text.unescapeHTML(); }
												return text;
								},
								newLinesToBreakTags: function(text) {
												text = new String(text);
												if (text) { text = text.replace(/(\r)?\n/g, '<br />'); }
												return text;
								},
								breakTagsToNewLines: function(text, noCarriageReturn) {
												text = new String(text);
												if (text) {
																if (!IP.Util.usingIE() || noCarriageReturn) { text = text.replace(/<br(\s)*(\/)?>/gi, '\n'); } else { text = text.replace(/<br(\s)*(\/)?>/gi, '\r\n'); }
												}
												return text;
								},
								spacesToNonbreakingSpaces: function(text) {
												text = new String(text);
												if (text) {
																text = text.replace(/(\r)? (?!(\/)?(>|&gt;))/g, '&nbsp;');
																text = text.replace(/(\r)?((&nbsp;)+)&nbsp;(?!(\/)?(>|&gt;))/g, ' $2');
												}
												return text;
								},
								truncateFloatingNumber: function(number, decimalPlaces) {
												decimalPlaces = decimalPlaces || 0;
												var numberString = new String(number);
												if (numberString.indexOf('.') > -1) {
																var multiplier = Math.pow(10, parseInt(decimalPlaces));
																number = Math.round(number * multiplier) / multiplier;
												}
												return number;
								},
								getErrorString: function(error) {
												var string = '';
												if (error.name) {
																string += error.name + ': ' + error.message;
																try {
																				if (error.number) { string += ', #' + (error.number & 0xFFFF); }
																				if (error.description) { string += ': ' + error.description; }
																} catch (e) {}
																try {
																				if (error.fileName) { string += ' in ' + error.fileName; }
																				if (error.lineNumber) { string += ' at line ' + error.lineNumber; }
																} catch (e) {}
																string += '. ' + error;
												} else { string += error; }
												return string;
								},
								getDateFromPerlString: function(dateString) {
												var date = null;
												try {
																dateString = dateString.replace(/-/g, '\/');
																date = new Date(dateString);
												} catch (e) {}
												return date;
								},
								getDateFromPerlTimestamp: function(timestamp) {
												try { var date = new Date(timestamp.substring(0, 4), (parseInt(timestamp.substring(5, 7)) - 1), timestamp.substring(8, 10), timestamp.substring(11, 13), timestamp.substring(14, 16), timestamp.substring(17, 19), timestamp.substring(20, 26)); } catch (e) {}
												return date;
								},
								formatDateMMDDYY: function(dateValue) {
												var numericMonth = new String(dateValue.getMonth() + 1);
												var numericDayOfMonth = new String(dateValue.getDate());
												var numericYear = new String(dateValue.getFullYear());
												var numericDate = numericMonth.pad(2, '0', 0);
												numericDate += '-';
												numericDate += numericDayOfMonth.pad(2, '0', 0);
												numericDate += '-';
												numericDate += numericYear.substr(2, 2);
												return numericDate;
								},
								getCurrentTimestamp: function() { var currentTime = new Date().getTime(); return currentTime; },
								getQueryStringParameter: function(parameterName) {
												var queryString = window.location.search.substring(1);
												var amp = '&';
												if (queryString.indexOf('&amp;') > -1) { amp = '&amp;'; }
												var parameters = queryString.split(amp);
												var parameterCount = parameters.length;
												var value = null;
												for (var i = 0; i < parameterCount; i++) { var pair = parameters[i].split("="); if (pair[0] == parameterName) { value = pair[1]; break; } }
												return value;
								},
								millisecondsToTime: function(ms) {
												var sec = Math.floor(ms / 1000);
												var min = Math.floor(sec / 60);
												sec = sec % 60;
												var secVal = new String(sec);
												var t = secVal.pad(2, '0', 0);
												var hr = Math.floor(min / 60);
												min = min % 60;
												var minVal = new String(min);
												t = minVal.pad(2, '0', 0) + ":" + t;
												var day = Math.floor(hr / 60);
												hr = hr % 60;
												var hrVal = new String(hr);
												t = hrVal.pad(2, '0', 0) + ":" + t;
												return t;
								},
								getRelativeCoordinates: function(event, element) {
												var coordinates = {};
												var elementRegion = $D.getRegion(element);
												coordinates.x = $E.getPageX(event);
												coordinates.y = $E.getPageY(event);
												if (element) {
																coordinates.x = parseInt(coordinates.x - elementRegion.left);
																coordinates.y = parseInt(coordinates.y - elementRegion.top);
												}
												return coordinates;
								},
								getViewportCoordinates: function(forElement) {
												var valueT = 0,
																valueL = 0;
												var element = forElement;
												while (element) {
																valueT += element.offsetTop || 0;
																valueL += element.offsetLeft || 0;
																if (element.offsetParent == document.body) { if (element.style.position == "absolute") { break; } }
																element = element.offsetParent;
												}
												element = forElement;
												while (element) {
																if (!window.opera || element.tagName == "BODY") {
																				valueT -= element.scrollTop || 0;
																				valueL -= element.scrollLeft || 0;
																}
																element = element.parentNode;
												}
												return { x: valueL, y: valueT };
								},
								getDocumentScrollTop: function() {
												var scrollTop = null;
												if (document.documentElement && document.documentElement.scrollTop) { scrollTop = document.documentElement.scrollTop; } else if (document.body) { scrollTop = document.body.scrollTop; }
												return scrollTop;
								},
								getFunctionInfo: function(f) {
												var functionBody = f.toString().replace(/\s/g, ' ');
												var functionName;
												var s = functionBody.match(/^function (\w*)/);
												if ((s === null) || (s[1] === null) || (s[1].length === 0)) { functionName = "anonymous"; } else { functionName = s[1]; }
												return [functionName, functionBody];
								},
								stackTrace: function(startFunction) {
												var stack = new Array();
												if (startFunction) { startFunction = startFunction.caller; } else { startFunction = IP.Util.stackTrace.caller; }
												var i = 0;
												for (var a = startFunction; a !== null; a = a.caller) {
																stack.push(IP.Util.getFunctionInfo(a));
																if (a.caller == a) { break; } else if (i >= 20) { stack.push(['...', '...']); break; }
																i++;
												}
												return stack;
								},
								openWindow: function(url, id, options) {
												var win = window.open(url, id, options);
												if (win) { win.focus(); }
												return win;
								},
								insertAtCursor: function(myField, myValue) {
												if (document.selection) {
																myField.focus();
																sel = document.selection.createRange();
																sel.text = myValue;
												} else if (myField.selectionStart || myField.selectionStart == '0') {
																var startPos = myField.selectionStart;
																var endPos = myField.selectionEnd;
																myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
																myField.selectionStart = endPos + myValue.length;
																myField.selectionEnd = endPos + myValue.length;
												} else { myField.value += myValue; }
								},
								placeCursorAtEnd: function(myField) {
												if (document.selection) {
																var range = myField.createTextRange();
																range.collapse(false);
																range.select();
												} else if (myField.selectionStart || myField.selectionStart == '0') {
																var endPos = myField.value.length;
																myField.selectionStart = endPos;
																myField.selectionEnd = endPos;
												}
								},
								getMouseWheelEventName: function() {
												var mouseWheelEventName = 'mousewheel';
												if (IP.Util.usingFirefox()) { mouseWheelEventName = 'DOMMouseScroll'; }
												return mouseWheelEventName;
								},
								setInnerHTML: function(element, url, callback) {
												var successCallback = function(responseInfo) {
																var innerHTML = responseInfo.responseText;
																element.innerHTML = innerHTML;
																callback(element);
												};
												YAHOO.util.Connect.asyncRequest('GET', url, { success: successCallback });
								},
								downloadFile: function(url) {
												if (IP.Util.usingIE()) {
																var win = window.open('', 'download', 'menubar=0,resizable=0,width=350,height=100,location=0');
																if (win) {
																				win.location = url;
																				win.focus();
																} else { return false; }
												} else {
																var downloadFrame = document.createElement('iframe');
																downloadFrame.style.display = 'none';
																downloadFrame.src = url;
																document.body.appendChild(downloadFrame);
												}
												return true;
								},
								fixedAncestryCache: [],
								hasFixedAncestry: function(el) {
												if (!el) { return false; }
												var nodeType = (el.tagName ? el.tagName.toLowerCase() : el.nodeName.toLowerCase());
												if (el.id && this.fixedAncestryCache[el.id] != undefined) { return this.fixedAncestryCache[el.id]; }
												if (nodeType == 'body' || nodeType == 'html') {
																if (el.id) { this.fixedAncestryCache[el.id] = false; }
																return false;
												} else if (YAHOO.util.Dom.getStyle(el, 'position').toLowerCase() == 'fixed') {
																if (el.id) { this.fixedAncestryCache[el.id] = true; }
																return true;
												} else { return this.hasFixedAncestry(el.parentNode, true); }
								}
				};
})();
IP.util.Logger = function() {
				return {
								INFO: 0,
								ERROR: 1,
								DEBUG: 2,
								_logArray: new Array(),
								_shouldSendLog: false,
								_log: function(text, type) {
												var date = new Date();
												text = new String(text).replace(/\n/g, '<br/>');
												var logEntry = [date, text, type];
												this._logArray.push(logEntry);
								},
								logError: function(text, errorObject, bypassConsole) {
												if (!bypassConsole) { console.error(text, errorObject); }
												if (errorObject) {
																text = 'ERROR. ' + text + " - " + errorObject.name + ": " + errorObject.message + '; ' +
																				'Location: ' + errorObject.fileName + ' at line ' + errorObject.lineNumber;
												}
												var stackTraceText = this._getStackTraceText(errorObject);
												text += '<br/><b>Stack trace:</b><br/>' + stackTraceText;
												this._log(text, IP.util.Logger.ERROR);
												this._shouldSendLog = true;
								},
								logInfo: function(text) {
												console.info(text);
												this._log(text, IP.util.Logger.INFO);
								},
								logDebug: function(text, shouldSendLog) {
												this._log(text, IP.util.Logger.DEBUG);
												this._shouldSendLog = this._shouldSendLog || shouldSendLog;
								},
								_getStackTraceText: function(errorObject) {
												var startFunction = IP.util.Logger.logError;
												var stack = IP.Util.stackTrace(startFunction, errorObject);
												var text = '';
												var stackLength = stack.length;
												for (var i = 0; i < stackLength; i++) {
																var functionInfo = stack[i];
																var functionName = functionInfo[0];
																var functionBody = functionInfo[1];
																text += '<b><i>' + functionName + '</i></b>: ' + functionBody.escapeHTML() + '<br>';
												}
												return text;
								},
								shouldSendLog: function() { return this._shouldSendLog; },
								getDataPackage: function() {
												var log = new Array();
												var logArrayLength = this._logArray.length;
												for (var i = 0; i < logArrayLength; i++) {
																var logEntry = this._logArray[i];
																var logEntryText = logEntry[0] + ', ' + logEntry[1];
																var entryColor = this.getEntryColor(logEntry);
																if (entryColor) { logEntryText = "<font color='" + entryColor + "'>" + logEntryText + "</font>"; }
																log.push(logEntryText);
												}
												return log;
								},
								getEntryColor: function(entry) {
												var type = entry[2];
												var color = null;
												if (type == IP.util.Logger.ERROR) { color = 'red'; } else if (type == IP.util.Logger.DEBUG) { color = 'green'; }
												return color;
								}
				};
}();
IP.widget.Button = function(element, config) { IP.widget.Button.superclass.constructor.apply(this, arguments); };
YAHOO.lang.extend(IP.widget.Button, YAHOO.widget.Button, {
				_showMenu: function(event) {
								IP.widget.Button.superclass._showMenu.call(this, event);
								this._menu.align("tl", "bl");
				},
				isClickOnSplitButtonMenuArea: function(clickEvent) {
								var isClickOnSplitButtonMenuArea = false;
								var type = this.get('type');
								if (type == 'split') { var element = this.get('element'); var x = $E.getPageX(clickEvent) - $D.getX(element); if ((element.offsetWidth - this.OPTION_AREA_WIDTH) < x) { isClickOnSplitButtonMenuArea = true; } }
								return isClickOnSplitButtonMenuArea;
				}
});
IP.widget.Widget = function(el, config) { this.init(el, config); };
IP.widget.Widget.fetchElement = function(element, templates, templateName) {
				var id;
				if (YAHOO.lang.isString(element)) {
								id = element;
								element = $(id);
				}
				if (!element) { element = IP.widget.Widget.createFromTemplate(templates, templateName); if (id) { element.id = id; } }
				return element;
};
IP.widget.Widget.createFromTemplate = function(templates, templateName) {
				templateName = templateName || 'element';
				var templateId = templates[templateName];
				var newElement = null;
				if (templateId) {
								var templateElement = $(templateId);
								if (templateElement) {
												newElement = templateElement.cloneNode(true);
												newElement.id = '';
								} else { throw new Error('The template ID ' + templateId + ' cannot be found.'); }
				}
				return newElement;
};
IP.widget.Widget.prototype = {
				id: null,
				element: null,
				init: function(el, config) {
								el = IP.widget.Widget.fetchElement(el, this._templateIds);
								this.element = el;
								if (el.id) { this.id = el.id; }
								this._locateElements();
								this._initEvents();
				},
				render: function(appendToNode, insertBeforeReferenceNode) {
								if (appendToNode) {
												if (typeof appendToNode == "string") { appendToNode = $(appendToNode); }
												if (appendToNode) {
																if (insertBeforeReferenceNode) { appendToNode.insertBefore(this.element, $(insertBeforeReferenceNode)); } else { appendToNode.appendChild(this.element); }
												}
								} else { if (!YAHOO.util.Dom.inDocument(this.element)) { return false; } }
								return true;
				},
				show: function() { Element.show(this.element); },
				hide: function() { Element.hide(this.element); },
				isVisible: function() { return Element.isVisible(this.element); },
				_locateElements: function() {},
				_initEvents: function() {},
				_createFromTemplate: function(templateName) { var newElement = IP.widget.Widget.createFromTemplate(this._templateIds, templateName); return newElement; },
				destroy: function() {
								var parent;
								if (this.element) {
												$E.purgeElement(this.element, true);
												parent = this.element.parentNode;
								}
								if (parent) { Element.remove(this.element); }
								this.element = null;
				}
};
IP.widget.InlineNotifier = function(el) { IP.widget.InlineNotifier.superclass.constructor.call(this, el); };
YAHOO.extend(IP.widget.InlineNotifier, IP.widget.Widget, { notificationDisplayedEvent: null, notificationHiddenEvent: null, infoMousedownEvent: null, undoMousedownEvent: null, linkMousedownEvent: null, _notificationDiv: null, _messageSpan: null, _undoLink: null, _infoLink: null, _link: null, _linkLabel: null, _undoCallback: null, _infoCallback: null, _linkCallback: null, _templateIds: { 'element': 'template_inline_notification' } });
IP.widget.InlineNotifier.prototype.init = function(el) {
				IP.widget.InlineNotifier.superclass.init.call(this, el);
				this._messageSpan = document.getElementByHandle('inline_message', this.element, 'span');
				this._undoLink = document.getElementByHandle('inline_action', this.element, 'span');
				this._infoLink = document.getElementByHandle('inline_info', this.element, 'span');
				this._link = document.getElementByHandle('inline_link', this.element, 'span');
				this._linkLabel = document.getElementByHandle('inline_link_label', this.element, 'a');
				this.notificationDisplayedEvent = new YAHOO.util.CustomEvent('notificationDisplayedEvent');
				this.notificationHiddenEvent = new YAHOO.util.CustomEvent('notificationHiddenEvent');
				this.infoMousedownEvent = new YAHOO.util.CustomEvent('infoMousedownEvent');
				this.undoMousedownEvent = new YAHOO.util.CustomEvent('undoMousedownEvent');
				this.linkMousedownEvent = new YAHOO.util.CustomEvent('linkMousedownEvent');
				$E.on(this._undoLink, 'mousedown', function(e) {
								$E.stopEvent(e);
								if (typeof this._undoCallback == 'function') {
												this._undoCallback();
												this.undoMousedownEvent.fire();
								}
								this.element.style.display = 'none';
				}, this, true);
				$E.on(this._undoLink, 'click', function(e) { $E.stopEvent(e); }, this, true);
				$E.on(this._infoLink, 'mousedown', function(e) {
								$E.stopEvent(e);
								if (typeof this._infoCallback == 'function') {
												this._infoCallback();
												this.infoMousedownEvent.fire();
								}
				}, this, true);
				$E.on(this._link, 'mousedown', function(e) {
								$E.stopEvent(e);
								if (typeof this._linkCallback == 'function') {
												this._linkCallback();
												this.linkMousedownEvent.fire();
								}
				}, this, true);
};
IP.widget.InlineNotifier.prototype.show = function(args) {
				if (this.element) {
								if (args['message'] && args['message'] !== '') { this._messageSpan.innerHTML = args['message']; } else { return; }
								if (args['info_callback_function'] && typeof(args['info_callback_function']) == 'function') {
												this._infoCallback = args['info_callback_function'];
												this._infoLink.style.display = '';
								} else { this._infoLink.style.display = 'none'; }
								if (args['undo_callback_function'] && typeof(args['undo_callback_function']) == 'function') {
												this._undoCallback = args['undo_callback_function'];
												this._undoLink.style.display = '';
								} else { this._undoLink.style.display = 'none'; }
								if (args['link_callback_function'] && typeof(args['link_callback_function']) == 'function') {
												this._linkCallback = args['link_callback_function'];
												this._linkLabel.innerHTML = args.linkLabel;
												this._link.style.display = '';
								} else {
												this._link.style.display = 'none';
												this._linkLabel.innerHTML = '';
								}
								if (args['duration'] && parseInt(args['duration'], 10) > 0) {
												var fadeFunction = function() { if (this._messageSpan.innerHTML == args['message']) { this.hide(); } }.bind(this);
												setTimeout(fadeFunction, parseInt(args['duration'], 10) || 3000);
								}
								IP.widget.InlineNotifier.superclass.show.call(this);
								this.notificationDisplayedEvent.fire();
				}
};
IP.widget.InlineNotifier.prototype.hide = function() {
				if (this.element) {
								IP.widget.InlineNotifier.superclass.hide.call(this);
								this._undoCallback = null;
								this._messageSpan.innerHTML = null;
								this._infoCallback = null;
								this.notificationHiddenEvent.fire();
				}
};
IP.widget.Panel = function(element, config) {
				config = config || {};
				config.dragOnly = config.dragOnly === undefined ? true : config.dragOnly;
				IP.widget.Panel.superclass.constructor.call(this, element, config);
};
IP.widget.Panel.visibleModals = [];
IP.widget.Panel.visibleModalExists = function() {
				if (IP.widget.Panel.visibleModals.length > 0) { return true; }
				return false;
};
YAHOO.extend(IP.widget.Panel, YAHOO.widget.Panel, {
				configVisible: function(type, args, obj) {
								IP.widget.Panel.superclass.configVisible.call(this, type, args, obj);
								var visible = args[0];
								var duplicate = false;
								var visibleModals = IP.widget.Panel.visibleModals;
								var visibleModalsLength = visibleModals.length;
								if (this.cfg.getProperty('modal')) {
												if (visible) { if (visibleModals.indexOf(this) == -1) { visibleModals[visibleModals.length] = this; } } else { visibleModals.remove(this); }
								}
								if (this._hasBeenVisible) {
												if (visible) { Element.show(this.element); } else { Element.hide(this.element); }
								}
								this._hasBeenVisible = this._hasBeenVisible || visible;
				},
				buildMask: function() {
								IP.widget.Panel.superclass.buildMask.call(this);
								var zIndex = this.cfg.getProperty('zIndex');
								if (zIndex && (zIndex > 0)) { $D.setStyle(this.mask, "zIndex", (zIndex - 1)); }
								var mouseWheelEventName = IP.Util.getMouseWheelEventName();
								$E.addListener(this.mask, mouseWheelEventName, this._mouseWheelHandler, this, true);
				},
				removeMask: function() {
								var mouseWheelEventName = IP.Util.getMouseWheelEventName();
								$E.removeListener(this.mask, mouseWheelEventName, this._mouseWheelHandler);
								IP.widget.Panel.superclass.removeMask.call(this);
				},
				_mouseWheelHandler: function(event) { $E.stopEvent(event); }
});
IP.widget.Modal = function(el, userConfig) { IP.widget.Modal.superclass.constructor.call(this, el, userConfig); };
YAHOO.extend(IP.widget.Modal, IP.widget.Panel, { _templateIds: { element: "template_modal", cancelButton: "template_modal_cancel_button", button: "template_modal_button" } });
IP.widget.Modal.prototype.init = function(el, userConfig) {
				el = IP.widget.Widget.fetchElement(el, this._templateIds);
				IP.widget.Modal.superclass.init.call(this, el);
				this.cfg.queueProperty('width', '30.8em');
				this.cfg.queueProperty('zIndex', 5000);
				this.cfg.queueProperty('fixedcenter', true);
				this.cfg.queueProperty('constrainttoviewport', false);
				this.cfg.queueProperty('underlay', 'shadow');
				this.cfg.queueProperty('close', false);
				this.cfg.queueProperty('draggable', true);
				this.cfg.queueProperty('modal', true);
				this.cfg.queueProperty('visible', false);
				if (userConfig) { this.cfg.applyConfig(userConfig, true); }
				this._buttonContainer = document.getElementByHandle('button_container', this.body, "div");
				this._messageContainer = document.getElementByHandle('message_content', this.body, "p");
				this._rememberGroupElement = document.getElementByHandle('remember_group', this.body, "div");
				this._rememberCheckboxElement = document.getElementByHandle('remember_checkbox', this.body, "input");
				this._rememberTextElement = document.getElementByHandle('remember_text', this.body, "span");
				this.cfg.subscribeToConfigEvent('visible', this._visibleChangedHandler, this, true);
};
IP.widget.Modal.prototype.destroy = function() {
				this.cfg.unsubscribeFromConfigEvent('visible', this._visibleChangedHandler, this);
				IP.widget.Modal.superclass.destroy.call(this);
};
IP.widget.Modal.prototype._addButton = function(attr) {
				var buttonElement = IP.widget.Widget.fetchElement(attr.id, this._templateIds, 'button');
				attr.type = "button";
				var button = new IP.widget.Button(buttonElement, attr);
				if (this.cancelButton) { button.appendTo(this._buttonContainer, this.cancelButton.get('element')); } else { button.appendTo(this._buttonContainer); }
				return button;
};
IP.widget.Modal.prototype._addCancelButton = function(label) {
				var cancelButtonEl = IP.widget.Widget.fetchElement(null, this._templateIds, 'cancelButton');
				this.cancelButton = new IP.widget.Button(cancelButtonEl, { type: "button", title: label || "Cancel", label: label || "Cancel", onclick: { fn: this._cancelButtonClickHandler.bind(this) } });
				this.cancelButton.appendTo(this._buttonContainer);
};
IP.widget.Modal.prototype._cancelButtonClickHandler = function(e) {
				if (this._cancelFunction) { IP.Util.deferExecution(this._cancelFunction); }
				this.hide();
};
IP.widget.Modal.prototype._resetCancelButton = function(label) {
				label = label || 'Cancel';
				this.cancelButton.set('label', label);
				this.cancelButton.set('title', label);
};
IP.widget.Modal.prototype._setHeader = function(headerContent) {
				this._header = document.getElementByHandle('title_content', this.header, "h2");
				this._header.innerHTML = headerContent;
};
IP.widget.Modal.prototype._setMessage = function(messageContent) {
				if (messageContent && messageContent.tagName) {
								this._messageContainer.innerHTML = '';
								this._messageContainer.appendChild(messageContent);
				} else { this._messageContainer.innerHTML = messageContent; }
};
IP.widget.Modal.prototype._setRememberOption = function(display, messageContent) {
				if (display) { Element.show(this._rememberGroupElement); if (messageContent) { this._rememberTextElement.innerHTML = messageContent; } } else { Element.hide(this._rememberGroupElement); }
};
IP.widget.Modal.prototype._setIcon = function(iconClass) { $D.addClass(document.getElementByHandle('title_content', this.header, "h2"), iconClass); };
IP.widget.Modal.prototype._setCancelFunction = function(cancelFunction) { if (cancelFunction) { this._cancelFunction = function() { cancelFunction({ remember: this._rememberCheckboxElement.checked }); }.bind(this); } };
IP.widget.Modal.prototype._setPostShowFunction = function(postShowFunction) { if (postShowFunction) { this._postShowFunction = function() { postShowFunction(this); }.bind(this); } };
IP.widget.Modal.prototype.isRememberOptionChecked = function() { return this._rememberCheckboxElement.checked; };
IP.widget.Modal.prototype._reset = function(userConfig) {
				var header = userConfig.header || 'Modal';
				this._setHeader(header);
				var message = userConfig.message || '';
				this._setMessage(message);
				this._setCancelFunction(userConfig.cancelFunction);
				this._setPostShowFunction(userConfig.postShowFunction);
				this._setRememberOption(userConfig.remember, userConfig.rememberText);
};
IP.widget.Modal.prototype.show = function(userConfig) {
				userConfig = userConfig || {};
				this._reset(userConfig);
				IP.widget.Modal.superclass.show.call(this);
};
IP.widget.Modal.prototype._visibleChangedHandler = function(type, args) {
				var visible = args[0];
				if (visible && !this._previouslyVisible) { if (this._postShowFunction) { IP.Util.deferExecution(this._postShowFunction); } }
				this._previouslyVisible = visible;
};
YAHOO.namespace("iThenticate");
var iThenticate = YAHOO.iThenticate;
iThenticate.currentLang = function() { var lang = document.getElementsByTagName('HTML')[0].lang || 'en-us'; return lang.replace(/-/g, '_'); }
iThenticate.DocumentManager = function() { this.init(); };
iThenticate.DocumentManager.prototype = {
				inbox: null,
				toolbar: null,
				_messageCenter: null,
				inlineNotifier: null,
				folderGroupsList: null,
				init: function() {
								if ($('docs')) { this.inbox = new iThenticate.Inbox($('docs')); }
								if ($('toolbar')) { this.toolbar = new iThenticate.Toolbar($('toolbar')); }
								this.folderGroupsList = new iThenticate.FolderGroupsList($('folder_list'));
								this.inlineNotifier = new iThenticate.InlineNotifier($('message_spot'));
								this._initMessageCenter();
								this._initListeners();
				},
				_initMessageCenter: function() {
								var url = '/move_document';
								this._messageCenter = new IP.net.MessageCenter(url, true);
				},
				_initListeners: function() {
								if (this.toolbar) {
												this.toolbar.moveButtonClickEvent.subscribe(this._moveButtonClickHandler, this, true);
												this.toolbar.trashButtonClickEvent.subscribe(this._trashButtonClickHandler, this, true);
												this.toolbar.deleteButtonClickEvent.subscribe(this._deleteButtonClickHandler, this, true);
								}
								if (this.inbox) {
												this.inbox.selectionChangedEvent.subscribe(this._selectionChangedHandler, this, true);
												this.inbox.dragStartEvent.subscribe(this._dragStartHandler, this, true);
												this.inbox.dragEndEvent.subscribe(this._dragEndHandler, this, true);
												this.inbox.itemDropEvent.subscribe(this._itemDropHandler, this, true);
												this.inbox.dragEnterExpanderEvent.subscribe(this._dragEnterExpanderHandler, this, true);
												this.inbox.dragOutFromExpanderEvent.subscribe(this._dragOutFromExpanderHandler, this, true);
												this.inbox.dragEnterValidEvent.subscribe(this._dragEnterValidHandler, this, true);
												this.inbox.dragOutFromValidEvent.subscribe(this._dragOutFromValidHandler, this, true);
								}
				},
				_moveButtonClickHandler: function(e, args) {
								if (args[0] == 'f' || args[0] == 'g') { this._moveSelectedItems(args[1]); } else {
												this.inlineNotifier.hide();
												this.inlineNotifier.show({ message: $loc("Please choose a valid destination to move the selected item(s) into.") });
								}
				},
				_trashButtonClickHandler: function(e) { this._trashSelectedItems(); },
				_deleteButtonClickHandler: function(e) { this._deleteSelectedItems(); },
				_selectionChangedHandler: function(e, args) {
								var selectedDocumentCount = args[0];
								if (selectedDocumentCount > 0) {
												this.toolbar.disableButtons();
												this.toolbar.enableButtons();
								} else { this.toolbar.disableButtons(); }
				},
				_dragStartHandler: function(e) {
								if (this.inbox && this.inbox.multipleTypes) { this.folderGroupsList.disableOtherDDTargets(); }
								this.folderGroupsList.disableFolderHoverOptions();
				},
				_dragEndHandler: function(e) {
								if (this.inbox && this.inbox.multipleTypes) {
												this.folderGroupsList.enableDDTargets();
												this.inlineNotifier.hide();
												this.inlineNotifier.show({ message: $loc("You cannot move folders and documents to the same destination.") });
								} else { this.inlineNotifier.hide(); }
								this.folderGroupsList.enableFolderHoverOptions();
				},
				_itemDropHandler: function(e, args) {
								var targetId = args[0];
								if (targetId == 'trash_folder') { this._trashSelectedItems(); } else {
												var targetIdType = targetId.substring(0, 1);
												if (targetIdType == 'f') {
																var folderId = targetId.substring(6);
																this._moveSelectedItems(folderId);
												} else if (targetIdType == 'g') {
																var groupId = targetId.substring(5);
																this._moveSelectedItems(groupId);
												}
								}
				},
				_dragEnterExpanderHandler: function(e, args) {
								if (this._expandProcId) {
												clearTimeout(this._expandProcId);
												this._expandProcId = null;
								}
								var delayedExpandFunction = function(args) { this._delayedExpand(args); }.bind(this);
								this._expandProcId = setTimeout(delayedExpandFunction(args), 300);
				},
				_dragOutFromExpanderHandler: function(e, args) {
								this.folderGroupsList.enableDDTargets();
								var targetFolderGroup = this.folderGroupsList.getFolderGroup(args[0]);
								targetFolderGroup.collapse();
				},
				_dragEnterValidHandler: function(e, args) { $D.addClass(args[0].getEl(), 'hover'); },
				_dragOutFromValidHandler: function(e, args) { $D.removeClass(args[0].getEl(), 'hover'); },
				_delayedExpand: function(args) {
								this.folderGroupsList.disableOtherDDTargets(args[0]);
								var targetFolderGroup = this.folderGroupsList.getFolderGroup(args[0]);
								targetFolderGroup.expand();
				},
				_moveSelectedItems: function(destinationId) {
								if (this.inbox) {
												var itemCount = this.inbox.selectedItemsCount();
												if (itemCount.documents && itemCount.folders) {
																this.inlineNotifier.hide();
																this.inlineNotifier.show({ message: $loc("You cannot move folders and documents to the same destination.") });
																return;
												} else {
																var type = (itemCount.documents) ? 'documents' : 'folders';
																var items = this.inbox.getSelectedItemIds();
																this._executeMove(items, destinationId, type);
																this.inbox.removeSelectedItems();
												}
								}
				},
				_trashSelectedItems: function() {
								if (this.inbox) {
												var docs = this.inbox.getSelectedItemIds();
												var itemCount = this.inbox.selectedItemsCount();
												var type = (itemCount.documents) ? 'documents' : 'folders';
												this._executeTrash(docs, type);
												this.inbox.removeSelectedItems();
								}
				},
				_deleteSelectedItems: function() {
								if (this.inbox) {
												var itemCount = this.inbox.selectedItemsCount();
												var selectedItems = this.inbox.getSelectedItems();
												var items = { folders: [], docs: [] };
												for (var i = 0; i < itemCount.total; i++) {
																if (selectedItems[i].type == 'document') { items.docs.push(selectedItems[i].id); } else if (selectedItems[i].type == 'folder') { items.folders.push(selectedItems[i].id); }
												}
												this._executeDelete(items);
												this.inbox.removeSelectedItems();
								}
				},
				_executeMove: function(items, targetId, type) {
								var successCallback;
								if (type == 'documents') {
												successCallback = function(responseInfo) {
																this.inbox.purgeRemovedItems();
																this.inlineNotifier.hide();
																this.inlineNotifier.show({ message: $loc("Selected item(s) moved.") });
												}.bind(this);
								} else { successCallback = function(responseInfo) { window.location.reload(); }; }
								var errorCallback = function(responseInfo) {
												window.scroll(0, 0);
												this.inbox.resurrectRemovedItems();
												this.inlineNotifier.hide();
												this.inlineNotifier.show({ message: $loc("We're sorry. There was a problem moving the selected item(s).") });
								}.bind(this);
								var postData = (type == "documents") ? { action: 'move_docs', data: { to_folder: targetId, docs: items } } : (type == "folders") ? { action: 'move', data: { to_group: targetId, folders: items } } : null;
								var url = '/move_document';
								var callBack = { success: successCallback, failure: errorCallback };
								this._sendRequest(url, callBack, postData);
				},
				_executeTrash: function(docs, type) {
								var successCallback = function(responseInfo) {
												this.inbox.purgeRemovedItems();
												this.inlineNotifier.hide();
												if (type == 'documents') {
													this.inlineNotifier.show({ message: $loc("Selected document(s) sent to trash.") });
												} else {
													this.inlineNotifier.show({ message: $loc("Selected folder(s) sent to trash.") });
												}
												console.log(responseInfo);
								}.bind(this);
								var errorCallback = function(responseInfo) {
												window.scroll(0, 0);
												this.inbox.resurrectRemovedItems();
												this.inlineNotifier.hide();
												this.inlineNotifier.show({ message: $loc("We're sorry. There was a problem deleting the selected item(s).") });
								}.bind(this);
								var postData;
								if (type == 'documents') { postData = { action: 'trash_docs', data: { docs: docs } }; } else { postData = { action: 'trash_folders', data: { folders: docs } }; }
								var url = (typeof(baseURL) != "undefined" || typeof(baseURL) != null) ? baseURL + 'en_us/move_to_trash' : 'en_us/move_to_trash';
								var callBack = { success: successCallback, failure: errorCallback };
								this._sendRequest(url, callBack, postData);
				},
				_executeDelete: function(items) {
								var successCallback = function(responseInfo) {
												this.inlineNotifier.hide();
												this.inlineNotifier.show({ message: $loc("Selected document(s) permanently deleted.") });
								}.bind(this);
								var errorCallback = function(responseInfo) {
												this.inlineNotifier.hide();
												this.inlineNotifier.show({ message: $loc("There was a problem with your attempt to permanently delete the selected documents.") });
												this.inbox.resurrectRemovedItems();
								}.bind(this);
								var postData = { action: 'purge', data: items };
								var url = '/purge_docs';
								var callBack = { success: successCallback, failure: errorCallback };
								this._sendRequest(url, callBack, postData);
				},
				_sendRequest: function(url, callback, postData) {
					postData.data = encodeURIComponent(JSON.stringify(postData.data));
					var parameters = "action=" + postData.action + "&data=" + postData.data;
					var request = YAHOO.util.Connect.asyncRequest('POST', url, callback, parameters);
				}
};
iThenticate.Inbox = function(el) { this.init(el); };
iThenticate.Inbox.EVENT_ITEM_SELECTION_CHANGED = 'selectionChanged';
iThenticate.Inbox.EVENT_DRAG_START = 'dragStart';
iThenticate.Inbox.EVENT_DRAG_END = 'dragEnd';
iThenticate.Inbox.EVENT_ITEM_DROP = 'itemDropEvent';
iThenticate.Inbox.EVENT_DRAG_ENTER_EXPANDER = 'dragEnterExpanderEvent';
iThenticate.Inbox.EVENT_DRAG_OUT_FROM_EXPANDER = 'dragOutFromExpanderEvent';
iThenticate.Inbox.EVENT_DRAG_ENTER_VALID = 'dragEnterValidEvent';
iThenticate.Inbox.EVENT_DRAG_OUT_FROM_VALID = 'dragOutFromValidEvent';
iThenticate.Inbox.prototype = {
				dragStartEvent: null,
				dragEndEvent: null,
				itemDropEvent: null,
				dragEnterExpanderEvent: null,
				dragOutFromExpanderEvent: null,
				dragEnterValidEvent: null,
				dragOutFromValidEvent: null,
				_selectedItems: null,
				_items: null,
				selectionChangedEvent: null,
				_selectAllCheckbox: null,
				init: function(el) {
								this.element = el;
								this._selectedItems = new IP.util.FactorySet();
								this._selectAllCheckbox = $('selectall');
								$E.on(this._selectAllCheckbox, 'click', this._selectAllItems, this, true);
								this.proxyElement = $('proxy_icon');
								this._items = new IP.util.FactorySet();
								this._initItems();
								this.selectionChangedEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_ITEM_SELECTION_CHANGED, this);
								this.dragStartEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_START, this);
								this.dragEndEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_END, this);
								this.itemDropEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_ITEM_DROP, this);
								this.dragEnterExpanderEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_ENTER_EXPANDER, this);
								this.dragOutFromExpanderEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_OUT_FROM_EXPANDER, this);
								this.dragEnterFolderGroupEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_ENTER_FOLDER_GROUP, this);
								this.dragOutFromFolderGroupEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_OUT_FROM_FOLDER_GROUP, this);
								this.dragEnterValidEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_ENTER_VALID, this);
								this.dragOutFromValidEvent = new YAHOO.util.CustomEvent(iThenticate.Inbox.EVENT_DRAG_OUT_FROM_VALID, this);
				},
				_initItems: function() {
								var items = $D.getElementsByClassName('inbox_item', 'tbody', this.element);
								var itemsLength = items.length;
								for (var i = 0; i < itemsLength; i++) {
												var itemType = ($D.hasClass(items[i], 'document_item')) ? 'document' : ($D.hasClass(items[i], 'folder_item')) ? 'folder' : null;
												if (itemType) {
																var itemId = document.getElementByClassName('item_id', items[i], 'span').innerHTML;
																var newItem;
																if (itemType == 'document') {
																				newItem = new iThenticate.DocumentItem(itemId, items[i], this.proxyElement);
																				if (newItem.isOwned()) {
																								newItem.dragEnterExpanderEvent.subscribe(this._dragEnterExpanderHandler, this, true);
																								newItem.dragOutFromExpanderEvent.subscribe(this._dragOutFromExpanderHandler, this, true);
																				}
																} else if (itemType == 'folder') {
																				newItem = new iThenticate.FolderItem(itemId, items[i], this.proxyElement);
																				if (newItem.isOwned()) {
																								newItem.dragEnterFolderGroupEvent.subscribe(this._dragEnterFolderGroupHandler, this, true);
																								newItem.dragOutFromFolderGroupEvent.subscribe(this._dragOutFromFolderGroupHandler, this, true);
																				}
																}
																if (newItem.isOwned()) {
																				newItem.selectedEvent.subscribe(this._itemSelectedHandler, this, true);
																				newItem.unselectedEvent.subscribe(this._itemUnselectedHandler, this, true);
																				newItem.dragStartEvent.subscribe(this._dragStartHandler, this, true);
																				newItem.dragEndEvent.subscribe(this._dragEndHandler, this, true);
																				newItem.dropEvent.subscribe(this._dropHandler, this, true);
																				newItem.dragEnterValidEvent.subscribe(this._dragEnterValidHandler, this, true);
																				newItem.dragOutFromValidEvent.subscribe(this._dragOutFromValidHandler, this, true);
																				newItem.dragEnterInvalidEvent.subscribe(this._dragEnterInvalidHandler, this, true);
																				newItem.dragOutFromInvalidEvent.subscribe(this._dragOutFromInvalidHandler, this, true);
																}
																this._items.add(newItem);
												}
								}
				},
				getSelectedItems: function() { return this._selectedItems.getSortedData(); },
				_itemSelectedHandler: function(e, args) {
								this._selectedItems.add(args[0]);
								this.selectionChangedEvent.fire(this._selectedItems.size());
				},
				_itemUnselectedHandler: function(e, args) {
								this._selectedItems.remove(args[0]);
								this.selectionChangedEvent.fire(this._selectedItems.size());
				},
				_dragStartHandler: function(e, args) {
								var selectedItemsCount = this.selectedItemsCount();
								if (selectedItemsCount.documents !== 0 && selectedItemsCount.folders !== 0) { this.multipleTypes = true; }
								var currentItem = args[0];
								var itemCount = (this._selectedItems.idInUse(currentItem.id)) ? this._selectedItems.size() : this._selectedItems.size() + 1;
								if (itemCount > 1) {
												$D.addClass(this.proxyElement, 'multiple_documents');
												this.multipleItems = true;
												if (this.multipleTypes) { $D.addClass(this.proxyElement, 'm_invalid_target'); }
								} else {
												$D.addClass(this.proxyElement, 'single_document');
												this.multipleItems = false;
												if (this.multipleTypes) { $D.addClass(this.proxyElement, 's_invalid_target'); }
								}
								this.dragStartEvent.fire();
				},
				_dragEndHandler: function(e) {
								if (this.multipleItems) {
												$D.removeClass(this.proxyElement, 'multiple_documents');
												$D.removeClass(this.proxyElement, 'm_valid_target');
												$D.removeClass(this.proxyElement, 'm_invalid_target');
								} else {
												$D.removeClass(this.proxyElement, 'single_document');
												$D.removeClass(this.proxyElement, 's_valid_target');
												$D.removeClass(this.proxyElement, 's_invalid_target');
								}
								this.dragEndEvent.fire();
								this.multipleTypes = null;
								this.multipleItems = null;
				},
				_dropHandler: function(e, args) { this.itemDropEvent.fire(args[0]); },
				_dragEnterExpanderHandler: function(e, args) { this.dragEnterExpanderEvent.fire(args[0]); },
				_dragOutFromExpanderHandler: function(e, args) { this.dragOutFromExpanderEvent.fire(args[0]); },
				_dragEnterFolderGroupHandler: function(e, args) {
								this._lastFolderGroupTarget = args[0];
								if (this.multipleItems) { $D.addClass(this.proxyElement, 'm_valid_target'); } else { $D.addClass(this.proxyElement, 's_valid_target'); }
								this.dragEnterFolderGroupEvent.fire(args[0]);
				},
				_dragOutFromFolderGroupHandler: function(e, args) {
								if (this._lastFolderGroupTarget == args[0]) {
												if (this.multipleItems) { $D.removeClass(this.proxyElement, 'm_valid_target'); } else { $D.removeClass(this.proxyElement, 's_valid_target'); }
								}
								this.dragOutFromFolderGroupEvent.fire(args[0]);
				},
				_dragEnterValidHandler: function(e, args) {
								this._lastValidTarget = args[0];
								if (this.multipleItems) { $D.addClass(this.proxyElement, 'm_valid_target'); } else { $D.addClass(this.proxyElement, 's_valid_target'); }
								this.dragEnterValidEvent.fire(args[0]);
				},
				_dragEnterInvalidHandler: function(e) {
								if (this.multipleItems) { $D.addClass(this.proxyElement, 'm_invalid_target'); } else { $D.addClass(this.proxyElement, 's_invalid_target'); }
				},
				_dragOutFromValidHandler: function(e, args) {
								if (this._lastValidTarget == args[0]) {
												if (this.multipleItems) { $D.removeClass(this.proxyElement, 'm_valid_target'); } else { $D.removeClass(this.proxyElement, 's_valid_target'); }
								}
								this.dragOutFromValidEvent.fire(args[0]);
				},
				_dragOutFromInvalidHandler: function(e) {
								if (this.multipleItems) { $D.removeClass(this.proxyElement, 'm_invalid_target'); } else { $D.removeClass(this.proxyElement, 's_invalid_target'); }
				},
				removeSelectedItems: function() {
								for (var i = 0; i < this._selectedItems.size(); i++) { this._selectedItems.getItemByIndex(i).destroy(); }
								this._selectedItems.removeAll();
								this.selectionChangedEvent.fire(this._selectedItems.size());
				},
				getSelectedItemIds: function() {
								var itemIds = [];
								for (var i = 0; i < this._selectedItems.size(); i++) {
												var itemId = this._selectedItems.getItemByIndex(i).id;
												itemIds.push(itemId);
								}
								return itemIds;
				},
				_selectAllItems: function() {
								for (var i = 0; i < this._items.size(); i++) {
												this._items.getItemByIndex(i).select();
												this._items.getItemByIndex(i).checkCheckbox();
								}
								$E.removeListener(this._selectAllCheckbox, 'click', this._selectAllItems);
								$E.on(this._selectAllCheckbox, 'click', this._unselectAllItems, this, true);
				},
				_unselectAllItems: function() {
								for (var i = 0; i < this._items.size(); i++) {
												this._items.getItemByIndex(i).unselect();
												this._items.getItemByIndex(i).uncheckCheckbox();
								}
								$E.removeListener(this._selectAllCheckbox, 'click', this._unselectAllItems);
								$E.on(this._selectAllCheckbox, 'click', this._selectAllItems, this, true);
				},
				purgeRemovedItems: function() {
					for (var i = 0; i < this._items.size(); i++) {
						var item = this._items.getItemByIndex(i);
						if (item.removed) {
							this._items.remove(item);
						}
					}
				},
				selectedItemsCount: function() {
								var selectedItems = this._selectedItems.getSortedData();
								var selectedItemsLength = this._selectedItems.size();
								var docCount = 0;
								var folderCount = 0;
								for (var i = 0; i < selectedItemsLength; i++) {
									if (selectedItems[i].type == 'document') {
										docCount++;
									}
									else if (selectedItems[i].type == 'folder') {
										folderCount++;
									}
								}
								return {
									total: selectedItemsLength,
									documents: docCount,
									folders: folderCount
								};
				},
				resurrectRemovedItems: function() {
					for (var i = 0; i < this._items.size(); i++) {
						var item = this._items.getItemByIndex(i);
						if (item.removed) {
							item.resurrect();
						}
					}
				},
				getPendingDocIds: function() {
					var pendingPartIds = [];
					for (var i = 0; i < this._items.size(); i++) {
						var item = this._items.getItemByIndex(i);
						if (item.type == "document" && item.isPending()) {
							pendingPartIds.push(item.id);
						}
					}
					return pendingPartIds;
				},
				initializeReportUpdating: function(threshold) {
					var pendingReportIds = this.getPendingDocIds();
					var current_lang = (iThenticate.currentLang() == "") ? "en_us" : iThenticate.currentLang() ;
					iThenticate.ReportUpdater.start({
						pendingReportRequests: pendingReportIds,
						url: (typeof(baseURL) != "undefined" && baseURL !== null) ? "" : baseURL + current_lang + '/document/status',
						delay: 10000,
						maxRetries: 120,
						alertThreshold: threshold
					});
				}
};
iThenticate.FolderInbox = function(el) { this.init(el); };
iThenticate.FolderInbox.EVENT_DOCUMENT_SELECTION_CHANGED = 'documentSelectionChangedEvent';
iThenticate.FolderInbox.prototype = {
				element: null,
				_selectedRowCount: 0,
				selectionChangedEvent: null,
				_selectAllCheckbox: null,
				_checkBoxElements: null,
				init: function(el) {
								this.element = el;
								this.selectionChangedEvent = new YAHOO.util.CustomEvent(iThenticate.FolderInbox.EVENT_DOCUMENT_SELECTION_CHANGED, this);
								this._selectAllCheckbox = $('selectall');
								$E.addListener(this._selectAllCheckbox, 'click', this._selectAllRows, this, true);
								this._initRows();
				},
				_initRows: function() {
								this._checkBoxElements = $D.getElementsByClassName('fol_check', 'input');
								this._checkBoxElementsLength = this._checkBoxElements.length;
								for (var i = 0; i < this._checkBoxElementsLength; i++) { $E.addListener(this._checkBoxElements[i], 'click', this._checkBoxClickedHandler, this, true); }
				},
				_selectAllRows: function() {
								for (var i = 0; i < this._checkBoxElementsLength; i++) {
												this._checkBoxElements[i].checked = true;
												this._selectedRowCount++;
								}
								this.selectionChangedEvent.fire(this._selectedRowCount);
								$E.removeListener(this._selectAllCheckbox, 'click', this._selectAllRows);
								$E.addListener(this._selectAllCheckbox, 'click', this._unselectAllRows, this, true);
				},
				_unselectAllRows: function() {
								for (var i = 0; i < this._checkBoxElementsLength; i++) { this._checkBoxElements[i].checked = false; }
								this._selectedRowCount = 0;
								this.selectionChangedEvent.fire(this._selectedRowCount);
								$E.removeListener(this._selectAllCheckbox, 'click', this._unselectAllRows);
								$E.addListener(this._selectAllCheckbox, 'click', this._selectAllRows, this, true);
				},
				_checkBoxClickedHandler: function(event) {
								var targetCheckBox = $E.getTarget(event);
								if (targetCheckBox.checked === true) {
												this._selectedRowCount++;
												if (this._selectedRowCount == this._checkBoxElements.length) {
																this._selectAllCheckbox.checked = true;
																$E.removeListener(this._selectAllCheckbox, 'click', this._selectAllRows);
																$E.addListener(this._selectAllCheckbox, 'click', this._unselectAllRows, this, true);
												}
								}
								if (targetCheckBox.checked === false) {
												if (this._selectAllCheckbox.checked === true) {
																this._selectAllCheckbox.checked = false;
																$E.removeListener(this._selectAllCheckbox, 'click', this._unselectAllRows);
																$E.addListener(this._selectAllCheckbox, 'click', this._selectAllRows, this, true);
												}
												this._selectedRowCount--;
								}
								this.selectionChangedEvent.fire(this._selectedRowCount);
				}
};
iThenticate.InboxItem = function(sortIndex, el, proxyEl) {
				this.init(sortIndex, el);
				this.proxyElement = proxyEl;
};
iThenticate.InboxItem.EVENT_ITEM_SELECTED = 'itemSelected';
iThenticate.InboxItem.EVENT_ITEM_UNSELECTED = 'itemUnselected';
iThenticate.InboxItem.EVENT_DRAG_START = 'dragStart';
iThenticate.InboxItem.EVENT_DRAG_END = 'dragEnd';
iThenticate.InboxItem.EVENT_DRAG_ENTER_VALID = 'dragEnterValidEvent';
iThenticate.InboxItem.EVENT_DRAG_OUT_FROM_VALID = 'dragOutFromValidEvent';
iThenticate.InboxItem.EVENT_DRAG_ENTER_INVALID = 'dragEnterInvalidEvent';
iThenticate.InboxItem.EVENT_DRAG_OUT_FROM_INVALID = 'dragOutFromInvalidEvent';
iThenticate.InboxItem.EVENT_DROP = 'dropEvent';
iThenticate.InboxItem.prototype = {
				id: null,
				element: null,
				_elementInitHeight: null,
				_owned: false,
				_checkboxElement: null,
				_selected: false,
				removed: false,
				selectedEvent: null,
				unselectedEvent: null,
				dragStartEvent: null,
				dragEndEvent: null,
				dragEnterValidEvent: null,
				dragOutFromValidEvent: null,
				dropEvent: null,
				_animFadeOut: null,
				_animFadeSlideOut: null,
				_animFadeIn: null,
				_animFadeSlideIn: null,
				ddProxy: null,
				type: null,
				_ddClassname: null,
				init: function(docId, el) {
								this.id = docId;
								this.element = el;
								this._selected = false;
								this._checkboxElement = document.getElementByClassName("select_item", this.element, 'input');
								if (this._checkboxElement) {
												this._owned = true;
												$E.on(this._checkboxElement, 'click', this._checkedChange, this, true);
												this._initEvents();
												this._initDragDrop();
												this._initAnimation();
								}
				},
				_initEvents: function() {
								this.selectedEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_ITEM_SELECTED, this);
								this.unselectedEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_ITEM_UNSELECTED, this);
								this.dragStartEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DRAG_START, this);
								this.dragEndEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DRAG_END, this);
								this.dragEnterValidEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DRAG_ENTER_VALID, this);
								this.dragOutFromValidEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DRAG_OUT_FROM_VALID, this);
								this.dragEnterInvalidEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DRAG_ENTER_INVALID, this);
								this.dragOutFromInvalidEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DRAG_OUT_FROM_INVALID, this);
								this.dropEvent = new YAHOO.util.CustomEvent(iThenticate.InboxItem.EVENT_DROP, this);
				},
				_initAnimation: function() {
								this._elementInitHeight = this.element.offsetHeight;
								this._animFadeOut = new YAHOO.util.Anim(this.element, { opacity: { to: 0 } }, 1);
								this._animFadeOut.onComplete.subscribe(function() { this._animFadeSlideOut.animate(); }, this, true);
								this._animFadeSlideOut = new YAHOO.util.Anim(this.element, { height: { to: 0 } }, 0.1);
								this._animFadeSlideOut.onComplete.subscribe(function() { Element.hide(this.element); }, this, true);
				},
				_initDragDrop: function() {
								this.ddProxy = new YAHOO.util.DDProxy(document.getElementByClassName(this._ddClassname, this.element, 'tr'), "valid", { resizeFrame: false, dragElId: 'proxy_icon', isTarget: false });
								this.ddProxy.addToGroup('invalid');
								this.ddProxy.addToGroup('manual');
								this.ddProxy.onMouseDown = function(e) {
												this.ddProxy.startPos = YAHOO.util.Dom.getXY(this.ddProxy.getEl());
												this.ddProxy.setDelta(20, 20);
								}.bind(this);
								this.ddProxy.startDrag = function(e) {
												this._checkboxElement.checked = true;
												this.select();
												this.dragStartEvent.fire(this);
								}.bind(this);
								this.ddProxy.endDrag = function(e) { this.dragEndEvent.fire(this); }.bind(this);
				},
				checkCheckbox: function() { if (this._checkboxElement) { this._checkboxElement.checked = true; } },
				uncheckCheckbox: function() { this._checkboxElement.checked = false; },
				select: function() {
								this._selected = true;
								$D.addClass(this.element, 'selected_doc');
								this.checkCheckbox();
								this.selectedEvent.fire(this);
				},
				unselect: function() {
								this._selected = false;
								$D.removeClass(this.element, 'selected_doc');
								this.uncheckCheckbox();
								this.unselectedEvent.fire(this);
				},
				_checkedChange: function() {
								if (this._checkboxElement.checked) { this.select(); } else { this.unselect(); }
				},
				isOwned: function() { return this._owned; },
				destroy: function() {
								this.removed = true;
								if (IP.Util.usingIE()) { Element.hide(this.element); } else { this._animFadeOut.animate(); }
				}
};
YAHOO.lang.augment(iThenticate.InboxItem, IP.util.SetItem);
iThenticate.DocumentItem = function(sortIndex, el, proxyEl) { iThenticate.DocumentItem.superclass.constructor.call(this, sortIndex, el, proxyEl); };
iThenticate.DocumentItem.EVENT_DRAG_ENTER_EXPANDER = 'dragEnterExpanderEvent';
iThenticate.DocumentItem.EVENT_DRAG_OUT_FROM_EXPANDER = 'dragOutFromExpanderEvent';
YAHOO.lang.extend(iThenticate.DocumentItem, iThenticate.InboxItem, {
				partsElement: null,
				_expandButton: null,
				dragEnterExpanderEvent: null,
				dragOutFromExpanderEvent: null,
				_animExpand: null,
				_animCollapse: null,
				init: function(docId, el) {
								this._ddClassname = 'document_row';
								iThenticate.DocumentItem.superclass.init.call(this, docId, el);
								this.type = "document";
								var documentOptDivElement = document.getElementByClassName('folder_options', this.element, 'div');
								if (documentOptDivElement) {
												var documentOptionsElement = documentOptDivElement.getElementsByTagName('SPAN')[0];
												$E.on(this.element, 'mouseover', this._elementMouseoverHandler, documentOptionsElement, true);
												$E.on(this.element, 'mouseout', this._elementMouseoutHandler, documentOptionsElement, true);
								}
								this.partsElement = document.getElementByClassName('_' + this.id + "_doc_parts", this.element.parentNode, 'tbody');
								if (this.partsElement) {
												this.initExpandButton();
												this._hideParts();
								}
				},
				_initEvents: function() {
								iThenticate.DocumentItem.superclass._initEvents.call(this);
								this.dragEnterExpanderEvent = new YAHOO.util.CustomEvent(iThenticate.DocumentItem.EVENT_DRAG_ENTER_EXPANDER, this);
								this.dragOutFromExpanderEvent = new YAHOO.util.CustomEvent(iThenticate.DocumentItem.EVENT_DRAG_OUT_FROM_EXPANDER, this);
				},
				initExpandButton: function() {
								var expandCell = document.getElementByClassName('td_expand', this.element, 'td');
								var spanElement = expandCell.getElementsByTagName('span');
								if (spanElement) {
												$D.addClass(spanElement, 'expand_icon');
												this._expandButton = new YAHOO.util.Element(spanElement);
												this._expandButton.on('click', this._expandParts, this, this);
												var partsElementHeight = this.partsElement.offsetHeight;
												this._animExpand = new YAHOO.util.Anim(this.partsElement, { height: { to: partsElementHeight } }, 0.05);
												this._animExpand.onStart.subscribe(function() { Element.show(this.partsElement); }, this, true);
												this._animCollapse = new YAHOO.util.Anim(this.partsElement, { height: { to: 0 } }, 0.05);
												this._animCollapse.onComplete.subscribe(function() { Element.hide(this.partsElement); }, this, true);
								}
				},
				_initDragDrop: function() {
								iThenticate.DocumentItem.superclass._initDragDrop.call(this);
								this.ddProxy.addToGroup('expander');
								this.ddProxy.onDragDrop = function(e, id) { var ddTarget = YAHOO.util.DragDropMgr.getDDById(id); if (ddTarget.groups.valid) { this.dropEvent.fire(id); } }.bind(this);
								this.ddProxy.onDragEnter = function(e, id) {
												var ddTarget = YAHOO.util.DragDropMgr.getDDById(id);
												if (ddTarget.groups.expander) { this.dragEnterExpanderEvent.fire(id); } else if (ddTarget.groups.valid) { this.dragEnterValidEvent.fire(ddTarget); } else if (ddTarget.groups.invalid) { this.dragEnterInvalidEvent.fire(); }
								}.bind(this);
								this.ddProxy.onDragOut = function(e, id) {
												var ddTarget = YAHOO.util.DragDropMgr.getDDById(id);
												if (ddTarget.groups.expander) { this.dragOutFromExpanderEvent.fire(id); } else if (ddTarget.groups.valid) { this.dragOutFromValidEvent.fire(ddTarget); } else if (ddTarget.groups.invalid) { this.dragOutFromInvalidEvent.fire(); }
								}.bind(this);
				},
				_initAnimation: function() {
								iThenticate.DocumentItem.superclass._initAnimation.call(this);
								this._animFadeIn = new YAHOO.util.Anim(this.element, { opacity: { to: 1 } }, 1);
								this._animFadeSlideIn = new YAHOO.util.Anim(this.element, { height: { to: this._elementInitHeight } }, 0.5);
								this._animFadeSlideIn.onStart.subscribe(function() { Element.show(this.element); }, this, true);
								this._animFadeSlideIn.onComplete.subscribe(function() { this._animFadeIn.animate(); }, this, true);
				},
				_elementMouseoverHandler: function(event, optionsElement) { optionsElement.style.display = 'block'; },
				_elementMouseoutHandler: function(event, optionsElement) {
								return;
								optionsElement.style.display = 'none';
				},
				_hideParts: function() {
								if (this.partsElement) {
												this._collapseParts();
												Element.hide(this.partsElement);
								}
				},
				_expandParts: function(e) {
								if (IP.Util.usingIE()) { Element.show(this.partsElement); } else {
												Element.show(this.partsElement);
												this._animExpand.animate();
								}
								this._expandButton.removeClass('expand_icon');
								this._expandButton.addClass('collapse_icon');
								this._expandButton.removeListener('click', this._expandParts);
								this._expandButton.on('click', this._collapseParts, this, this);
				},
				_collapseParts: function(e) {
								if (IP.Util.usingIE()) { Element.hide(this.partsElement); } else { this._animCollapse.animate(); }
								this._expandButton.removeClass('collapse_icon');
								this._expandButton.addClass('expand_icon');
								this._expandButton.removeListener('click', this._collapseParts);
								this._expandButton.on('click', this._expandParts, this, this);
				},
				select: function() { iThenticate.DocumentItem.superclass.select.call(this); if (this.partsElement) { $D.addClass(this.partsElement, 'selected_doc'); } },
				unselect: function() { iThenticate.DocumentItem.superclass.unselect.call(this); if (this.partsElement) { $D.removeClass(this.partsElement, 'selected_doc'); } },
				destroy: function() {
								this._hideParts();
								iThenticate.DocumentItem.superclass.destroy.call(this);
				},
				resurrect: function() {
								if (IP.Util.usingIE()) { Element.show(this.element); } else {
												this._animFadeOut.stop(true);
												this._animFadeSlideOut.stop(true);
												this._animFadeSlideIn.animate();
								}
								this.removed = false;
								this.select();
				},
				isPending: function() { return (document.getElementByClassName('td_wait', this.element, 'TD') || false); }
});
iThenticate.FolderItem = function(sortIndex, el, proxyEl) { iThenticate.FolderItem.superclass.constructor.call(this, sortIndex, el, proxyEl); };
iThenticate.FolderItem.EVENT_DRAG_ENTER_FOLDER_GROUP = 'dragEnterFolderGroupEvent';
iThenticate.FolderItem.EVENT_DRAG_OUT_FROM_FOLDER_GROUP = 'dragOutFromFolderGroupEvent';
YAHOO.lang.extend(iThenticate.FolderItem, iThenticate.InboxItem, {
				init: function(folderId, el) {
								this._ddClassname = 'folder_row';
								iThenticate.FolderItem.superclass.init.call(this, folderId, el);
				},
				_initEvents: function() {
								iThenticate.FolderItem.superclass._initEvents.call(this);
								this.dragEnterFolderGroupEvent = new YAHOO.util.CustomEvent(iThenticate.DocumentItem.EVENT_DRAG_ENTER_FOLDER_GROUP, this);
								this.dragOutFromFolderGroupEvent = new YAHOO.util.CustomEvent(iThenticate.DocumentItem.EVENT_DRAG_OUT_FROM_FOLDER_GROUP, this);
				},
				_initDragDrop: function() {
								iThenticate.FolderItem.superclass._initDragDrop.call(this);
								this.ddProxy.addToGroup('folderGroup');
								this.ddProxy.onDragDrop = function(e, id) { var ddTarget = YAHOO.util.DragDropMgr.getDDById(id); if (ddTarget.groups.folderGroup) { this.dropEvent.fire(id); } }.bind(this);
								this.ddProxy.onDragEnter = function(e, id) {
												var ddTarget = YAHOO.util.DragDropMgr.getDDById(id);
												if (ddTarget.groups.folderGroup) { this.dragEnterFolderGroupEvent.fire(ddTarget); } else if (ddTarget.groups.invalid) { this.dragEnterInvalidEvent.fire(); }
								}.bind(this);
								this.ddProxy.onDragOut = function(e, id) {
												var ddTarget = YAHOO.util.DragDropMgr.getDDById(id);
												if (ddTarget.groups.folderGroup) { this.dragOutFromFolderGroupEvent.fire(ddTarget); } else if (ddTarget.groups.invalid) { this.dragOutFromInvalidEvent.fire(); }
								}.bind(this);
								this.type = "folder";
				}
});
iThenticate.Toolbar = function(el) { this.init(el); };
iThenticate.Toolbar.EVENT_TRASH_BUTTON_CLICKED = 'trashButtonClicked';
iThenticate.Toolbar.EVENT_MOVE_BUTTON_CLICKED = 'moveButtonClicked';
iThenticate.Toolbar.EVENT_DELETE_BUTTON_CLICKED = 'deleteButtonClicked';
iThenticate.Toolbar.prototype = {
				element: null,
				_trashButton: null,
				_resubmitButton: null,
				_moveButton: null,
				_deleteButton: null,
				_removeSharedFolderButtonElement: null,
				_moveFolderSelect: null,
				trashButtonClickEvent: null,
				moveButtonClickEvent: null,
				deleteButtonClickEvent: null,
				init: function(el) {
								this.element = el;
								this._initElements();
								this._initEvents();
				},
				_initElements: function() {
								this._trashButton = document.getElementByClassName('trash', this.element, 'input');
								if (this._trashButton) { this._disableButtonElement(this._trashButton); }
								this._resubmitButton = document.getElementByClassName('resubmit', this.element, 'input');
								if (this._resubmitButton) { this._disableButtonElement(this._resubmitButton); }
								this._moveButton = document.getElementByClassName('move', this.element, 'input');
								if (this._moveButton) {
												this._disableButtonElement(this._moveButton);
												this._moveFolderSelect = document.getElementByClassName('move_field', this.element, 'select');
								}
								this._deleteButton = document.getElementByClassName('delete', this.element, 'input');
								if (this._deleteButton) { this._disableButtonElement(this._deleteButton); }
								this._removeSharedFolderButtonElement = document.getElementByClassName('remove_shared', this.element, 'input');
								if (this._removeSharedFolderButtonElement) { this._disableButtonElement(this._removeSharedFolderButtonElement); }
				},
				_initEvents: function() {
								this.trashButtonClickEvent = new YAHOO.util.CustomEvent(iThenticate.Toolbar.EVENT_TRASH_BUTTON_CLICKED, this);
								this.moveButtonClickEvent = new YAHOO.util.CustomEvent(iThenticate.Toolbar.EVENT_MOVE_BUTTON_CLICKED, this);
								this.deleteButtonClickEvent = new YAHOO.util.CustomEvent(iThenticate.Toolbar.EVENT_DELETE_BUTTON_CLICKED, this);
				},
				_trashButtonClickHandler: function(e) {
								$E.preventDefault(e);
								this.trashButtonClickEvent.fire();
				},
				_moveButtonClickHandler: function(e) {
								$E.preventDefault(e);
								var moveToFolderId = this._moveFolderSelect[this._moveFolderSelect.selectedIndex].value;
								var folderType = moveToFolderId.substring(0, 1);
								var folderId = moveToFolderId.substring(1, (moveToFolderId.length));
								this.moveButtonClickEvent.fire(folderType, folderId);
				},
				_deleteButtonClickHandler: function(e) {
								$E.preventDefault(e);
								this.deleteButtonClickEvent.fire();
				},
				enableButtons: function() {
								if (this._moveButton) { this._enableButtonElement(this._moveButton, this._moveButtonClickHandler); }
								if (this._trashButton) { this._enableButtonElement(this._trashButton, this._trashButtonClickHandler); }
								if (this._resubmitButton) { this._enableButtonElement(this._resubmitButton); }
								if (this._deleteButton) { this._enableButtonElement(this._deleteButton, this._deleteButtonClickHandler); }
								if (this._removeSharedFolderButtonElement) { this._enableButtonElement(this._removeSharedFolderButtonElement); }
				},
				disableButtons: function() {
								if (this._moveButton) { this._disableButtonElement(this._moveButton, this._moveButtonClickHandler); }
								if (this._trashButton) { this._disableButtonElement(this._trashButton, this._trashButtonClickHandler); }
								if (this._resubmitButton) { this._disableButtonElement(this._resubmitButton); }
								if (this._deleteButton) { this._disableButtonElement(this._deleteButton, this._deleteButtonClickHandler); }
								if (this._removeSharedFolderButtonElement) { this._disableButtonElement(this._removeSharedFolderButtonElement); }
				},
				_enableButtonElement: function(el, clickHandler) {
								$D.removeClass(el, 'yui-button-disabled');
								el.removeAttribute('disabled');
								if (clickHandler) { $E.on(el, 'click', clickHandler, this, true); }
				},
				_disableButtonElement: function(el, clickHandler) {
								$D.addClass(el, 'yui-button-disabled');
								el.setAttribute('disabled', 'disabled');
								if (clickHandler) { $E.removeListener(el, 'click', clickHandler); }
				}
};
YAHOO.namespace("iThenticate");
var iThenticate = YAHOO.iThenticate;
iThenticate.FolderGroupsList = function(el) { this.init(el); };
iThenticate.FolderGroupsList.prototype = {
				element: null,
				_folderGroups: {},
				init: function(el) {
								this.element = el;
								this._initFolderGroups();
				},
				_initFolderGroups: function() {
								var folderGroupElements = $D.getElementsByClassName('_folder_group', 'li', this.element);
								var folderGroupElementsLength = folderGroupElements.length;
								for (var i = 0; i < folderGroupElementsLength; i++) {
												$D.generateId(folderGroupElements[i], 'folder_grp');
												var newFolderGroup = new iThenticate.FolderGroup(folderGroupElements[i], this);
												this._folderGroups[folderGroupElements[i].id] = newFolderGroup;
								}
								var trashFolder = $('trash_folder');
								if ($D.hasClass(trashFolder, 'active')) { new YAHOO.util.DDTarget(trashFolder, 'manual'); } else { new YAHOO.util.DDTarget(trashFolder, 'valid'); }
				},
				getFolderGroup: function(folderGroupId) { return this._folderGroups[folderGroupId]; },
				disableOtherDDTargets: function(exemptedFolderGroupId) { for (var id in this._folderGroups) { if (id != exemptedFolderGroupId) { var target = this._folderGroups[id]._headerDDTarget; if (target && !target.isLocked()) { target.lock(); } } } },
				enableDDTargets: function() { for (var id in this._folderGroups) { var target = this._folderGroups[id]._headerDDTarget; if (target && target.isLocked()) { target.unlock(); } } },
				disableFolderHoverOptions: function() { for (var id in this._folderGroups) { this._folderGroups[id].disableFolderHoverOptions(); } },
				enableFolderHoverOptions: function() { for (var id in this._folderGroups) { this._folderGroups[id].enableFolderHoverOptions(); } }
};
iThenticate.FolderGroup = function(el) { this.init(el); };
iThenticate.FolderGroup.prototype = {
				element: null,
				animSlideExpand: null,
				animSlideCollapse: null,
				_headerElement: null,
				_folderListElement: null,
				_folderListElementHeight: null,
				_expandButtonElement: null,
				_headerDDTarget: null,
				_folderDDTargets: null,
				_expanded: null,
				empty: false,
				_foldersInitilized: false,
				init: function(el) {
								this.element = el;
								this._locateElements();
								if (!this.empty) {
												if (!IP.Util.usingIE()) {
																this.animSlideExpand = new YAHOO.util.Anim(this._folderListElement, { height: { to: this._folderListElementHeight } }, 0.05);
																this.animSlideExpand.onComplete.subscribe(function() { YAHOO.util.DragDropMgr.refreshCache(); }, this, true);
																this.animSlideCollapse = new YAHOO.util.Anim(this._folderListElement, { height: { to: 0 } }, 0.05);
																this.animSlideCollapse.onComplete.subscribe(function() { YAHOO.util.DragDropMgr.refreshCache(); }, this, true);
												}
												this._folderDDTargets = {};
												this._initDDTargets();
												if (this.isActive()) { this.expand(false); } else { this.collapse(); }
												this._initListeners();
								}
				},
				_locateElements: function() {
								var childElements = this.element.childNodes;
								var childElementsLength = childElements.length;
								for (var i = 0; i < childElementsLength; i++) {
												if (childElements[i].tagName) {
																switch (childElements[i].tagName.toUpperCase()) {
																				case 'SPAN':
																								this._headerElement = childElements[i];
																								break;
																				case 'DIV':
																								this._folderListElement = childElements[i];
																								this._folderListElementHeight = this._folderListElement.offsetHeight;
																								break;
																				default:
																								break;
																}
												}
								}
								if (!this._folderListElement) { this.empty = true; } else {
												this._folderElements = this._folderListElement.getElementsByTagName('LI');
												this._folderElementsLength = this._folderElements.length;
												var matchSpan = function(node) { return (node.tagName.toUpperCase() == 'SPAN'); };
												this._expandButtonElement = $D.getFirstChildBy(this._headerElement, matchSpan);
												Element.show(this._expandButtonElement);
								}
				},
				_initDDTargets: function() {
								if (this.isActive()) { this._headerDDTarget = new YAHOO.util.DDTarget(this.element, 'manual'); } else if (this.isShared()) { this._headerDDTarget = new YAHOO.util.DDTarget(this.element, 'invalid'); } else {
												this._headerDDTarget = new YAHOO.util.DDTarget(this.element, 'expander');
												this._headerOnlyDDTarget = new YAHOO.util.DDTarget(this._headerElement, 'folderGroup');
								}
				},
				_initFolderDDTargets: function() {
								var newTarget;
								for (var i = 0; i < this._folderElementsLength; i++) {
												if (!this.isShared()) {
																if ($D.hasClass(this._folderElements[i], 'active')) { newTarget = new YAHOO.util.DDTarget(this._folderElements[i], 'invalid'); } else { newTarget = new YAHOO.util.DDTarget(this._folderElements[i], 'valid'); }
												} else { newTarget = new YAHOO.util.DDTarget(this._folderElements[i], 'invalid'); }
												this._folderDDTargets[this._folderElements[i].id] = newTarget;
								}
				},
				_initListeners: function() {
								for (var i = 0; i < this._folderElementsLength; i++) {
												$E.addListener(this._folderElements[i], 'mouseover', this._folderElementsMouseoverHandler, this._folderElements[i], true);
												$E.addListener(this._folderElements[i], 'mouseout', this._folderElementsMouseoutHandler, this._folderElements[i], true);
								}
								$E.addListener(this._expandButtonElement, 'click', this._expandButtonClickHandler, this, true);
				},
				_folderElementsMouseoverHandler: function(event, folderElement) { $D.addClass(folderElement, 'hoveropt'); },
				_folderElementsMouseoutHandler: function(event, folderElement) { $D.removeClass(folderElement, 'hoveropt'); },
				_expandButtonClickHandler: function() {
								if (this.isExpanded()) {
												if (this._headerDDTarget.groups.manual) {
																this._headerDDTarget.removeFromGroup('manual');
																this._headerDDTarget.addToGroup('expander');
												}
												this.collapse();
								} else {
												if (this._headerDDTarget.groups.expander) {
																this._headerDDTarget.removeFromGroup('expander');
																this._headerDDTarget.addToGroup('manual');
												}
												this.expand();
								}
				},
				expand: function() {
								if (!this._foldersInitialized) {
												this._initFolderDDTargets();
												this._foldersInitialized = true;
								}
								if (this.animSlideExpand) {
												if (this.animSlideCollapse.isAnimated()) { this.animSlideCollapse.stop(); }
												this.animSlideExpand.animate();
								} else {
												Element.show(this._folderListElement);
												YAHOO.util.DragDropMgr.refreshCache();
								}
								this._expanded = true;
								for (var id in this._folderDDTargets) { if (this._folderDDTargets[id].isLocked()) { this._folderDDTargets[id].unlock(); } }
								$D.replaceClass(this._expandButtonElement, 'expand_icon', 'collapse_icon');
				},
				collapse: function() {
								if (this.animSlideCollapse) {
												if (this.animSlideExpand.isAnimated()) { this.animSlideExpand.stop(); }
												this.animSlideCollapse.animate();
								} else {
												Element.hide(this._folderListElement);
												YAHOO.util.DragDropMgr.refreshCache();
								}
								this._expanded = false;
								for (var id in this._folderDDTargets) { this._folderDDTargets[id].lock(); }
								$D.replaceClass(this._expandButtonElement, 'collapse_icon', 'expand_icon');
				},
				disableFolderHoverOptions: function() {
								for (var i = 0; i < this._folderElementsLength; i++) {
												$E.removeListener(this._folderElements[i], 'mouseover', this._folderElementsMouseoverHandler, this._folderElements[i], true);
												$E.removeListener(this._folderElements[i], 'mouseout', this._folderElementsMouseoutHandler, this._folderElements[i], true);
								}
				},
				enableFolderHoverOptions: function() {
								for (var i = 0; i < this._folderElementsLength; i++) {
												$E.addListener(this._folderElements[i], 'mouseover', this._folderElementsMouseoverHandler, this._folderElements[i], true);
												$E.addListener(this._folderElements[i], 'mouseout', this._folderElementsMouseoutHandler, this._folderElements[i], true);
								}
				},
				isActive: function() {
								var active = false;
								var activeFolder = $D.getElementsByClassName('active', 'li', this._folderListElement);
								if (activeFolder.length > 0) { active = true; } else { active = $D.hasClass(this.element, 'active'); }
								return active;
				},
				isShared: function() { return $D.hasClass(this.element, 'shared'); },
				isExpanded: function() { return this._expanded; }
};
iThenticate.Calendar = function(el, container, config) { iThenticate.Calendar.superclass.constructor.call(this, el, container, config); };
YAHOO.lang.extend(iThenticate.Calendar, YAHOO.widget.Calendar, {
				init: function(el, container, config) {
								iThenticate.Calendar.superclass.init.call(this, el, container, config);
								this.textDateField = config.target || document.getElementByClassName('Date_yyyy_mm_dd', 'input', el);
								this.trigger = document.getElementById(this.textDateField.id + '_icon');
								this.trigger.style.display = 'inline';
								this.selectEvent.subscribe(this._handleSelect, this, true);
								$E.on(this.trigger, 'click', this._show, this, true);
								this.selectEvent.subscribe(this._selectEventHandler, this, true);
				},
				_selectEventHandler: function(e) {
								this.textDateField.focus();
								this.textDateField.blur();
				},
				_show: function() { this.show(); },
				_handleSelect: function(type, args, obj) {
								var dates = args[0];
								var date = dates[0];
								var year = date[0],
												month = date[1],
												day = date[2];
								month = (month < 10) ? '0' + month : month;
								day = (day < 10) ? '0' + day : day;
								this.textDateField.value = year + '-' + month + '-' + day;
								this.hide();
				}
});
iThenticate.CalendarManager = function(elementArray) { this.init(elementArray); };
iThenticate.CalendarManager.prototype = {
				_calendars: null,
				init: function(elementArray) {
								this._calendars = [];
								var arrayLength = elementArray.length;
								for (var i = 0; i < arrayLength; i++) {
												var inputEl = elementArray[i];
												this._addCalendar(inputEl);
								}
				},
				_addCalendar: function(inputEl) {
								var container = document.createElement("DIV");
								container.setAttribute('id', inputEl.id + "_cal_container");
								$D.addClass(container, "calendar_container");
								$D.insertAfter(container, inputEl);
								var calendar = new iThenticate.Calendar(inputEl.id + "_cal", container.id, { close: true, target: inputEl, weekdays_short: [$loc('dSun'), $loc('dMon'), $loc('dTue'), $loc('dWed'), $loc('dThur'), $loc('dFri'), $loc('dSat')], months_long: [$loc('mJan'), $loc('mFeb'), $loc('mMar'), $loc('mApr'), $loc('mMay'), $loc('mJun'), $loc('mJul'), $loc('mAug'), $loc('mSep'), $loc('mOct'), $loc('mNov'), $loc('mDec')], my_label_year_position: 1, my_label_year_append: $loc('year-append') });
								calendar.beforeShowEvent.subscribe(this._hideAll.bind(this));
								calendar.render();
								calendar.hide();
								this._calendars[this._calendars.length] = calendar;
				},
				_hideAll: function(e) { var calendarsLength = this._calendars.length; for (var i = 0; i < calendarsLength; i++) { this._calendars[i].hide(); } }
};
iThenticate.FileFieldManager = function(el, addButton, removeButton) { this.init(el, addButton, removeButton); };
iThenticate.FileFieldManager.MAX_FIELDS = 10;
iThenticate.FileFieldManager.prototype = {
				_uploadFields: [],
				init: function(el, addButton, removeButton) {
								this.element = (typeof(el) == "string") ? $(el) : el;
								this._addButton = (typeof(addButton) == "string") ? $(addButton) : addButton;
								$E.on(this._addButton, 'click', this._addField, this, true);
								this._removeButton = (typeof(removeButton) == "string") ? $(removeButton) : removeButton;
								$E.on(this._removeButton, 'click', this._removeField, this, true);
								this._lastFieldsetNumber = 0;
								var hideFields = function(el) {
												var elFields = el.getElementsByTagName('input');
												var elFieldsLength = elFields.length;
												var fieldNum;
												for (var i = 0; i < elFieldsLength; i++) {
																if (elFields[i].value && elFields[i].value !== '') {
																				if (elFields[i].name.match(/report_group/)) { continue; }
																				fieldNum = elFields[i].name.match(/\d+$/);
																				this._lastFieldsetNumber = fieldNum[0];
																				break;
																}
												}
												if ($D.getElementsByClassName('error', 'div', el).length) {
																var legendTag = el.getElementsByTagName('legend');
																fieldNum = legendTag[0].innerHTML.match(/\d+/);
																this._lastFieldsetNumber = fieldNum[0];
												}
												Element.hide(el);
								}.bind(this);
								this._uploadFields = $D.getElementsByClassName('fld_grp', 'fieldset', this.element, hideFields);
								this._revealUpTo(this._lastFieldsetNumber);
				},
				_revealUpTo: function(fieldsetNumber) {
								if (fieldsetNumber) { for (var i = 0; i < fieldsetNumber; i++) { this._addField(); } } else { this._addField(); }
				},
				_addField: function() { if (this._getFieldCount() < iThenticate.FileFieldManager.MAX_FIELDS) { Element.show(this._uploadFields[this._getFieldCount()]); if (this._getFieldCount() == iThenticate.FileFieldManager.MAX_FIELDS) { Element.hide(this._addButton); } } },
				_removeField: function() { if (this._getFieldCount() > 1) { Element.hide(this._uploadFields[this._getFieldCount() - 1]); } },
				_getFieldCount: function() {
								var allFieldCount = this._uploadFields.length;
								var fieldCount = 0;
								for (var i = 0; i < allFieldCount; i++) {
												if (this._uploadFields[i].style.display != 'none') { fieldCount++; } else { break; }
								}
								return fieldCount;
				}
};
YAHOO.namespace("iThenticate");
var iThenticate = YAHOO.iThenticate;
iThenticate.OriginalityReport = function(el) { this.init(el); };
iThenticate.OriginalityReport.prototype = {
				element: null,
				_lastSlotnumClicked: null,
				_lastActiveMatchElementIndex: null,
				_body: null,
				_leftColElement: null,
				_rightColElement: null,
				_viewInWebPageLinkElements: null,
				_matchElements: null,
				_sourceElements: null,
				_sourceElementsLength: null,
				_sourceIdToElement: null,
				_matchesBySource: null,
				scrollLeftColumn: null,
				isPrinting: false,
				dscMode: false,
				webPage: false,
				_orderedTagNames: [],
				init: function(el) {
								this.element = el;
								Element.hide($('change_report'));
								this._lastSlotnumClicked = null;
								this._lastActiveMatchElementIndex = null;
								this._locateElements();
								this._initListeners();
								this.scrollLeftColumn = new YAHOO.util.Scroll(this._leftColElement);
								if (this.dscMode) {
												this.scrollRightColPaperText = new YAHOO.util.Scroll(this._rightColPaperTextElement);
												this._initRightColumnDsc();
								} else if (this.isContentReport() && !this.webPage && this._activeSource) {
												this._rightColElement.scrollTop = this._activeSource.offsetTop - this._leftColElement.offsetTop - 25;
												this._leftColElement.scrollTop = this._firstMatch ? this._firstMatch.offsetTop - this._leftColElement.offsetTop - 25 : this._rightColElement.scrollTop;
								}
								this.windowResize();
								$E.on(window, 'load', this.windowResize.bind(this));
				},
				_locateElements: function() {
								this._body = document.getElementsByTagName('body')[0];
								this._leftColElement = $('col-1');
								this._rightColElement = $('col-2');
								if ($D.hasClass(this._rightColElement, 'webpage')) { this.webPage = true; }
								this._topNavElement = $('top_nav');
								this._topSectionElement = $('title_bar') || $('topsection');
								this._toolbarElement = $('toolbar');
								this._viewInWebPageLinkElements = $D.getElementsByClassName('show_in_web', 'a', this._rightColElement);
								this._matchElements = $D.getElementsByClassName('match', 'a', this._leftColElement);
								this._sourceElements = $D.getElementsByClassName('source', 'div', this._rightColElement);
								this._sourceElementsLength = this._sourceElements.length;
								this._rightColPaperTextElement = $D.getElementsByClassName('paper_text', 'div', this._rightColElement)[0];
								this._rightColHeaderElement = $('col2-head');
								this._upDownButtonsDiv = $('up_down_buttons');
								if (this._upDownButtonsDiv) {
												this._prevMatchButtonElement = $('nav-up');
												this._nextMatchButtonElement = $('nav-down');
												this.dscMode = true;
								}
								var i, j;
								this._sourceIdToElement = [];
								for (i = 0; i < this._sourceElementsLength; i++) { this._sourceIdToElement[this._sourceElements[i].id] = this._sourceElements[i]; }
								this._matchesBySource = {};
								for (i = 0; i < this._sourceElementsLength; i++) {
												var sourceId = this._sourceElements[i].id;
												this._matchesBySource[sourceId] = $D.getElementsByClassName(sourceId, 'a', this._leftColElement);
								}
								if (this.dscMode) {
												this.leftToRight = {};
												this.rightToLeft = {};
												var leftTagName, rightTagName;
												this.rightMatchElements = $D.getElementsByClassName('match', 'a', this._rightColElement);
												this._rightMatchElementsLength = this.rightMatchElements.length;
												this.dscSlotNum = this.extractFromClass(this.rightMatchElements[0].className, 'slot');
												this.leftMatchElements = $D.getElementsByClassName(this.dscSlotNum, 'a', this._leftColElement);
												if (this.leftMatchElements.length === 0 && this.isContentReport()) { this.leftMatchElements = $D.getElementsByClassName('match', 'a', this._leftColElement); }
												this._leftMatchElementsLength = this.leftMatchElements.length;
												for (i = 0; i < this._leftMatchElementsLength; i++) { leftTagName = this.extractFromClass(this.leftMatchElements[i].className, 'tag'); for (j = 0; j < this._rightMatchElementsLength; j++) { rightTagName = this.extractFromClass(this.rightMatchElements[j].className, 'tag'); if (rightTagName == leftTagName) { this.leftToRight[leftTagName] = this.rightMatchElements[j]; continue; } } }
												for (i = 0; i < this._rightMatchElementsLength; i++) {
																rightTagName = this.extractFromClass(this.rightMatchElements[i].className, 'tag');
																this.rightToLeft[rightTagName] = {};
																this.rightToLeft[rightTagName].elements = [];
																this.rightToLeft[rightTagName].index = i;
																this._orderedTagNames[i] = rightTagName;
																for (j = 0; j < this._leftMatchElementsLength; j++) { leftTagName = this.extractFromClass(this.leftMatchElements[j].className, 'tag'); if (leftTagName == rightTagName) { this.rightToLeft[rightTagName].elements.push(this.leftMatchElements[j]); } }
												}
								}
								if (this.isContentReport()) {
												for (i = 0; i < this._sourceElementsLength; i++) { if ($D.hasClass(this._sourceElements[i], 'active')) { this._activeSource = this._sourceElements[i]; continue; } }
												this._firstMatch = this._matchElements[0];
								}
				},
				extractFromClass: function(className, uniqueClass) {
								var startIndex = className.indexOf(uniqueClass);
								var stopIndex = className.indexOf(' ', startIndex);
								if (stopIndex < 0) { return className.substring(startIndex); }
								return className.substring(startIndex, stopIndex);
				},
				_initListeners: function() {
								var i;
								if (!this.dscMode) {
												$E.on(this._matchElements, 'mouseover', this._matchMouseoverHandler, this, true);
												$E.on(this._matchElements, 'mouseout', this._matchMouseoutHandler, this, true);
												for (i = 0; i < this._sourceElementsLength; i++) {
																var slotnumElement = $D.getElementsByClassName('slotnum', 'span', this._sourceElements[i]);
																$E.on(slotnumElement, 'mouseover', this._slotnumMouseoverHandler, this, true);
																$E.on(slotnumElement, 'mouseout', this._slotnumMouseoutHandler, this, true);
																$E.on(slotnumElement, 'click', this._slotnumClickHandler, this, true);
												}
								} else {
												for (i = 0; i < this._leftMatchElementsLength; i++) { $E.on(this.leftMatchElements[i], 'click', this._leftMatchElementClickHandler.bind(this), [this.leftMatchElements[i], i]); }
												for (i = 0; i < this._rightMatchElementsLength; i++) { $E.on(this.rightMatchElements[i], 'click', this._rightMatchElementClickHandler.bind(this), this.rightMatchElements[i]); }
												if (this._rightMatchElementsLength > 1) {
																Element.show(this._upDownButtonsDiv);
																$E.on(this._prevMatchButtonElement, 'click', this._prevMatchButtonClickHandler, this, true);
																$E.on(this._nextMatchButtonElement, 'click', this._nextMatchButtonClickHandler, this, true);
												}
								}
								$E.on(window, 'resize', this._windowResizeHandler, this, true);
								$E.on(this._viewInWebPageLinkElements, 'click', this._viewInWebPageClickHandler, this, true);
				},
				_initRightColumnDsc: function() {
								var initialLeftMatchElement;
								for (var i = 0; i < this._leftMatchElementsLength; i++) {
												if ($D.hasClass(this.leftMatchElements[i], 'clicked')) {
																initialLeftMatchElement = this.leftMatchElements[i];
																this._lastLeftMatchesIndex = i;
												}
								}
								if (!initialLeftMatchElement) {
												initialLeftMatchElement = this.leftMatchElements[0];
												this._lastLeftMatchesIndex = 0;
								}
								if (IP.Util.usingIE() || IP.Util.usingIE6()) { this._rightColScrollPadding = this._rightColHeaderElement.offsetHeight + 25; } else { this._rightColScrollPadding = this._rightColHeaderElement.offsetHeight + this._leftColElement.offsetTop + 25; }
								this._lastTagSelected = this.extractFromClass(initialLeftMatchElement.className, 'tag');
								var initialRightMatchElement = this.leftToRight[this._lastTagSelected];
								this._rightColPaperTextElement.scrollTop = initialRightMatchElement.offsetTop - this._rightColScrollPadding;
								if (IP.Util.usingIE() || IP.Util.usingIE6()) { this._leftColElement.scrollTop = initialLeftMatchElement.offsetTop - this._leftColElement.offsetTop - this._rightColScrollPadding; } else { this._leftColElement.scrollTop = initialLeftMatchElement.offsetTop - this._rightColScrollPadding; }
				},
				_matchMouseoverHandler: function(event) {
								var matchElement = $E.getTarget(event);
								if ($D.hasClass(matchElement, '_hov')) {
												var matchElementClass;
												if ($D.hasClass(matchElement, 'match')) { matchElementClass = matchElement.className; } else { matchElementClass = matchElement.parentNode.className; }
												var sourceElementId = this.extractFromClass(matchElementClass, 'slot');
												var sourceElement = this._sourceIdToElement[sourceElementId];
												$D.addClass(sourceElement, 'active');
								}
				},
				_matchMouseoutHandler: function(event) {
								var matchElement = $E.getTarget(event);
								if ($D.hasClass(matchElement, '_hov')) {
												var matchElementClass;
												if ($D.hasClass(matchElement, 'match')) { matchElementClass = matchElement.className; } else { matchElementClass = matchElement.parentNode.className; }
												var sourceElementId = this.extractFromClass(matchElementClass, 'slot');
												var sourceElement = this._sourceIdToElement[sourceElementId];
												$D.removeClass(sourceElement, 'active');
								}
				},
				_slotnumMouseoverHandler: function(event) { $D.addClass($E.getTarget(event).parentNode.parentNode, 'active'); },
				_slotnumMouseoutHandler: function(event) { $D.removeClass($E.getTarget(event).parentNode.parentNode, 'active'); },
				_slotnumClickHandler: function(event) {
								$E.stopEvent(event);
								if (this.scrollLeftColumn.isAnimated()) { this.scrollLeftColumn.stop(); }
								var slotnum = $E.getTarget(event).parentNode.parentNode.id;
								var activeMatchElementIndex = 0;
								if (this._lastSlotnumClicked == slotnum) { activeMatchElementIndex = this._lastActiveMatchElementIndex + 1; if (this._matchesBySource[slotnum].length <= activeMatchElementIndex) { activeMatchElementIndex = 0; } }
								var activeMatchElement = this._matchesBySource[slotnum][activeMatchElementIndex];
								if (activeMatchElement) {
												this._scrollToMatchElement(activeMatchElement);
												this._lastSlotnumClicked = slotnum;
												this._lastActiveMatchElementIndex = activeMatchElementIndex;
												return true;
								} else { return false; }
				},
				_viewInWebPageClickHandler: function(event) { this._showLoadingPanel('Retrieving, please wait...'); },
				_showLoadingPanel: function(message) {
								if (!this._loadingPanel) {
												myPanel = new iThenticate.LoadingPanel('loading_panel');
												myPanel.render(document.body);
								}
								myPanel.setHeader(message);
								myPanel.show();
				},
				_scrollToMatchElement: function(matchElement) {
								var matchElementYPosition = matchElement.offsetTop - this._leftColElement.offsetTop - 40;
								this.scrollLeftColumn.attributes.scroll = { to: [0, matchElementYPosition] };
								this.scrollLeftColumn.animate();
				},
				_leftMatchElementClickHandler: function(event, args) {
								$E.stopEvent(event);
								var leftMatchElement = args[0];
								var tagName = this.extractFromClass(leftMatchElement.className, 'tag');
								var rightMatchElement = this.leftToRight[tagName];
								this._scrollInDscMode(leftMatchElement, rightMatchElement);
								this._lastTagSelected = tagName;
								this._lastLeftMatchesIndex = args[1];
								return false;
				},
				_rightMatchElementClickHandler: function(event, rightMatchElement) {
								$E.stopEvent(event);
								var leftMatchElement = this._getLeftMatch(rightMatchElement, false);
								this._scrollInDscMode(leftMatchElement, rightMatchElement);
								return false;
				},
				_prevMatchButtonClickHandler: function(event) {
								var prevRightMatchIndex = this.rightToLeft[this._lastTagSelected].index - 1;
								if (prevRightMatchIndex < 0) { prevRightMatchIndex = this._rightMatchElementsLength - 1; }
								var prevRightMatchElement = this.leftToRight[this._orderedTagNames[prevRightMatchIndex]];
								var prevLeftMatchElement = this._getLeftMatch(prevRightMatchElement, true);
								this._scrollInDscMode(prevLeftMatchElement, prevRightMatchElement);
				},
				_nextMatchButtonClickHandler: function(event) {
								var nextRightMatchIndex = this.rightToLeft[this._lastTagSelected].index + 1;
								if (nextRightMatchIndex >= this._rightMatchElementsLength) { nextRightMatchIndex = 0; }
								var nextRightMatchElement = this.leftToRight[this._orderedTagNames[nextRightMatchIndex]];
								var nextLeftMatchElement = this._getLeftMatch(nextRightMatchElement, true);
								this._scrollInDscMode(nextLeftMatchElement, nextRightMatchElement);
				},
				_getLeftMatch: function(rightMatchElement, firstMatchOnly) {
								var tagName = this.extractFromClass(rightMatchElement.className, 'tag');
								var leftMatches = this.rightToLeft[tagName].elements;
								if (!firstMatchOnly && (this._lastTagSelected == tagName) && (leftMatches.length > this._lastLeftMatchesIndex + 1)) { this._lastLeftMatchesIndex++; } else {
												this._lastLeftMatchesIndex = 0;
												this._lastTagSelected = tagName;
								}
								return leftMatches[this._lastLeftMatchesIndex];
				},
				_scrollInDscMode: function(leftMatchElement, rightMatchElement) {
								if (this.scrollRightColPaperText.isAnimated()) { this.scrollRightColPaperText.stop(); }
								if (this.scrollLeftColumn.isAnimated()) { this.scrollLeftColumn.stop(); }
								var rightMatchElementYPosition = rightMatchElement.offsetTop - this._rightColScrollPadding;
								this.scrollRightColPaperText.attributes.scroll = { to: [0, rightMatchElementYPosition] };
								this.scrollRightColPaperText.animate();
								var leftMatchElementYPosition = leftMatchElement.offsetTop - this._rightColScrollPadding;
								if (IP.Util.usingIE() || IP.Util.usingIE6()) { leftMatchElementYPosition = leftMatchElementYPosition - this._leftColElement.offsetTop; }
								this.scrollLeftColumn.attributes.scroll = { to: [0, leftMatchElementYPosition] };
								this.scrollLeftColumn.animate();
				},
				_windowResizeHandler: function(event) {
								$E.stopEvent(event);
								this.windowResize();
				},
				windowResize: function() {
								if (this.isPrinting) { return; }
								var windowHeight = $D.getViewportHeight();
								var columnHeight = windowHeight - $('footer').offsetHeight -
												this._topNavElement.offsetHeight - this._topSectionElement.offsetHeight - this._toolbarElement.offsetHeight;
								$D.setStyle(this._leftColElement, 'height', columnHeight + 'px');
								if ($('show_web_page_frame')) {
												columnHeight -= $D.getElementsByClassName('noprint-block', 'div', this._rightColElement)[0].offsetHeight;
												$D.setStyle($('show_web_page_frame'), 'height', columnHeight + 'px');
								}
								columnHeight -= 1;
								$D.setStyle(this._rightColElement, 'height', columnHeight + 'px');
								if (this._rightColHeaderElement) {
												columnHeight -= this._rightColHeaderElement.offsetHeight;
												$D.setStyle(this._rightColPaperTextElement, 'height', columnHeight + 'px');
								}
				},
				isSimilarityReport: function() {
								if ($D.hasClass(this.element, 'similarity_report')) { return true; } else { return false; }
				},
				isContentReport: function() {
								if ($D.hasClass(this.element, 'content_report')) { return true; } else { return false; }
				},
				isSummaryReport: function() {
								if ($D.hasClass(this.element, 'summary_report')) { return true; } else { return false; }
				},
				isLargestReport: function() {
								if ($D.hasClass(this.element, 'largest_report')) { return true; } else { return false; }
				}
};
iThenticate.LoadingPanel = function(el, userConfig) { iThenticate.LoadingPanel.superclass.constructor.call(this, el, userConfig); };
YAHOO.lang.extend(iThenticate.LoadingPanel, YAHOO.widget.Panel, {
				init: function(el, userConfig) {
								userConfig = { width: '404px', fixedcenter: true, close: false, draggable: false, zindex: 4, modal: true, visible: false, underlay: false };
								iThenticate.LoadingPanel.superclass.init.call(this, el, userConfig);
								$D.setStyle(el, 'display', 'block');
				}
});
iThenticate.InlineNotifier = function(el) { iThenticate.InlineNotifier.superclass.constructor.call(this, el); };
YAHOO.lang.extend(iThenticate.InlineNotifier, IP.widget.InlineNotifier, {
				init: function(el) {
								iThenticate.InlineNotifier.superclass.init.call(this, el);
								var staticMessageDiv = document.getElementByClassName('static', this.element, 'div');
								this.hide();
								if (staticMessageDiv) {
												this.show({ message: staticMessageDiv.innerHTML });
												this.element.removeChild(staticMessageDiv);
								}
								Element.show(this._messageSpan);
				}
});
iThenticate.ReportUpdater = function() {
				return {
								start: function(config) {
												this.pendingReportRequests = config.pendingReportRequests || this.pendingReportRequests || [];
												if (!this.pendingReportRequests) { return false; }
												this._delay = config.delay || 10000;
												this._maxRetries = config.maxRetries || 120;
												this._url = config.url;
												this._alertThreshold = config.alertThreshold || 100;
												this._refreshCount = 0;
												this._stop = false;
												this._queueRequest();
												return true;
								},
								_showLoadingMessage: function() {
												if (!this._loadingMessageElement) {
																this._loadingMessageElement = document.createElement('DIV');
																this._loadingMessageElement.innerHTML = $loc('<strong>Updating Page...</strong><div class="clear"></div>');
																$D.addClass(this._loadingMessageElement, 'updating_page');
																document.body.appendChild(this._loadingMessageElement);
												}
												$D.setStyle(this._loadingMessageElement, 'opacity', '100');
												$D.setStyle(this._loadingMessageElement, 'display', 'block');
								},
								_hideLoadingMessage: function() {
												var anim = new YAHOO.util.Anim(this._loadingMessageElement, { opacity: { to: 0 } }, 2, YAHOO.util.Easing.easeOut);
												anim.onComplete.subscribe(function(el) { $D.setStyle(el, 'display', 'none'); });
												anim.animate();
								},
								setReportIds: function(reportPaperIds) { this.pendingReportRequests = reportPaperIds; },
								stop: function() {
												this._stop = true;
												Element.hide(this._loadingMessageElement);
								},
								restart: function() {
												this._stop = false;
												this._refreshCount = 0;
												this._queueRequest();
								},
								_queueRequest: function() { if (!this._stop && (this._refreshCount < this._maxRetries) && (this.pendingReportRequests.length)) { setTimeout(this._sendUpdateRequest.bind(this), this._delay); } },
								_sendUpdateRequest: function() {
												this._showLoadingMessage();
												this._refreshCount++;
												var callback = { success: this._processUpdateResults.bind(this), failure: function(e) { this._hideLoadingMessage(); throw new Error('error requesting report update: ' + e.message); }.bind(this) };
												YAHOO.util.Connect.resetDefaultHeaders();
												var transaction = YAHOO.util.Connect.asyncRequest('GET', this._url + '?id=' + this.pendingReportRequests.join('&id='), callback);
								},
								_processUpdateResults: function(response) {
												var results = JSON.parse(response.responseText);
												if (results.documents) {
																for (var docId in results.documents) {
																				var docData = results.documents[docId];
																				this._updateReport(docId, docData, results.report_type);
																				if (!docData.is_pending) {
																								this.pendingReportRequests.remove(docId);
																								if (results.revised_docs) {
																												var remove_id = results.revised_docs[docId];
																												if (remove_id && typeof docData.score != 'undefined') {
																																var tbody = document.getElementById('dr' + remove_id);
																																var tbody_parts = document.getElementById('dpr' + remove_id);
																																if (tbody) { tbody.parentNode.removeChild(tbody); }
																																if (tbody_parts) { tbody_parts.parentNode.removeChild(tbody_parts); }
																												}
																								}
																				}
																}
												}
												this._queueRequest();
												this._hideLoadingMessage();
								},
								_updateReport: function(docId, docData, reportType) {
												var docDataPartsLength = docData.parts.length;
												for (var i = 0; i < docDataPartsLength; i++) {
																var part = docData.parts[i];
																var partElement = $('pending_part_' + part.id);
																if (partElement && part.score) {
																				var parentNode = partElement.parentNode;
																				parentNode.innerHTML = '';
																				var newPartLink = this._createLinkElement(part.path, part.score);
																				$D.setStyle(newPartLink, 'opacity', 0);
																				parentNode.appendChild(newPartLink);
																				var titleElement = document.getElementByClassName('title', parentNode.parentNode, 'td');
																				titleElement.innerHTML = '<a target="_blank" href=' + part.path + '>' + titleElement.innerHTML + '<a>';
																				var anim = new YAHOO.util.Anim(newPartLink, { opacity: { to: 100 } }, 4, YAHOO.util.Easing.easeIn);
																				anim.animate();
																}
												}
												var docElement = $('pending_doc_' + docId);
												if (docElement) {
																if (docData.state && docData.state != docElement.innerHTML) { docElement.innerHTML = docData.state; }
																if (docData.fail_url || (docData.score && !docData.is_pending)) {
																				$D.removeClass(docElement, 'td_wait');
																				docElement.innerHTML = '';
																				var newLinkElement = docData.fail_url ? this._createFailLinkElement(docData.fail_url, docData.state) : this._createLinkElement(docData.path, docData.score);
																				$D.setStyle(newLinkElement, 'opacity', 0);
																				docElement.appendChild(newLinkElement);
																				if (docData.fail_url)
																								$D.addClass(docElement, 'td_noreport');
																				var animation = new YAHOO.util.Anim(newLinkElement, { opacity: { to: 100 } }, 4, YAHOO.util.Easing.easeIn);
																				animation.animate();
																}
												}
								},
								_createFailLinkElement: function(path, text) {
												var element = document.createElement('A');
												element.href = path;
												element.innerHTML = text;
												return element;
								},
								_createLinkElement: function(path, score) {
												var element = document.createElement('A');
												element.href = path;
												element.setAttribute('target', '_blank');
												element.className = score >= this._alertThreshold ? 'btn btn-primary' : 'btn btn-default-alt';
												element.innerHTML = score + '%';
												return element;
								}
				};
}();

function showSmallMatchExclusions() {
				if (init_by_percent) {
								$('exclude_by_percent_value').value = init_percent;
								updateExcludeWordCount(init_percent);
				} else {
								$('exclude_by_words_value').value = init_words;
								updateExcludePercentage(init_words);
				}
				$D.setStyle('small_matches_prefs', 'visibility', 'visible');
				$D.hasClass('exclude_by_percent_row', 'selected') ? $('exclude_by_percent_value').focus() : $('exclude_by_words_value').focus();
				hideLimitMatchSize();
}

function hideSmallMatchExclusions() { $D.setStyle('small_matches_prefs', 'visibility', 'hidden'); }

function selectSmallExclusionMethod(enableType) {
				if (enableType == 'words') {
								$('exclude_by_words_value').focus();
								$D.addClass('exclude_by_words_row', 'selected');
								$D.removeClass('exclude_by_percent_row', 'selected');
								$D.removeClass('exclude_by_words_row', 'disabled');
								$D.addClass('exclude_by_percent_row', 'disabled');
								$('p_el').value = 0;
				} else {
								$('exclude_by_percent_value').focus();
								$D.removeClass('exclude_by_words_row', 'selected');
								$D.addClass('exclude_by_percent_row', 'selected');
								$D.addClass('exclude_by_words_row', 'disabled');
								$D.removeClass('exclude_by_percent_row', 'disabled');
								$('p_el').value = 1;
				}
}

function updateExcludePercentage(wordCount) {
				var percent = Math.floor(wordCount / total_word_count * 100);
				$('exclude_by_percent_value').value = percent;
}

function updateExcludeWordCount(percent) {
				var wordCount = Math.floor((percent / 100) * total_word_count);
				$('exclude_by_words_value').value = wordCount;
}

function validate_excludes() {
				var is_percent = $('p_el').value;
				var set_exclude_value = is_percent == 1 ? $('exclude_by_percent_value').value : $('exclude_by_words_value').value;
				if (is_percent == 1) { if (isNaN(set_exclude_value) || set_exclude_value < 0 || set_exclude_value > 100) { alert(invalid_percent); return false; } } else { if (isNaN(set_exclude_value) || set_exclude_value < 0 || set_exclude_value > total_word_count) { alert(invalid_word_count); return false; } }
				return true;
}

function showLimitMatchSize() {
				$D.setStyle('limit_match_size_prefs', 'visibility', 'visible');
				hideSmallMatchExclusions();
}

function hideLimitMatchSize() { $D.setStyle('limit_match_size_prefs', 'visibility', 'hidden'); }

function validate_limit_excludes() {
				var set_value = $('minimum_match_word_count_value').value;
				if (isNaN(set_value) || set_value < 0 || set_value > total_word_count) { alert(invalid_word_count); return false; }
				return true;
}
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.3.1
*/
if (typeof YAHOO == "undefined") { var YAHOO = {}; } YAHOO.namespace = function() {
				var A = arguments,
								E = null,
								C, B, D;
				for (C = 0; C < A.length; C = C + 1) {
								D = A[C].split(".");
								E = YAHOO;
								for (B = (D[0] == "YAHOO") ? 1 : 0; B < D.length; B = B + 1) {
												E[D[B]] = E[D[B]] || {};
												E = E[D[B]];
								}
				}
				return E;
};
YAHOO.log = function(D, A, C) { var B = YAHOO.widget.Logger; if (B && B.log) { return B.log(D, A, C); } else { return false; } };
YAHOO.register = function(A, E, D) {
				var I = YAHOO.env.modules;
				if (!I[A]) { I[A] = { versions: [], builds: [] }; }
				var B = I[A],
								H = D.version,
								G = D.build,
								F = YAHOO.env.listeners;
				B.name = A;
				B.version = H;
				B.build = G;
				B.versions.push(H);
				B.builds.push(G);
				B.mainClass = E;
				for (var C = 0; C < F.length; C = C + 1) { F[C](B); }
				if (E) {
								E.VERSION = H;
								E.BUILD = G;
				} else { YAHOO.log("mainClass is undefined for module " + A, "warn"); }
};
YAHOO.env = YAHOO.env || { modules: [], listeners: [] };
YAHOO.env.getVersion = function(A) { return YAHOO.env.modules[A] || null; };
YAHOO.env.ua = function() {
				var C = { ie: 0, opera: 0, gecko: 0, webkit: 0 };
				var B = navigator.userAgent,
								A;
				if ((/KHTML/).test(B)) { C.webkit = 1; } A = B.match(/AppleWebKit\/([^\s]*)/);
				if (A && A[1]) { C.webkit = parseFloat(A[1]); }
				if (!C.webkit) {
								A = B.match(/Opera[\s\/]([^\s]*)/);
								if (A && A[1]) { C.opera = parseFloat(A[1]); } else {
												A = B.match(/MSIE\s([^;]*)/);
												if (A && A[1]) { C.ie = parseFloat(A[1]); } else {
																A = B.match(/Gecko\/([^\s]*)/);
																if (A) {
																				C.gecko = 1;
																				A = B.match(/rv:([^\s\)]*)/);
																				if (A && A[1]) { C.gecko = parseFloat(A[1]); }
																}
												}
								}
				}
				return C;
}();
(function() {
				YAHOO.namespace("util", "widget", "example");
				if ("undefined" !== typeof YAHOO_config) {
								var B = YAHOO_config.listener,
												A = YAHOO.env.listeners,
												D = true,
												C;
								if (B) { for (C = 0; C < A.length; C = C + 1) { if (A[C] == B) { D = false; break; } } if (D) { A.push(B); } }
				}
})();
YAHOO.lang = {
				isArray: function(B) { if (B) { var A = YAHOO.lang; return A.isNumber(B.length) && A.isFunction(B.splice) && !A.hasOwnProperty(B.length); } return false; },
				isBoolean: function(A) { return typeof A === "boolean"; },
				isFunction: function(A) { return typeof A === "function"; },
				isNull: function(A) { return A === null; },
				isNumber: function(A) { return typeof A === "number" && isFinite(A); },
				isObject: function(A) { return (A && (typeof A === "object" || YAHOO.lang.isFunction(A))) || false; },
				isString: function(A) { return typeof A === "string"; },
				isUndefined: function(A) { return typeof A === "undefined"; },
				hasOwnProperty: function(A, B) { if (Object.prototype.hasOwnProperty) { return A.hasOwnProperty(B); } return !YAHOO.lang.isUndefined(A[B]) && A.constructor.prototype[B] !== A[B]; },
				_IEEnumFix: function(C, B) {
								if (YAHOO.env.ua.ie) {
												var E = ["toString", "valueOf"],
																A;
												for (A = 0; A < E.length; A = A + 1) {
																var F = E[A],
																				D = B[F];
																if (YAHOO.lang.isFunction(D) && D != Object.prototype[F]) { C[F] = D; }
												}
								}
				},
				extend: function(D, E, C) {
								if (!E || !D) { throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included."); }
								var B = function() {};
								B.prototype = E.prototype;
								D.prototype = new B();
								D.prototype.constructor = D;
								D.superclass = E.prototype;
								if (E.prototype.constructor == Object.prototype.constructor) { E.prototype.constructor = E; }
								if (C) { for (var A in C) { D.prototype[A] = C[A]; } YAHOO.lang._IEEnumFix(D.prototype, C); }
				},
				augmentObject: function(E, D) {
								if (!D || !E) { throw new Error("Absorb failed, verify dependencies."); }
								var A = arguments,
												C, F, B = A[2];
								if (B && B !== true) { for (C = 2; C < A.length; C = C + 1) { E[A[C]] = D[A[C]]; } } else { for (F in D) { if (B || !E[F]) { E[F] = D[F]; } } YAHOO.lang._IEEnumFix(E, D); }
				},
				augmentProto: function(D, C) { if (!C || !D) { throw new Error("Augment failed, verify dependencies."); } var A = [D.prototype, C.prototype]; for (var B = 2; B < arguments.length; B = B + 1) { A.push(arguments[B]); } YAHOO.lang.augmentObject.apply(this, A); },
				dump: function(A, G) {
								var C = YAHOO.lang,
												D, F, I = [],
												J = "{...}",
												B = "f(){...}",
												H = ", ",
												E = " => ";
								if (!C.isObject(A)) { return A + ""; } else { if (A instanceof Date || ("nodeType" in A && "tagName" in A)) { return A; } else { if (C.isFunction(A)) { return B; } } } G = (C.isNumber(G)) ? G : 3;
								if (C.isArray(A)) { I.push("["); for (D = 0, F = A.length; D < F; D = D + 1) { if (C.isObject(A[D])) { I.push((G > 0) ? C.dump(A[D], G - 1) : J); } else { I.push(A[D]); } I.push(H); } if (I.length > 1) { I.pop(); } I.push("]"); } else { I.push("{"); for (D in A) { if (C.hasOwnProperty(A, D)) { I.push(D + E); if (C.isObject(A[D])) { I.push((G > 0) ? C.dump(A[D], G - 1) : J); } else { I.push(A[D]); } I.push(H); } } if (I.length > 1) { I.pop(); } I.push("}"); }
								return I.join("");
				},
				substitute: function(Q, B, J) {
								var G, F, E, M, N, P, D = YAHOO.lang,
												L = [],
												C, H = "dump",
												K = " ",
												A = "{",
												O = "}";
								for (;;) {
												G = Q.lastIndexOf(A);
												if (G < 0) { break; } F = Q.indexOf(O, G);
												if (G + 1 >= F) { break; } C = Q.substring(G + 1, F);
												M = C;
												P = null;
												E = M.indexOf(K);
												if (E > -1) {
																P = M.substring(E + 1);
																M = M.substring(0, E);
												}
												N = B[M];
												if (J) { N = J(M, N, P); }
												if (D.isObject(N)) { if (D.isArray(N)) { N = D.dump(N, parseInt(P, 10)); } else { P = P || ""; var I = P.indexOf(H); if (I > -1) { P = P.substring(4); } if (N.toString === Object.prototype.toString || I > -1) { N = D.dump(N, parseInt(P, 10)); } else { N = N.toString(); } } } else {
																if (!D.isString(N) && !D.isNumber(N)) {
																				N = "~-" + L.length + "-~";
																				L[L.length] = C;
																}
												}
												Q = Q.substring(0, G) + N + Q.substring(F + 1);
								}
								for (G = L.length - 1; G >= 0; G = G - 1) { Q = Q.replace(new RegExp("~-" + G + "-~"), "{" + L[G] + "}", "g"); }
								return Q;
				},
				trim: function(A) { try { return A.replace(/^\s+|\s+$/g, ""); } catch (B) { return A; } },
				merge: function() {
								var C = {},
												A = arguments,
												B;
								for (B = 0; B < A.length; B = B + 1) { YAHOO.lang.augmentObject(C, A[B], true); }
								return C;
				},
				isValue: function(B) { var A = YAHOO.lang; return (A.isObject(B) || A.isString(B) || A.isNumber(B) || A.isBoolean(B)); }
};
YAHOO.util.Lang = YAHOO.lang;
YAHOO.lang.augment = YAHOO.lang.augmentProto;
YAHOO.augment = YAHOO.lang.augmentProto;
YAHOO.extend = YAHOO.lang.extend;
YAHOO.register("yahoo", YAHOO, { version: "2.3.1", build: "541" });
(function() {
				var B = YAHOO.util,
								K, I, H = 0,
								J = {},
								F = {};
				var C = YAHOO.env.ua.opera,
								L = YAHOO.env.ua.webkit,
								A = YAHOO.env.ua.gecko,
								G = YAHOO.env.ua.ie;
				var E = { HYPHEN: /(-[a-z])/i, ROOT_TAG: /^body|html$/i };
				var M = function(O) { if (!E.HYPHEN.test(O)) { return O; } if (J[O]) { return J[O]; } var P = O; while (E.HYPHEN.exec(P)) { P = P.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase()); } J[O] = P; return P; };
				var N = function(P) {
								var O = F[P];
								if (!O) {
												O = new RegExp("(?:^|\\s+)" + P + "(?:\\s+|$)");
												F[P] = O;
								}
								return O;
				};
				if (document.defaultView && document.defaultView.getComputedStyle) { K = function(O, R) { var Q = null; if (R == "float") { R = "cssFloat"; } var P = document.defaultView.getComputedStyle(O, ""); if (P) { Q = P[M(R)]; } return O.style[R] || Q; }; } else {
								if (document.documentElement.currentStyle && G) {
												K = function(O, Q) {
																switch (M(Q)) {
																				case "opacity":
																								var S = 100;
																								try { S = O.filters["DXImageTransform.Microsoft.Alpha"].opacity; } catch (R) { try { S = O.filters("alpha").opacity; } catch (R) {} }
																								return S / 100;
																				case "float":
																								Q = "styleFloat";
																				default:
																								var P = O.currentStyle ? O.currentStyle[Q] : null;
																								return (O.style[Q] || P);
																}
												};
								} else { K = function(O, P) { return O.style[P]; }; }
				}
				if (G) {
								I = function(O, P, Q) {
												switch (P) {
																case "opacity":
																				if (YAHOO.lang.isString(O.style.filter)) { O.style.filter = "alpha(opacity=" + Q * 100 + ")"; if (!O.currentStyle || !O.currentStyle.hasLayout) { O.style.zoom = 1; } }
																				break;
																case "float":
																				P = "styleFloat";
																default:
																				O.style[P] = Q;
												}
								};
				} else { I = function(O, P, Q) { if (P == "float") { P = "cssFloat"; } O.style[P] = Q; }; }
				var D = function(O, P) { return O && O.nodeType == 1 && (!P || P(O)); };
				YAHOO.util.Dom = {
								get: function(Q) { if (Q && (Q.tagName || Q.item)) { return Q; } if (YAHOO.lang.isString(Q) || !Q) { return document.getElementById(Q); } if (Q.length !== undefined) { var R = []; for (var P = 0, O = Q.length; P < O; ++P) { R[R.length] = B.Dom.get(Q[P]); } return R; } return Q; },
								getStyle: function(O, Q) { Q = M(Q); var P = function(R) { return K(R, Q); }; return B.Dom.batch(O, P, B.Dom, true); },
								setStyle: function(O, Q, R) {
												Q = M(Q);
												var P = function(S) { I(S, Q, R); };
												B.Dom.batch(O, P, B.Dom, true);
								},
								getXY: function(O) {
												var P = function(R) {
																if ((R.parentNode === null || R.offsetParent === null || this.getStyle(R, "display") == "none") && R != document.body) { return false; }
																var Q = null;
																var V = [];
																var S;
																var T = R.ownerDocument;
																if (R.getBoundingClientRect) { S = R.getBoundingClientRect(); return [S.left + B.Dom.getDocumentScrollLeft(R.ownerDocument), S.top + B.Dom.getDocumentScrollTop(R.ownerDocument)]; } else {
																				V = [R.offsetLeft, R.offsetTop];
																				Q = R.offsetParent;
																				var U = this.getStyle(R, "position") == "absolute";
																				if (Q != R) {
																								while (Q) {
																												V[0] += Q.offsetLeft;
																												V[1] += Q.offsetTop;
																												if (L && !U && this.getStyle(Q, "position") == "absolute") { U = true; } Q = Q.offsetParent;
																								}
																				}
																				if (L && U) {
																								V[0] -= R.ownerDocument.body.offsetLeft;
																								V[1] -= R.ownerDocument.body.offsetTop;
																				}
																}
																Q = R.parentNode;
																while (Q.tagName && !E.ROOT_TAG.test(Q.tagName)) {
																				if (B.Dom.getStyle(Q, "display").search(/^inline|table-row.*$/i)) {
																								V[0] -= Q.scrollLeft;
																								V[1] -= Q.scrollTop;
																				}
																				Q = Q.parentNode;
																}
																return V;
												};
												return B.Dom.batch(O, P, B.Dom, true);
								},
								getX: function(O) { var P = function(Q) { return B.Dom.getXY(Q)[0]; }; return B.Dom.batch(O, P, B.Dom, true); },
								getY: function(O) { var P = function(Q) { return B.Dom.getXY(Q)[1]; }; return B.Dom.batch(O, P, B.Dom, true); },
								setXY: function(O, R, Q) {
												var P = function(U) {
																var T = this.getStyle(U, "position");
																if (T == "static") {
																				this.setStyle(U, "position", "relative");
																				T = "relative";
																}
																var W = this.getXY(U);
																if (W === false) { return false; }
																var V = [parseInt(this.getStyle(U, "left"), 10), parseInt(this.getStyle(U, "top"), 10)];
																if (isNaN(V[0])) { V[0] = (T == "relative") ? 0 : U.offsetLeft; }
																if (isNaN(V[1])) { V[1] = (T == "relative") ? 0 : U.offsetTop; }
																if (R[0] !== null) { U.style.left = R[0] - W[0] + V[0] + "px"; }
																if (R[1] !== null) { U.style.top = R[1] - W[1] + V[1] + "px"; }
																if (!Q) { var S = this.getXY(U); if ((R[0] !== null && S[0] != R[0]) || (R[1] !== null && S[1] != R[1])) { this.setXY(U, R, true); } }
												};
												B.Dom.batch(O, P, B.Dom, true);
								},
								setX: function(P, O) { B.Dom.setXY(P, [O, null]); },
								setY: function(O, P) { B.Dom.setXY(O, [null, P]); },
								getRegion: function(O) { var P = function(Q) { if ((Q.parentNode === null || Q.offsetParent === null || this.getStyle(Q, "display") == "none") && Q != document.body) { return false; } var R = B.Region.getRegion(Q); return R; }; return B.Dom.batch(O, P, B.Dom, true); },
								getClientWidth: function() { return B.Dom.getViewportWidth(); },
								getClientHeight: function() { return B.Dom.getViewportHeight(); },
								getElementsByClassName: function(S, W, T, U) {
												W = W || "*";
												T = (T) ? B.Dom.get(T) : null || document;
												if (!T) { return []; }
												var P = [],
																O = T.getElementsByTagName(W),
																V = N(S);
												for (var Q = 0, R = O.length; Q < R; ++Q) { if (V.test(O[Q].className)) { P[P.length] = O[Q]; if (U) { U.call(O[Q], O[Q]); } } }
												return P;
								},
								hasClass: function(Q, P) { var O = N(P); var R = function(S) { return O.test(S.className); }; return B.Dom.batch(Q, R, B.Dom, true); },
								addClass: function(P, O) { var Q = function(R) { if (this.hasClass(R, O)) { return false; } R.className = YAHOO.lang.trim([R.className, O].join(" ")); return true; }; return B.Dom.batch(P, Q, B.Dom, true); },
								removeClass: function(Q, P) {
												var O = N(P);
												var R = function(S) {
																if (!this.hasClass(S, P)) { return false; }
																var T = S.className;
																S.className = T.replace(O, " ");
																if (this.hasClass(S, P)) { this.removeClass(S, P); } S.className = YAHOO.lang.trim(S.className);
																return true;
												};
												return B.Dom.batch(Q, R, B.Dom, true);
								},
								replaceClass: function(R, P, O) { if (!O || P === O) { return false; } var Q = N(P); var S = function(T) { if (!this.hasClass(T, P)) { this.addClass(T, O); return true; } T.className = T.className.replace(Q, " " + O + " "); if (this.hasClass(T, P)) { this.replaceClass(T, P, O); } T.className = YAHOO.lang.trim(T.className); return true; }; return B.Dom.batch(R, S, B.Dom, true); },
								generateId: function(O, Q) { Q = Q || "yui-gen"; var P = function(R) { if (R && R.id) { return R.id; } var S = Q + H++; if (R) { R.id = S; } return S; }; return B.Dom.batch(O, P, B.Dom, true) || P.apply(B.Dom, arguments); },
								isAncestor: function(P, Q) { P = B.Dom.get(P); if (!P || !Q) { return false; } var O = function(R) { if (P.contains && R.nodeType && !L) { return P.contains(R); } else { if (P.compareDocumentPosition && R.nodeType) { return !!(P.compareDocumentPosition(R) & 16); } else { if (R.nodeType) { return !!this.getAncestorBy(R, function(S) { return S == P; }); } } } return false; }; return B.Dom.batch(Q, O, B.Dom, true); },
								inDocument: function(O) { var P = function(Q) { if (L) { while (Q = Q.parentNode) { if (Q == document.documentElement) { return true; } } return false; } return this.isAncestor(document.documentElement, Q); }; return B.Dom.batch(O, P, B.Dom, true); },
								getElementsBy: function(V, P, Q, S) {
												P = P || "*";
												Q = (Q) ? B.Dom.get(Q) : null || document;
												if (!Q) { return []; }
												var R = [],
																U = Q.getElementsByTagName(P);
												for (var T = 0, O = U.length; T < O; ++T) { if (V(U[T])) { R[R.length] = U[T]; if (S) { S(U[T]); } } }
												return R;
								},
								batch: function(S, V, U, Q) { S = (S && (S.tagName || S.item)) ? S : B.Dom.get(S); if (!S || !V) { return false; } var R = (Q) ? U : window; if (S.tagName || S.length === undefined) { return V.call(R, S, U); } var T = []; for (var P = 0, O = S.length; P < O; ++P) { T[T.length] = V.call(R, S[P], U); } return T; },
								getDocumentHeight: function() { var P = (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight; var O = Math.max(P, B.Dom.getViewportHeight()); return O; },
								getDocumentWidth: function() { var P = (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth; var O = Math.max(P, B.Dom.getViewportWidth()); return O; },
								getViewportHeight: function() { var O = self.innerHeight; var P = document.compatMode; if ((P || G) && !C) { O = (P == "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight; } return O; },
								getViewportWidth: function() { var O = self.innerWidth; var P = document.compatMode; if (P || G) { O = (P == "CSS1Compat") ? document.documentElement.clientWidth : document.body.clientWidth; } return O; },
								getAncestorBy: function(O, P) { while (O = O.parentNode) { if (D(O, P)) { return O; } } return null; },
								getAncestorByClassName: function(P, O) { P = B.Dom.get(P); if (!P) { return null; } var Q = function(R) { return B.Dom.hasClass(R, O); }; return B.Dom.getAncestorBy(P, Q); },
								getAncestorByTagName: function(P, O) { P = B.Dom.get(P); if (!P) { return null; } var Q = function(R) { return R.tagName && R.tagName.toUpperCase() == O.toUpperCase(); }; return B.Dom.getAncestorBy(P, Q); },
								getPreviousSiblingBy: function(O, P) { while (O) { O = O.previousSibling; if (D(O, P)) { return O; } } return null; },
								getPreviousSibling: function(O) { O = B.Dom.get(O); if (!O) { return null; } return B.Dom.getPreviousSiblingBy(O); },
								getNextSiblingBy: function(O, P) { while (O) { O = O.nextSibling; if (D(O, P)) { return O; } } return null; },
								getNextSibling: function(O) { O = B.Dom.get(O); if (!O) { return null; } return B.Dom.getNextSiblingBy(O); },
								getFirstChildBy: function(O, Q) { var P = (D(O.firstChild, Q)) ? O.firstChild : null; return P || B.Dom.getNextSiblingBy(O.firstChild, Q); },
								getFirstChild: function(O, P) { O = B.Dom.get(O); if (!O) { return null; } return B.Dom.getFirstChildBy(O); },
								getLastChildBy: function(O, Q) { if (!O) { return null; } var P = (D(O.lastChild, Q)) ? O.lastChild : null; return P || B.Dom.getPreviousSiblingBy(O.lastChild, Q); },
								getLastChild: function(O) { O = B.Dom.get(O); return B.Dom.getLastChildBy(O); },
								getChildrenBy: function(P, R) {
												var Q = B.Dom.getFirstChildBy(P, R);
												var O = Q ? [Q] : [];
												B.Dom.getNextSiblingBy(Q, function(S) { if (!R || R(S)) { O[O.length] = S; } return false; });
												return O;
								},
								getChildren: function(O) { O = B.Dom.get(O); if (!O) {} return B.Dom.getChildrenBy(O); },
								getDocumentScrollLeft: function(O) { O = O || document; return Math.max(O.documentElement.scrollLeft, O.body.scrollLeft); },
								getDocumentScrollTop: function(O) { O = O || document; return Math.max(O.documentElement.scrollTop, O.body.scrollTop); },
								insertBefore: function(P, O) {
												P = B.Dom.get(P);
												O = B.Dom.get(O);
												if (!P || !O || !O.parentNode) { return null; }
												return O.parentNode.insertBefore(P, O);
								},
								insertAfter: function(P, O) {
												P = B.Dom.get(P);
												O = B.Dom.get(O);
												if (!P || !O || !O.parentNode) { return null; }
												if (O.nextSibling) { return O.parentNode.insertBefore(P, O.nextSibling); } else { return O.parentNode.appendChild(P); }
								}
				};
})();
YAHOO.util.Region = function(C, D, A, B) {
				this.top = C;
				this[1] = C;
				this.right = D;
				this.bottom = A;
				this.left = B;
				this[0] = B;
};
YAHOO.util.Region.prototype.contains = function(A) { return (A.left >= this.left && A.right <= this.right && A.top >= this.top && A.bottom <= this.bottom); };
YAHOO.util.Region.prototype.getArea = function() { return ((this.bottom - this.top) * (this.right - this.left)); };
YAHOO.util.Region.prototype.intersect = function(E) { var C = Math.max(this.top, E.top); var D = Math.min(this.right, E.right); var A = Math.min(this.bottom, E.bottom); var B = Math.max(this.left, E.left); if (A >= C && D >= B) { return new YAHOO.util.Region(C, D, A, B); } else { return null; } };
YAHOO.util.Region.prototype.union = function(E) { var C = Math.min(this.top, E.top); var D = Math.max(this.right, E.right); var A = Math.max(this.bottom, E.bottom); var B = Math.min(this.left, E.left); return new YAHOO.util.Region(C, D, A, B); };
YAHOO.util.Region.prototype.toString = function() { return ("Region {top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + ", left: " + this.left + "}"); };
YAHOO.util.Region.getRegion = function(D) { var F = YAHOO.util.Dom.getXY(D); var C = F[1]; var E = F[0] + D.offsetWidth; var A = F[1] + D.offsetHeight; var B = F[0]; return new YAHOO.util.Region(C, E, A, B); };
YAHOO.util.Point = function(A, B) {
				if (YAHOO.lang.isArray(A)) {
								B = A[1];
								A = A[0];
				}
				this.x = this.right = this.left = this[0] = A;
				this.y = this.top = this.bottom = this[1] = B;
};
YAHOO.util.Point.prototype = new YAHOO.util.Region();
YAHOO.register("dom", YAHOO.util.Dom, { version: "2.3.1", build: "541" });
YAHOO.util.CustomEvent = function(D, B, C, A) {
				this.type = D;
				this.scope = B || window;
				this.silent = C;
				this.signature = A || YAHOO.util.CustomEvent.LIST;
				this.subscribers = [];
				if (!this.silent) {}
				var E = "_YUICEOnSubscribe";
				if (D !== E) { this.subscribeEvent = new YAHOO.util.CustomEvent(E, this, true); } this.lastError = null;
};
YAHOO.util.CustomEvent.LIST = 0;
YAHOO.util.CustomEvent.FLAT = 1;
YAHOO.util.CustomEvent.prototype = {
				subscribe: function(B, C, A) { if (!B) { throw new Error("Invalid callback for subscriber to '" + this.type + "'"); } if (this.subscribeEvent) { this.subscribeEvent.fire(B, C, A); } this.subscribers.push(new YAHOO.util.Subscriber(B, C, A)); },
				unsubscribe: function(D, F) {
								if (!D) { return this.unsubscribeAll(); }
								var E = false;
								for (var B = 0, A = this.subscribers.length; B < A; ++B) {
												var C = this.subscribers[B];
												if (C && C.contains(D, F)) {
																this._delete(B);
																E = true;
												}
								}
								return E;
				},
				fire: function() {
								var E = this.subscribers.length;
								if (!E && this.silent) { return true; }
								var H = [],
												G = true,
												D, I = false;
								for (D = 0; D < arguments.length; ++D) { H.push(arguments[D]); }
								var A = H.length;
								if (!this.silent) {}
								for (D = 0; D < E; ++D) { var L = this.subscribers[D]; if (!L) { I = true; } else { if (!this.silent) {} var K = L.getScope(this.scope); if (this.signature == YAHOO.util.CustomEvent.FLAT) { var B = null; if (H.length > 0) { B = H[0]; } try { G = L.fn.call(K, B, L.obj); } catch (F) { this.lastError = F; } } else { try { G = L.fn.call(K, this.type, H, L.obj); } catch (F) { this.lastError = F; } } if (false === G) { if (!this.silent) {} return false; } } }
								if (I) {
												var J = [],
																C = this.subscribers;
												for (D = 0, E = C.length; D < E; D = D + 1) { J.push(C[D]); } this.subscribers = J;
								}
								return true;
				},
				unsubscribeAll: function() { for (var B = 0, A = this.subscribers.length; B < A; ++B) { this._delete(A - 1 - B); } this.subscribers = []; return B; },
				_delete: function(A) {
								var B = this.subscribers[A];
								if (B) {
												delete B.fn;
												delete B.obj;
								}
								this.subscribers[A] = null;
				},
				toString: function() { return "CustomEvent: '" + this.type + "', scope: " + this.scope; }
};
YAHOO.util.Subscriber = function(B, C, A) {
				this.fn = B;
				this.obj = YAHOO.lang.isUndefined(C) ? null : C;
				this.override = A;
};
YAHOO.util.Subscriber.prototype.getScope = function(A) { if (this.override) { if (this.override === true) { return this.obj; } else { return this.override; } } return A; };
YAHOO.util.Subscriber.prototype.contains = function(A, B) { if (B) { return (this.fn == A && this.obj == B); } else { return (this.fn == A); } };
YAHOO.util.Subscriber.prototype.toString = function() { return "Subscriber { obj: " + this.obj + ", override: " + (this.override || "no") + " }"; };
if (!YAHOO.util.Event) {
				YAHOO.util.Event = function() {
								var H = false;
								var J = false;
								var I = [];
								var K = [];
								var G = [];
								var E = [];
								var C = 0;
								var F = [];
								var B = [];
								var A = 0;
								var D = { 63232: 38, 63233: 40, 63234: 37, 63235: 39 };
								return {
												POLL_RETRYS: 4000,
												POLL_INTERVAL: 10,
												EL: 0,
												TYPE: 1,
												FN: 2,
												WFN: 3,
												UNLOAD_OBJ: 3,
												ADJ_SCOPE: 4,
												OBJ: 5,
												OVERRIDE: 6,
												lastError: null,
												isSafari: YAHOO.env.ua.webkit,
												webkit: YAHOO.env.ua.webkit,
												isIE: YAHOO.env.ua.ie,
												_interval: null,
												startInterval: function() {
																if (!this._interval) {
																				var L = this;
																				var M = function() { L._tryPreloadAttach(); };
																				this._interval = setInterval(M, this.POLL_INTERVAL);
																}
												},
												onAvailable: function(N, L, O, M) {
																F.push({ id: N, fn: L, obj: O, override: M, checkReady: false });
																C = this.POLL_RETRYS;
																this.startInterval();
												},
												onDOMReady: function(L, N, M) { if (J) { setTimeout(function() { var O = window; if (M) { if (M === true) { O = N; } else { O = M; } } L.call(O, "DOMReady", [], N); }, 0); } else { this.DOMReadyEvent.subscribe(L, N, M); } },
												onContentReady: function(N, L, O, M) {
																F.push({ id: N, fn: L, obj: O, override: M, checkReady: true });
																C = this.POLL_RETRYS;
																this.startInterval();
												},
												addListener: function(N, L, W, R, M) {
																if (!W || !W.call) { return false; }
																if (this._isValidCollection(N)) { var X = true; for (var S = 0, U = N.length; S < U; ++S) { X = this.on(N[S], L, W, R, M) && X; } return X; } else { if (YAHOO.lang.isString(N)) { var Q = this.getEl(N); if (Q) { N = Q; } else { this.onAvailable(N, function() { YAHOO.util.Event.on(N, L, W, R, M); }); return true; } } }
																if (!N) { return false; }
																if ("unload" == L && R !== this) { K[K.length] = [N, L, W, R, M]; return true; }
																var Z = N;
																if (M) { if (M === true) { Z = R; } else { Z = M; } }
																var O = function(a) { return W.call(Z, YAHOO.util.Event.getEvent(a, N), R); };
																var Y = [N, L, W, O, Z, R, M];
																var T = I.length;
																I[T] = Y;
																if (this.useLegacyEvent(N, L)) {
																				var P = this.getLegacyIndex(N, L);
																				if (P == -1 || N != G[P][0]) {
																								P = G.length;
																								B[N.id + L] = P;
																								G[P] = [N, L, N["on" + L]];
																								E[P] = [];
																								N["on" + L] = function(a) { YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(a), P); };
																				}
																				E[P].push(Y);
																} else {
																				try { this._simpleAdd(N, L, O, false); } catch (V) {
																								this.lastError = V;
																								this.removeListener(N, L, W);
																								return false;
																				}
																}
																return true;
												},
												fireLegacyEvent: function(P, N) {
																var R = true,
																				L, T, S, U, Q;
																T = E[N];
																for (var M = 0, O = T.length; M < O; ++M) {
																				S = T[M];
																				if (S && S[this.WFN]) {
																								U = S[this.ADJ_SCOPE];
																								Q = S[this.WFN].call(U, P);
																								R = (R && Q);
																				}
																}
																L = G[N];
																if (L && L[2]) { L[2](P); }
																return R;
												},
												getLegacyIndex: function(M, N) { var L = this.generateId(M) + N; if (typeof B[L] == "undefined") { return -1; } else { return B[L]; } },
												useLegacyEvent: function(M, N) { if (this.webkit && ("click" == N || "dblclick" == N)) { var L = parseInt(this.webkit, 10); if (!isNaN(L) && L < 418) { return true; } } return false; },
												removeListener: function(M, L, U) {
																var P, S, W;
																if (typeof M == "string") { M = this.getEl(M); } else { if (this._isValidCollection(M)) { var V = true; for (P = 0, S = M.length; P < S; ++P) { V = (this.removeListener(M[P], L, U) && V); } return V; } }
																if (!U || !U.call) { return this.purgeElement(M, false, L); }
																if ("unload" == L) { for (P = 0, S = K.length; P < S; P++) { W = K[P]; if (W && W[0] == M && W[1] == L && W[2] == U) { K[P] = null; return true; } } return false; }
																var Q = null;
																var R = arguments[3];
																if ("undefined" === typeof R) { R = this._getCacheIndex(M, L, U); }
																if (R >= 0) { Q = I[R]; }
																if (!M || !Q) { return false; }
																if (this.useLegacyEvent(M, L)) { var O = this.getLegacyIndex(M, L); var N = E[O]; if (N) { for (P = 0, S = N.length; P < S; ++P) { W = N[P]; if (W && W[this.EL] == M && W[this.TYPE] == L && W[this.FN] == U) { N[P] = null; break; } } } } else { try { this._simpleRemove(M, L, Q[this.WFN], false); } catch (T) { this.lastError = T; return false; } } delete I[R][this.WFN];
																delete I[R][this.FN];
																I[R] = null;
																return true;
												},
												getTarget: function(N, M) { var L = N.target || N.srcElement; return this.resolveTextNode(L); },
												resolveTextNode: function(L) { if (L && 3 == L.nodeType) { return L.parentNode; } else { return L; } },
												getPageX: function(M) { var L = M.pageX; if (!L && 0 !== L) { L = M.clientX || 0; if (this.isIE) { L += this._getScrollLeft(); } } return L; },
												getPageY: function(L) { var M = L.pageY; if (!M && 0 !== M) { M = L.clientY || 0; if (this.isIE) { M += this._getScrollTop(); } } return M; },
												getXY: function(L) { return [this.getPageX(L), this.getPageY(L)]; },
												getRelatedTarget: function(M) { var L = M.relatedTarget; if (!L) { if (M.type == "mouseout") { L = M.toElement; } else { if (M.type == "mouseover") { L = M.fromElement; } } } return this.resolveTextNode(L); },
												getTime: function(N) { if (!N.time) { var M = new Date().getTime(); try { N.time = M; } catch (L) { this.lastError = L; return M; } } return N.time; },
												stopEvent: function(L) {
																this.stopPropagation(L);
																this.preventDefault(L);
												},
												stopPropagation: function(L) { if (L.stopPropagation) { L.stopPropagation(); } else { L.cancelBubble = true; } },
												preventDefault: function(L) { if (L.preventDefault) { L.preventDefault(); } else { L.returnValue = false; } },
												getEvent: function(Q, O) { var P = Q || window.event; if (!P) { var R = this.getEvent.caller; while (R) { P = R.arguments[0]; if (P && Event == P.constructor) { break; } R = R.caller; } } if (P && this.isIE) { try { var N = P.srcElement; if (N) { var M = N.type; } } catch (L) { P.target = O; } } return P; },
												getCharCode: function(M) { var L = M.keyCode || M.charCode || 0; if (YAHOO.env.ua.webkit && (L in D)) { L = D[L]; } return L; },
												_getCacheIndex: function(P, Q, O) { for (var N = 0, M = I.length; N < M; ++N) { var L = I[N]; if (L && L[this.FN] == O && L[this.EL] == P && L[this.TYPE] == Q) { return N; } } return -1; },
												generateId: function(L) {
																var M = L.id;
																if (!M) {
																				M = "yuievtautoid-" + A;
																				++A;
																				L.id = M;
																}
																return M;
												},
												_isValidCollection: function(M) { try { return (typeof M !== "string" && M.length && !M.tagName && !M.alert && typeof M[0] !== "undefined"); } catch (L) { return false; } },
												elCache: {},
												getEl: function(L) { return (typeof L === "string") ? document.getElementById(L) : L; },
												clearCache: function() {},
												DOMReadyEvent: new YAHOO.util.CustomEvent("DOMReady", this),
												_load: function(M) {
																if (!H) {
																				H = true;
																				var L = YAHOO.util.Event;
																				L._ready();
																				L._tryPreloadAttach();
																}
												},
												_ready: function(M) {
																if (!J) {
																				J = true;
																				var L = YAHOO.util.Event;
																				L.DOMReadyEvent.fire();
																				L._simpleRemove(document, "DOMContentLoaded", L._ready);
																}
												},
												_tryPreloadAttach: function() {
																if (this.locked) { return false; }
																if (this.isIE) { if (!J) { this.startInterval(); return false; } } this.locked = true;
																var Q = !H;
																if (!Q) { Q = (C > 0); }
																var P = [];
																var R = function(T, U) { var S = T; if (U.override) { if (U.override === true) { S = U.obj; } else { S = U.override; } } U.fn.call(S, U.obj); };
																var M, L, O, N;
																for (M = 0, L = F.length; M < L; ++M) {
																				O = F[M];
																				if (O && !O.checkReady) {
																								N = this.getEl(O.id);
																								if (N) {
																												R(N, O);
																												F[M] = null;
																								} else { P.push(O); }
																				}
																}
																for (M = 0, L = F.length; M < L; ++M) {
																				O = F[M];
																				if (O && O.checkReady) {
																								N = this.getEl(O.id);
																								if (N) {
																												if (H || N.nextSibling) {
																																R(N, O);
																																F[M] = null;
																												}
																								} else { P.push(O); }
																				}
																}
																C = (P.length === 0) ? 0 : C - 1;
																if (Q) { this.startInterval(); } else {
																				clearInterval(this._interval);
																				this._interval = null;
																}
																this.locked = false;
																return true;
												},
												purgeElement: function(O, P, R) {
																var Q = this.getListeners(O, R),
																				N, L;
																if (Q) {
																				for (N = 0, L = Q.length; N < L; ++N) {
																								var M = Q[N];
																								this.removeListener(O, M.type, M.fn, M.index);
																				}
																}
																if (P && O && O.childNodes) { for (N = 0, L = O.childNodes.length; N < L; ++N) { this.purgeElement(O.childNodes[N], P, R); } }
												},
												getListeners: function(N, L) {
																var Q = [],
																				M;
																if (!L) { M = [I, K]; } else { if (L == "unload") { M = [K]; } else { M = [I]; } }
																for (var P = 0; P < M.length; P = P + 1) { var T = M[P]; if (T && T.length > 0) { for (var R = 0, S = T.length; R < S; ++R) { var O = T[R]; if (O && O[this.EL] === N && (!L || L === O[this.TYPE])) { Q.push({ type: O[this.TYPE], fn: O[this.FN], obj: O[this.OBJ], adjust: O[this.OVERRIDE], scope: O[this.ADJ_SCOPE], index: R }); } } } }
																return (Q.length) ? Q : null;
												},
												_unload: function(S) {
																var R = YAHOO.util.Event,
																				P, O, M, L, N;
																for (P = 0, L = K.length; P < L; ++P) {
																				M = K[P];
																				if (M) {
																								var Q = window;
																								if (M[R.ADJ_SCOPE]) { if (M[R.ADJ_SCOPE] === true) { Q = M[R.UNLOAD_OBJ]; } else { Q = M[R.ADJ_SCOPE]; } } M[R.FN].call(Q, R.getEvent(S, M[R.EL]), M[R.UNLOAD_OBJ]);
																								K[P] = null;
																								M = null;
																								Q = null;
																				}
																}
																K = null;
																if (I && I.length > 0) {
																				O = I.length;
																				while (O) {
																								N = O - 1;
																								M = I[N];
																								if (M) { R.removeListener(M[R.EL], M[R.TYPE], M[R.FN], N); } O = O - 1;
																				}
																				M = null;
																				R.clearCache();
																}
																for (P = 0, L = G.length; P < L; ++P) {
																				G[P][0] = null;
																				G[P] = null;
																}
																G = null;
																R._simpleRemove(window, "unload", R._unload);
												},
												_getScrollLeft: function() { return this._getScroll()[1]; },
												_getScrollTop: function() { return this._getScroll()[0]; },
												_getScroll: function() {
																var L = document.documentElement,
																				M = document.body;
																if (L && (L.scrollTop || L.scrollLeft)) { return [L.scrollTop, L.scrollLeft]; } else { if (M) { return [M.scrollTop, M.scrollLeft]; } else { return [0, 0]; } }
												},
												regCE: function() {},
												_simpleAdd: function() { if (window.addEventListener) { return function(N, O, M, L) { N.addEventListener(O, M, (L)); }; } else { if (window.attachEvent) { return function(N, O, M, L) { N.attachEvent("on" + O, M); }; } else { return function() {}; } } }(),
												_simpleRemove: function() { if (window.removeEventListener) { return function(N, O, M, L) { N.removeEventListener(O, M, (L)); }; } else { if (window.detachEvent) { return function(M, N, L) { M.detachEvent("on" + N, L); }; } else { return function() {}; } } }()
								};
				}();
				(function() {
								var D = YAHOO.util.Event;
								D.on = D.addListener;
								if (D.isIE) {
												YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach, YAHOO.util.Event, true);
												var B, E = document,
																A = E.body;
												if (("undefined" !== typeof YAHOO_config) && YAHOO_config.injecting) {
																B = document.createElement("script");
																var C = E.getElementsByTagName("head")[0] || A;
																C.insertBefore(B, C.firstChild);
												} else {
																E.write("<script id=\"_yui_eu_dr\" defer=\"true\" src=\"//:\"></script>");
																B = document.getElementById("_yui_eu_dr");
												}
												if (B) {
																B.onreadystatechange = function() {
																				if ("complete" === this.readyState) {
																								this.parentNode.removeChild(this);
																								YAHOO.util.Event._ready();
																				}
																};
												} else {} B = null;
								} else {
												if (D.webkit) {
																D._drwatch = setInterval(function() {
																				var F = document.readyState;
																				if ("loaded" == F || "complete" == F) {
																								clearInterval(D._drwatch);
																								D._drwatch = null;
																								D._ready();
																				}
																}, D.POLL_INTERVAL);
												} else { D._simpleAdd(document, "DOMContentLoaded", D._ready); }
								}
								D._simpleAdd(window, "load", D._load);
								D._simpleAdd(window, "unload", D._unload);
								D._tryPreloadAttach();
				})();
}
YAHOO.util.EventProvider = function() {};
YAHOO.util.EventProvider.prototype = {
				__yui_events: null,
				__yui_subscribers: null,
				subscribe: function(A, C, F, E) { this.__yui_events = this.__yui_events || {}; var D = this.__yui_events[A]; if (D) { D.subscribe(C, F, E); } else { this.__yui_subscribers = this.__yui_subscribers || {}; var B = this.__yui_subscribers; if (!B[A]) { B[A] = []; } B[A].push({ fn: C, obj: F, override: E }); } },
				unsubscribe: function(C, E, G) { this.__yui_events = this.__yui_events || {}; var A = this.__yui_events; if (C) { var F = A[C]; if (F) { return F.unsubscribe(E, G); } } else { var B = true; for (var D in A) { if (YAHOO.lang.hasOwnProperty(A, D)) { B = B && A[D].unsubscribe(E, G); } } return B; } return false; },
				unsubscribeAll: function(A) { return this.unsubscribe(A); },
				createEvent: function(G, D) {
								this.__yui_events = this.__yui_events || {};
								var A = D || {};
								var I = this.__yui_events;
								if (I[G]) {} else {
												var H = A.scope || this;
												var E = (A.silent);
												var B = new YAHOO.util.CustomEvent(G, H, E, YAHOO.util.CustomEvent.FLAT);
												I[G] = B;
												if (A.onSubscribeCallback) { B.subscribeEvent.subscribe(A.onSubscribeCallback); } this.__yui_subscribers = this.__yui_subscribers || {};
												var F = this.__yui_subscribers[G];
												if (F) { for (var C = 0; C < F.length; ++C) { B.subscribe(F[C].fn, F[C].obj, F[C].override); } }
								}
								return I[G];
				},
				fireEvent: function(E, D, A, C) { this.__yui_events = this.__yui_events || {}; var G = this.__yui_events[E]; if (!G) { return null; } var B = []; for (var F = 1; F < arguments.length; ++F) { B.push(arguments[F]); } return G.fire.apply(G, B); },
				hasEvent: function(A) { if (this.__yui_events) { if (this.__yui_events[A]) { return true; } } return false; }
};
YAHOO.util.KeyListener = function(A, F, B, C) {
				if (!A) {} else { if (!F) {} else { if (!B) {} } }
				if (!C) { C = YAHOO.util.KeyListener.KEYDOWN; }
				var D = new YAHOO.util.CustomEvent("keyPressed");
				this.enabledEvent = new YAHOO.util.CustomEvent("enabled");
				this.disabledEvent = new YAHOO.util.CustomEvent("disabled");
				if (typeof A == "string") { A = document.getElementById(A); }
				if (typeof B == "function") { D.subscribe(B); } else { D.subscribe(B.fn, B.scope, B.correctScope); }

				function E(K, J) { if (!F.shift) { F.shift = false; } if (!F.alt) { F.alt = false; } if (!F.ctrl) { F.ctrl = false; } if (K.shiftKey == F.shift && K.altKey == F.alt && K.ctrlKey == F.ctrl) { var H; var G; if (F.keys instanceof Array) { for (var I = 0; I < F.keys.length; I++) { H = F.keys[I]; if (H == K.charCode) { D.fire(K.charCode, K); break; } else { if (H == K.keyCode) { D.fire(K.keyCode, K); break; } } } } else { H = F.keys; if (H == K.charCode) { D.fire(K.charCode, K); } else { if (H == K.keyCode) { D.fire(K.keyCode, K); } } } } } this.enable = function() {
								if (!this.enabled) {
												YAHOO.util.Event.addListener(A, C, E);
												this.enabledEvent.fire(F);
								}
								this.enabled = true;
				};
				this.disable = function() {
								if (this.enabled) {
												YAHOO.util.Event.removeListener(A, C, E);
												this.disabledEvent.fire(F);
								}
								this.enabled = false;
				};
				this.toString = function() { return "KeyListener [" + F.keys + "] " + A.tagName + (A.id ? "[" + A.id + "]" : ""); };
};
YAHOO.util.KeyListener.KEYDOWN = "keydown";
YAHOO.util.KeyListener.KEYUP = "keyup";
YAHOO.register("event", YAHOO.util.Event, { version: "2.3.1", build: "541" });
YAHOO.util.Connect = {
				_msxml_progid: ["Microsoft.XMLHTTP", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP"],
				_http_headers: {},
				_has_http_headers: false,
				_use_default_post_header: true,
				_default_post_header: "application/x-www-form-urlencoded; charset=UTF-8",
				_default_form_header: "application/x-www-form-urlencoded",
				_use_default_xhr_header: true,
				_default_xhr_header: "XMLHttpRequest",
				_has_default_headers: true,
				_default_headers: {},
				_isFormSubmit: false,
				_isFileUpload: false,
				_formNode: null,
				_sFormData: null,
				_poll: {},
				_timeOut: {},
				_polling_interval: 50,
				_transaction_id: 0,
				_submitElementValue: null,
				_hasSubmitListener: (function() { if (YAHOO.util.Event) { YAHOO.util.Event.addListener(document, "click", function(q) { try { var S = YAHOO.util.Event.getTarget(q); if (S.type.toLowerCase() == "submit") { YAHOO.util.Connect._submitElementValue = encodeURIComponent(S.name) + "=" + encodeURIComponent(S.value); } } catch (q) {} }); return true; } return false; })(),
				startEvent: new YAHOO.util.CustomEvent("start"),
				completeEvent: new YAHOO.util.CustomEvent("complete"),
				successEvent: new YAHOO.util.CustomEvent("success"),
				failureEvent: new YAHOO.util.CustomEvent("failure"),
				uploadEvent: new YAHOO.util.CustomEvent("upload"),
				abortEvent: new YAHOO.util.CustomEvent("abort"),
				_customEvents: { onStart: ["startEvent", "start"], onComplete: ["completeEvent", "complete"], onSuccess: ["successEvent", "success"], onFailure: ["failureEvent", "failure"], onUpload: ["uploadEvent", "upload"], onAbort: ["abortEvent", "abort"] },
				setProgId: function(S) { this._msxml_progid.unshift(S); },
				setDefaultPostHeader: function(S) { if (typeof S == "string") { this._default_post_header = S; } else { if (typeof S == "boolean") { this._use_default_post_header = S; } } },
				setDefaultXhrHeader: function(S) { if (typeof S == "string") { this._default_xhr_header = S; } else { this._use_default_xhr_header = S; } },
				setPollingInterval: function(S) { if (typeof S == "number" && isFinite(S)) { this._polling_interval = S; } },
				createXhrObject: function(w) {
								var m, S;
								try {
												S = new XMLHttpRequest();
												m = { conn: S, tId: w };
								} catch (R) {
												for (var q = 0; q < this._msxml_progid.length; ++q) {
																try {
																				S = new ActiveXObject(this._msxml_progid[q]);
																				m = { conn: S, tId: w };
																				break;
																} catch (R) {}
												}
								} finally { return m; }
				},
				getConnectionObject: function(S) {
								var R;
								var m = this._transaction_id;
								try {
												if (!S) { R = this.createXhrObject(m); } else {
																R = {};
																R.tId = m;
																R.isUpload = true;
												}
												if (R) { this._transaction_id++; }
								} catch (q) {} finally { return R; }
				},
				asyncRequest: function(w, q, m, S) {
								var R = (this._isFileUpload) ? this.getConnectionObject(true) : this.getConnectionObject();
								if (!R) { return null; } else {
												if (m && m.customevents) { this.initCustomEvents(R, m); }
												if (this._isFormSubmit) { if (this._isFileUpload) { this.uploadFile(R, m, q, S); return R; } if (w.toUpperCase() == "GET") { if (this._sFormData.length !== 0) { q += ((q.indexOf("?") == -1) ? "?" : "&") + this._sFormData; } else { q += "?" + this._sFormData; } } else { if (w.toUpperCase() == "POST") { S = S ? this._sFormData + "&" + S : this._sFormData; } } } R.conn.open(w, q, true);
												if (this._use_default_xhr_header) { if (!this._default_headers["X-Requested-With"]) { this.initHeader("X-Requested-With", this._default_xhr_header, true); } }
												if (this._isFormSubmit == false && this._use_default_post_header) { this.initHeader("Content-Type", this._default_post_header); }
												if (this._has_default_headers || this._has_http_headers) { this.setHeader(R); } this.handleReadyState(R, m);
												R.conn.send(S || null);
												this.startEvent.fire(R);
												if (R.startEvent) { R.startEvent.fire(R); }
												return R;
								}
				},
				initCustomEvents: function(S, R) {
								for (var q in R.customevents) {
												if (this._customEvents[q][0]) {
																S[this._customEvents[q][0]] = new YAHOO.util.CustomEvent(this._customEvents[q][1], (R.scope) ? R.scope : null);
																S[this._customEvents[q][0]].subscribe(R.customevents[q]);
												}
								}
				},
				handleReadyState: function(q, R) {
								var S = this;
								if (R && R.timeout) { this._timeOut[q.tId] = window.setTimeout(function() { S.abort(q, R, true); }, R.timeout); } this._poll[q.tId] = window.setInterval(function() {
												if (q.conn && q.conn.readyState === 4) {
																window.clearInterval(S._poll[q.tId]);
																delete S._poll[q.tId];
																if (R && R.timeout) {
																				window.clearTimeout(S._timeOut[q.tId]);
																				delete S._timeOut[q.tId];
																}
																S.completeEvent.fire(q);
																if (q.completeEvent) { q.completeEvent.fire(q); } S.handleTransactionResponse(q, R);
												}
								}, this._polling_interval);
				},
				handleTransactionResponse: function(w, V, S) {
								var R, q;
								try { if (w.conn.status !== undefined && w.conn.status !== 0) { R = w.conn.status; } else { R = 13030; } } catch (m) { R = 13030; }
								if (R >= 200 && R < 300 || R === 1223) { q = this.createResponseObject(w, (V && V.argument) ? V.argument : undefined); if (V) { if (V.success) { if (!V.scope) { V.success(q); } else { V.success.apply(V.scope, [q]); } } } this.successEvent.fire(q); if (w.successEvent) { w.successEvent.fire(q); } } else {
												switch (R) {
																case 12002:
																case 12029:
																case 12030:
																case 12031:
																case 12152:
																case 13030:
																				q = this.createExceptionObject(w.tId, (V && V.argument) ? V.argument : undefined, (S ? S : false));
																				if (V) { if (V.failure) { if (!V.scope) { V.failure(q); } else { V.failure.apply(V.scope, [q]); } } }
																				break;
																default:
																				q = this.createResponseObject(w, (V && V.argument) ? V.argument : undefined);
																				if (V) { if (V.failure) { if (!V.scope) { V.failure(q); } else { V.failure.apply(V.scope, [q]); } } }
												}
												this.failureEvent.fire(q);
												if (w.failureEvent) { w.failureEvent.fire(q); }
								}
								this.releaseObject(w);
								q = null;
				},
				createResponseObject: function(S, d) {
								var m = {};
								var T = {};
								try { var R = S.conn.getAllResponseHeaders(); var V = R.split("\n"); for (var w = 0; w < V.length; w++) { var q = V[w].indexOf(":"); if (q != -1) { T[V[w].substring(0, q)] = V[w].substring(q + 2); } } } catch (N) {} m.tId = S.tId;
								m.status = (S.conn.status == 1223) ? 204 : S.conn.status;
								m.statusText = (S.conn.status == 1223) ? "No Content" : S.conn.statusText;
								m.getResponseHeader = T;
								m.getAllResponseHeaders = R;
								m.responseText = S.conn.responseText;
								m.responseXML = S.conn.responseXML;
								if (typeof d !== undefined) { m.argument = d; }
								return m;
				},
				createExceptionObject: function(N, m, S) {
								var V = 0;
								var d = "communication failure";
								var R = -1;
								var q = "transaction aborted";
								var w = {};
								w.tId = N;
								if (S) {
												w.status = R;
												w.statusText = q;
								} else {
												w.status = V;
												w.statusText = d;
								}
								if (m) { w.argument = m; }
								return w;
				},
				initHeader: function(S, m, R) {
								var q = (R) ? this._default_headers : this._http_headers;
								q[S] = m;
								if (R) { this._has_default_headers = true; } else { this._has_http_headers = true; }
				},
				setHeader: function(S) {
								if (this._has_default_headers) { for (var q in this._default_headers) { if (YAHOO.lang.hasOwnProperty(this._default_headers, q)) { S.conn.setRequestHeader(q, this._default_headers[q]); } } }
								if (this._has_http_headers) {
												for (var q in this._http_headers) { if (YAHOO.lang.hasOwnProperty(this._http_headers, q)) { S.conn.setRequestHeader(q, this._http_headers[q]); } } delete this._http_headers;
												this._http_headers = {};
												this._has_http_headers = false;
								}
				},
				resetDefaultHeaders: function() {
								delete this._default_headers;
								this._default_headers = {};
								this._has_default_headers = false;
				},
				setForm: function(M, w, q) {
								this.resetFormState();
								var f;
								if (typeof M == "string") { f = (document.getElementById(M) || document.forms[M]); } else { if (typeof M == "object") { f = M; } else { return; } }
								if (w) {
												var V = this.createFrame(q ? q : null);
												this._isFormSubmit = true;
												this._isFileUpload = true;
												this._formNode = f;
												return;
								}
								var S, T, d, p;
								var N = false;
								for (var m = 0; m < f.elements.length; m++) {
												S = f.elements[m];
												p = f.elements[m].disabled;
												T = f.elements[m].name;
												d = f.elements[m].value;
												if (!p && T) {
																switch (S.type) {
																				case "select-one":
																				case "select-multiple":
																								for (var R = 0; R < S.options.length; R++) { if (S.options[R].selected) { if (window.ActiveXObject) { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(S.options[R].attributes["value"].specified ? S.options[R].value : S.options[R].text) + "&"; } else { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(S.options[R].hasAttribute("value") ? S.options[R].value : S.options[R].text) + "&"; } } }
																								break;
																				case "radio":
																				case "checkbox":
																								if (S.checked) { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(d) + "&"; }
																								break;
																				case "file":
																				case undefined:
																				case "reset":
																				case "button":
																								break;
																				case "submit":
																								if (N === false) { if (this._hasSubmitListener && this._submitElementValue) { this._sFormData += this._submitElementValue + "&"; } else { this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(d) + "&"; } N = true; }
																								break;
																				default:
																								this._sFormData += encodeURIComponent(T) + "=" + encodeURIComponent(d) + "&";
																}
												}
								}
								this._isFormSubmit = true;
								this._sFormData = this._sFormData.substr(0, this._sFormData.length - 1);
								this.initHeader("Content-Type", this._default_form_header);
								return this._sFormData;
				},
				resetFormState: function() {
								this._isFormSubmit = false;
								this._isFileUpload = false;
								this._formNode = null;
								this._sFormData = "";
				},
				createFrame: function(S) {
								var q = "yuiIO" + this._transaction_id;
								var R;
								if (window.ActiveXObject) { R = document.createElement("<iframe id=\"" + q + "\" name=\"" + q + "\" />"); if (typeof S == "boolean") { R.src = "javascript:false"; } else { if (typeof secureURI == "string") { R.src = S; } } } else {
												R = document.createElement("iframe");
												R.id = q;
												R.name = q;
								}
								R.style.position = "absolute";
								R.style.top = "-1000px";
								R.style.left = "-1000px";
								document.body.appendChild(R);
				},
				appendPostData: function(S) {
								var m = [];
								var q = S.split("&");
								for (var R = 0; R < q.length; R++) {
												var w = q[R].indexOf("=");
												if (w != -1) {
																m[R] = document.createElement("input");
																m[R].type = "hidden";
																m[R].name = q[R].substring(0, w);
																m[R].value = q[R].substring(w + 1);
																this._formNode.appendChild(m[R]);
												}
								}
								return m;
				},
				uploadFile: function(m, p, w, R) {
								var N = "yuiIO" + m.tId;
								var T = "multipart/form-data";
								var f = document.getElementById(N);
								var U = this;
								var q = { action: this._formNode.getAttribute("action"), method: this._formNode.getAttribute("method"), target: this._formNode.getAttribute("target") };
								this._formNode.setAttribute("action", w);
								this._formNode.setAttribute("method", "POST");
								this._formNode.setAttribute("target", N);
								if (this._formNode.encoding) { this._formNode.setAttribute("encoding", T); } else { this._formNode.setAttribute("enctype", T); }
								if (R) { var M = this.appendPostData(R); } this._formNode.submit();
								this.startEvent.fire(m);
								if (m.startEvent) { m.startEvent.fire(m); }
								if (p && p.timeout) { this._timeOut[m.tId] = window.setTimeout(function() { U.abort(m, p, true); }, p.timeout); }
								if (M && M.length > 0) { for (var d = 0; d < M.length; d++) { this._formNode.removeChild(M[d]); } }
								for (var S in q) { if (YAHOO.lang.hasOwnProperty(q, S)) { if (q[S]) { this._formNode.setAttribute(S, q[S]); } else { this._formNode.removeAttribute(S); } } } this.resetFormState();
								var V = function() {
												if (p && p.timeout) {
																window.clearTimeout(U._timeOut[m.tId]);
																delete U._timeOut[m.tId];
												}
												U.completeEvent.fire(m);
												if (m.completeEvent) { m.completeEvent.fire(m); }
												var v = {};
												v.tId = m.tId;
												v.argument = p.argument;
												try {
																v.responseText = f.contentWindow.document.body ? f.contentWindow.document.body.innerHTML : f.contentWindow.document.documentElement.textContent;
																v.responseXML = f.contentWindow.document.XMLDocument ? f.contentWindow.document.XMLDocument : f.contentWindow.document;
												} catch (u) {}
												if (p && p.upload) { if (!p.scope) { p.upload(v); } else { p.upload.apply(p.scope, [v]); } } U.uploadEvent.fire(v);
												if (m.uploadEvent) { m.uploadEvent.fire(v); } YAHOO.util.Event.removeListener(f, "load", V);
												setTimeout(function() {
																document.body.removeChild(f);
																U.releaseObject(m);
												}, 100);
								};
								YAHOO.util.Event.addListener(f, "load", V);
				},
				abort: function(m, V, S) {
								var R;
								if (m.conn) {
												if (this.isCallInProgress(m)) {
																m.conn.abort();
																window.clearInterval(this._poll[m.tId]);
																delete this._poll[m.tId];
																if (S) {
																				window.clearTimeout(this._timeOut[m.tId]);
																				delete this._timeOut[m.tId];
																}
																R = true;
												}
								} else {
												if (m.isUpload === true) {
																var q = "yuiIO" + m.tId;
																var w = document.getElementById(q);
																if (w) {
																				YAHOO.util.Event.removeListener(w, "load", uploadCallback);
																				document.body.removeChild(w);
																				if (S) {
																								window.clearTimeout(this._timeOut[m.tId]);
																								delete this._timeOut[m.tId];
																				}
																				R = true;
																}
												} else { R = false; }
								}
								if (R === true) { this.abortEvent.fire(m); if (m.abortEvent) { m.abortEvent.fire(m); } this.handleTransactionResponse(m, V, true); }
								return R;
				},
				isCallInProgress: function(q) { if (q && q.conn) { return q.conn.readyState !== 4 && q.conn.readyState !== 0; } else { if (q && q.isUpload === true) { var S = "yuiIO" + q.tId; return document.getElementById(S) ? true : false; } else { return false; } } },
				releaseObject: function(S) { if (S.conn) { S.conn = null; } S = null; }
};
YAHOO.register("connection", YAHOO.util.Connect, { version: "2.3.1", build: "541" });
YAHOO.util.Anim = function(B, A, C, D) { if (!B) {} this.init(B, A, C, D); };
YAHOO.util.Anim.prototype = {
				toString: function() { var A = this.getEl(); var B = A.id || A.tagName || A; return ("Anim " + B); },
				patterns: { noNegatives: /width|height|opacity|padding/i, offsetAttribute: /^((width|height)|(top|left))$/, defaultUnit: /width|height|top$|bottom$|left$|right$/i, offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i },
				doMethod: function(A, C, B) { return this.method(this.currentFrame, C, B - C, this.totalFrames); },
				setAttribute: function(A, C, B) { if (this.patterns.noNegatives.test(A)) { C = (C > 0) ? C : 0; } YAHOO.util.Dom.setStyle(this.getEl(), A, C + B); },
				getAttribute: function(A) { var C = this.getEl(); var E = YAHOO.util.Dom.getStyle(C, A); if (E !== "auto" && !this.patterns.offsetUnit.test(E)) { return parseFloat(E); } var B = this.patterns.offsetAttribute.exec(A) || []; var F = !!(B[3]); var D = !!(B[2]); if (D || (YAHOO.util.Dom.getStyle(C, "position") == "absolute" && F)) { E = C["offset" + B[0].charAt(0).toUpperCase() + B[0].substr(1)]; } else { E = 0; } return E; },
				getDefaultUnit: function(A) { if (this.patterns.defaultUnit.test(A)) { return "px"; } return ""; },
				setRuntimeAttribute: function(B) {
								var G;
								var C;
								var D = this.attributes;
								this.runtimeAttributes[B] = {};
								var F = function(H) { return (typeof H !== "undefined"); };
								if (!F(D[B]["to"]) && !F(D[B]["by"])) { return false; } G = (F(D[B]["from"])) ? D[B]["from"] : this.getAttribute(B);
								if (F(D[B]["to"])) { C = D[B]["to"]; } else { if (F(D[B]["by"])) { if (G.constructor == Array) { C = []; for (var E = 0, A = G.length; E < A; ++E) { C[E] = G[E] + D[B]["by"][E] * 1; } } else { C = G + D[B]["by"] * 1; } } } this.runtimeAttributes[B].start = G;
								this.runtimeAttributes[B].end = C;
								this.runtimeAttributes[B].unit = (F(D[B].unit)) ? D[B]["unit"] : this.getDefaultUnit(B);
								return true;
				},
				init: function(C, H, G, A) {
								var B = false;
								var D = null;
								var F = 0;
								C = YAHOO.util.Dom.get(C);
								this.attributes = H || {};
								this.duration = !YAHOO.lang.isUndefined(G) ? G : 1;
								this.method = A || YAHOO.util.Easing.easeNone;
								this.useSeconds = true;
								this.currentFrame = 0;
								this.totalFrames = YAHOO.util.AnimMgr.fps;
								this.setEl = function(K) { C = YAHOO.util.Dom.get(K); };
								this.getEl = function() { return C; };
								this.isAnimated = function() { return B; };
								this.getStartTime = function() { return D; };
								this.runtimeAttributes = {};
								this.animate = function() {
												if (this.isAnimated()) { return false; } this.currentFrame = 0;
												this.totalFrames = (this.useSeconds) ? Math.ceil(YAHOO.util.AnimMgr.fps * this.duration) : this.duration;
												if (this.duration === 0 && this.useSeconds) { this.totalFrames = 1; } YAHOO.util.AnimMgr.registerElement(this);
												return true;
								};
								this.stop = function(K) {
												if (K) {
																this.currentFrame = this.totalFrames;
																this._onTween.fire();
												}
												YAHOO.util.AnimMgr.stop(this);
								};
								var J = function() {
												this.onStart.fire();
												this.runtimeAttributes = {};
												for (var K in this.attributes) { this.setRuntimeAttribute(K); } B = true;
												F = 0;
												D = new Date();
								};
								var I = function() {
												var M = { duration: new Date() - this.getStartTime(), currentFrame: this.currentFrame };
												M.toString = function() { return ("duration: " + M.duration + ", currentFrame: " + M.currentFrame); };
												this.onTween.fire(M);
												var L = this.runtimeAttributes;
												for (var K in L) { this.setAttribute(K, this.doMethod(K, L[K].start, L[K].end), L[K].unit); } F += 1;
								};
								var E = function() {
												var K = (new Date() - D) / 1000;
												var L = { duration: K, frames: F, fps: F / K };
												L.toString = function() { return ("duration: " + L.duration + ", frames: " + L.frames + ", fps: " + L.fps); };
												B = false;
												F = 0;
												this.onComplete.fire(L);
								};
								this._onStart = new YAHOO.util.CustomEvent("_start", this, true);
								this.onStart = new YAHOO.util.CustomEvent("start", this);
								this.onTween = new YAHOO.util.CustomEvent("tween", this);
								this._onTween = new YAHOO.util.CustomEvent("_tween", this, true);
								this.onComplete = new YAHOO.util.CustomEvent("complete", this);
								this._onComplete = new YAHOO.util.CustomEvent("_complete", this, true);
								this._onStart.subscribe(J);
								this._onTween.subscribe(I);
								this._onComplete.subscribe(E);
				}
};
YAHOO.util.AnimMgr = new function() {
				var C = null;
				var B = [];
				var A = 0;
				this.fps = 1000;
				this.delay = 1;
				this.registerElement = function(F) {
								B[B.length] = F;
								A += 1;
								F._onStart.fire();
								this.start();
				};
				this.unRegister = function(G, F) {
								G._onComplete.fire();
								F = F || E(G);
								if (F == -1) { return false; } B.splice(F, 1);
								A -= 1;
								if (A <= 0) { this.stop(); }
								return true;
				};
				this.start = function() { if (C === null) { C = setInterval(this.run, this.delay); } };
				this.stop = function(H) {
								if (!H) {
												clearInterval(C);
												for (var G = 0, F = B.length; G < F; ++G) { if (B[0].isAnimated()) { this.unRegister(B[0], 0); } } B = [];
												C = null;
												A = 0;
								} else { this.unRegister(H); }
				};
				this.run = function() { for (var H = 0, F = B.length; H < F; ++H) { var G = B[H]; if (!G || !G.isAnimated()) { continue; } if (G.currentFrame < G.totalFrames || G.totalFrames === null) { G.currentFrame += 1; if (G.useSeconds) { D(G); } G._onTween.fire(); } else { YAHOO.util.AnimMgr.stop(G, H); } } };
				var E = function(H) { for (var G = 0, F = B.length; G < F; ++G) { if (B[G] == H) { return G; } } return -1; };
				var D = function(G) { var J = G.totalFrames; var I = G.currentFrame; var H = (G.currentFrame * G.duration * 1000 / G.totalFrames); var F = (new Date() - G.getStartTime()); var K = 0; if (F < G.duration * 1000) { K = Math.round((F / H - 1) * G.currentFrame); } else { K = J - (I + 1); } if (K > 0 && isFinite(K)) { if (G.currentFrame + K >= J) { K = J - (I + 1); } G.currentFrame += K; } };
};
YAHOO.util.Bezier = new function() {
				this.getPosition = function(E, D) {
								var F = E.length;
								var C = [];
								for (var B = 0; B < F; ++B) { C[B] = [E[B][0], E[B][1]]; }
								for (var A = 1; A < F; ++A) {
												for (B = 0; B < F - A; ++B) {
																C[B][0] = (1 - D) * C[B][0] + D * C[parseInt(B + 1, 10)][0];
																C[B][1] = (1 - D) * C[B][1] + D * C[parseInt(B + 1, 10)][1];
												}
								}
								return [C[0][0], C[0][1]];
				};
};
(function() {
				YAHOO.util.ColorAnim = function(E, D, F, G) { YAHOO.util.ColorAnim.superclass.constructor.call(this, E, D, F, G); };
				YAHOO.extend(YAHOO.util.ColorAnim, YAHOO.util.Anim);
				var B = YAHOO.util;
				var C = B.ColorAnim.superclass;
				var A = B.ColorAnim.prototype;
				A.toString = function() { var D = this.getEl(); var E = D.id || D.tagName; return ("ColorAnim " + E); };
				A.patterns.color = /color$/i;
				A.patterns.rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
				A.patterns.hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
				A.patterns.hex3 = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
				A.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/;
				A.parseColor = function(D) { if (D.length == 3) { return D; } var E = this.patterns.hex.exec(D); if (E && E.length == 4) { return [parseInt(E[1], 16), parseInt(E[2], 16), parseInt(E[3], 16)]; } E = this.patterns.rgb.exec(D); if (E && E.length == 4) { return [parseInt(E[1], 10), parseInt(E[2], 10), parseInt(E[3], 10)]; } E = this.patterns.hex3.exec(D); if (E && E.length == 4) { return [parseInt(E[1] + E[1], 16), parseInt(E[2] + E[2], 16), parseInt(E[3] + E[3], 16)]; } return null; };
				A.getAttribute = function(D) {
								var F = this.getEl();
								if (this.patterns.color.test(D)) {
												var G = YAHOO.util.Dom.getStyle(F, D);
												if (this.patterns.transparent.test(G)) {
																var E = F.parentNode;
																G = B.Dom.getStyle(E, D);
																while (E && this.patterns.transparent.test(G)) {
																				E = E.parentNode;
																				G = B.Dom.getStyle(E, D);
																				if (E.tagName.toUpperCase() == "HTML") { G = "#fff"; }
																}
												}
								} else { G = C.getAttribute.call(this, D); }
								return G;
				};
				A.doMethod = function(E, I, F) { var H; if (this.patterns.color.test(E)) { H = []; for (var G = 0, D = I.length; G < D; ++G) { H[G] = C.doMethod.call(this, E, I[G], F[G]); } H = "rgb(" + Math.floor(H[0]) + "," + Math.floor(H[1]) + "," + Math.floor(H[2]) + ")"; } else { H = C.doMethod.call(this, E, I, F); } return H; };
				A.setRuntimeAttribute = function(E) {
								C.setRuntimeAttribute.call(this, E);
								if (this.patterns.color.test(E)) {
												var G = this.attributes;
												var I = this.parseColor(this.runtimeAttributes[E].start);
												var F = this.parseColor(this.runtimeAttributes[E].end);
												if (typeof G[E]["to"] === "undefined" && typeof G[E]["by"] !== "undefined") { F = this.parseColor(G[E].by); for (var H = 0, D = I.length; H < D; ++H) { F[H] = I[H] + F[H]; } } this.runtimeAttributes[E].start = I;
												this.runtimeAttributes[E].end = F;
								}
				};
})();
YAHOO.util.Easing = { easeNone: function(B, A, D, C) { return D * B / C + A; }, easeIn: function(B, A, D, C) { return D * (B /= C) * B + A; }, easeOut: function(B, A, D, C) { return -D * (B /= C) * (B - 2) + A; }, easeBoth: function(B, A, D, C) { if ((B /= C / 2) < 1) { return D / 2 * B * B + A; } return -D / 2 * ((--B) * (B - 2) - 1) + A; }, easeInStrong: function(B, A, D, C) { return D * (B /= C) * B * B * B + A; }, easeOutStrong: function(B, A, D, C) { return -D * ((B = B / C - 1) * B * B * B - 1) + A; }, easeBothStrong: function(B, A, D, C) { if ((B /= C / 2) < 1) { return D / 2 * B * B * B * B + A; } return -D / 2 * ((B -= 2) * B * B * B - 2) + A; }, elasticIn: function(C, A, G, F, B, E) { if (C == 0) { return A; } if ((C /= F) == 1) { return A + G; } if (!E) { E = F * 0.3; } if (!B || B < Math.abs(G)) { B = G; var D = E / 4; } else { var D = E / (2 * Math.PI) * Math.asin(G / B); } return -(B * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E)) + A; }, elasticOut: function(C, A, G, F, B, E) { if (C == 0) { return A; } if ((C /= F) == 1) { return A + G; } if (!E) { E = F * 0.3; } if (!B || B < Math.abs(G)) { B = G; var D = E / 4; } else { var D = E / (2 * Math.PI) * Math.asin(G / B); } return B * Math.pow(2, -10 * C) * Math.sin((C * F - D) * (2 * Math.PI) / E) + G + A; }, elasticBoth: function(C, A, G, F, B, E) { if (C == 0) { return A; } if ((C /= F / 2) == 2) { return A + G; } if (!E) { E = F * (0.3 * 1.5); } if (!B || B < Math.abs(G)) { B = G; var D = E / 4; } else { var D = E / (2 * Math.PI) * Math.asin(G / B); } if (C < 1) { return -0.5 * (B * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E)) + A; } return B * Math.pow(2, -10 * (C -= 1)) * Math.sin((C * F - D) * (2 * Math.PI) / E) * 0.5 + G + A; }, backIn: function(B, A, E, D, C) { if (typeof C == "undefined") { C = 1.70158; } return E * (B /= D) * B * ((C + 1) * B - C) + A; }, backOut: function(B, A, E, D, C) { if (typeof C == "undefined") { C = 1.70158; } return E * ((B = B / D - 1) * B * ((C + 1) * B + C) + 1) + A; }, backBoth: function(B, A, E, D, C) { if (typeof C == "undefined") { C = 1.70158; } if ((B /= D / 2) < 1) { return E / 2 * (B * B * (((C *= (1.525)) + 1) * B - C)) + A; } return E / 2 * ((B -= 2) * B * (((C *= (1.525)) + 1) * B + C) + 2) + A; }, bounceIn: function(B, A, D, C) { return D - YAHOO.util.Easing.bounceOut(C - B, 0, D, C) + A; }, bounceOut: function(B, A, D, C) { if ((B /= C) < (1 / 2.75)) { return D * (7.5625 * B * B) + A; } else { if (B < (2 / 2.75)) { return D * (7.5625 * (B -= (1.5 / 2.75)) * B + 0.75) + A; } else { if (B < (2.5 / 2.75)) { return D * (7.5625 * (B -= (2.25 / 2.75)) * B + 0.9375) + A; } } } return D * (7.5625 * (B -= (2.625 / 2.75)) * B + 0.984375) + A; }, bounceBoth: function(B, A, D, C) { if (B < C / 2) { return YAHOO.util.Easing.bounceIn(B * 2, 0, D, C) * 0.5 + A; } return YAHOO.util.Easing.bounceOut(B * 2 - C, 0, D, C) * 0.5 + D * 0.5 + A; } };
(function() {
				YAHOO.util.Motion = function(G, F, H, I) { if (G) { YAHOO.util.Motion.superclass.constructor.call(this, G, F, H, I); } };
				YAHOO.extend(YAHOO.util.Motion, YAHOO.util.ColorAnim);
				var D = YAHOO.util;
				var E = D.Motion.superclass;
				var B = D.Motion.prototype;
				B.toString = function() { var F = this.getEl(); var G = F.id || F.tagName; return ("Motion " + G); };
				B.patterns.points = /^points$/i;
				B.setAttribute = function(F, H, G) {
								if (this.patterns.points.test(F)) {
												G = G || "px";
												E.setAttribute.call(this, "left", H[0], G);
												E.setAttribute.call(this, "top", H[1], G);
								} else { E.setAttribute.call(this, F, H, G); }
				};
				B.getAttribute = function(F) { if (this.patterns.points.test(F)) { var G = [E.getAttribute.call(this, "left"), E.getAttribute.call(this, "top")]; } else { G = E.getAttribute.call(this, F); } return G; };
				B.doMethod = function(F, J, G) {
								var I = null;
								if (this.patterns.points.test(F)) {
												var H = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;
												I = D.Bezier.getPosition(this.runtimeAttributes[F], H);
								} else { I = E.doMethod.call(this, F, J, G); }
								return I;
				};
				B.setRuntimeAttribute = function(O) { if (this.patterns.points.test(O)) { var G = this.getEl(); var I = this.attributes; var F; var K = I["points"]["control"] || []; var H; var L, N; if (K.length > 0 && !(K[0] instanceof Array)) { K = [K]; } else { var J = []; for (L = 0, N = K.length; L < N; ++L) { J[L] = K[L]; } K = J; } if (D.Dom.getStyle(G, "position") == "static") { D.Dom.setStyle(G, "position", "relative"); } if (C(I["points"]["from"])) { D.Dom.setXY(G, I["points"]["from"]); } else { D.Dom.setXY(G, D.Dom.getXY(G)); } F = this.getAttribute("points"); if (C(I["points"]["to"])) { H = A.call(this, I["points"]["to"], F); var M = D.Dom.getXY(this.getEl()); for (L = 0, N = K.length; L < N; ++L) { K[L] = A.call(this, K[L], F); } } else { if (C(I["points"]["by"])) { H = [F[0] + I["points"]["by"][0], F[1] + I["points"]["by"][1]]; for (L = 0, N = K.length; L < N; ++L) { K[L] = [F[0] + K[L][0], F[1] + K[L][1]]; } } } this.runtimeAttributes[O] = [F]; if (K.length > 0) { this.runtimeAttributes[O] = this.runtimeAttributes[O].concat(K); } this.runtimeAttributes[O][this.runtimeAttributes[O].length] = H; } else { E.setRuntimeAttribute.call(this, O); } };
				var A = function(F, H) {
								var G = D.Dom.getXY(this.getEl());
								F = [F[0] - G[0] + H[0], F[1] - G[1] + H[1]];
								return F;
				};
				var C = function(F) { return (typeof F !== "undefined"); };
})();
(function() {
				YAHOO.util.Scroll = function(E, D, F, G) { if (E) { YAHOO.util.Scroll.superclass.constructor.call(this, E, D, F, G); } };
				YAHOO.extend(YAHOO.util.Scroll, YAHOO.util.ColorAnim);
				var B = YAHOO.util;
				var C = B.Scroll.superclass;
				var A = B.Scroll.prototype;
				A.toString = function() { var D = this.getEl(); var E = D.id || D.tagName; return ("Scroll " + E); };
				A.doMethod = function(D, G, E) { var F = null; if (D == "scroll") { F = [this.method(this.currentFrame, G[0], E[0] - G[0], this.totalFrames), this.method(this.currentFrame, G[1], E[1] - G[1], this.totalFrames)]; } else { F = C.doMethod.call(this, D, G, E); } return F; };
				A.getAttribute = function(D) { var F = null; var E = this.getEl(); if (D == "scroll") { F = [E.scrollLeft, E.scrollTop]; } else { F = C.getAttribute.call(this, D); } return F; };
				A.setAttribute = function(D, G, F) {
								var E = this.getEl();
								if (D == "scroll") {
												E.scrollLeft = G[0];
												E.scrollTop = G[1];
								} else { C.setAttribute.call(this, D, G, F); }
				};
})();
YAHOO.register("animation", YAHOO.util.Anim, { version: "2.3.1", build: "541" });
if (!YAHOO.util.DragDropMgr) {
				YAHOO.util.DragDropMgr = function() {
								var A = YAHOO.util.Event;
								return {
												ids: {},
												handleIds: {},
												dragCurrent: null,
												dragOvers: {},
												deltaX: 0,
												deltaY: 0,
												preventDefault: true,
												stopPropagation: true,
												initialized: false,
												locked: false,
												interactionInfo: null,
												init: function() { this.initialized = true; },
												POINT: 0,
												INTERSECT: 1,
												STRICT_INTERSECT: 2,
												mode: 0,
												_execOnAll: function(D, C) { for (var E in this.ids) { for (var B in this.ids[E]) { var F = this.ids[E][B]; if (!this.isTypeOfDD(F)) { continue; } F[D].apply(F, C); } } },
												_onLoad: function() {
																this.init();
																A.on(document, "mouseup", this.handleMouseUp, this, true);
																A.on(document, "mousemove", this.handleMouseMove, this, true);
																A.on(window, "unload", this._onUnload, this, true);
																A.on(window, "resize", this._onResize, this, true);
												},
												_onResize: function(B) { this._execOnAll("resetConstraints", []); },
												lock: function() { this.locked = true; },
												unlock: function() { this.locked = false; },
												isLocked: function() { return this.locked; },
												locationCache: {},
												useCache: true,
												clickPixelThresh: 3,
												clickTimeThresh: 1000,
												dragThreshMet: false,
												clickTimeout: null,
												startX: 0,
												startY: 0,
												regDragDrop: function(C, B) { if (!this.initialized) { this.init(); } if (!this.ids[B]) { this.ids[B] = {}; } this.ids[B][C.id] = C; },
												removeDDFromGroup: function(D, B) { if (!this.ids[B]) { this.ids[B] = {}; } var C = this.ids[B]; if (C && C[D.id]) { delete C[D.id]; } },
												_remove: function(C) { for (var B in C.groups) { if (B && this.ids[B][C.id]) { delete this.ids[B][C.id]; } } delete this.handleIds[C.id]; },
												regHandle: function(C, B) { if (!this.handleIds[C]) { this.handleIds[C] = {}; } this.handleIds[C][B] = B; },
												isDragDrop: function(B) { return (this.getDDById(B)) ? true : false; },
												getRelated: function(G, C) { var F = []; for (var E in G.groups) { for (var D in this.ids[E]) { var B = this.ids[E][D]; if (!this.isTypeOfDD(B)) { continue; } if (!C || B.isTarget) { F[F.length] = B; } } } return F; },
												isLegalTarget: function(F, E) { var C = this.getRelated(F, true); for (var D = 0, B = C.length; D < B; ++D) { if (C[D].id == E.id) { return true; } } return false; },
												isTypeOfDD: function(B) { return (B && B.__ygDragDrop); },
												isHandle: function(C, B) { return (this.handleIds[C] && this.handleIds[C][B]); },
												getDDById: function(C) { for (var B in this.ids) { if (this.ids[B][C]) { return this.ids[B][C]; } } return null; },
												handleMouseDown: function(D, C) {
																this.currentTarget = YAHOO.util.Event.getTarget(D);
																this.dragCurrent = C;
																var B = C.getEl();
																this.startX = YAHOO.util.Event.getPageX(D);
																this.startY = YAHOO.util.Event.getPageY(D);
																this.deltaX = this.startX - B.offsetLeft;
																this.deltaY = this.startY - B.offsetTop;
																this.dragThreshMet = false;
																this.clickTimeout = setTimeout(function() {
																				var E = YAHOO.util.DDM;
																				E.startDrag(E.startX, E.startY);
																}, this.clickTimeThresh);
												},
												startDrag: function(B, D) { clearTimeout(this.clickTimeout); var C = this.dragCurrent; if (C) { C.b4StartDrag(B, D); } if (C) { C.startDrag(B, D); } this.dragThreshMet = true; },
												handleMouseUp: function(B) {
																if (this.dragCurrent) {
																				clearTimeout(this.clickTimeout);
																				if (this.dragThreshMet) { this.fireEvents(B, true); } else {} this.stopDrag(B);
																				this.stopEvent(B);
																}
												},
												stopEvent: function(B) { if (this.stopPropagation) { YAHOO.util.Event.stopPropagation(B); } if (this.preventDefault) { YAHOO.util.Event.preventDefault(B); } },
												stopDrag: function(C, B) {
																if (this.dragCurrent && !B) {
																				if (this.dragThreshMet) {
																								this.dragCurrent.b4EndDrag(C);
																								this.dragCurrent.endDrag(C);
																				}
																				this.dragCurrent.onMouseUp(C);
																}
																this.dragCurrent = null;
																this.dragOvers = {};
												},
												handleMouseMove: function(E) { var B = this.dragCurrent; if (B) { if (YAHOO.util.Event.isIE && !E.button) { this.stopEvent(E); return this.handleMouseUp(E); } if (!this.dragThreshMet) { var D = Math.abs(this.startX - YAHOO.util.Event.getPageX(E)); var C = Math.abs(this.startY - YAHOO.util.Event.getPageY(E)); if (D > this.clickPixelThresh || C > this.clickPixelThresh) { this.startDrag(this.startX, this.startY); } } if (this.dragThreshMet) { B.b4Drag(E); if (B) { B.onDrag(E); } if (B) { this.fireEvents(E, false); } } this.stopEvent(E); } },
												fireEvents: function(Q, H) {
																var S = this.dragCurrent;
																if (!S || S.isLocked()) { return; }
																var J = YAHOO.util.Event.getPageX(Q),
																				I = YAHOO.util.Event.getPageY(Q),
																				K = new YAHOO.util.Point(J, I),
																				F = S.getTargetCoord(K.x, K.y),
																				C = S.getDragEl(),
																				P = new YAHOO.util.Region(F.y, F.x + C.offsetWidth, F.y + C.offsetHeight, F.x),
																				E = [],
																				G = [],
																				B = [],
																				R = [],
																				O = [];
																for (var M in this.dragOvers) {
																				var T = this.dragOvers[M];
																				if (!this.isTypeOfDD(T)) { continue; }
																				if (!this.isOverTarget(K, T, this.mode, P)) { G.push(T); } E[M] = true;
																				delete this.dragOvers[M];
																}
																for (var L in S.groups) { if ("string" != typeof L) { continue; } for (M in this.ids[L]) { var D = this.ids[L][M]; if (!this.isTypeOfDD(D)) { continue; } if (D.isTarget && !D.isLocked() && D != S) { if (this.isOverTarget(K, D, this.mode, P)) { if (H) { R.push(D); } else { if (!E[D.id]) { O.push(D); } else { B.push(D); } this.dragOvers[D.id] = D; } } } } } this.interactionInfo = { out: G, enter: O, over: B, drop: R, point: K, draggedRegion: P, sourceRegion: this.locationCache[S.id], validDrop: H };
																if (H && !R.length) {
																				this.interactionInfo.validDrop = false;
																				S.onInvalidDrop(Q);
																}
																if (this.mode) { if (G.length) { S.b4DragOut(Q, G); if (S) { S.onDragOut(Q, G); } } if (O.length) { if (S) { S.onDragEnter(Q, O); } } if (B.length) { if (S) { S.b4DragOver(Q, B); } if (S) { S.onDragOver(Q, B); } } if (R.length) { if (S) { S.b4DragDrop(Q, R); } if (S) { S.onDragDrop(Q, R); } } } else { var N = 0; for (M = 0, N = G.length; M < N; ++M) { if (S) { S.b4DragOut(Q, G[M].id); } if (S) { S.onDragOut(Q, G[M].id); } } for (M = 0, N = O.length; M < N; ++M) { if (S) { S.onDragEnter(Q, O[M].id); } } for (M = 0, N = B.length; M < N; ++M) { if (S) { S.b4DragOver(Q, B[M].id); } if (S) { S.onDragOver(Q, B[M].id); } } for (M = 0, N = R.length; M < N; ++M) { if (S) { S.b4DragDrop(Q, R[M].id); } if (S) { S.onDragDrop(Q, R[M].id); } } }
												},
												getBestMatch: function(D) { var F = null; var C = D.length; if (C == 1) { F = D[0]; } else { for (var E = 0; E < C; ++E) { var B = D[E]; if (this.mode == this.INTERSECT && B.cursorIsOver) { F = B; break; } else { if (!F || !F.overlap || (B.overlap && F.overlap.getArea() < B.overlap.getArea())) { F = B; } } } } return F; },
												refreshCache: function(C) { var E = C || this.ids; for (var B in E) { if ("string" != typeof B) { continue; } for (var D in this.ids[B]) { var F = this.ids[B][D]; if (this.isTypeOfDD(F)) { var G = this.getLocation(F); if (G) { this.locationCache[F.id] = G; } else { delete this.locationCache[F.id]; } } } } },
												verifyEl: function(C) { try { if (C) { var B = C.offsetParent; if (B) { return true; } } } catch (D) {} return false; },
												getLocation: function(G) {
																if (!this.isTypeOfDD(G)) { return null; }
																var E = G.getEl(),
																				J, D, C, L, K, M, B, I, F;
																try { J = YAHOO.util.Dom.getXY(E); } catch (H) {}
																if (!J) { return null; } D = J[0];
																C = D + E.offsetWidth;
																L = J[1];
																K = L + E.offsetHeight;
																M = L - G.padding[0];
																B = C + G.padding[1];
																I = K + G.padding[2];
																F = D - G.padding[3];
																return new YAHOO.util.Region(M, B, I, F);
												},
												isOverTarget: function(J, B, D, E) {
																var F = this.locationCache[B.id];
																if (!F || !this.useCache) {
																				F = this.getLocation(B);
																				this.locationCache[B.id] = F;
																}
																if (!F) { return false; } B.cursorIsOver = F.contains(J);
																var I = this.dragCurrent;
																if (!I || (!D && !I.constrainX && !I.constrainY)) { return B.cursorIsOver; } B.overlap = null;
																if (!E) {
																				var G = I.getTargetCoord(J.x, J.y);
																				var C = I.getDragEl();
																				E = new YAHOO.util.Region(G.y, G.x + C.offsetWidth, G.y + C.offsetHeight, G.x);
																}
																var H = E.intersect(F);
																if (H) { B.overlap = H; return (D) ? true : B.cursorIsOver; } else { return false; }
												},
												_onUnload: function(C, B) { this.unregAll(); },
												unregAll: function() {
																if (this.dragCurrent) {
																				this.stopDrag();
																				this.dragCurrent = null;
																}
																this._execOnAll("unreg", []);
																this.ids = {};
												},
												elementCache: {},
												getElWrapper: function(C) { var B = this.elementCache[C]; if (!B || !B.el) { B = this.elementCache[C] = new this.ElementWrapper(YAHOO.util.Dom.get(C)); } return B; },
												getElement: function(B) { return YAHOO.util.Dom.get(B); },
												getCss: function(C) { var B = YAHOO.util.Dom.get(C); return (B) ? B.style : null; },
												ElementWrapper: function(B) {
																this.el = B || null;
																this.id = this.el && B.id;
																this.css = this.el && B.style;
												},
												getPosX: function(B) { return YAHOO.util.Dom.getX(B); },
												getPosY: function(B) { return YAHOO.util.Dom.getY(B); },
												swapNode: function(D, B) {
																if (D.swapNode) { D.swapNode(B); } else {
																				var E = B.parentNode;
																				var C = B.nextSibling;
																				if (C == D) { E.insertBefore(D, B); } else {
																								if (B == D.nextSibling) { E.insertBefore(B, D); } else {
																												D.parentNode.replaceChild(B, D);
																												E.insertBefore(D, C);
																								}
																				}
																}
												},
												getScroll: function() {
																var D, B, E = document.documentElement,
																				C = document.body;
																if (E && (E.scrollTop || E.scrollLeft)) {
																				D = E.scrollTop;
																				B = E.scrollLeft;
																} else {
																				if (C) {
																								D = C.scrollTop;
																								B = C.scrollLeft;
																				} else {}
																}
																return { top: D, left: B };
												},
												getStyle: function(C, B) { return YAHOO.util.Dom.getStyle(C, B); },
												getScrollTop: function() { return this.getScroll().top; },
												getScrollLeft: function() { return this.getScroll().left; },
												moveToEl: function(B, D) {
																var C = YAHOO.util.Dom.getXY(D);
																YAHOO.util.Dom.setXY(B, C);
												},
												getClientHeight: function() { return YAHOO.util.Dom.getViewportHeight(); },
												getClientWidth: function() { return YAHOO.util.Dom.getViewportWidth(); },
												numericSort: function(C, B) { return (C - B); },
												_timeoutCount: 0,
												_addListeners: function() { var B = YAHOO.util.DDM; if (YAHOO.util.Event && document) { B._onLoad(); } else { if (B._timeoutCount > 2000) {} else { setTimeout(B._addListeners, 10); if (document && document.body) { B._timeoutCount += 1; } } } },
												handleWasClicked: function(B, D) { if (this.isHandle(D, B.id)) { return true; } else { var C = B.parentNode; while (C) { if (this.isHandle(D, C.id)) { return true; } else { C = C.parentNode; } } } return false; }
								};
				}();
				YAHOO.util.DDM = YAHOO.util.DragDropMgr;
				YAHOO.util.DDM._addListeners();
}(function() {
				var A = YAHOO.util.Event;
				var B = YAHOO.util.Dom;
				YAHOO.util.DragDrop = function(E, C, D) { if (E) { this.init(E, C, D); } };
				YAHOO.util.DragDrop.prototype = {
								id: null,
								config: null,
								dragElId: null,
								handleElId: null,
								invalidHandleTypes: null,
								invalidHandleIds: null,
								invalidHandleClasses: null,
								startPageX: 0,
								startPageY: 0,
								groups: null,
								locked: false,
								lock: function() { this.locked = true; },
								unlock: function() { this.locked = false; },
								isTarget: true,
								padding: null,
								_domRef: null,
								__ygDragDrop: true,
								constrainX: false,
								constrainY: false,
								minX: 0,
								maxX: 0,
								minY: 0,
								maxY: 0,
								deltaX: 0,
								deltaY: 0,
								maintainOffset: false,
								xTicks: null,
								yTicks: null,
								primaryButtonOnly: true,
								available: false,
								hasOuterHandles: false,
								cursorIsOver: false,
								overlap: null,
								b4StartDrag: function(C, D) {},
								startDrag: function(C, D) {},
								b4Drag: function(C) {},
								onDrag: function(C) {},
								onDragEnter: function(C, D) {},
								b4DragOver: function(C) {},
								onDragOver: function(C, D) {},
								b4DragOut: function(C) {},
								onDragOut: function(C, D) {},
								b4DragDrop: function(C) {},
								onDragDrop: function(C, D) {},
								onInvalidDrop: function(C) {},
								b4EndDrag: function(C) {},
								endDrag: function(C) {},
								b4MouseDown: function(C) {},
								onMouseDown: function(C) {},
								onMouseUp: function(C) {},
								onAvailable: function() {},
								getEl: function() { if (!this._domRef) { this._domRef = B.get(this.id); } return this._domRef; },
								getDragEl: function() { return B.get(this.dragElId); },
								init: function(E, C, D) {
												this.initTarget(E, C, D);
												A.on(this._domRef || this.id, "mousedown", this.handleMouseDown, this, true);
								},
								initTarget: function(E, C, D) {
												this.config = D || {};
												this.DDM = YAHOO.util.DDM;
												this.groups = {};
												if (typeof E !== "string") {
																this._domRef = E;
																E = B.generateId(E);
												}
												this.id = E;
												this.addToGroup((C) ? C : "default");
												this.handleElId = E;
												A.onAvailable(E, this.handleOnAvailable, this, true);
												this.setDragElId(E);
												this.invalidHandleTypes = { A: "A" };
												this.invalidHandleIds = {};
												this.invalidHandleClasses = [];
												this.applyConfig();
								},
								applyConfig: function() {
												this.padding = this.config.padding || [0, 0, 0, 0];
												this.isTarget = (this.config.isTarget !== false);
												this.maintainOffset = (this.config.maintainOffset);
												this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);
								},
								handleOnAvailable: function() {
												this.available = true;
												this.resetConstraints();
												this.onAvailable();
								},
								setPadding: function(E, C, F, D) { if (!C && 0 !== C) { this.padding = [E, E, E, E]; } else { if (!F && 0 !== F) { this.padding = [E, C, E, C]; } else { this.padding = [E, C, F, D]; } } },
								setInitPosition: function(F, E) {
												var G = this.getEl();
												if (!this.DDM.verifyEl(G)) { return; }
												var D = F || 0;
												var C = E || 0;
												var H = B.getXY(G);
												this.initPageX = H[0] - D;
												this.initPageY = H[1] - C;
												this.lastPageX = H[0];
												this.lastPageY = H[1];
												this.setStartPosition(H);
								},
								setStartPosition: function(D) {
												var C = D || B.getXY(this.getEl());
												this.deltaSetXY = null;
												this.startPageX = C[0];
												this.startPageY = C[1];
								},
								addToGroup: function(C) {
												this.groups[C] = true;
												this.DDM.regDragDrop(this, C);
								},
								removeFromGroup: function(C) { if (this.groups[C]) { delete this.groups[C]; } this.DDM.removeDDFromGroup(this, C); },
								setDragElId: function(C) { this.dragElId = C; },
								setHandleElId: function(C) {
												if (typeof C !== "string") { C = B.generateId(C); } this.handleElId = C;
												this.DDM.regHandle(this.id, C);
								},
								setOuterHandleElId: function(C) {
												if (typeof C !== "string") { C = B.generateId(C); } A.on(C, "mousedown", this.handleMouseDown, this, true);
												this.setHandleElId(C);
												this.hasOuterHandles = true;
								},
								unreg: function() {
												A.removeListener(this.id, "mousedown", this.handleMouseDown);
												this._domRef = null;
												this.DDM._remove(this);
								},
								isLocked: function() { return (this.DDM.isLocked() || this.locked); },
								handleMouseDown: function(F, E) {
												var C = F.which || F.button;
												if (this.primaryButtonOnly && C > 1) { return; }
												if (this.isLocked()) { return; } this.b4MouseDown(F);
												this.onMouseDown(F);
												this.DDM.refreshCache(this.groups);
												var D = new YAHOO.util.Point(A.getPageX(F), A.getPageY(F));
												if (!this.hasOuterHandles && !this.DDM.isOverTarget(D, this)) {} else {
																if (this.clickValidator(F)) {
																				this.setStartPosition();
																				this.DDM.handleMouseDown(F, this);
																				this.DDM.stopEvent(F);
																} else {}
												}
								},
								clickValidator: function(D) { var C = A.getTarget(D); return (this.isValidHandleChild(C) && (this.id == this.handleElId || this.DDM.handleWasClicked(C, this.id))); },
								getTargetCoord: function(E, D) {
												var C = E - this.deltaX;
												var F = D - this.deltaY;
												if (this.constrainX) { if (C < this.minX) { C = this.minX; } if (C > this.maxX) { C = this.maxX; } }
												if (this.constrainY) { if (F < this.minY) { F = this.minY; } if (F > this.maxY) { F = this.maxY; } } C = this.getTick(C, this.xTicks);
												F = this.getTick(F, this.yTicks);
												return { x: C, y: F };
								},
								addInvalidHandleType: function(C) {
												var D = C.toUpperCase();
												this.invalidHandleTypes[D] = D;
								},
								addInvalidHandleId: function(C) { if (typeof C !== "string") { C = B.generateId(C); } this.invalidHandleIds[C] = C; },
								addInvalidHandleClass: function(C) { this.invalidHandleClasses.push(C); },
								removeInvalidHandleType: function(C) {
												var D = C.toUpperCase();
												delete this.invalidHandleTypes[D];
								},
								removeInvalidHandleId: function(C) { if (typeof C !== "string") { C = B.generateId(C); } delete this.invalidHandleIds[C]; },
								removeInvalidHandleClass: function(D) { for (var E = 0, C = this.invalidHandleClasses.length; E < C; ++E) { if (this.invalidHandleClasses[E] == D) { delete this.invalidHandleClasses[E]; } } },
								isValidHandleChild: function(F) {
												var E = true;
												var H;
												try { H = F.nodeName.toUpperCase(); } catch (G) { H = F.nodeName; } E = E && !this.invalidHandleTypes[H];
												E = E && !this.invalidHandleIds[F.id];
												for (var D = 0, C = this.invalidHandleClasses.length; E && D < C; ++D) { E = !B.hasClass(F, this.invalidHandleClasses[D]); }
												return E;
								},
								setXTicks: function(F, C) {
												this.xTicks = [];
												this.xTickSize = C;
												var E = {};
												for (var D = this.initPageX; D >= this.minX; D = D - C) {
																if (!E[D]) {
																				this.xTicks[this.xTicks.length] = D;
																				E[D] = true;
																}
												}
												for (D = this.initPageX; D <= this.maxX; D = D + C) {
																if (!E[D]) {
																				this.xTicks[this.xTicks.length] = D;
																				E[D] = true;
																}
												}
												this.xTicks.sort(this.DDM.numericSort);
								},
								setYTicks: function(F, C) {
												this.yTicks = [];
												this.yTickSize = C;
												var E = {};
												for (var D = this.initPageY; D >= this.minY; D = D - C) {
																if (!E[D]) {
																				this.yTicks[this.yTicks.length] = D;
																				E[D] = true;
																}
												}
												for (D = this.initPageY; D <= this.maxY; D = D + C) {
																if (!E[D]) {
																				this.yTicks[this.yTicks.length] = D;
																				E[D] = true;
																}
												}
												this.yTicks.sort(this.DDM.numericSort);
								},
								setXConstraint: function(E, D, C) {
												this.leftConstraint = parseInt(E, 10);
												this.rightConstraint = parseInt(D, 10);
												this.minX = this.initPageX - this.leftConstraint;
												this.maxX = this.initPageX + this.rightConstraint;
												if (C) { this.setXTicks(this.initPageX, C); } this.constrainX = true;
								},
								clearConstraints: function() {
												this.constrainX = false;
												this.constrainY = false;
												this.clearTicks();
								},
								clearTicks: function() {
												this.xTicks = null;
												this.yTicks = null;
												this.xTickSize = 0;
												this.yTickSize = 0;
								},
								setYConstraint: function(C, E, D) {
												this.topConstraint = parseInt(C, 10);
												this.bottomConstraint = parseInt(E, 10);
												this.minY = this.initPageY - this.topConstraint;
												this.maxY = this.initPageY + this.bottomConstraint;
												if (D) { this.setYTicks(this.initPageY, D); } this.constrainY = true;
								},
								resetConstraints: function() {
												if (this.initPageX || this.initPageX === 0) {
																var D = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
																var C = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;
																this.setInitPosition(D, C);
												} else { this.setInitPosition(); }
												if (this.constrainX) { this.setXConstraint(this.leftConstraint, this.rightConstraint, this.xTickSize); }
												if (this.constrainY) { this.setYConstraint(this.topConstraint, this.bottomConstraint, this.yTickSize); }
								},
								getTick: function(I, F) { if (!F) { return I; } else { if (F[0] >= I) { return F[0]; } else { for (var D = 0, C = F.length; D < C; ++D) { var E = D + 1; if (F[E] && F[E] >= I) { var H = I - F[D]; var G = F[E] - I; return (G > H) ? F[D] : F[E]; } } return F[F.length - 1]; } } },
								toString: function() { return ("DragDrop " + this.id); }
				};
})();
YAHOO.util.DD = function(C, A, B) { if (C) { this.init(C, A, B); } };
YAHOO.extend(YAHOO.util.DD, YAHOO.util.DragDrop, {
				scroll: true,
				autoOffset: function(C, B) {
								var A = C - this.startPageX;
								var D = B - this.startPageY;
								this.setDelta(A, D);
				},
				setDelta: function(B, A) {
								this.deltaX = B;
								this.deltaY = A;
				},
				setDragElPos: function(C, B) {
								var A = this.getDragEl();
								this.alignElWithMouse(A, C, B);
				},
				alignElWithMouse: function(B, F, E) {
								var D = this.getTargetCoord(F, E);
								if (!this.deltaSetXY) {
												var G = [D.x, D.y];
												YAHOO.util.Dom.setXY(B, G);
												var C = parseInt(YAHOO.util.Dom.getStyle(B, "left"), 10);
												var A = parseInt(YAHOO.util.Dom.getStyle(B, "top"), 10);
												this.deltaSetXY = [C - D.x, A - D.y];
								} else {
												YAHOO.util.Dom.setStyle(B, "left", (D.x + this.deltaSetXY[0]) + "px");
												YAHOO.util.Dom.setStyle(B, "top", (D.y + this.deltaSetXY[1]) + "px");
								}
								this.cachePosition(D.x, D.y);
								this.autoScroll(D.x, D.y, B.offsetHeight, B.offsetWidth);
				},
				cachePosition: function(B, A) {
								if (B) {
												this.lastPageX = B;
												this.lastPageY = A;
								} else {
												var C = YAHOO.util.Dom.getXY(this.getEl());
												this.lastPageX = C[0];
												this.lastPageY = C[1];
								}
				},
				autoScroll: function(J, I, E, K) { if (this.scroll) { var L = this.DDM.getClientHeight(); var B = this.DDM.getClientWidth(); var N = this.DDM.getScrollTop(); var D = this.DDM.getScrollLeft(); var H = E + I; var M = K + J; var G = (L + N - I - this.deltaY); var F = (B + D - J - this.deltaX); var C = 40; var A = (document.all) ? 80 : 30; if (H > L && G < C) { window.scrollTo(D, N + A); } if (I < N && N > 0 && I - N < C) { window.scrollTo(D, N - A); } if (M > B && F < C) { window.scrollTo(D + A, N); } if (J < D && D > 0 && J - D < C) { window.scrollTo(D - A, N); } } },
				applyConfig: function() {
								YAHOO.util.DD.superclass.applyConfig.call(this);
								this.scroll = (this.config.scroll !== false);
				},
				b4MouseDown: function(A) {
								this.setStartPosition();
								this.autoOffset(YAHOO.util.Event.getPageX(A), YAHOO.util.Event.getPageY(A));
				},
				b4Drag: function(A) { this.setDragElPos(YAHOO.util.Event.getPageX(A), YAHOO.util.Event.getPageY(A)); },
				toString: function() { return ("DD " + this.id); }
});
YAHOO.util.DDProxy = function(C, A, B) {
				if (C) {
								this.init(C, A, B);
								this.initFrame();
				}
};
YAHOO.util.DDProxy.dragElId = "ygddfdiv";
YAHOO.extend(YAHOO.util.DDProxy, YAHOO.util.DD, {
				resizeFrame: true,
				centerFrame: false,
				createFrame: function() {
								var B = this,
												A = document.body;
								if (!A || !A.firstChild) { setTimeout(function() { B.createFrame(); }, 50); return; }
								var F = this.getDragEl(),
												E = YAHOO.util.Dom;
								if (!F) {
												F = document.createElement("div");
												F.id = this.dragElId;
												var D = F.style;
												D.position = "absolute";
												D.visibility = "hidden";
												D.cursor = "move";
												D.border = "2px solid #aaa";
												D.zIndex = 999;
												D.height = "25px";
												D.width = "25px";
												var C = document.createElement("div");
												E.setStyle(C, "height", "100%");
												E.setStyle(C, "width", "100%");
												E.setStyle(C, "background-color", "#ccc");
												E.setStyle(C, "opacity", "0");
												F.appendChild(C);
												A.insertBefore(F, A.firstChild);
								}
				},
				initFrame: function() { this.createFrame(); },
				applyConfig: function() {
								YAHOO.util.DDProxy.superclass.applyConfig.call(this);
								this.resizeFrame = (this.config.resizeFrame !== false);
								this.centerFrame = (this.config.centerFrame);
								this.setDragElId(this.config.dragElId || YAHOO.util.DDProxy.dragElId);
				},
				showFrame: function(E, D) {
								var C = this.getEl();
								var A = this.getDragEl();
								var B = A.style;
								this._resizeProxy();
								if (this.centerFrame) { this.setDelta(Math.round(parseInt(B.width, 10) / 2), Math.round(parseInt(B.height, 10) / 2)); } this.setDragElPos(E, D);
								YAHOO.util.Dom.setStyle(A, "visibility", "visible");
				},
				_resizeProxy: function() {
								if (this.resizeFrame) {
												var H = YAHOO.util.Dom;
												var B = this.getEl();
												var C = this.getDragEl();
												var G = parseInt(H.getStyle(C, "borderTopWidth"), 10);
												var I = parseInt(H.getStyle(C, "borderRightWidth"), 10);
												var F = parseInt(H.getStyle(C, "borderBottomWidth"), 10);
												var D = parseInt(H.getStyle(C, "borderLeftWidth"), 10);
												if (isNaN(G)) { G = 0; }
												if (isNaN(I)) { I = 0; }
												if (isNaN(F)) { F = 0; }
												if (isNaN(D)) { D = 0; }
												var E = Math.max(0, B.offsetWidth - I - D);
												var A = Math.max(0, B.offsetHeight - G - F);
												H.setStyle(C, "width", E + "px");
												H.setStyle(C, "height", A + "px");
								}
				},
				b4MouseDown: function(B) {
								this.setStartPosition();
								var A = YAHOO.util.Event.getPageX(B);
								var C = YAHOO.util.Event.getPageY(B);
								this.autoOffset(A, C);
				},
				b4StartDrag: function(A, B) { this.showFrame(A, B); },
				b4EndDrag: function(A) { YAHOO.util.Dom.setStyle(this.getDragEl(), "visibility", "hidden"); },
				endDrag: function(D) {
								var C = YAHOO.util.Dom;
								var B = this.getEl();
								var A = this.getDragEl();
								C.setStyle(A, "visibility", "");
								C.setStyle(B, "visibility", "hidden");
								YAHOO.util.DDM.moveToEl(B, A);
								C.setStyle(A, "visibility", "hidden");
								C.setStyle(B, "visibility", "");
				},
				toString: function() { return ("DDProxy " + this.id); }
});
YAHOO.util.DDTarget = function(C, A, B) { if (C) { this.initTarget(C, A, B); } };
YAHOO.extend(YAHOO.util.DDTarget, YAHOO.util.DragDrop, { toString: function() { return ("DDTarget " + this.id); } });
YAHOO.register("dragdrop", YAHOO.util.DragDropMgr, { version: "2.3.1", build: "541" });
YAHOO.util.Attribute = function(B, A) {
				if (A) {
								this.owner = A;
								this.configure(B, true);
				}
};
YAHOO.util.Attribute.prototype = {
				name: undefined,
				value: null,
				owner: null,
				readOnly: false,
				writeOnce: false,
				_initialConfig: null,
				_written: false,
				method: null,
				validator: null,
				getValue: function() { return this.value; },
				setValue: function(F, B) {
								var E;
								var A = this.owner;
								var C = this.name;
								var D = { type: C, prevValue: this.getValue(), newValue: F };
								if (this.readOnly || (this.writeOnce && this._written)) { return false; }
								if (this.validator && !this.validator.call(A, F)) { return false; }
								if (!B) { E = A.fireBeforeChangeEvent(D); if (E === false) { return false; } }
								if (this.method) { this.method.call(A, F); } this.value = F;
								this._written = true;
								D.type = C;
								if (!B) { this.owner.fireChangeEvent(D); }
								return true;
				},
				configure: function(B, C) {
								B = B || {};
								this._written = false;
								this._initialConfig = this._initialConfig || {};
								for (var A in B) { if (A && YAHOO.lang.hasOwnProperty(B, A)) { this[A] = B[A]; if (C) { this._initialConfig[A] = B[A]; } } }
				},
				resetValue: function() { return this.setValue(this._initialConfig.value); },
				resetConfig: function() { this.configure(this._initialConfig); },
				refresh: function(A) { this.setValue(this.value, A); }
};
(function() {
				var A = YAHOO.util.Lang;
				YAHOO.util.AttributeProvider = function() {};
				YAHOO.util.AttributeProvider.prototype = {
								_configs: null,
								get: function(C) { this._configs = this._configs || {}; var B = this._configs[C]; if (!B) { return undefined; } return B.value; },
								set: function(D, E, B) { this._configs = this._configs || {}; var C = this._configs[D]; if (!C) { return false; } return C.setValue(E, B); },
								getAttributeKeys: function() { this._configs = this._configs; var D = []; var B; for (var C in this._configs) { B = this._configs[C]; if (A.hasOwnProperty(this._configs, C) && !A.isUndefined(B)) { D[D.length] = C; } } return D; },
								setAttributes: function(D, B) { for (var C in D) { if (A.hasOwnProperty(D, C)) { this.set(C, D[C], B); } } },
								resetValue: function(C, B) { this._configs = this._configs || {}; if (this._configs[C]) { this.set(C, this._configs[C]._initialConfig.value, B); return true; } return false; },
								refresh: function(E, C) {
												this._configs = this._configs;
												E = ((A.isString(E)) ? [E] : E) || this.getAttributeKeys();
												for (var D = 0, B = E.length; D < B; ++D) { if (this._configs[E[D]] && !A.isUndefined(this._configs[E[D]].value) && !A.isNull(this._configs[E[D]].value)) { this._configs[E[D]].refresh(C); } }
								},
								register: function(B, C) { this.setAttributeConfig(B, C); },
								getAttributeConfig: function(C) { this._configs = this._configs || {}; var B = this._configs[C] || {}; var D = {}; for (C in B) { if (A.hasOwnProperty(B, C)) { D[C] = B[C]; } } return D; },
								setAttributeConfig: function(B, C, D) {
												this._configs = this._configs || {};
												C = C || {};
												if (!this._configs[B]) {
																C.name = B;
																this._configs[B] = this.createAttribute(C);
												} else { this._configs[B].configure(C, D); }
								},
								configureAttribute: function(B, C, D) { this.setAttributeConfig(B, C, D); },
								resetAttributeConfig: function(B) {
												this._configs = this._configs || {};
												this._configs[B].resetConfig();
								},
								subscribe: function(B, C) { this._events = this._events || {}; if (!(B in this._events)) { this._events[B] = this.createEvent(B); } YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments); },
								on: function() { this.subscribe.apply(this, arguments); },
								addListener: function() { this.subscribe.apply(this, arguments); },
								fireBeforeChangeEvent: function(C) {
												var B = "before";
												B += C.type.charAt(0).toUpperCase() + C.type.substr(1) + "Change";
												C.type = B;
												return this.fireEvent(C.type, C);
								},
								fireChangeEvent: function(B) { B.type += "Change"; return this.fireEvent(B.type, B); },
								createAttribute: function(B) { return new YAHOO.util.Attribute(B, this); }
				};
				YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();
(function() {
				var D = YAHOO.util.Dom,
								F = YAHOO.util.AttributeProvider;
				YAHOO.util.Element = function(G, H) { if (arguments.length) { this.init(G, H); } };
				YAHOO.util.Element.prototype = {
								DOM_EVENTS: null,
								appendChild: function(G) {
												G = G.get ? G.get("element") : G;
												this.get("element").appendChild(G);
								},
								getElementsByTagName: function(G) { return this.get("element").getElementsByTagName(G); },
								hasChildNodes: function() { return this.get("element").hasChildNodes(); },
								insertBefore: function(G, H) {
												G = G.get ? G.get("element") : G;
												H = (H && H.get) ? H.get("element") : H;
												this.get("element").insertBefore(G, H);
								},
								removeChild: function(G) {
												G = G.get ? G.get("element") : G;
												this.get("element").removeChild(G);
												return true;
								},
								replaceChild: function(G, H) {
												G = G.get ? G.get("element") : G;
												H = H.get ? H.get("element") : H;
												return this.get("element").replaceChild(G, H);
								},
								initAttributes: function(G) {},
								addListener: function(K, J, L, I) {
												var H = this.get("element");
												I = I || this;
												H = this.get("id") || H;
												var G = this;
												if (!this._events[K]) { if (this.DOM_EVENTS[K]) { YAHOO.util.Event.addListener(H, K, function(M) { if (M.srcElement && !M.target) { M.target = M.srcElement; } G.fireEvent(K, M); }, L, I); } this.createEvent(K, this); } YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
								},
								on: function() { this.addListener.apply(this, arguments); },
								subscribe: function() { this.addListener.apply(this, arguments); },
								removeListener: function(H, G) { this.unsubscribe.apply(this, arguments); },
								addClass: function(G) { D.addClass(this.get("element"), G); },
								getElementsByClassName: function(H, G) { return D.getElementsByClassName(H, G, this.get("element")); },
								hasClass: function(G) { return D.hasClass(this.get("element"), G); },
								removeClass: function(G) { return D.removeClass(this.get("element"), G); },
								replaceClass: function(H, G) { return D.replaceClass(this.get("element"), H, G); },
								setStyle: function(I, H) { var G = this.get("element"); if (!G) { return this._queue[this._queue.length] = ["setStyle", arguments]; } return D.setStyle(G, I, H); },
								getStyle: function(G) { return D.getStyle(this.get("element"), G); },
								fireQueue: function() { var H = this._queue; for (var I = 0, G = H.length; I < G; ++I) { this[H[I][0]].apply(this, H[I][1]); } },
								appendTo: function(H, I) {
												H = (H.get) ? H.get("element") : D.get(H);
												this.fireEvent("beforeAppendTo", { type: "beforeAppendTo", target: H });
												I = (I && I.get) ? I.get("element") : D.get(I);
												var G = this.get("element");
												if (!G) { return false; }
												if (!H) { return false; }
												if (G.parent != H) { if (I) { H.insertBefore(G, I); } else { H.appendChild(G); } } this.fireEvent("appendTo", { type: "appendTo", target: H });
								},
								get: function(G) { var I = this._configs || {}; var H = I.element; if (H && !I[G] && !YAHOO.lang.isUndefined(H.value[G])) { return H.value[G]; } return F.prototype.get.call(this, G); },
								setAttributes: function(L, H) { var K = this.get("element"); for (var J in L) { if (!this._configs[J] && !YAHOO.lang.isUndefined(K[J])) { this.setAttributeConfig(J); } } for (var I = 0, G = this._configOrder.length; I < G; ++I) { if (L[this._configOrder[I]]) { this.set(this._configOrder[I], L[this._configOrder[I]], H); } } },
								set: function(H, J, G) { var I = this.get("element"); if (!I) { this._queue[this._queue.length] = ["set", arguments]; if (this._configs[H]) { this._configs[H].value = J; } return; } if (!this._configs[H] && !YAHOO.lang.isUndefined(I[H])) { C.call(this, H); } return F.prototype.set.apply(this, arguments); },
								setAttributeConfig: function(G, I, J) { var H = this.get("element"); if (H && !this._configs[G] && !YAHOO.lang.isUndefined(H[G])) { C.call(this, G, I); } else { F.prototype.setAttributeConfig.apply(this, arguments); } this._configOrder.push(G); },
								getAttributeKeys: function() { var H = this.get("element"); var I = F.prototype.getAttributeKeys.call(this); for (var G in H) { if (!this._configs[G]) { I[G] = I[G] || H[G]; } } return I; },
								createEvent: function(H, G) {
												this._events[H] = true;
												F.prototype.createEvent.apply(this, arguments);
								},
								init: function(H, G) { A.apply(this, arguments); }
				};
				var A = function(H, G) {
								this._queue = this._queue || [];
								this._events = this._events || {};
								this._configs = this._configs || {};
								this._configOrder = [];
								G = G || {};
								G.element = G.element || H || null;
								this.DOM_EVENTS = { "click": true, "dblclick": true, "keydown": true, "keypress": true, "keyup": true, "mousedown": true, "mousemove": true, "mouseout": true, "mouseover": true, "mouseup": true, "focus": true, "blur": true, "submit": true };
								var I = false;
								if (YAHOO.lang.isString(H)) { C.call(this, "id", { value: G.element }); }
								if (D.get(H)) {
												I = true;
												E.call(this, G);
												B.call(this, G);
								}
								YAHOO.util.Event.onAvailable(G.element, function() { if (!I) { E.call(this, G); } this.fireEvent("available", { type: "available", target: G.element }); }, this, true);
								YAHOO.util.Event.onContentReady(G.element, function() { if (!I) { B.call(this, G); } this.fireEvent("contentReady", { type: "contentReady", target: G.element }); }, this, true);
				};
				var E = function(G) { this.setAttributeConfig("element", { value: D.get(G.element), readOnly: true }); };
				var B = function(G) {
								this.initAttributes(G);
								this.setAttributes(G, true);
								this.fireQueue();
				};
				var C = function(G, I) {
								var H = this.get("element");
								I = I || {};
								I.name = G;
								I.method = I.method || function(J) { H[G] = J; };
								I.value = I.value || H[G];
								this._configs[G] = new YAHOO.util.Attribute(I, this);
				};
				YAHOO.augment(YAHOO.util.Element, F);
})();
YAHOO.register("element", YAHOO.util.Element, { version: "2.3.1", build: "541" });
YAHOO.register("utilities", YAHOO, { version: "2.3.1", build: "541" });
IP.control.Validate = {};
IP.control.Validate.CLASSNAME_PREFIX = '__';
IP.control.Validate.isEmpty = function(s) { var regexpWhitespace = /^\s+$/; var stringS = new String(s); return ((s === null) || (stringS.length === 0) || regexpWhitespace.test(s)); };
IP.control.Validate.isPopulated = function(s) { return !IP.control.Validate.isEmpty(s); };
IP.control.Validate.isAlpha = function(s) { var regexpAlphabetic = /^[a-zA-Z\s]+$/; return regexpAlphabetic.test(s); };
IP.control.Validate.isAlphaNum = function(s) { var validChars = /^[\w\s]+$/; return validChars.test(s); };
IP.control.Validate.isDate = function(s) { s = s.replace(/-/g, '/'); var testDate = new Date(s); return !isNaN(testDate); };
IP.control.Validate.isEmail = function(s) { var regexpEmail = /^[A-Z0-9!#$%&'*+-/=?^`_{}|~.]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/; return regexpEmail.test(s.toUpperCase()); };
IP.control.Validate.isPhone = function(s) {
				var stripped = s.replace(/[\(\)\.\-\ +]/g, '');
				s = new String(s);
				return (!isNaN(stripped) && s.length >= 7);
};
IP.control.Validate.isURL = function(s) { var regexpURL = /^((https?):\/\/){1}(([\d\w]|%[a-fA-f\d]{2,2})+(([\d\w]|%[a-fA-f\d]{2,2})+)?)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/; return regexpURL.test(s); };
IP.control.Validate.isInteger = function(s) { var regexp = /^[-]?\d+$/; return regexp.test(s); };
IP.control.Validate.isFloat = function(s) { return !isNaN(parseFloat(s)); };
IP.control.Validate.isLongerThan = function(s, longerThan) { longerThan = parseInt(longerThan); return new String(s).length > longerThan; };
IP.control.Validate.isShorterThan = function(s, shorterThan) { shorterThan = parseInt(shorterThan); return new String(s).length < shorterThan; };
IP.control.Validate.isLength = function(s, testLength) { testLength = parseInt(testLength); return s.length == testLength; };
IP.control.Validate.isLengthBetween = function(s, params) { var low = parseInt(params[0]); var high = parseInt(params[1]); return (s.length >= low && s.length <= high); };
IP.control.Validate.isWithoutSpaces = function(s) { return s.indexOf(" ") === -1; };
IP.control.Validate.isGreaterThan = function(n, value) { value = parseFloat(value); return n > value; };
IP.control.Validate.isLessThan = function(n, value) { value = parseFloat(value); return n < value; };
IP.control.Validate.isEqualTo = function(n, value) { value = parseFloat(value); return n == value; };
IP.control.Validate.isValueBetween = function(n, params) { var low = parseFloat(params[0]); var high = parseFloat(params[1]); return (n >= low && s <= high); };
(function() {
				var cards = new Array();
				cards[0] = { name: "Visa", length: "13,16", prefixes: "4", checkdigit: true };
				cards[1] = { name: "MasterCard", length: "16", prefixes: "51,52,53,54,55", checkdigit: true };
				cards[2] = { name: "DinersClub", length: "14,16", prefixes: "300,301,302,303,304,305,36,38,55", checkdigit: true };
				cards[3] = { name: "CarteBlanche", length: "14", prefixes: "300,301,302,303,304,305,36,38", checkdigit: true };
				cards[4] = { name: "AmEx", length: "15", prefixes: "34,37", checkdigit: true };
				cards[5] = { name: "Discover", length: "16", prefixes: "6011,650", checkdigit: true };
				cards[6] = { name: "JCB", length: "15,16", prefixes: "3,1800,2131", checkdigit: true };
				cards[7] = { name: "enRoute", length: "15", prefixes: "2014,2149", checkdigit: true };
				cards[8] = { name: "Solo", length: "16,18,19", prefixes: "6334, 6767", checkdigit: true };
				cards[9] = { name: "Switch", length: "16,18,19", prefixes: "4903,4905,4911,4936,564182,633110,6333,6759", checkdigit: true };
				cards[10] = { name: "Maestro", length: "16", prefixes: "5020,6", checkdigit: true };
				cards[11] = { name: "VisaElectron", length: "16", prefixes: "417500,4917,4913", checkdigit: true };
				var ccErrorNo = 0;
				var ccErrors = new Array();
				ccErrors[0] = "Unknown card type.";
				ccErrors[1] = "No card number provided.";
				ccErrors[2] = "Credit card number is in invalid format.";
				ccErrors[3] = "Credit card number is invalid.";
				ccErrors[4] = "Credit card number has an inappropriate number of digits.";
				var checkCreditCard = function(cardnumber, cardname) {
								var cardType = -1;
								var cardCount = cards.length;
								for (var i = 0; i < cardCount; i++) { if (cardname.toLowerCase() == cards[i].name.toLowerCase()) { cardType = i; break; } }
								if (cardType == -1) { ccErrorNo = 0; return false; }
								if (cardnumber.length === 0) { ccErrorNo = 1; return false; }
								cardnumber = cardnumber.replace(/\s/g, "");
								var cardNo = cardnumber;
								var cardexp = /^[0-9]{13,19}$/;
								if (!cardexp.exec(cardNo)) { ccErrorNo = 2; return false; }
								var cardNoLength = cardNo.length;
								if (cards[cardType].checkdigit) {
												var checksum = 0;
												var mychar = "";
												var j = 1;
												var calc;
												for (i = cardNoLength - 1; i >= 0; i--) {
																calc = Number(cardNo.charAt(i)) * j;
																if (calc > 9) {
																				checksum = checksum + 1;
																				calc = calc - 10;
																}
																checksum = checksum + calc;
																if (j == 1) { j = 2; } else { j = 1; }
												}
												if (checksum % 10 !== 0) { ccErrorNo = 3; return false; }
								}
								var LengthValid = false;
								var PrefixValid = false;
								var undefined;
								var prefix = new Array();
								var lengths = new Array();
								prefix = cards[cardType].prefixes.split(",");
								var prefixLength = prefix.length;
								for (i = 0; i < prefixLength; i++) { var exp = new RegExp("^" + prefix[i]); if (exp.test(cardNo)) { PrefixValid = true; } }
								if (!PrefixValid) { ccErrorNo = 3; return false; }
								lengths = cards[cardType].length.split(",");
								var lengthsCount = lengths.length;
								for (j = 0; j < lengthsCount; j++) { if (cardNoLength == lengths[j]) { LengthValid = true; } }
								if (!LengthValid) { ccErrorNo = 4; return false; }
								return true;
				};
				IP.control.Validate.getCreditCardErrorMessage = function() { return ccErrors[ccErrorNo]; };
				IP.control.Validate.isVisaCreditCardNumber = function(number) { return checkCreditCard(number, 'Visa'); };
				IP.control.Validate.isMasterCardCreditCardNumber = function(number) { return checkCreditCard(number, 'MasterCard'); };
				IP.control.Validate.isAmericanExpressCardCreditCardNumber = function(number) { return checkCreditCard(number, 'AmEx'); };
})();
IP.control.Validate.SETTING_PREFIX = '__';
IP.control.Validate.PARAM_BEGIN = ':';
IP.control.Validate.getCustomSettings = function(element) {
				var classNames = YAHOO.lang.trim(element.className).split(' ');
				var customSettings = {};
				var classNamesLength = classNames.length;
				for (var i = 0; i < classNamesLength; i++) {
								var className = YAHOO.lang.trim(classNames[i]);
								if (className.indexOf(IP.control.Validate.SETTING_PREFIX) === 0) {
												var keyAndValues = className.split(IP.control.Validate.PARAM_BEGIN);
												if (keyAndValues.length > 1) { customSettings[keyAndValues[0]] = keyAndValues[1]; } else { customSettings[keyAndValues[0]] = true; }
								}
				}
				return customSettings;
};
IP.control.AutoValidator = (function() {
				return {
								_formValidators: new Array(),
								init: function() {
												var formCount = document.forms.length;
												var formValidatorCount = this._formValidators.length;
												for (var i = 0; i < formCount; i++) {
																var formElement = document.forms[i];
																if ($D.hasClass(formElement, '__validate')) {
																				var cfg = { validateEvent: "submit", autoParseForm: true, breakOnFirstError: false, invalidCallback: function() { alert($loc("Form is invalid. Please fix errors and submit again.")); } };
																				if (formElement.id && IP.control.FormValidator.OverrideValidationProfiles && IP.control.FormValidator.OverrideValidationProfiles[formElement.id]) {
																								var formOverrides = IP.control.FormValidator.OverrideValidationProfiles[formElement.id];
																								cfg = YAHOO.lang.merge(cfg, formOverrides);
																				}
																				this._formValidators[formValidatorCount] = new IP.control.FormValidator(formElement, cfg);
																				formValidatorCount++;
																}
												}
								},
								getFormValidator: function(formElement) {
												var validator = null;
												var formCount = this._formValidators.length;
												for (var i = 0; i < formCount; i++) { var formValidator = this._formValidators[i]; if (formValidator.element == formElement) { validator = formValidator; break; } }
												return validator;
								}
				};
})();
$E.onDOMReady(IP.control.AutoValidator.init, IP.control.AutoValidator, true);
IP.control.FormValidator = function(el, config) {
				if (el) {
								if (YAHOO.lang.isString(el)) { el = $(el); }
								if (el.nodeName.toUpperCase() == "FORM") { this.init(el, config); } else { throw "el is not a valid FORM element"; }
				}
};
IP.control.FormValidator.prototype = {
				_el: null,
				_fieldValidators: null,
				init: function(el, config) {
								this.element = el;
								this._fieldValidators = new Array();
								this.cfg = config || {};
								$E.on(this.element, this.cfg.validateEvent, this._onValidationEventHandler, this, true);
								if (this.cfg.autoParseForm) { this._parseElement(this.element); }
				},
				_parseElement: function(el) {
								if (el.nodeType != 1) { return; }
								var tagName = el.tagName.toUpperCase();
								if (tagName == "INPUT" || tagName == 'SELECT' || tagName == 'TEXTAREA' || tagName == 'DIV') {
												var configHash = this._getFieldValidatorConfigHash(el);
												if (!YAHOO.lang.isUndefined(configHash) && (!el.type || el.type.toUpperCase() != 'PASSWORD')) { this._fieldValidators[this._fieldValidators.length] = new IP.control.FieldValidator(el, configHash); } else if (el.type && el.type.toUpperCase() == 'PASSWORD') { this._fieldValidators[this._fieldValidators.length] = new IP.control.PasswordFieldValidator(el, configHash); }
								}
								var childNodeCount = el.childNodes.length;
								for (var ii = 0; ii < childNodeCount; ii++) { this._parseElement(el.childNodes[ii]); }
				},
				_getFieldValidatorConfigHash: function(el) {
								var settings = IP.control.Validate.getCustomSettings(el);
								var configHash;
								if (IP.control.FieldValidator.ValidationProfiles) { configHash = IP.control.FieldValidator.ValidationProfiles[settings['__validateProfile']]; }
								if (settings.__required) {
												configHash = configHash || {};
												configHash.required = settings.__required;
								}
								if (el.id && IP.control.FieldValidator.OverrideValidationProfiles && IP.control.FieldValidator.OverrideValidationProfiles[el.id]) {
												configHash = configHash || {};
												var fieldOverrides = IP.control.FieldValidator.OverrideValidationProfiles[el.id];
												var mergedValidate = fieldOverrides.validate;
												if (fieldOverrides.validate && configHash.validate) { mergedValidate = YAHOO.lang.merge(configHash.validate, fieldOverrides.validate); }
												configHash = YAHOO.lang.merge(configHash, fieldOverrides);
												configHash.validate = mergedValidate;
								}
								return configHash;
				},
				_onValidationEventHandler: function(e) {
								if (!this.isValid()) {
												$E.stopEvent(e);
												this.cfg.invalidCallback();
												document.body.scrollTop = 0;
								} else {
												if (this.cfg.supressSubmit) { $E.stopEvent(e); }
												if (this.cfg.validCallback) { this.cfg.validCallback(); }
								}
				},
				_run: function() {
								this._isValid = true;
								var fieldValidatorCount = this._fieldValidators.length;
								for (var i = 0; i < fieldValidatorCount; i++) { if (!this._fieldValidators[i].isValid()) { this._isValid = false; if (this.cfg.breakOnFirstError) { break; } } }
								if (this._isValid && YAHOO.lang.isFunction(this.cfg.customValidation)) { this._isValid = this.cfg.customValidation(this.element); }
								if (this._isValid) { for (var ii = 0; ii < fieldValidatorCount; ii++) { this._fieldValidators[ii].removeExampleValue(); } }
				},
				isValid: function() { this._run(); return this._isValid; },
				getFieldValidator: function(fieldElement) {
								var validator = null;
								var fieldCount = this._fieldValidators.length;
								for (var i = 0; i < fieldCount; i++) { var fieldValidator = this._fieldValidators[i]; if (fieldValidator.element == fieldElement) { validator = fieldValidator; break; } }
								return validator;
				}
};
IP.control.FieldValidator = function(el, config) {
				if (el) {
								if (YAHOO.lang.isString(el)) { el = $(el); }
								if (el.nodeName) { this.init(el, config); }
				}
};
IP.control.FieldValidator.prototype = {
				_el: null,
				_isValid: null,
				_transformedValue: null,
				_isRequired: null,
				init: function(el, config) {
								this.element = el;
								this._tagName = this.element.tagName.toUpperCase();
								this._inputType = this._tagName == "INPUT" ? this.element.type.toUpperCase() : "";
								this._initConfiguration(config);
								this._initDefaultValue();
								this._initEventHandling();
				},
				_initConfiguration: function(config) {
								this.cfg = config || {};
								var validCallback = function() {
												this._showStatus(true);
												this._hideHints();
								};
								var invalidCallback = function(errorMessages) {
												this._showStatus(false);
												this._showHints(errorMessages);
								};
								this.cfg.validateEvent = this.cfg.validateEvent || this.getDefaultValidationEvent();
								this.cfg.validCallback = this.cfg.validCallback || validCallback;
								this.cfg.invalidCallback = this.cfg.invalidCallback || invalidCallback;
								this.cfg.custom = this.cfg.customValidation || null;
				},
				_initDefaultValue: function() { if (this.cfg.exampleValue) { this._setExampleValue(this.cfg.exampleValue); } },
				_initEventHandling: function() {
								$E.on(this.element, this.cfg.validateEvent, this._onValidationEventHandler, this, true);
								if ((this._tagName == "INPUT" && this._inputType == "TEXT") || this._tagName == "TEXTAREA") { $E.on(this.element, "keyup", this._onIntermediateValidationEventHandler, this, true); }
								$E.on(this.element, "focus", function() { this._isValid = null; }, this, true);
				},
				_setExampleValue: function(exampleText) {
								if (((this._tagName == "INPUT" && this._inputType == "TEXT") || this._tagName == "TEXTAREA") && !IP.control.FieldValidator.trim(this.element.value)) {
												$D.addClass(this.element, 'example-value');
												this._exampleText = exampleText;
												this.element.value = exampleText;
												$E.on(this.element, 'focus', this.removeExampleValue, this, true);
												this._displayingExampleValue = true;
								}
				},
				removeExampleValue: function() {
								if (this._displayingExampleValue) {
												$D.removeClass(this.element, 'example-value');
												this.element.value = "";
												$E.removeListener(this.element, 'focus', this.removeExampleValue);
												this._displayingExampleValue = false;
								}
				},
				_onValidationEventHandler: function(e) { this._run(); },
				_onIntermediateValidationEventHandler: function(e) { this._run(true); },
				_run: function(isIntermediate) {
								this._isValid = false;
								var resetExampleValue = false;
								if (this._displayingExampleValue) {
												resetExampleValue = true;
												this.removeExampleValue();
								}
								if (!isIntermediate) { this.filter(); }
								var errorMessages = new Array();
								try {
												this._require();
												if (!IP.control.Validate.isEmpty(this.element.value)) {
																this._constrain();
																var inflatedValue = this._inflate();
																this._validate(inflatedValue);
																if (YAHOO.lang.isFunction(this.cfg.custom)) { this.cfg.custom(this.element); }
												}
								} catch (e) {
												if (e.validationException) {
																if (!this.cfg.custom_error_message) { errorMessages = e.messages; } else { errorMessages = [this.cfg.custom_error_message]; }
												} else { throw e; }
								}
								this._isValid = (errorMessages.length === 0);
								if (this._isValid) { if (this.element.value) { this.cfg.validCallback.call(this); } } else if (!this._isValid && !isIntermediate) { this.cfg.invalidCallback.call(this, errorMessages); }
								if (resetExampleValue) { this._setExampleValue(this.cfg.exampleValue); }
				},
				filter: function() { if (this.element.type == "text" || this.element.type == "textarea") { this.element.value = YAHOO.lang.trim(this.element.value); } },
				_require: function() {
								if (this.cfg.requiredIf) {
												if (this.cfg.requiredIf() && !this.testRequired(this.element)) { throw { validationException: true, phase: "require", messages: [$loc("This field is required.")] }; }
												return;
								}
								if (this.isRequired()) {
												if (this.cfg.required === true) { if (!this.testRequired(this.element)) { throw { validationException: true, phase: "require", messages: [$loc("This field is required.")] }; } } else if (this.cfg.required == "all") { if (!this.testAllRequired(this.element)) { throw { validationException: true, phase: "require", messages: [$loc("All items in this section are required.")] }; } } else if (YAHOO.lang.isNumber(parseInt(this.cfg.required))) { if (!this.testXRequired(this.element, parseInt(this.cfg.required))) { throw { validationException: true, phase: "require", messages: [$loc("At least [_1] required.", [parseInt(this.cfg.required)])] }; } }
								}
				},
				_constrain: function() { var constraintType = this.cfg.constrain; var currentLang = iThenticate.currentLang(); var constraint = IP.control.FieldValidator.constraintTests[constraintType]; if (constraint) { if (!constraint.fn(this.element.value)) { throw { validationException: true, phase: "constrain", messages: [constraint.message[currentLang]] }; } } },
				_inflate: function() {
								var value = this.element.value;
								if (this.cfg.constrain == 'float') { value = parseFloat(value); } else if (this.cfg.constrain == 'integer') { value = parseInt(value); } else { value = new String(value); }
								return value;
				},
				_validate: function(inflatedValue) {
								var validationTestStack = this._getValidationTestStack();
								var errorMessages = new Array();
								var errorMessageCount = 0;
								var validationTestCount = validationTestStack.length;
								for (var i = 0; i < validationTestCount; i++) {
												var validationTest = validationTestStack[i];
												if (!validationTest.test.fn(inflatedValue, validationTest.params)) {
																errorMessages[errorMessageCount] = validationTest.test.message(validationTest.params);
																errorMessageCount++;
												}
								}
								if (errorMessages.length > 0) { throw { validationException: true, phase: "validation", messages: errorMessages }; }
				},
				isValid: function() {
								if (this._isValid === null) { this._run(); }
								return this._isValid;
				},
				isRequired: function() {
								if (this._isRequired === null) { this._isRequired = this.cfg.required && (this.cfg.required === true || this.cfg.required == "all" || YAHOO.lang.isNumber(parseInt(this.cfg.required))) ? true : false; }
								return this._isRequired;
				},
				_getValidationTestStack: function() {
								if (!this._validationTestStack) {
												this._validationTestStack = new Array();
												var validationTestCount = 0;
												var tests = this.cfg.validate;
												for (var testName in tests) {
																var testParameter = tests[testName];
																var testDetails = IP.control.FieldValidator.validationTests[testName];
																if (testDetails) {
																				this._validationTestStack[validationTestCount] = { name: testName, test: testDetails, params: testParameter };
																				validationTestCount++;
																}
												}
								}
								return this._validationTestStack;
				},
				_showStatus: function(isValid) {
								var statusIcon = document.getElementByHandle("statusIcon", this.element.parentNode, "SPAN");
								if (!statusIcon) {
												statusIcon = document.createElement("SPAN");
												statusIcon.setAttribute("class", "_statusIcon");
												this.element.parentNode.appendChild(statusIcon);
								}
								if (isValid) { $D.replaceClass(this.element.parentNode, "ip_invalid_field", "ip_valid_field"); } else { $D.replaceClass(this.element.parentNode, "ip_valid_field", "ip_invalid_field"); }
				},
				_showHints: function(errorMessages) {
								var hintList = document.getElementByHandle("hint", this.element.parentNode, "UL");
								if (!hintList) {
												hintList = document.createElement("UL");
												hintList.setAttribute("class", "_hint");
												var statusIcon = document.getElementByHandle("statusIcon", this.element.parentNode, "SPAN");
												if (statusIcon) { statusIcon.parentNode.insertBefore(hintList, statusIcon.nextSibling); }
								} else { hintList.innerHTML = ""; }
								var errorMessageCount = errorMessages.length;
								for (var i = 0; i < errorMessageCount; i++) {
												var newMessage = document.createElement("LI");
												newMessage.innerHTML = errorMessages[i];
												hintList.appendChild(newMessage);
								}
				},
				_hideHints: function() { var hintList = document.getElementByHandle("hint", this.element.parentNode, "UL"); if (hintList) { hintList.innerHTML = ""; } },
				testRequired: function(element) {
								var validator = IP.control.Validate;
								switch (element.tagName.toUpperCase()) {
												case "INPUT":
																var inputType = element.getAttribute("type");
																if (!inputType) { inputType = 'text'; }
																switch (inputType.toLowerCase()) {
																				case "checkbox":
																								return element.checked;
																								break;
																				case "radio":
																								return element.checked;
																								break;
																				default:
																								return !validator.isEmpty(element.value);
																}
																break;
												case "SELECT":
																if (element.selectedIndex == -1) { return false; } else { return !validator.isEmpty(element.options[element.selectedIndex].value); }
																break;
												case "TEXTAREA":
																return !validator.isEmpty(element.value);
																break;
												default:
																return this.testXRequired(element, 1);
																break;
								}
								return true;
				},
				testXRequired: function(element, numRequired) {
								if (element.nodeType != 1) { return false; }
								var tagName = element.tagName.toUpperCase();
								var validator = IP.control.Validate;
								if (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT") { var value = this.getElementValue(element); if (!validator.isEmpty(value)) { return true; } }
								var numFilled = 0;
								var childNodeCount = element.childNodes.length;
								for (var i = 0; i < childNodeCount; i++) { if (this.testXRequired(element.childNodes[i], 1)) { numFilled++; if (numFilled >= numRequired) { return true; } } }
								return false;
				},
				testAllRequired: function(element) {
								if (element.nodeType != 1) { return true; }
								var tagName = element.tagName.toUpperCase();
								var validator = IP.control.Validate;
								if (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT") { var value = this.getElementValue(element); if (validator.isEmpty(value)) { return false; } }
								var childNodeCount = element.childNodes.length;
								for (var i = 0; i < childNodeCount; i++) { if (!this.testAllRequired(element.childNodes[i])) { return false; } }
								return true;
				},
				getDefaultValidationEvent: function() {
								if (this._tagName == "DIV" || this._tagName == "SELECT" || this._tagName == "CHECKBOX") { return 'change'; } else { return 'blur'; }
				},
				getElementValue: function(element) {
								var value = null;
								if (element && element.tagName) {
												if (element.tagName.toUpperCase() == "INPUT") {
																var inputType = element.getAttribute("type");
																if (!inputType) { inputType = 'text'; }
																switch (inputType.toLowerCase()) {
																				case "checkbox":
																								value = element.checked ? element.value : null;
																								break;
																				case "radio":
																								var radioGroup = element.form[element.name];
																								var radioGroupCount = radioGroup.length;
																								var valueCount = 0;
																								for (var i = 0; i < radioGroupCount; i++) {
																												if (radioGroup[i].checked) {
																																if (!value) { value = new Array(); }
																																value[valueCount] = radioGroup[i].value;
																																valueCount++;
																												}
																								}
																								break;
																				default:
																								value = element.value;
																								break;
																}
												} else if (element.tagName.toUpperCase() == "SELECT") {
																if (element.selectedIndex != -1) { value = element.options[element.selectedIndex].value; } else { value = null; }
												} else if (element.tagName.toUpperCase() == "TEXTAREA") { value = element.value; } else if (element.tagName.toUpperCase() == "OPTION") { value = element.selected === true ? element.value : ""; }
								}
								return value;
				}
};
IP.control.FieldValidator.trim = function trim(str) {
				s = str.replace(/^(\s)*/, '');
				s = s.replace(/(\s)*$/, '');
				return s;
};
IP.control.FieldValidator.requireTests = { "required": { fn: IP.control.Validate.isPopulated, message: "This field is required." }, "required": { fn: IP.control.Validate.isPopulated, message: "This field is required." }, "required": { fn: IP.control.Validate.isPopulated, message: "This field is required." } };
IP.control.FieldValidator.constraintTests = { "alpha": { fn: IP.control.Validate.isAlpha, message: { en_us: "Please use only letters.", ko: "Please use only letters." }, }, "email": { fn: IP.control.Validate.isEmail, message: { en_us: "This does not appear to be a valid email address.", ko: "이는 유효한 이메일이 아닌 듯합니다." }, }, "url": { fn: IP.control.Validate.isURL, message: { en_us: "This does not appear to be a valid url.", ko: "This does not appear to be a valid url." }, }, "phone": { fn: IP.control.Validate.isPhone, message: { en_us: "This does not appear to be a valid phone number", ko: "This does not appear to be a valid phone number" }, }, "integer": { fn: IP.control.Validate.isInteger, message: { en_us: "This does not appear to be a valid integer.", ko: "This does not appear to be a valid integer." }, }, "float": { fn: IP.control.Validate.isFloat, message: { en_us: "This does not appear to be a valid email address", ko: "This does not appear to be a valid email address" }, }, "alphanum": { fn: IP.control.Validate.isAlphaNum, message: { en_us: "Please use alpha-numeric characters only [a-z 0-9].", ko: "Please use alpha-numeric characters only [a-z 0-9]." }, }, "date": { fn: IP.control.Validate.isDate, message: { en_us: "This does not appear to be a valid date.", ko: "This does not appear to be a valid date." }, } };
IP.control.FieldValidator.validationTests = { "string_length_longer_than": { fn: IP.control.Validate.isLongerThan, message: function(a) { return 'Input must be longer than ' + a + ' characters.'; } }, "string_length_shorter_than": { fn: IP.control.Validate.isShorterThan, message: function(a) { return 'Input must be shorter than ' + a + ' characters.'; } }, "string_length_length": { fn: IP.control.Validate.isLength, message: function(a) { return 'Input must be ' + a + ' characters.'; } }, "string_length_between": { fn: IP.control.Validate.isLengthBetween, message: function(a) { return 'Input must be between ' + a[0] + ' and ' + a[1] + ' characters in length.'; } }, "nospaces": { fn: IP.control.Validate.isWithoutSpaces, message: function(a) { return "Input cannot contain spaces."; } }, "number_greater_than": { fn: IP.control.Validate.isGreaterThan, message: function(a) { return 'Value must be greater than ' + a; } }, "number_less_than": { fn: IP.control.Validate.isLessThan, message: function(a) { return 'Value must be less than ' + a; } }, "number_equal_to": { fn: IP.control.Validate.isEqualTo, message: function(a) { return 'Value must be equal to ' + a; } }, "number_value_between": { fn: IP.control.Validate.isValueBetween, message: function(a) { return 'Value must be between ' + a[0] + ' and ' + a[1]; } } };
IP.control.PasswordFieldValidator = function(el, config) { IP.control.PasswordFieldValidator.superclass.constructor.call(this, el, config); };
YAHOO.extend(IP.control.PasswordFieldValidator, IP.control.FieldValidator);
IP.control.PasswordFieldValidator.prototype._initEventHandling = function(el, config) {
				IP.control.PasswordFieldValidator.superclass._initEventHandling.call(this);
				$E.on(this.element, 'keypress', this._checkCapsLockStatus, this, true);
				$E.on(this.element, 'blur', this._hideCapsLockWarning, this, true);
};
IP.control.PasswordFieldValidator.prototype._checkCapsLockStatus = function(e) {
				var charcode = $E.getCharCode(e);
				var usingShift = false;
				if (e.shiftKey) { usingShift = e.shiftKey; } else if (e.modifiers) { usingShift = !!(e.modifiers & 4); }
				if (((charcode >= 65 && charcode <= 90) && !usingShift) || ((charcode >= 97 && charcode <= 122) && usingShift)) { this._showCapsLockWarning(); } else { this._hideCapsLockWarning(); }
};
IP.control.PasswordFieldValidator.prototype._showCapsLockWarning = function() {
				if (this.element.parentNode && !IP.Util.usingSafari()) { $D.addClass(this.element.parentNode, 'caps_lock_warning'); }
				this.element.title = 'It appears that your keyboard\'s CAPS LOCK is currently on.';
};
IP.control.PasswordFieldValidator.prototype._hideCapsLockWarning = function() {
				if (this.element.parentNode && !IP.Util.usingSafari()) { $D.removeClass(this.element.parentNode, 'caps_lock_warning'); }
				this.element.title = '';
};
IP.control.FieldValidator.ValidationProfiles = { 'FolderName': { validate: { string_length_shorter_than: 200, string_length_longer_than: 0 } }, 'Author': { validate: { string_length_shorter_than: 200, string_length_longer_than: 0 } }, 'DocTitle': { validate: { string_length_shorter_than: 501, string_length_longer_than: 0 } }, 'Email': { constrain: 'email', validate: { string_length_shorter_than: 254, string_length_longer_than: 5 } } };