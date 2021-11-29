<?php

namespace App\Models;

use App\Concepts\FFG\L5R\InheritanceRoll as L5RHeritageRoll;
use App\Concepts\FFG\L5R\Roll as L5RRoll;
use App\Concepts\Roll;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContextualizedRoll extends Model
{
    use HasFactory;

    protected $casts = [
        'roll' => 'json',
        'result' => 'json',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function setRoll(Roll $roll): void
    {
        $this->roll = $roll->toArray();
    }

    public function getRoll(): Roll
    {
        switch ($this->type) {
            case 'FFG-L5R':
                return L5RRoll::fromArray($this->roll);

            case 'FFG-L5R-Heritage':
                return L5RHeritageRoll::fromArray($this->roll);

            default:
                throw 'Corrupted roll';
        }
    }
}
