<?php
/**
 * /modules/(bundle)[/(version)]/(module)[.js]
 * module loader
*/

require_once '../preload.php';

// bundleごとにコントローラを振り分け
$bundle = filter_input(INPUT_GET, 'bundle');

switch ($bundle) {
  case '~project':
    require_once './~project.php';
    break;
  default:
    header('HTTP/1.0 404 Not Found');
    echo "Selected bundle $bundle not found";
    exit;
}

?>
