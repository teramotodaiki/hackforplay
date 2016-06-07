<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Channel';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $primaryKey = 'ID';

  public function project()
  {
    return $this->belongsTo('App\Project', 'ProjectID');
  }

}
