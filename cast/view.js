// ブラウザが通知をサポートしているか確認する
if ("Notification" in window) {
  // すでに通知の許可を得ているか確認する
  // 許可を得ていない場合は、ユーザに許可を求めなければならない
  if (Notification.permission !== 'default') {
    Notification.requestPermission();
  }
}
$(function () {

  var frame = $('.cast-frame-wrapper iframe').get(0) || $('<iframe>').appendTo('.cast-frame-wrapper').get(0);
  refreshTask(frame);

  $('.refresh-on-click').on('click', refreshTask.bind(this, frame));

  function refreshTask(frame) {
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
        }
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(polling, 1000);
      }
    }).fail(function (data) {
      setTimeout(polling, 1000);
    });

  })();

});
