<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Project';
  protected $fillable = ['title', 'description', 'thumbnail', 'is_active', 'State', 'Written'];
  protected $primaryKey = 'ID';

  public function scripts()
  {
    return $this->hasMany('App\Script', 'ProjectID');
  }

  public function stages()
  {
    return $this->hasMany('App\Stage', 'ProjectID');
  }

  public function channel()
  {
    return $this->belongsTo('App\Channel', 'ProjectID');
  }

  public function isOwner($user)
  {
    return $this->UserID === $user->ID;
  }
}
