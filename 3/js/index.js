window.arCAB = (function (params) {
	params.message = params.message || '';
	params.delay = params.delay || 0;
	params.delay *= 1000;

	function pubSub(myObject) {
		// Storage for topics that can be broadcast
		// or listened to
		var topics = {};

		// An topic identifier
		var subUid = -1;

		// Publish or broadcast events of interest
		// with a specific topic name and arguments
		// such as the data to pass along
		myObject.publish = function (topic, args) {
			if (!topics[topic]) {
				return false;
			}

			var subscribers = topics[topic],
				len = subscribers ? subscribers.length : 0;

			while (len--) {
				subscribers[len].func(topic, args);
			}

			return this;
		};

		// Subscribe to events of interest
		// with a specific topic name and a
		// callback function, to be executed
		// when the topic/event is observed
		myObject.subscribe = function (topic, func) {
			if (!topics[topic]) {
				topics[topic] = [];
			}

			var token = ( ++subUid ).toString();
			topics[topic].push({
				token: token,
				func: func
			});
			return token;
		};

		// Unsubscribe from a specific
		// topic, based on a tokenized reference
		// to the subscription
		myObject.unsubscribe = function (token) {
			for (var m in topics) {
				if (topics[m]) {
					for (var i = 0, j = topics[m].length; i < j; i++) {
						if (topics[m][i].token === token) {
							topics[m].splice(i, 1);
							return token;
						}
					}
				}
			}
			return this;
		};

		return myObject;
	}

	var k = window, f = document, j = f.body, g, l, m;
	f.addEventListener ? (l = function (a, b, c) {
		a.addEventListener(b, c, !1)
	}, m = function (a, b, c) {
		a.removeEventListener(b, c, !1)
	}) : f.attachEvent && (l = function (a, b, c) {
		a.attachEvent("on" + b, c)
	}, m = function (a, b, c) {
		a.detachEvent("on" + b, c)
	});
	g = {
		rnd: Math.round(1E6 * Math.random()),
		addListener: l,
		removeListener: m,
		getCookie: function (a) {
			return (a = f.cookie.match("(^|;) ?" + a + "=([^;]*)(;|$)")) ? unescape(a[2]) : null
		},
		setCookie: function (a, b) {
			f.cookie = a + "=1; expires=" + b.toGMTString() + "; path=/"
		},
		getScreenDim: function () {
			var a = {}, b = f.documentElement, c = "CSS1Compat" == f.compatMode;
			a.cw = c && b.clientWidth || self.innerWidth || j.clientWidth;
			a.ch = c && b.clientHeight || self.innerHeight || j.clientHeight;
			return a
		}
	};

	var h = {},
	e = function () {};
	e.factory = function (a) {
		return new this[a]
	};
	e.Adblock = function () {};
	e.Adblock.prototype = {
		insertElements: function (a) {
			var b = f.createElement("span"), c = j.childNodes.length;
			b.innerHTML = a;
			j.insertBefore(b, j.childNodes[c - 1])
		},
		check: function (success, fail) {
			var b = "AD_CONTROL_28 feed_links_ad_container inner-advert-row".split(" "),
					c = b.length, d, e = "", g;
			for (d = 0; d < c; d += 1)f.getElementById(b[d]) || (e += '<a id="' + b[d] + '"></a>');
			this.insertElements(e);
			setTimeout(function () {
				for (d = 0; d < c; d += 1) {
					if (
						g = f.getElementById(b[d]), null === g.offsetParent || 
						-1 !== (
							k.getComputedStyle 
							? f.defaultView.getComputedStyle(g, null).getPropertyValue("display").indexOf("none")
							: g.currentStyle.display.indexOf("none")
						)
					) {
						success();
						return;
					}
				}
				fail();
			}, 300)
		}
	};
	e.ArRequestBlock = function () {};
	e.ArRequestBlock.prototype = {
		ph: "arKS" + g.rnd,
		url: "//ad.adriver.ru/cgi-bin/erle.cgi?sid=211574&bt=62&rnd=![rnd]&tail256=unknown&tuid=-5944727788",
		//url: "//web-tst2.test.x/cgi-bin/erle.cgi?sid=211443&bt=62&ad=477363&pid=2220293&bid=4277648&bn=4277648&rnd=![rnd]&tail256=unknown&tuid=-5944727788",
		//url: "//projects.a.fedotov.x/other/check-ad-blocker/src/js/reply.js?",
		loadScript: function (a, b) {
			try {
				var c = f.getElementsByTagName("head")[0], d = f.createElement("script");
				d.setAttribute("type", "text/javascript");
				d.setAttribute("charset", "windows-1251");
				d.setAttribute("src", a.split("![rnd]").join(g.rnd));
				d.onreadystatechange = function () {
					/loaded|complete/.test(this.readyState) && (b(), d.onload = d.onerror = null, c.removeChild(d))
				};
				d.onload = d.onerror = function () {
					b();
					c.removeChild(d)
				};
				c.insertBefore(d, c.firstChild)
			} catch (e) {}
		},
		check: function (success, fail) {
			this.loadScript(this.url + '&ph=' + this.ph, function () {
				h.hasOwnProperty("reply") ? fail() : success()
			});
		}
	};
	h = {
		success: 0,
		error: 0,
		COOKIENAMESTOP: 'arCAB',
		COOKIENAMEBAN: 'arCABBan',
		checks: ['Adblock', 'ArRequestBlock'],
		makeMessage: function () {
			var a = f.createElement("div"), b = a.style, c = g.getScreenDim(), d = !(!document.all || window.XMLHttpRequest && "CSS1Compat" === document.compatMode);
			a.className = "antiblock";
			a.innerHTML = '<div class="antiblockBG"></div><div class="antiblockMessage"><span class="antiblockClose">&times;</span>' + params.message + '<input type="button" value="Закрыть и больше не показывать"></div>';
			b.position = d ? "absolute" : "fixed";
			b.top = b.left = 0;
			b.width = c.cw + "px";
			b.height = c.ch + "px";
			b.zIndex = 65E3;
			j.appendChild(a);
			g.addListener(a.lastChild, "click", h.closeMessage)
		},
		closeMessage: function (a) {
			var b;
			b = !1;
			a = a || window.event;
			a = a.target || a.srcElement;
			if ("antiblockClose" === a.className || (b = "input" === a.nodeName.toLowerCase()))a.parentNode.parentNode.parentNode.removeChild(a.parentNode.parentNode),
			b && (b = new Date, b.setFullYear(b.getFullYear() + 5), g.setCookie(h.COOKIENAMEBAN, b))
		},
		onFound: function () {
			if (h.success)return false;
			h.success += 1;

			h.publish('found');
			h.makeMessage();
		},
		onNotFound: function () {
			h.error += 1;
			if (h.error === h.checks.length) {
				h.publish('notFound');
			}
		},
		check: function () {
			var adblock = e.factory('Adblock');
			adblock.check(function () {
				h.publish('found:adBlock');
				h.onFound();
			}, function () {
				h.publish('notFound:adBlock');
				h.onNotFound();
				var arRequestBlock = e.factory('ArRequestBlock');
				arRequestBlock.check(function () {
					h.publish('found:requestBlock');
					h.onFound();
				}, function () {
					h.publish('notFound:requestBlock');
					h.onNotFound();
				});
			});
		},
		init: function () {
			if (!navigator.cookieEnabled || g.getCookie(this.COOKIENAMESTOP) || g.getCookie(this.COOKIENAMEBAN)) { return; }

			var now = new Date();
			now.setMilliseconds(now.getMilliseconds() + params.delay);

			g.addListener(k, "load", h.check)
		}
	};
	h.init();

	return pubSub(h);
}({
	message: '<h1>Обнаружено блокирование рекламы на сайте</h1><p>Уважаемые пользователи,</p><p>создатели сайта не желают превращать его в свалку рекламы, но для существования нашего сайта необходим показ нескольких баннеров.</p><p>Просим отнестись с пониманием и добавить сервис в список исключений вашей программы для блокировки рекламы (AdBlock и другие).</p>',
	delay: 30 // сек.
}));
