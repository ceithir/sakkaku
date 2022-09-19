<?php

namespace App\Concepts\Cards;

use Assert\Assertion;

class Parameters
{
    public Deck $deck;

    public int $hand;

    public function __construct(array $parameters)
    {
        Assertion::keyExists($parameters, 'deck');
        $deck = new Deck($parameters['deck']);

        Assertion::keyExists($parameters, 'hand');
        $hand = $parameters['hand'];
        Assertion::integer($hand);
        Assertion::between($hand, 1, $deck->size());

        $this->deck = $deck;
        $this->hand = $hand;
    }
}
