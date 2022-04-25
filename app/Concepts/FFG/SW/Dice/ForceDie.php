<?php

namespace App\Concepts\FFG\SW\Dice;

use Assert\Assertion;

class ForceDie extends BaseDie
{
    public const TYPE = 'force';

    public const VALUES = [
        ['dark' => 1],
        ['dark' => 1],
        ['dark' => 1],
        ['dark' => 1],
        ['dark' => 1],
        ['dark' => 1],
        ['dark' => 2],
        ['light' => 1],
        ['light' => 1],
        ['light' => 2],
        ['light' => 2],
        ['light' => 2],
    ];

    public function __construct(DieValue $value)
    {
        Assertion::eq($value->success, 0);
        Assertion::eq($value->advantage, 0);
        Assertion::eq($value->failure, 0);
        Assertion::eq($value->threat, 0);
        Assertion::eq($value->triumph, 0);
        Assertion::eq($value->despair, 0);

        Assertion::true(
            (0 === $value->light && (1 === $value->dark || 2 === $value->dark))
            || (0 === $value->dark && (1 === $value->light || 2 === $value->light))
        );

        $this->type = self::TYPE;
        $this->value = $value;
    }
}
