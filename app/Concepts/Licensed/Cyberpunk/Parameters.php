<?php

namespace App\Concepts\Licensed\Cyberpunk;

use Assert\Assertion;

class Parameters
{
    public int $modifier;

    public ?int $tn;

    public function __construct(array $parameters)
    {
        $modifier = $parameters['modifier'] ?? 0;
        Assertion::integer($modifier);

        $tn = $parameters['tn'] ?? null;
        Assertion::nullOrInteger($tn);

        $this->modifier = $modifier;
        $this->tn = $tn;
    }
}
