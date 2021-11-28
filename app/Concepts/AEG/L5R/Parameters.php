<?php

namespace App\Concepts\AEG\L5R;

use Assert\Assertion;

class Parameters
{
    public int $roll;

    public int $keep;

    public int $modifier;

    public ?int $tn;

    public array $explosions;

    public array $rerolls;

    public function __construct(array $parameters)
    {
        Assertion::keyExists($parameters, 'roll');
        Assertion::keyExists($parameters, 'keep');

        $roll = $parameters['roll'];
        $keep = $parameters['keep'];

        Assertion::allInteger([$roll, $keep]);
        Assertion::allBetween([$roll, $keep], 1, 10);
        Assertion::greaterOrEqualThan($roll, $keep);

        $modifier = $parameters['modifier'] ?? 0;
        Assertion::integer($modifier);

        $tn = $parameters['tn'] ?? null;
        Assertion::nullOrInteger($tn);

        $explosions = $parameters['explosions'] ?? [];
        $rerolls = $parameters['rerolls'] ?? [];
        Assertion::allIsArray([$explosions, $rerolls]);

        Assertion::allInteger($explosions);
        Assertion::allBetween($explosions, 8, 10);

        Assertion::allInteger($rerolls);
        Assertion::allBetween($rerolls, 1, 3);

        $this->roll = $roll;
        $this->keep = $keep;
        $this->modifier = $modifier;
        $this->tn = $tn;
        $this->explosions = $explosions;
        $this->rerolls = $rerolls;
    }
}
