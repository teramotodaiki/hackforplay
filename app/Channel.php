<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Channel';
  protected $guarded = ['id', 'created_at', 'updated_at']; // idはcreateに含まない
  protected $primaryKey = 'ID';

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

  public function chats()
  {
    return $this->hasMany('App\Chat');
  }

  public function qcards()
  {
    return $this->hasMany('App\Qcard');
  }

}
