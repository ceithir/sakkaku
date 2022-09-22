<?php

namespace App\Concepts\Cards;

use Assert\Assertion;

class Deck
{
    public array $cards;

    public function __construct(array $cards)
    {
        Assertion::allInteger($cards);
        Assertion::uniqueValues($cards);
        // As of now, only allow classic 52+2 cards
        Assertion::allBetween($cards, 1, 54);

        $this->cards = $cards;
    }

    public function size(): int
    {
        return count($this->cards);
    }

    public function toArray(): array
    {
        return $this->cards;
    }
}
