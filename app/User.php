<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'User';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $primaryKey = 'ID';
  protected $hidden = ['remember_token', 'private_token', 'private_secret'];

  public function accounts()
  {
    return $this->hasMany('App\Account', 'UserID');
  }

  public function teams()
  {
    return $this->belongsToMany('App\Team', 'UserTeamMap', 'UserID', 'TeamID')
    ->withPivot('Enabled');
  }

  public function authors()
  {
    return $this->hasMany('App\Author');
  }

  public function plugs()
  {
    return $this->hasManyThrough('App\Plug', 'App\Author');
  }

  public function isConnected($team)
  {
    $connection = $this->teams
    ->where('ID', $team->ID)
    ->first();

    return $connection !== NULL && $connection->pivot->Enabled;
  }

}
