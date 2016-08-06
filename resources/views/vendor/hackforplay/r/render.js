(function () {

// インスタンス
var $item = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12 h4p_item').append(
).append(
  $('<div>').addClass('h4p_item-frame h4p_item-transform').append(
    $('<img>').addClass('h4p_item-inner').attr('src', '../img/cassette/inner_tab.png')
  )
).append(
  $('<div>').addClass('h4p_item-frame h4p_item-front h4p_item-transform').append(
    $('<div>').addClass('h4p_item-frame h4p_item-thumbnail').css({
      'top':   41,
      'left':  47,
      'width': 265,
      'height':176,
      'border-top-left-radius': '4px 4px',
      'border-top-right-radius': '4px 4px',
    })
  ).append(
    $('<div>').addClass('h4p_item-frame').css({
      'top':   217,
      'left':   47,
      'width': 265,
      'height':126,
      'padding': '5px 5px',
      'background-color': 'rgb(255,255,255)',
      'border-bottom-left-radius': '12px 12px',
      'border-bottom-right-radius': '4px 4px'
    }).append(
      $('<p>').addClass('title').css('margin', '8px 0').append($('<a>'))
    ).append(
      $('<p>').append($('<span>').addClass('author').html('作成者：<b><a></a></b>'))
    ).append(
      $('<p>').append(
        $('<span>').addClass('playcount').html('プレイ回数：<b>回</b>')
      ).append(
        $('<span>').addClass('clearrate label label-sm').text('0%')
      )
    ).append(
      $('<p>').append($('<span>').addClass('emoji').css('font-size', '90%'))
    )
  )
);
// マウスオーバーイベント
$item.find('.h4p_item-front').hover(function() {
  $(this).parent().find('.h4p_item-inner').attr('src', '../img/cassette/inner_notab.png');
  $(this).parent().find('.h4p_item-transform').addClass('transform-on');
}, function() {
  $(this).parent().find('.h4p_item-inner').attr('src', '../img/cassette/inner_tab.png');
  $(this).parent().find('.h4p_item-transform').removeClass('transform-on');
});


// あまりを詰めるためのアイテム
var $blank = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12 h4p_item h4p_item-blank').append();

window.renderStaegs = function (result) {
  var $list = $('.h4p_stagelist.list-stage');

  if (result.cache) {
    $('.abstruct-pagination').before(
      $('<span>').addClass('alert alert-warning').append(
        'Because of the speed, the caches displayed. '
      ).append(
        '高速化のため、ブラウザにのこっているキャッシュを表示しています.'
      ).append(
        $('<a>').attr({ href: '?1' }).text('あたらしいデータを取得')
      )
    );
  } else {
    $('.abstruct-pagination').toggleClass('abstruct-pagination pagination');
  }
  // pager
  $('.pagination').append(
    $('<li>').addClass('page-item ' + (result.prev_page_url ? '' : ' disabled')).append(
      $('<a>').addClass('page-link').attr({
        href: getUrl({ page: result.current_page - 1 }),
        'aria-label': 'Previous'
      }).append(
        $('<span>').attr('aria-hidden', 'true').addClass('glyphicon glyphicon-chevron-left')
      )
    )
  );
  for (var page = Math.max(1, result.current_page - 4);
        page <= Math.min(result.last_page, result.current_page + 4);
        page++) {
    $('.pagination').append(
      $('<li>').addClass('page-item' + (page === result.current_page ? ' active' : '')).append(
        $('<a>').addClass('page-link').attr('href', getUrl({ page: page })).text(page)
      )
    )
  }
  $('.pagination').append(
    $('<li>').addClass('page-item' + (result.next_page_url ? '' : ' disabled')).append(
      $('<a>').addClass('page-link').attr({
        href: getUrl({ page: result.current_page + 1 }),
        'aria-label': 'Next'
      }).append(
        $('<span>').attr('aria-hidden', 'true').addClass('glyphicon glyphicon-chevron-right')
      )
    )
  );

  result.data.forEach(function(stage){
    setStage(stage);
    var item = $item.clone(true);
    item.find('.h4p_item-thumbnail').on('click', function() {
      location.href = '/s?id=' + stage.id;
    });
    if (stage.thumbnail) {
      item.find('.h4p_item-thumbnail').css('background-image', 'url(' + stage.thumbnail + ')');
    }
    item.find('.title a').attr({
      href: '/s?id=' + stage.id,
      title: stage.title
    }).text(stage.title.length < 25 ? stage.title : stage.title.substr(0, 23) + '…');
    if (stage.user) {
      item.find('.author a').attr({
        href: '/m?id=' + stage.user.id,
        title: stage.user.nickname
      }).text(stage.user.nickname);
    }else{
      item.find('.author').text('いにしえのプログラマー');
    }
    item.find('.playcount b').prepend(stage.playcount);
    var rate = stage.clearcount / stage.playcount;
    item.find('.clearrate').text(
      'クリア率 ' + (rate * 100 >> 0) + '%'
    ).addClass(rateToLabelColor(rate, stage.playcount == 0));

    // emoji summary
    $.ajax({
      type: 'GET',
      url: `/api/stages/${stage.id}/emojis`,
      data: {
        summary: 1,
      },
    })
    .done(function (result) {
      item.find('.emoji').children().remove();
      Object.keys(result).forEach(function (key) {
        item.find('.emoji').append(
          $('<span>').css('margin-right', '.7rem').append(
            $(emojione.shortnameToImage(`:${key}:`))
          ).append(' ' + result[key])
        );
      });
    });

    item.appendTo($list);
  });
  alignmentOnResize();
}

// リサイズ時に変わる数値
window.alignmentOnResize = function () {
  $('.h4p_stagecontainer .container').each(function(index, el) {
    var $con = $(el);
    // あまり
    var column = $con.find('.h4p_stagelist').width() / $con.find('.h4p_item:first').width();
    var itemNum = $con.find('.h4p_item').length;
    var blankNum = $con.find('.h4p_item.h4p_item-blank').length;
    var surplus = (itemNum - blankNum) % column;
    var extraNum = surplus === 0 ? blankNum : blankNum - (column - surplus); // + : 過多、- : 不足
    if (extraNum > 0) {
      for (var i = 0; i < extraNum; i++) {
        $con.find('.h4p_item.h4p_item-blank:first').remove();
      }
    }else if(extraNum < 0){
      extraNum = -extraNum;
      for (var i = 0; i < extraNum; i++) {
        var blank = $blank.clone(true);
        $con.find('.h4p_stagelist').append(blank);
      }
    }

    // 左右の枠
    // [左バー | 中身 | 右バー]の幅 >= containerの幅 ---> はみだすので非表示に
    var entity = $con.find('.h4p_bar-left').width() + $con.find('.h4p_stagelist').width() + $con.find('.h4p_bar-right').width();
    if (entity < $con.width()) {

      // 左右バー表示（高さをentityにあわせる）
      var containerHeight = $con.find('.h4p_stagelist').height();
      $con.find('.h4p_bar-left,.h4p_bar-right').removeClass('hidden').height(containerHeight);

    } else {

      // 左右バー非表示
      $con.find('.h4p_bar-left,.h4p_bar-right').addClass('hidden');

    }

  });
}

window.getUrl = function (params) {
  var merged = $.extend(getCurrentParams(), params);

  var query = Object.keys(merged).filter(function (key) {
    return merged[key] !== null && merged[key] !== '';
  }).map(function (key) {
    return key + '=' + merged[key];
  }).join('&');

  return location.pathname + '?' + query;
}

window.getCurrentParams = function () {
  return {
    page: +urlParam('page', 1),
    show_zero: +urlParam('show_zero', 0),
    q: decodeURIComponent(urlParam('q') || ''),
  };
};

window.urlParam = function (name, _default) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return _default || null;
  }
  else{
     return results[1] || 0;
  }
};

window.rateToLabelColor = function (rate, isZero) {
	return isZero ? 'label-default' :
	rate < 0.15 ? 'label-hard' :
	rate < 0.3 ? 'label-normal' :
	'label-easy';
};


})();
