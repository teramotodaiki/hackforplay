<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plug extends Model
{
  public $fillable = ['stage_id', 'label', 'is_visible', 'is_used'];

  public function author()
  {
    return $this->belongsTo('App\Author');
  }

  public function stage()
  {
    return $this->belongsTo('App\Stage');
  }
}
