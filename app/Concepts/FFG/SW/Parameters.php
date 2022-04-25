<?php

namespace App\Concepts\FFG\SW;

use Assert\Assertion;

class Parameters
{
    public int $ability;

    public int $boost;

    public int $challenge;

    public int $difficulty;

    public int $proficiency;

    public int $setback;

    public int $force;

    public function __construct(array $parameters)
    {
        $ability = $parameters['ability'] ?? 0;
        $boost = $parameters['boost'] ?? 0;
        $challenge = $parameters['challenge'] ?? 0;
        $difficulty = $parameters['difficulty'] ?? 0;
        $proficiency = $parameters['proficiency'] ?? 0;
        $setback = $parameters['setback'] ?? 0;
        $force = $parameters['force'] ?? 0;

        $allDice = [$ability, $boost, $challenge, $difficulty, $proficiency, $setback, $force];

        Assertion::allInteger($allDice);
        Assertion::allGreaterOrEqualThan($allDice, 0);
        Assertion::allLessOrEqualThan($allDice, 10);
        Assertion::greaterThan(array_sum($allDice), 0);

        $this->ability = $ability;
        $this->boost = $boost;
        $this->challenge = $challenge;
        $this->difficulty = $difficulty;
        $this->proficiency = $proficiency;
        $this->setback = $setback;
        $this->force = $force;
    }
}
