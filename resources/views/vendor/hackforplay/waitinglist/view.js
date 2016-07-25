$(function () {
  $('.flex-container-bar').on('click', function () {
    console.log('click', this);
    var bar = $(this).hasClass('flex-container-bar') ? $(this) : $(this).parents('.flex-container-bar');
    var opened = bar.hasClass('opened');
    if (!opened) $('.flex-container-bar').removeClass('opened');
    bar.toggleClass('opened');
  });
  $('.toggle-false').on('click', function () {
    var bar = $(this).parents('.flex-container-bar');
    bar.toggleClass('opened');
  });

  $('.query-publish').on('click', function () {
    var id = $(this).data('id');
    var self = $(this);
    $.ajax({
      type: 'GET',
      url: `/api/stages/${id}/judge`,
      data: {
        state: 'published',
      }
    })
    .done(function (result) {
      if (result.message) {
        alert(result.message);
      } else {
        self.off('click').parents('.flex-container-bar').fadeOut('slow');
      }
    });
    return false;
  });

  (function () {
    var $button; // Deprecated

    $('#rejectModal').on('show.bs.modal', function(event) {
      $button = $(event.relatedTarget);
      $(this).find('input[type="checkbox"]:checked').prop('checked', false);

    }).find('form').submit(function(event) {
      event.preventDefault();

      var reasons = [];
      $(this).find('input[type="checkbox"]:checked').each(function(index, el) {
        reasons.push(el.value);
      });
      var reasons_json = JSON.stringify(reasons);

      var bar = $button.parents('.flex-container-bar');
      var id = $button.data('id');
      var notice = $(this).find('textarea[name="notice"]').val();
      $.ajax({
        type: 'GET',
        url: `/api/stages/${id}/judge`,
        data: {
          state: 'rejected',
          reject_notice: notice,
        },
      })
      .done(function (result) {
        if (result.message) {
          alert(result.message);
        } else {
          bar.fadeOut('slow');
        }
      });
      $('#rejectModal').modal('hide');
    });
  })();

  // Elapsed timer
  (function () {
    var ele = $('.elapsed-timer');
    setInterval(render, 5000);
    render();
    function render () {
      ele.each(function () {
        var elapsed = new Date().getTime() / 1000 - $(this).data('time');
        $(this).text(
          elapsed < 10 ? 'just now' :
          elapsed < 60 ? (elapsed>>0) + ' seconds ago' :
          elapsed < 3600 ? (elapsed/60>>0) + ' minutes ago' :
          elapsed < 86400 ? (elapsed/3600>>0) + ' hours ago' :
          (elapsed/86400>>0) + 'days ago'
        );
      });
    }
  })();

});
