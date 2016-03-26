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
    <div class="container">
      <h1><?php echo $community['DisplayName']; ?></h1>
      <?php foreach ($UCMap as $key => $value) : ?>
        <h4><?php echo $value['UserID']; ?></h4>
      <?php endforeach; ?>
    </div>
  </body>
</html>
