<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Emoji extends Model
{
  protected $fillable = ['stage_id', 'user_id', 'shortcode', 'created_at'];
  public $timestamps = false;
}