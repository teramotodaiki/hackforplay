<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Qcard extends Model
{
  protected $table = 'qcard';
  protected $guarded = ['id', 'user_id', 'channel_id'];
}
