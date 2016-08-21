<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Qcard extends Model
{
  protected $table = 'qcard';
  protected $guarded = ['id', 'user_id', 'channel_id', 'created_at', 'updated_at'];
  protected $casts = [
    'id' => 'integer',
    'user_id' => 'integer',
    'channel_id' => 'integer',
    'is_active' => 'boolean',
  ];
}
