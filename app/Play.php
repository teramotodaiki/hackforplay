<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Play extends Model
{
  use SoftDeletes;
  
  protected $fillable = ['is_cleared', 'referrer'];
  protected $dates = ['deleted_at'];

  public function stage()
  {
    return $this->belongsTo('App\Stage');
  }

  public function user()
  {
    return $this->belongsTo('App\User');
  }
}
