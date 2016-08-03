<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title></title>
	<style type="text/css">
	@font-face {
		font-family: PixelMplus;
		src: url('../build/fonts/PixelMplus/PixelMplus12-Regular.ttf');
	}
	.PixelMplus {
		font-family: PixelMplus;
		visibility: collapse;
		position: absolute;
	}
	body {
		margin: 0;
		background-color: #000;
	}
	textarea.log {
		color: #fff;
		font: bold large PixelMplus, sans-serif;
		border: 3px solid #fff;
		border-radius: 10px;
		padding: 10px;
		margin: 3px;
	}
	</style>
	<script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
	<script type="text/javascript">
	(function () {
			/**
			 * global object
			 * (read only)
			 */
			Object.defineProperty(window, 'Hack', {
				configurable: false,
				enumerable: true,
				writable: false,
				value: {}
			});
			Hack.stageInfo = {
				width: 480,
				height: 320,
			};

			// URL `GET` parameters
			var params = {};
			location.search.substr(1).split('&')
			.map(function (seg) { return seg.split('=').map(decodeURIComponent); })
			.filter(function (parts) { return parts.length === 2 })
			.forEach(function (parts) {
				params[parts[0]] = parts[1];
			});

			Hack.stageInfo.type = params.type || 'code';

			if ('id' in params) {
				Hack.stageInfo.id = params.id;
				var xhttp = new XMLHttpRequest();
				xhttp.open('POST', '/api/stages/' + params.id + '/plays', true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.onload = function () {
					var body = JSON.parse(xhttp.responseText);
					Hack.stageInfo.token = body.token;
				};
				xhttp.send();
			}

	require.config({
		baseUrl : '../mods/',
		shim: {
			'enchantjs/ui.enchant': ['enchantjs/enchant']
		}
	});
	require.onError = function (e) {
		console.error(e);
		if ('Hack' in window && typeof Hack.openExternal === 'function') {
			Hack.openExternal('https://error.hackforplay'+
												'?name='+e.name+
												'&message='+e.message+
												'&line='+(e.line || e.stack.lineNumber || '?')+
												'&column='+(e.column || '?')+
												'&sourceURL='+encodeURIComponent(e.sourceURL || '?'));
		}
	};

	Hack.require = function (dependencies, code) {
			(function (callback) {
				// dependencies
				require(dependencies || [], callback);

			})(function () {
				// main
				var script = new Blob([
				`define(function (require, exports, module) {
					${code}
				});`]);

				require([window.URL.createObjectURL(script)], function () {
					Hack.start();
				});
			});

		delete Hack.require;
	};

	(function (loadFromStage, loadFromCode) {

		switch (Hack.stageInfo.type) {
			case 'stage': return loadFromStage();
			case 'code': return loadFromCode();
		}

	})(function () {
		// loadFromStage
		// Ajax request
		var xhttp = new XMLHttpRequest();
		xhttp.open('GET', '/api/stages/' + Hack.stageInfo.id, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.onload = function () {
			var body = JSON.parse(xhttp.responseText);
			Hack.require([body.implicit_mod], body.script.raw_code);
		};
		xhttp.send();

	}, function () {
		// loadFromCode
		// wait for messaging
		window.addEventListener('message', function task (event) {
			if (event.data.query === 'require') {
				window.removeEventListener('message', task); // listen once
				Hack.require(event.data.dependencies, event.data.code);

				location.reload = function () {
					// local cache
					var key;
					do {
						key = 'cache-' + Math.random().toString(36).substr(2);
					} while (localStorage.getItem(key) !== null);

					localStorage.setItem(key, JSON.stringify({
						dependencies: event.data.dependencies,
						code: event.data.code,
					}));
					location.href = location.origin + location.pathname + '?type=code&key=' + key;
				};
			}
		});

		// load cache
		var key = params.key;
		if (key && localStorage.getItem(key)) {
			try {
				var message = JSON.parse(localStorage.getItem(key));
				window.postMessage(message, '/');
			} catch (e) {

			} finally {
				localStorage.removeItem(key);
			}
		}

	});

	})();
	</script>
</head>
<body>
	<span class="PixelMplus">A</span>
</body>
</html>
