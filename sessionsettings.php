<?php
// セッション ユーザーID取得
session_cache_limiter('private_no_expire');
session_cache_expire(48 * 60); // 48時間セッション継続
session_set_cookie_params(48 * 60 * 60);
// switch ($_SERVER['SERVER_NAME']) {
// 	case 'hackforplay-staging.azurewebsites.net':
// 		session_save_path('D:\local\Temp\hackforplay-staging');
// 		break;
// 	case 'hackforplay.xyz':
// 		session_save_path('D:\local\Temp\hackforplay');
// 		break;
// }
?>