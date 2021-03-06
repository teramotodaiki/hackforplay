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

Route::get('patch', 'TmpPatchController@migrateOldHackforPlayMods');

// React (frontend) App
Route::get('tutorials', 'DefaultAppController@index');
Route::get('register', 'DefaultAppController@index');
Route::get('news', 'DefaultAppController@index');

Route::group(['middleware' => ['auth.old', 'auth']], function()
{
  Route::get('history', 'DefaultAppController@index');
});


Route::get('verify', 'VerifyController@index');
Route::get('random', 'RandomController@index');

Route::group(['middleware' => ['auth.old', 'auth']], function()
{
  Route::get('users/auth', 'UserController@getAuth');
});

Route::resource('users', 'UserController');

Route::group(['middleware' => 'auth.private'], function()
{
  Route::resource('products', 'ProductController');
});

Route::group(['middleware' => ['auth.old', 'auth']], function()
{
  Route::post('teams/{id}/bells', 'BellController@storeWithTeam')
  ->middleware(['pusher']);
});

Route::group(['middleware' => ['auth.old']], function()
{
  // teams/
  Route::get('users/auth/teams', 'TeamController@indexWithAuthUser')
  ->middleware(['auth']);
  Route::get('users/{id}/teams', 'TeamController@indexWithUser');

  Route::resource('teams', 'TeamController');

  // channels/
  Route::get('channels/{id}/watch', 'DefaultAppController@index');
  Route::get('channels/list', 'DefaultAppController@index')->middleware('auth');

  Route::resource('channels', 'ChannelController');
  Route::resource('channels.chats', 'ChatController');
  Route::get('projects/{id}/channels', 'ChannelController@indexWithProject');

  // bells/
  Route::resource('bells', 'BellController');

});

Route::group(['middleware' => ['auth.old', 'auth']], function()
{
  // qcards
  Route::get('qcards/{id}/edit', 'DefaultAppController@index');
  Route::get('qcards/{id}/view', 'QcardController@view');
  Route::resource('qcards', 'QcardController');

  Route::get('channels/{channel_id}/qcards/create', [ 'uses' => 'QcardController@createWithChannel']);

});

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


// JSON API (With Auth)
Route::group(['prefix' => 'api', 'middleware' => ['auth.old', 'auth']], function()
{
  Route::resource('projects', 'ProjectController');
  Route::resource('authors', 'AuthorController');
  Route::resource('plugs', 'PlugController');
  Route::resource('plays', 'PlayController');

  Route::any('stages/{id}/judge', 'StageController@judge');

  Route::get('records', 'RecordController@index');
  Route::get('records/clear', 'RecordController@clear');

  Route::resource('channels', 'ChannelController');
  Route::resource('channels.chats', 'ChatController');
});

// JSON API
Route::group(['prefix' => 'api', 'middleware' => ['auth.old']], function()
{
  Route::resource('stages', 'StageController');
  Route::get('users/{id}/stages', 'StageController@indexByUser');
  Route::resource('stages.emojis', 'EmojiController');
  Route::post('stages/{id}/plays', 'StageController@play');

  Route::resource('users', 'UserController');
  Route::resource('thumbnails', 'ThumbnailController');

  // 互換性維持のための ~project MOD
  Route::get('mods/~project/{name}/{version}{ext?}', [ 'uses' => 'ModController@showByProject' ])
  ->where('name', '\w+')
  ->where('ext', '\.(js)');

  Route::get('mods/{author}/{label}.js', 'ModController@showByPlug')
  ->where('label', '[a-zA-Z0-9\_][\w\_\-\~\*\.]+')
  ->middleware('etag');

});


// /static
Route::get('static/{path}', 'StaticController@index')
->where('path', '.*')
->middleware('etag');

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
