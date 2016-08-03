<?php
/*
MODをAMDで管理するステージロード(新仕様)コントローラ
Input: type , (id,key|id|token)
type: 改造コードスクリプトの読み込み方法を表すキー文字列 (stage|project)
id: type=stage のとき、ステージのIDを表す数値
token: type=project のとき、プロジェクトトークンの文字列
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

$type	= filter_input(INPUT_GET, 'type') or die('Missing param type. Add "&type=(ses|sta|pro)" to url');

// Get (source) stage ID
switch ($type) {
	case 'code': break;
	case 'stage':
		$id	= filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) or die('Missing param id. Add "&id={STAGE ID}" to url');
		break;
	default:
		die("Invalid type " . htmlspecialchars($type));
		break;
}


if ($type === 'stage') {

// Get source element URL
$stmt	= $dbh->prepare('SELECT "Src","ScriptID","State","UserID","ProjectID","MajorVersion","MinorVersion" FROM "Stage" WHERE "ID"=:id');
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$stage = $stmt->fetch(PDO::FETCH_ASSOC) or die('Stage not found');

// Check authorization
if ($stage['State'] === 'rejected') {
	die('This stage is rejected');
} elseif ($stage['State'] === 'private' && $stage['UserID'] != $session_userid) {
	die('This stage is private');
}

}


// Get project token
switch ($type) {
	case 'stage':
		$stmt = $dbh->prepare('SELECT "Token" FROM "Project" WHERE "ID"=:id');
		$stmt->bindValue(':id', $stage['ProjectID'], PDO::PARAM_INT);
		$stmt->execute();
		$token = $stmt->fetch(PDO::FETCH_COLUMN);
		$version = implode('.', [$stage['MajorVersion'], $stage['MinorVersion']]);
		break;
}

$deps = empty($token) ?
null :
["~project/$token/$version"];

$key = htmlspecialchars(filter_input(INPUT_GET, 'key'));

?>
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
		})();
	</script>
	<script type="text/javascript">
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

	<?php if (isset($deps)) : ?>

	require(<?php echo json_encode($deps, JSON_UNESCAPED_SLASHES); ?>,
		function () {
			Hack.start();
		}
	);

	<?php else : ?>

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
		var key = "<?php echo $key; ?>";
		if (key && localStorage.getItem(key)) {
			try {
				var message = JSON.parse(localStorage.getItem(key));
				window.postMessage(message, '/');
			} catch (e) {

			} finally {
				localStorage.removeItem(key);
			}
		}

	<?php endif; ?>

	});
	</script>
</head>
<body>
	<span class="PixelMplus">A</span>
</body>
</html>
