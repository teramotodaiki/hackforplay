<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Stage';
  public $timestamps = false; // モデルのタイムスタンプを更新しない
  protected $guarded = array('id'); // idはcreateに含まない
  protected $primaryKey = 'ID';

  public function script()
  {
    return $this->belongsTo('App\Script', 'ScriptID');
  }

}
