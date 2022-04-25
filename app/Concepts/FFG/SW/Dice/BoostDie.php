<?php

namespace App\Concepts\FFG\SW\Dice;

use Assert\Assertion;

class BoostDie extends BaseDie
{
    public const TYPE = 'boost';

    public const VALUES = [
        [],
        [],
        ['success' => 1],
        ['success' => 1, 'advantage' => 1],
        ['advantage' => 2],
        ['advantage' => 1],
    ];

    public function __construct(DieValue $value)
    {
        Assertion::eq($value->triumph, 0);
        Assertion::eq($value->failure, 0);
        Assertion::eq($value->threat, 0);
        Assertion::eq($value->despair, 0);

        Assertion::true(
            0 === $value->success && ($value->advantage >= 0 && $value->advantage <= 2)
            || 1 === $value->success && (0 === $value->advantage || 1 === $value->advantage)
        );

        $this->type = self::TYPE;
        $this->value = $value;
    }
}
