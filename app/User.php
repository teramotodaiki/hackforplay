<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'User';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $primaryKey = 'ID';

  public function accounts()
  {
    return $this->hasMany('App\Account', 'UserID');
  }

}
