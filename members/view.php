<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Members - <?php echo $community['DisplayName']; ?></title>
    <?php require_once '../library.php' ?>
  </head>
  <body>
  	<?php require_once '../externalcodes.php'; ?>
  	<?php require_once '../view/header.php'; ?>
    <script src="view.js"></script>
    <div class="container">
      <h1><?php echo $community['DisplayName']; ?></h1>
      <?php foreach ($UCMap as $key => $user) : ?>
        <div class="panel panel-default">
          <div class="panel-body">
            <h4><?php echo $user['Nickname']; ?></h4>
            <a class="query-on-click" data-query="delete" href="javascript:void(0);"
            data-userid="<?php echo $user['UserID']; ?>"
            data-communityid="<?php echo $community['ID']; ?>">
              DELETE
            </a>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </body>
</html>
