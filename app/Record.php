<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
  protected $fillable = ['created_at', 'time', 'uri'];
  public $timestamps = false;
  protected $casts = [
    'id' => 'integer',
    'time' => 'float',
  ];
}
