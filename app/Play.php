<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Play extends Model
{
  protected $fillable = ['is_cleared', 'referrer'];

  public function stage()
  {
    return $this->belongsTo('App\Stage');
  }

  public function user()
  {
    return $this->belongsTo('App\User');
  }
}
