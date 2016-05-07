<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


// React (frontend) App
Route::get('tutorials', 'DefaultAppController@index');

Route::any('{api}', [ 'uses' => 'Old\OldController@index' ])
->where('api', '/?|[a-z\/]+');

Route::any('{dir}/{file}.php', [ 'uses' => 'Old\OldController@rawphp' ])
->where('dir', '[a-zA-Z0-9\-\_\/]+')
->where('file', '[a-zA-Z0-9\-\_]+');

Route::any('{file}.php', [ 'uses' => 'Old\OldController@rawphproot' ])
->where('file', '[a-zA-Z0-9\-\_]+');

Route::any('{api}.{ext}', [ 'uses' => 'Old\OldController@statics' ])
->where('api', '[a-zA-Z0-9\/\-\_\.]+')
->where('ext', 'txt|htm|html|css|js|json|xml|png|jpeg|jpg|gif|ico|mp3|wav');
