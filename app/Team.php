<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Team';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $primaryKey = 'ID';
  protected $hidden = [
    'slack_api_token',
    'slack_channel_name',
  ];

  public function bells()
  {
    return $this->hasMany('App\Bell');
  }
}
