<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bell extends Model
{
  protected $table = 'bell';
  protected $guarded = array('id');
  protected $casts = [
    'id' => 'integer',
    'user_id' => 'integer',
    'team_id' => 'integer',
    'channel_id' => 'integer',
    'is_active' => 'boolean',
    'qcard_id' => 'integer',
  ];
}
