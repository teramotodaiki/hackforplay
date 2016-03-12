/**
 * Post query generater. ===> /activity/name
 * Make __PostActivity property in global.
*/
$(function () {
	Object.defineProperty(window, '__PostActivity', {
		get: function () { return _query; }
	});
	var _query = function (name, row) {
		row.Path = row.Path || '/activity/'+name+'.php';
		enqueue(row);
	};
	var _interval = 1000;
	(function task () {
		var fetch = dequeue(), count = 0;
		if (fetch.length === 0) { setTimeout(task, _interval); }
		fetch.map(function (row) {
			return row.Path;
		}).filter(function (path, index, pathList) {
			return index === pathList.indexOf(path);
		}).forEach(function (path, index, pathList) {
			var list = fetch.filter(function (row) { return row.Path === path; });
			$.post(path, { list: JSON.stringify(list) }, function(data, textStatus, xhr) {
				// Success
				console.log(data);
				if (data === 'NG') {
					enqueue(list);
				}
			}).fail(function () {
				enqueue(list); // retry sending
				console.error('failed to post');
			}).always(function () {
				count ++;
				if (count === pathList.length)
					setTimeout(task, _interval); // All tasks finished
			});
		});
	})();

	var _key = 'activity-param-queue';
	function enqueue () {
		var json = localStorage.getItem(_key);
		var queue = json ? ($.parseJSON(json) || []) : [];
		var input = arguments.length === 1 && arguments[0] instanceof Array ? arguments[0] :
		arguments.length > 0 ? Array.prototype.slice.call(arguments) : [];
		queue = queue.concat(input);
		localStorage.setItem(_key, JSON.stringify(queue));
	}
	function dequeue (max) {
		max = max || 1000;
		var json = localStorage.getItem(_key);
		var queue = json ? ($.parseJSON(json) || []) : [];
		var fetch = queue.splice(0, Math.min(queue.length, max));
		localStorage.setItem(_key, JSON.stringify(queue));
		return fetch;
	}
});
