var onYouTubeIframeAPIReady = null;
var jsEditor = null;
window.addEventListener('load', function () {
  // iframeを最大サイズに
  (function ($iframe) {
    var w = $iframe.parent().width();
    $iframe.width(w);
    $iframe.height(w/3*2>>0);
  })($('iframe#item-embed-iframe'));

  // CodeMirror
  jsEditor = CodeMirror.fromTextArea(document.getElementById('item-embed-editor'), {
		mode: "javascript",
		lineNumbers: true,
		scrollbarStyle: 'simple',
		indentUnit: 4,
		indentWithTabs: true,
		matchBrackets: true,
		autoCloseBrackets: true,
		foldGutter: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		extraKeys: {
			'Ctrl-Q': function(cm){ cm.foldCode(cm.getCursor()); },
      'Ctrl-Enter': runWithSessionStorage
		},
		foldOptions: {
			rangeFinder: CodeMirror.fold.auto,
			widget: "✧⟣❃⟢✧",
			minFoldSize: 1,
			scanUp: false
		},
		keyMap: 'sublime'
	});
  jsEditor.setValue(document.getElementById('item-embed-code').textContent);
  jsEditor.on('change', function (cm, change) {
    $('button[data-query="sync"]').removeClass('disabled');
  });

  (function () {
    task();
    window.addEventListener('resize', task);
    function task() {
      var height = window.innerHeight;
      jsEditor.setSize(null, height);
    }
  })();

  // Sync this code
  $('button[data-query="sync"]').on('click', function () {
    $.post('private.php', {
      id: stageInfo.ScriptID,
      code: jsEditor.getValue()
    }, function (data, textStatus, xhr) {
      if (data) {
        alert(data);
      } else {
        document.getElementById('item-embed-iframe').src = '/embed/?type=stage&id='+stageInfo.StageID;
        updateInfo();
      }
    });
  });

  function runWithSessionStorage (cm) {
    var key = 'restaging_code';
    var code = cm.getValue();
    sessionStorage.setItem(key, code);
    document.getElementById('item-embed-iframe').src = '/embed/?type=local&id='+stageInfo.StageID+'&key=' + key;
  }

  function updateInfo() {
    $.post('info.php', {
      id: stageInfo.ScriptID
    }, function (data) {
      var info = JSON.parse(data);
      $('.info-latest-update').text(info.Updated);
      jsEditor.setValue(info.RawCode);
      $('button[data-query="sync"]').addClass('disabled');
    });
  }
});
