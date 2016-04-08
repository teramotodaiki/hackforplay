<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>あそべるプログラミング hackforplay</title>
    <title></title>
    <?php require_once '../library.php'; ?>
    <?php require_once '../template.php'; ?>
  </head>
  <body>
  	<?php require_once '../analyticstracking.php' ?>
  	<?php require_once '../view/authmodal.php'; ?>
  	<?php require_once '../view/header.php'; ?>
    <div class="container">
    <?php foreach ($list as $key => $stage): ?>
      <div class="flex-container flex-container-bar">
        <span class="column">
          <?php Template::UserLink($stage['User']); ?>
        </span>
        <span class="column">
          <?php Template::StageLink($stage); ?>
        </span>
        <span class="column"><?php echo $stage['Registered']; ?></span>
        <span class="blank"></span>
        <span class="icon glyphicon glyphicon-file"></span>
        <span class="icon glyphicon glyphicon-ok"></span>
        <span class="icon glyphicon glyphicon-remove"></span>
      </div>
    <?php endforeach; ?>
    </div>
  </body>
</html>
