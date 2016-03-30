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
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(polling, 1000);
      }
    }).fail(function (data) {
      console.error(data);
      setTimeout(polling, 1000);
    });

  })();

});
