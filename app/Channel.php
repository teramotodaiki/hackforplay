<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
  /**
   * http://readouble.com/laravel/5/1/ja/eloquent.html
   */
  protected $table = 'Channel';
  protected $fillable = [
    'DisplayName',
    'description',
    'is_archived',
  ];
  protected $primaryKey = 'ID';
  protected $appends = ['reserved', 'head', 'thumbnail'];
  protected $casts = [
    'ID' => 'integer',
    'TeamID' => 'integer',
    'ProjectID' => 'integer',
    'UserID' => 'integer',
    'is_private' => 'boolean',
    'is_archived' => 'boolean',
  ];

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

  public function getReservedAttribute()
  {
    return $this->project->stages()->orderBy('ID', 'DESC')->first();
  }

  public function getHeadAttribute()
  {
    return $this->project->scripts()->orderBy('ID', 'DESC')->first();
  }

  public function getThumbnailAttribute()
  {
    return $this->project->thumbnail;
  }

}
