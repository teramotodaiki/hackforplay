<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Sessions';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $casts = ['ID' => 'integer'];
}
