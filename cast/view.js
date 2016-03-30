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

});
