<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'User';
  protected $primaryKey = 'ID';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  
}
