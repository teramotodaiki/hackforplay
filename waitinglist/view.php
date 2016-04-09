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
    <script src="./view.js" charset="utf-8"></script>
    <?php Template::RejectModal($reasons); ?>
    <div class="container">
    <?php foreach ($list as $key => $stage): ?>
      <div class="flex-container flex-container-bar">
        <span class="column">
          <?php Template::UserLink($stage['User']); ?>
        </span>
        <span class="column">
          <?php Template::StageLink($stage); ?>
        </span>
        <span class="column elapsed-timer" data-time="<?php echo $stage['UnixTime']; ?>"></span>
        <span class="blank"></span>
        <a href="#" class="icon toggle-false query-publish" data-id="<?php echo $stage['ID']; ?>">
          <span class="glyphicon glyphicon-ok"></a>
        </span>
        <a href="#" class="icon toggle-false" data-id="<?php echo $stage['ID']; ?>"
          data-toggle="modal" data-target="#rejectModal">
          <span class="icon glyphicon glyphicon-remove"></span>
        </a>
        <div class="inner row flex-container">
          <img class="thumbnail" src="<?php echo $stage['Thumbnail'] ?>" alt="" />
          <p class="column"><?php echo $stage['Explain']; ?></p>
          <pre class="code"><?php echo $stage['Script']['RawCode']; ?></pre>
        </div>
      </div>
    <?php endforeach; ?>
    <?php if (count($list) === 0): ?>
      <h1>There is no stage waiting</h1>
    <?php endif; ?>
    </div>
  </body>
</html>
