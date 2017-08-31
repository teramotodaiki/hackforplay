// Feeles への移行をおこなう
(function() {
  var $body = $(document.body);

  // マイグレーションバーを表示
  if ($('.container.container-game').hasClass('restaging')) {
    // すぐに表示
    document.body.classList.add('recommend-migration');
  } else {
    // beginRestaging が呼ばれた時に表示
    var _beginRestaging = window.beginRestaging;
    window.beginRestaging = function() {
      _beginRestaging();
      document.body.classList.add('recommend-migration');
    };
  }

  // このまま Feeles へ
  function launchFeeles() {
    // とにかくすべての要素を消す
    var duration = 2000;
    var $waste = $('*:not(html):not(body):not(head):not(meta):not(title)')
      .css({
        transitionProperty: 'all',
        transitionDuration: duration + 'ms',
        transitionDelay: '500ms'
      })
      .css({
        opacity: 0,
        transform: 'translateY(' + window.innerHeight + 'px)'
      });
    console.log('waste', $waste);

    setTimeout(function() {
      $waste.remove();
    }, duration);

    // root element
    var rootElement =
      document.querySelector('.h4p__app') ||
      $('<div>').addClass('h4p__app').get(0);
    $(rootElement)
      .css({
        position: 'absolute',
        padding: 0,
        margin: 0,
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1400
      })
      .appendTo($body);

    new Promise(function(resolve, reject) {
      // Feeles コアのロード
      if (window.h4p) {
        resolve();
      } else {
        var script = document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.src = 'https://assets.feeles.com/public/v1119/h4p.js';
        // will export window.h4p
        document.head.appendChild(script);
      }
    })
      .then(function() {
        // make-rpg.json のロード
        return $.ajax('https://make-rpg.hackforplay.xyz/make-rpg.json');
      })
      .then(function(result) {
        // マイグレーション
        var code = jsEditor.getValue();
        console.log('code', code);
        // ゲームのアセット
        code = code.replace(
          '// ( Keep this line -- ここはけさないでね ) //',
          '/*+ モンスター アイテム せっち システム */'
        );
        // マップのアセット
        code = code.replace(
          '// < Keep this line -- ここはけさないでね > //',
          '/*+ マップ */'
        );
        // Hack.openExternal
        code = code.replace(
          /Hack\.openExternal\((.*)\)/g,
          'feeles.openMedia({ playing: true, controls: true, url: $1 })'
        );
        // Hack.openSoundCloud
        code = code.replace(
          /Hack\.openSoundCloud\((.*)\)/g,
          'feeles.openMedia({ playing: true, controls: true, url: $1 })'
        );
        // window.player
        code = code.replace(
          'var player = Hack.player = new Player();',
          'var player = window.player = Hack.player = new Player();'
        );
        // MOD
        code = code.replace(
          /require\([\'\"](.*)[\'\"]\)/g,
          "require('https://hackforplay.xyz/api/mods/$1')"
        );
        // コアモジュールのロード
        code =
          "require('hackforplay/core');\n// require('mod/3d/core');\n" +
          code +
          'module.exports = {\n\t_bundled: true,\n\tgameOnLoad: game.onload,\n\thackOnLoad: Hack.onload\n};';

        result = result.map(function(item) {
          if (item.name === 'game.js') {
            return Object.assign({}, item, {
              text: code
            });
          }
          if (item.name === '.babelrc') {
            const code =
              '{"presets": ["es2015", "stage-3"], "ignore": ["stages/*/code*.js", "enchantjs/enchant.js", "enchantjs/ui.enchant.js", "game.js"]}';
            return Object.assign({}, item, {
              type: 'application/json',
              text: code
            });
          }
          return item;
        });
        console.log('result', result);

        h4p({
          rootElement: rootElement,
          seeds: result
        });
      })
      .catch(function(error) {
        console.error(error);
      });
  }

  // スタイルシート
  $('<style>')
    .text(
      '.feeles-migrate-bar { transform: scaleX(0) } .recommend-migration .feeles-migrate-bar { transform: scaleX(1) }'
    )
    .appendTo($body);

  // 移行を促すバー
  var bar = $('<div>')
    .addClass('feeles-migrate-bar')
    .css({
      position: 'fixed',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      top: 0,
      width: '100%',
      minHeight: 32,
      fontSize: 16,
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#5cb85c',
      zIndex: 10,
      transition: 'transform 400ms ease'
    })
    .append(
      $('<div>').css({
        flex: 1
      })
    )
    .append(
      $('<span>')
        .text('👋 このキットは 2017/9/1 から使えなくなります。あたらしいキットをためしてみませんか？')
        .css({
          cursor: 'pointer'
        })
        .on('click', function() {
          if (confirm('このステージをそのまま あたらしいキット にします')) {
            launchFeeles();
          }
        })
    )
    .append(
      $('<div>').css({
        flex: 1
      })
    )
    .append(
      $('<span>')
        .addClass('glyphicon glyphicon-remove')
        .css({
          paddingRight: 24,
          cursor: 'pointer'
        })
        .on('click', function() {
          bar.remove();
        })
    )
    .appendTo($body);
})();
