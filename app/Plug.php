<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plug extends Model
{
  public $fillable = ['stage_id', 'label', 'is_visible', 'is_used'];
  protected $appends = ['full_label'];
  protected $hidden = ['author'];
  protected $casts = [
    'id' => 'integer',
    'author_id' => 'integer',
    'stage_id' => 'integer',
    'is_visible' => 'boolean',
    'is_used' => 'boolean',
  ];

  public function author()
  {
    return $this->belongsTo('App\Author');
  }

  public function stage()
  {
    return $this->belongsTo('App\Stage');
  }

  public function getFullLabelAttribute()
  {
    return $this->author->name . '/' . $this->label;
  }
}
