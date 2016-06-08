<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
  protected $table = 'chat';
  protected $guarded = array('id', 'channel_id');
}
