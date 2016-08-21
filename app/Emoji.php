<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Emoji extends Model
{
  protected $fillable = ['stage_id', 'user_id', 'shortname', 'created_at'];
  public $timestamps = false;
  protected $casts = [
    'id' => 'integer',
    'stage_id' => 'integer',
    'user_id' => 'integer',
  ];
}
