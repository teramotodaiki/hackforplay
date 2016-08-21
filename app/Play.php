<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Play extends Model
{
  use SoftDeletes;

  protected $fillable = ['is_cleared', 'referrer'];
  protected $dates = ['deleted_at'];
  protected $casts = [
    'id' => 'integer',
    'user_id' => 'integer',
    'stage_id' => 'integer',
    'is_cleared' => 'boolean',
  ];

  public function stage()
  {
    return $this->belongsTo('App\Stage');
  }

  public function user()
  {
    return $this->belongsTo('App\User');
  }
}
