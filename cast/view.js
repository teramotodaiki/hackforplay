// ブラウザが通知をサポートしているか確認する
if ("Notification" in window) {
  // すでに通知の許可を得ているか確認する
  // 許可を得ていない場合は、ユーザに許可を求めなければならない
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
$(function () {

  var frame = $('.cast-frame-wrapper iframe').get(0) || $('<iframe>').appendTo('.cast-frame-wrapper').get(0);
  refreshTask(frame);

  $('.refresh-on-click').on('click', refreshTask.bind(this, frame));

  function refreshTask(frame) {
    // 白い点滅を防ぐ
    frame.style.visibility = 'hidden';
    frame.onload = visibleFrame.bind(frame);
    frame.onerror = visibleFrame.bind(frame);
    function visibleFrame () {
      this.style.visibility = 'visible';
    }
    var server = $('.refresh-on-click').hasClass('update');
    if (server) {
      frame.src = '../embed/?type='+channelInfo.type+'&token='+channelInfo.token+'&t='+new Date().getTime();
      $('.refresh-on-click').removeClass('update');
    } else {
      frame.contentWindow.location.reload(true);
    }
  }

  // Frame size optimise
  resizeTask();
  window.addEventListener('resize', resizeTask);

  function resizeTask() {
    var ratio = 2 / 3;
    var h = Math.min($(window).width() * ratio, $(window).height());
    $('.cast-frame-wrapper').height(h).width(h / ratio);
  }

  // Ajax abortAll
  $._reqStack = [];
  $._reqStack.abortAll = function () {
    this.forEach(function (req) { req.abort(); });
    this.splice(0, this.length);
  };
  $.ajaxSetup({
    beforeSend: function(jqXHR) { $._reqStack.push(jqXHR); }, //  annd connection to list
    complete: function(jqXHR) {
      var i = $._reqStack.indexOf(jqXHR);   //  get index for current connection completed
      if (i > -1) $._reqStack.splice(i, 1); //  removes from list by index
    }
  });

  // Polling
  (function polling () {

    $.ajax({
      url: './polling.php',
      cache: false,
      method: 'get',
      type: 'json',
      data: {
        id: channelInfo.id,
        update: channelInfo.update
      }
    }).done(function (data) {
      try {
        var fetch = JSON.parse(data);
        channelInfo.token = fetch.ProjectToken;
        channelInfo.update = fetch.Updated;
        channelInfo.script_id = fetch.Script.ID;
        // 次にrefreshをクリックした時、情報を書き換える
        $('.refresh-on-click').addClass('update').on('click', function render () {
          $('body').remove('click', '.refresh-on-click', render);
          // Update information
          Object.keys(fetch).forEach(function (key) {
            $('.relative-' + key).text(fetch[key]);
          });
          $('.relative-Nickname').attr('src', '/m/?id=' + fetch['UserID']);
        });
        // Notificationを作成
        if (Notification.permission === 'granted') {
          new Notification('あたらしいバージョンが届きました！', {
            body: 'クリックして今すぐプレイしよう'
          }).addEventListener('click', function () {
            $('.refresh-on-click').trigger('click');
          });
          // Auto reload
          if ($('#cast-auto-reload').prop('checked')) {
            $('.refresh-on-click').trigger('click');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(polling, 5000);
      }
    }).fail(function (result, textStatus) {
      if (textStatus === 'abort') return;
      try {
        console.log(JSON.parse(result.responseText));
      } catch (e) {
        console.error(result);
      } finally {
        setTimeout(polling, 5000);
      }
    });

  })();

  // code modal
  $('#codeModal').on('show.bs.modal', function () {
    $.get('../script/', {
      id: channelInfo.script_id
    }, function (data) {
      $('#codeModal pre').text(data);
    });
  });

  $(window).on('beforeunload', function () {
    $._reqStack.abortAll();
  });

});
