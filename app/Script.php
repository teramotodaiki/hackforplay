<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Script extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Script';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $fillable = ['RawCode'];

}
