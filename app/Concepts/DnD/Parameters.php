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
        Assertion::notEmpty($parameters['dices']);

        $modifier = $parameters['modifier'] ?? 0;
        Assertion::integer($modifier);

        $tn = $parameters['tn'] ?? null;
        Assertion::nullOrInteger($tn);

        $this->dices = array_map(function ($dice) {
            Assertion::isArray($dice);
            Assertion::keyExists($dice, 'number');
            Assertion::keyExists($dice, 'sides');

            return new Dice(
                sides: $dice['sides'],
                number: $dice['number'],
                keepNumber: $dice['keepNumber'] ?? $dice['number'],
                keepCriteria: $dice['keepCriteria'] ?? 'highest',
                explode: $dice['explode'] ?? false,
            );
        }, $parameters['dices']);
        $this->modifier = $modifier;
        $this->tn = $tn;
    }

    public function formula(): string
    {
        $expressions = [];

        foreach ($this->dices as $die) {
            $formula = "{$die->number}d{$die->sides}";
            if ($die->number > $die->keepNumber) {
                $formula .= 'lowest' === $die->keepCriteria ? 'kl' : 'kh';
                $formula .= $die->keepNumber;
            }
            if ($die->explode) {
                $formula .= '!';
            }
            $expressions[] = $formula;
        }

        $formula = implode('+', $expressions);
        if (0 !== $this->modifier) {
            $formula .= $this->modifier > 0 ? "+{$this->modifier}" : "{$this->modifier}";
        }

        return $formula;
    }
}
