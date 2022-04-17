<?php

namespace App\Concepts\DnD;

use Assert\Assertion;

class Dice
{
    public int $sides;

    public int $number;

    public function __construct(int $sides, int $number)
    {
        Assertion::between($sides, 1, 999);
        Assertion::between($number, 1, 99);

        $this->sides = $sides;
        $this->number = $number;
    }
}
