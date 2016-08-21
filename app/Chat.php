<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
  protected $table = 'chat';
  protected $guarded = array('id', 'channel_id');
  protected $casts = [
    'id' => 'integer',
    'channel_id' => 'integer',
    'user_id' => 'integer',
  ];
}
