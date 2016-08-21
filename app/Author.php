<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
  public $fillable = ['name', 'is_auto'];
  protected $casts = [
    'id' => 'integer',
    'user_id' => 'integer',
    'is_auto' => 'boolean',
  ];

  public function user()
  {
    return $this->belongsTo('App\User');
  }

  public function plugs()
  {
    return $this->hasMany('App\Plug');
  }
}
