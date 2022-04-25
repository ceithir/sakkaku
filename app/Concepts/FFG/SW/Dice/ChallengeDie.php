<?php

namespace App\Concepts\FFG\SW\Dice;

use Assert\Assertion;

class ChallengeDie extends BaseDie
{
    public const TYPE = 'challenge';

    public const VALUES = [
        [],
        ['failure' => 1],
        ['failure' => 1],
        ['failure' => 2],
        ['failure' => 2],
        ['threat' => 1],
        ['threat' => 1],
        ['failure' => 1, 'threat' => 1],
        ['failure' => 1, 'threat' => 1],
        ['threat' => 2],
        ['threat' => 2],
        ['despair' => 1],
    ];

    public function __construct(DieValue $value)
    {
        Assertion::eq($value->success, 0);
        Assertion::eq($value->advantage, 0);
        Assertion::eq($value->triumph, 0);

        Assertion::true(
            (1 === $value->despair && 0 === $value->failure && 0 === $value->threat)
            || (0 === $value->despair && $value->failure >= 0 && $value->threat >= 0 && ($value->failure + $value->threat <= 2))
        );

        $this->type = self::TYPE;
        $this->value = $value;
    }
}
