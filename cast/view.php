<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><?php echo $channel['ChName']; ?></title>
    <?php require_once '../library.php' ?>
    <style media="screen">
    .container-cast {
      max-width: 600px;
    }
    .flex-container {
      display: flex;
      justify-content: center;
      align-items: baseline;

      width: 100%;
      text-align: center;
      margin: 10px 0px;
    }
    .flex-container>* {
      flex: 0 0 auto;
      padding: 0px 10px;
    }
    .cast-frame-wrapper {
      background-color: black;
      width: 600px;
      height: 400px;
    }
    </style>
  </head>
  <body>
    <?php require_once '../analyticstracking.php' ?>
    <div class="container container-cast">
      <div class="flex-container">
        <h2><?php echo $channel['ChName']; ?></h2>
        <h4><span class="text-muted"><?php echo $channel['CoName']; ?></span></h4>
      </div>
      <div class="cast-frame-wrapper">
      </div>
      <div class="flex-container">
        <h4><a href="/m/?id=<?php echo $user['ID']; ?>" target="_blank"><?php echo $user['Nickname']; ?></a> is casting now.</h4>
        <h4><a href="#"><span class="glyphicon glyphicon-refresh"></span></a></h4>
      </div>
    </div>
  </body>
</html>
