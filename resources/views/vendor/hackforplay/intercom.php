<?php
/**
 * intercom http://intercom.io
*/
// Name
$intercom_param = array(
  'app_id' => 'j0tzgnz4'
);

// Check a right from User.IsSupported
if (isset($_SESSION['UserID'])) {
  $stmt = $dbh->prepare('SELECT "ID","Nickname" FROM "User" WHERE "ID"=:id AND "IsSupported"=:true');
  $stmt->bindValue(':id', $_SESSION['UserID'], PDO::PARAM_INT);
  $stmt->bindValue(':true', true, PDO::PARAM_INT);
  $stmt->execute();
  $user  = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($user) {
    $intercom_param['name'] = $user['Nickname'];
    $intercom_param['user_id']  = $user['ID'];
    $intercom_param['user_hash']  = hash_hmac("sha256", $user['ID'], "vnRDDu1tFolqA4fdIs3mkBbQxdImtjCGTahW0cbP");
  } else {
    // Unauthorized supporting
    unset($intercom_param);
  }
} else {
  unset($intercom_param);
}

// Fetch more information if supported
if (isset($intercom_param)) {
  // Email
  $stmt = $dbh->prepare('SELECT "Email" FROM "Account" WHERE "UserID"=:id AND "Type"=:hackforplay AND "State"=:connected');
  $stmt->bindValue(':id', $_SESSION['UserID'], PDO::PARAM_INT);
  $stmt->bindValue(':hackforplay', 'hackforplay', PDO::PARAM_STR);
  $stmt->bindValue(':connected', 'connected', PDO::PARAM_STR);
  $stmt->execute();
  if ($email  = $stmt->fetch(PDO::FETCH_COLUMN)) {
    $intercom_param['Email']  = $email;
  }
  // Sign-in timestamp
  $stmt = $dbh->prepare('SELECT "Timestamp" FROM "Sessions" WHERE "ID"=:id');
  $stmt->bindValue(':id', $_COOKIE['PHPSESSID'], PDO::PARAM_STR);
  $stmt->execute();
  if ($timestamp  = (int)$stmt->fetch(PDO::FETCH_COLUMN)) {
    $intercom_param['Timestamp']  = $timestamp;
  }
}
?>
<?php if (isset($intercom_param)) : ?>
<script>
// for Logged-in user
window.intercomSettings = <?php echo json_encode($intercom_param); ?>;
</script>
<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/j0tzgnz4';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>
<?php endif; ?>
