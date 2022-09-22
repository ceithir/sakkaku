<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory;

    protected $casts = [
        'state' => 'json',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
