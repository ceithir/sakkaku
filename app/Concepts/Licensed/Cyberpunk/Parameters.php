<?php

namespace App\Concepts\Licensed\Cyberpunk;

use Assert\Assertion;

class Parameters
{
    public int $modifier;

    public function __construct(array $parameters)
    {
        $modifier = $parameters['modifier'] ?? 0;
        Assertion::integer($modifier);

        $this->modifier = $modifier;
    }
}
