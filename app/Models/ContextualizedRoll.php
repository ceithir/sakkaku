<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Concepts\FFG\L5R\Roll;

class ContextualizedRoll extends Model
{
    use HasFactory;

    public function user(): ?User
    {
        return $this->belongsTo('App\Models\User');
    }

    public function setRoll(Roll $roll): void
    {
        $this->roll = (array) $roll;
    }

    public function getRoll(): Roll
    {
        return new Roll($this->roll);
    }
}