<?php
try {

  require_once './preload.php';

  throw new Exception("Rollbar detecting test", 1);
    
} catch (Exception $e) {
  Rollbar::report_exception($e);
  var_dump($e);
}


 ?>
