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
Route::get('register', 'DefaultAppController@index');
Route::get('verify', 'VerifyController@index');
Route::get('random', 'RandomController@index');

// channels/
Route::get('channels/{id}/watch', 'DefaultAppController@index');
Route::resource('channels', 'ChannelController');

// channels.chats/
Route::resource('channels.chats', 'ChatController');

// users/
Route::resource('users', 'UserController');

// mods/
Route::group(['middleware' => 'etag', 'prefix' => 'mods'], function()
{
  Route::get('~project/{name}/{version}{ext?}', [ 'uses' => 'ModController@showByProject' ])
  ->where('name', '\w+')
  ->where('ext', '\.(js)');

  // 公式(bundle)を使う場合で、バージョン指定子を使わなかった場合(Tmp)
  Route::get('{bundle}{ext}', [ 'uses' => 'ModController@showByProduct' ])
  ->where('ext', '\.(js)');

  Route::get('{bundle}/{version?}{ext?}', [ 'uses' => 'ModController@showByProduct' ])
  ->where('ext', '\.(js)');
});


Route::any('{api}', [ 'uses' => 'Old\OldController@index' ])
->where('api', '/?|[a-z\/]+');

Route::any('{dir}/{file}.php', [ 'uses' => 'Old\OldController@rawphp' ])
->where('dir', '[a-zA-Z0-9\-\_\/]+')
->where('file', '[a-zA-Z0-9\-\_]+');

Route::any('{file}.php', [ 'uses' => 'Old\OldController@rawphproot' ])
->where('file', '[a-zA-Z0-9\-\_]+');

Route::any('{api}.{ext}', [ 'uses' => 'Old\OldController@statics' ])
->where('api', '[a-zA-Z0-9\/\-\_\.\~]+')
->where('ext', 'txt|htm|html|css|js|json|xml|png|jpeg|jpg|gif|ico|mp3|wav')
->middleware('etag');
