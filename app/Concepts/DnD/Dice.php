<?php

namespace App\Concepts\DnD;

use Assert\Assertion;

class Dice
{
    public int $sides;

    public int $number;

    public int $keepNumber;

    public string $keepCriteria;

    public bool $explode;

    public function __construct(int $sides, int $number, int $keepNumber, string $keepCriteria, bool $explode)
    {
        Assertion::between($sides, 1, 999);
        Assertion::between($number, 1, 99);
        Assertion::between($keepNumber, 1, $number);
        Assertion::inArray($keepCriteria, ['highest', 'lowest']);

        $this->sides = $sides;
        $this->number = $number;
        $this->keepNumber = $keepNumber;
        $this->keepCriteria = $keepCriteria;
        $this->explode = $explode;
    }
}
