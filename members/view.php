<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Members - <?php echo $community['DisplayName']; ?></title>
    <?php require_once '../library.php' ?>
    <style media="screen">
    .flex-container {
      display: flex;
      align-items: baseline;
      padding: 0px 30px;
    }
    .flex-container>* {
      flex: 1 1 auto;
      max-width: 200px;
    }
    </style>
  </head>
  <body>
  	<?php require_once '../externalcodes.php'; ?>
  	<?php require_once '../view/header.php'; ?>
    <script src="view.js"></script>
    <div class="container">
      <h1><?php echo $community['DisplayName']; ?></h1>
      <?php foreach ($UCMap as $key => $user) : ?>
        <div class="panel panel-default flex-container">
          <h4>
            <a href="/m/?id=<?php echo $user['UserID']; ?>" target="_blank">
              <?php echo $user['Nickname']; ?>
              <span class="glyphicon glyphicon-new-window"></span>
            </a>
          </h4>
          <a href="/dashboard/?id=<?php echo $user['UserID']; ?>" target="_blank">
            Dashboard
            <span class="glyphicon glyphicon-new-window"></span>
          </a>
          <a class="query-on-click" data-query="delete" href="javascript:void(0);"
          data-userid="<?php echo $user['UserID']; ?>"
          data-communityid="<?php echo $community['ID']; ?>">
            DELETE
          </a>
        </div>
      <?php endforeach; ?>
    </div>
  </body>
</html>
