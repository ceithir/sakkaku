<?php

namespace App\Concepts\Cards;

class Draw
{
    public Parameters $parameters;

    public array $hand;

    public function __construct(Parameters $parameters, array $hand, array $metadata = [])
    {
        $this->parameters = $parameters;
        $this->hand = $hand;
        $this->metadata = $metadata;
    }

    public static function init(array $parameters, array $metadata = [])
    {
        $params = new Parameters($parameters);

        return new self(
            $params,
            self::draw($params),
            $metadata,
        );
    }

    private static function draw(Parameters $parameters)
    {
        $deck = $parameters->deck;

        $cardsDrawn = [];
        $cardsLeft = $deck->cards;

        for ($i = 0; $i < $parameters->hand; ++$i) {
            $drawnCardIndex = random_int(0, count($cardsLeft) - 1);

            $cardsDrawn[] = $cardsLeft[$drawnCardIndex];
            unset($cardsLeft[$drawnCardIndex]);
            $cardsLeft = array_values($cardsLeft);
        }

        return $cardsDrawn;
    }
}
