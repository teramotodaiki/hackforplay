$(function () {

  // Query of delete
  $('.query-on-click').on('click', function () {
    var $elem = $(this);
    switch ($elem.data('query')) {
      case 'delete':
        $.post('../auth/deleteconnectionincommunity.php', {
          userid: $elem.data('userid'),
          communityid: $elem.data('communityid')
        });
        break;
      default:
        break;
    }
  });

});
