$(function () {

  // Query of delete
  $('.query-on-click').on('click', function () {
    var $elem = $(this);
    switch ($elem.data('query')) {
      case 'delete':
        if (window.confirm('CAUTION: Are you sure you want to KICK OUT ' + $elem.data('nickname') + '?')) {
          $.post('../auth/deleteconnectioninteam.php', {
            userid: $elem.data('userid'),
            team: $elem.data('team')
          }, function () {
            alert($elem.data('nickname') + ' was kicked out');
            $elem.parents('.flex-container').remove();
          });
        }
        break;
      default:
        break;
    }
  });

});
