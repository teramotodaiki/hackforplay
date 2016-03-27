<?php
/**
 * intercom http://intercom.io
*/
// Name
$user_name  = '';
if (isset($_SESSION['UserID'])) {
  $stmt = $dbh->prepare('SELECT "Nickname" FROM "User" WHERE "ID"=:id');
  $stmt->bindValue(':id', $_SESSION['UserID'], PDO::PARAM_INT);
  $stmt->execute();
  $user_name  = $stmt->fetch(PDO::FETCH_COLUMN);
}

// Email
$email  = '';
if (isset($_SESSION['UserID'])) {
  $stmt = $dbh->prepare('SELECT "Email" FROM "Account" WHERE "UserID"=:id AND "Type"=:hackforplay AND "State"=:connected');
  $stmt->bindValue(':id', $_SESSION['UserID'], PDO::PARAM_INT);
  $stmt->bindValue(':hackforplay', 'hackforplay', PDO::PARAM_STR);
  $stmt->bindValue(':connected', 'connected', PDO::PARAM_STR);
  $stmt->execute();
  $email  = $stmt->fetch(PDO::FETCH_COLUMN);
}

// Timestamp
$timestamp  = 0;
if (isset($_COOKIE['PHPSESSID'])) {
  $stmt = $dbh->prepare('SELECT "Timestamp" FROM "Sessions" WHERE "ID"=:id');
  $stmt->bindValue(':id', $_COOKIE['PHPSESSID'], PDO::PARAM_STR);
  $stmt->execute();
  $timestamp  = (int)$stmt->fetch(PDO::FETCH_COLUMN);
}
?>
<?php if ($user_name) : ?>
<script>
// for Logged-in user
window.intercomSettings = {
  app_id: "j0tzgnz4",
  name: "<?php echo $user_name; ?>",
  user_id: "<?php echo $_SESSION['UserID']; ?>",
  user_hash: "<?php echo hash_hmac("sha256", $_SESSION['UserID'], "vnRDDu1tFolqA4fdIs3mkBbQxdImtjCGTahW0cbP"); ?>",
  timestamp: <?php echo $timestamp; ?>,
  email: "<?php echo $email; ?>"
};
</script>
<?php else : ?>
<script>
// for Logged-out user
window.intercomSettings = {
  app_id: "j0tzgnz4"
};
</script>
<?php endif; ?>
<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/j0tzgnz4';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>
