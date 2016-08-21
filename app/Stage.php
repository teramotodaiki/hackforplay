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
  protected $fillable = ['Title','State','Thumbnail','NoRestage','Explain','is_mod','ImplicitMod'];
  protected $primaryKey = 'ID';
  protected $casts = [
    'UserID' => 'integer',
    'TeamID' => 'integer',
    'ScriptID' => 'integer',
    'ProjectID' => 'integer',
    'SourceID' => 'integer',
    'MajorVersion' => 'integer',
    'MinorVersion' => 'integer',
    'is_clearable' => 'boolean',
    'is_latest' => 'boolean',
    'is_mod' => 'boolean',
  ];

  public function script()
  {
    return $this->belongsTo('App\Script', 'ScriptID');
  }

  public function project()
  {
    return $this->belongsTo('App\Project', 'ProjectID');
  }

  public function user()
  {
    return $this->belongsTo('App\User', 'UserID');
  }

  public function team()
  {
    return $this->belongsTo('App\Team', 'TeamID');
  }

  public function emojis()
  {
    return $this->hasMany('App\Emoji');
  }

  public function plays()
  {
    return $this->hasMany('App\Play');
  }

}
