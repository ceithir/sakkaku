<?php

namespace App\Concepts\FFG\SW\Dice;

use Assert\Assertion;

class SetbackDie extends BaseDie
{
    public const TYPE = 'setback';

    public const VALUES = [
        [],
        [],
        ['failure' => 1],
        ['failure' => 1],
        ['threat' => 1],
        ['threat' => 1],
    ];

    public function __construct(DieValue $value)
    {
        Assertion::eq($value->success, 0);
        Assertion::eq($value->advantage, 0);
        Assertion::eq($value->triumph, 0);
        Assertion::eq($value->despair, 0);

        Assertion::true(
            (0 === $value->failure && 0 === $value->threat)
            || (1 === $value->failure xor 1 === $value->threat)
        );

        $this->type = self::TYPE;
        $this->value = $value;
    }
}
