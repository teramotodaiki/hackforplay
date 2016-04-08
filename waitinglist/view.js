$(function () {
  $('.flex-container-bar').on('click', function () {
    var opened = $(this).toggleClass('opened').hasClass('opened');

  });

  $('.query-publish').on('click', function () {
    var id = $(this).data('id');
    var self = $(this);
    $.post('../stages/', {
      id: id,
      data: JSON.stringify({
        State: 'published',
        Published: null
      })
    }, function (data) {
      switch (data) {
        case 'success':
          self.off('click').parents('.flex-container-bar').fadeOut('slow');
          break;
        default:
          console.error(data);
      }
    });
    return false;
  });

});
