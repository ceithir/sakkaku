<?php

namespace App\Concepts\FFG\SW\Dice;

use Assert\Assertion;

class AbilityDie extends BaseDie
{
    public const TYPE = 'ability';

    public const VALUES = [
        [],
        ['success' => 1],
        ['success' => 1],
        ['success' => 2],
        ['advantage' => 1],
        ['advantage' => 1],
        ['success' => 1, 'advantage' => 1],
        ['advantage' => 2],
    ];

    public function __construct(DieValue $value)
    {
        Assertion::eq($value->failure, 0);
        Assertion::eq($value->threat, 0);
        Assertion::eq($value->triumph, 0);
        Assertion::eq($value->despair, 0);

        Assertion::true(
            $value->success >= 0 && $value->advantage >= 0 && ($value->success + $value->advantage <= 2)
        );

        $this->type = self::TYPE;
        $this->value = $value;
    }
}
