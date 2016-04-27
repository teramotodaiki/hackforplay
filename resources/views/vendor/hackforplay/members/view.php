<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Members - <?php echo $team['DisplayName']; ?></title>
    <?php require_once '../library.php' ?>
    <style media="screen">
    .flex-container {
      display: flex;
      align-items: baseline;
      padding: 0px 30px;
      justify-content: space-between;;
    }
    .flex-container>* {
      flex: 1 1 auto;
    }
    .flex-container .label {
      flex: 0 1 auto;
    }
    </style>
  </head>
  <body>
  	<?php require_once '../externalcodes.php'; ?>
  	<?php require_once '../view/header.php'; ?>
    <script src="view.js"></script>
    <div class="container">
      <h1><?php echo $team['DisplayName']; ?></h1>
      <?php foreach ($UCMap as $key => $user) : ?>
        <div class="panel panel-default flex-container">
          <h4>
            <a href="/m/?id=<?php echo $user['UserID']; ?>" target="_blank">
              <?php echo $user['Nickname']; ?>
              <span class="glyphicon glyphicon-new-window"></span>
            </a>
          </h4>
          <h5>Join at <?php echo explode(' ', $user['Registered'])[0]; ?></h5>
          <a href="/dashboard/?id=<?php echo $user['UserID']; ?>" target="_blank">
            Dashboard
            <span class="glyphicon glyphicon-new-window"></span>
          </a>
        <?php if ($map['MembershipManagement'] && $user['MembershipEmpowered']) : ?>
          <a class="query-on-click label label-danger" data-query="delete" href="javascript:void(0);"
          data-userid="<?php echo $user['UserID']; ?>"
          data-team="<?php echo $team['ID']; ?>"
          data-nickname="<?php echo $user['Nickname']; ?>">
            DELETE
          </a>
        <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </body>
</html>
