<?php

namespace App\Concepts\DnD;

use Assert\Assertion;

class Parameters
{
    public array $dices;

    public int $modifier;

    public ?int $tn;

    public function __construct(array $parameters)
    {
        Assertion::keyExists($parameters, 'dices');
        Assertion::isArray($parameters['dices']);
        // TODO: Refusing to mix dice for now, to be improved upon later
        Assertion::count($parameters['dices'], 1);

        $modifier = $parameters['modifier'] ?? 0;
        Assertion::integer($modifier);

        $tn = $parameters['tn'] ?? null;
        Assertion::nullOrInteger($tn);

        $this->dices = array_map(function ($dice) {
            Assertion::isArray($dice);
            Assertion::keyExists($dice, 'number');
            Assertion::keyExists($dice, 'sides');

            return new Dice(sides: $dice['sides'], number: $dice['number']);
        }, $parameters['dices']);
        $this->modifier = $modifier;
        $this->tn = $tn;
    }
}
