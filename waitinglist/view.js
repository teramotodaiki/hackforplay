$(function () {
  $('.flex-container-bar').on('click', '.column,.blank', function () {
    var bar = $(this).parents('.flex-container-bar');
    bar.toggleClass('opened');
  });

  $('.query-publish').on('click', function () {
    var id = $(this).data('id');
    var self = $(this);
    $.post('../stages/', {
      id: id,
      query: 'state',
      state: 'published'
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
