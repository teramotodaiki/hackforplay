<?php
// more view
$is_beta = 1; // This is a BETA VERSION. Turn into 0 to be the official ver!

// 1.Preparation
require_once '../preload.php';

// 2.Sign in or sign up
require_once '../signin.php';

// 3.Enumrate cleared stage
require_once '../cleared.php';

// 4.Get all stages
require_once '../getstages.php';

// 4.Load page html
include('view/main.php');
?>