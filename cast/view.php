<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $channel['ChName']; ?></title>
    <?php require_once '../library.php' ?>
    <style>
    body {
      background-color: rgba(0, 0, 0, 1.0);
    }
    header {
      background-color: rgba(255, 255, 255, 0.5);
      padding: 4px 0px 2px 0px;
    }
    .flex-container {
      display: flex;
      justify-content: center;
      align-items: baseline;
      width: 100%;
    }
    .flex-container>* {
      flex: 0 0 auto;
      padding: 0px 10px;
    }
    .cast-frame-wrapper {
      margin: 0 auto;

      background-color: black;
    }
    .cast-frame-wrapper iframe {
      width: 100%;
      height: 100%;
    }
    </style>
  </head>
  <body>
    <?php require_once '../analyticstracking.php' ?>
    <script type="text/javascript">
    window.channelInfo = {
      id: <?php echo $channel['ID']; ?>,
      type: "project",
      token: "<?php echo $channel['ProjectToken']; ?>",
      update: "<?php echo $channel['Updated']; ?>"

    };
    </script>
    <script src="view.js" charset="utf-8"></script>
    <header class="affix flex-container">
      <span class="relative-DisplayName"><?php echo $channel['ChName']; ?></span>
      <span class="text-muted hidden-xs"><?php echo $channel['CoName']; ?></span>
      <span>
        <a href="/m/?id=<?php echo $user['ID']; ?>" class="relative-Nickname" target="_blank">
          <?php echo $user['Nickname']; ?>
        </a> is casting now.
      </span>
      <a href="javascript:void(0)" class="refresh-on-click update">
        <span class="glyphicon glyphicon-refresh"></span>
      </a>
    </header>
    <div class="cast-frame-wrapper">
    </div>
  </body>
</html>
