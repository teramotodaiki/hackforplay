<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Project';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $primaryKey = 'ID';

  public function scripts()
  {
    return $this->hasMany('App\Script', 'ProjectID');
  }
}
