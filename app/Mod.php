<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mod extends Model
{
  protected $table = 'mod';
  protected $guarded = array('id');
  protected $casts = ['id' => 'integer'];
}
