<?php
// main and begining page
// $is_beta = 1; // This is a BETA VERSION. Turn into 0 to be the official ver!

// 1.Preparation
require_once 'preload.php';

// 2.Sign in or sign up
// require_once 'signin.php';

// 3.Enumrate cleared stage
// require_once 'cleared.php';

// 4.Get playable stages
// $stage_limit = 6;
// require_once 'getstages.php';

//
// require_once 'c/challengetoday.php';

// 5.Get errored code
// require_once 'getcodes.php';

// 4.Load main page html
include('view/main.php');
?>