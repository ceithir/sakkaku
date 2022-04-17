<?php

namespace App\Concepts\DnD;

use App\Concepts\Roll as RollInterface;

class Roll implements RollInterface
{
    public Parameters $parameters;

    public array $dice;

    public function __construct(Parameters $parameters, array $dice, array $metadata = [])
    {
        $this->parameters = $parameters;
        $this->dice = $dice;
        $this->metadata = $metadata;
    }

    public static function init(array $parameters, array $metadata = [])
    {
        $params = new Parameters($parameters);

        return new self(
            $params,
            self::roll($params),
            $metadata,
        );
    }

    public function result(): array
    {
        $total = array_reduce(
            $this->dice,
            function (int $carry, array $die) {
                if ('kept' !== $die['status']) {
                    return $carry;
                }

                return $carry + $die['value'];
            },
            0
        ) + $this->parameters->modifier;

        return [
            'total' => $total,
        ];
    }

    public static function fromArray(array $data): Roll
    {
        return new self(
            new Parameters($data['parameters']),
            $data['dice'],
            $data['metadata'] ?? []
        );
    }

    public function toArray(): array
    {
        return json_decode(json_encode($this), true);
    }

    private static function roll(Parameters $parameters)
    {
        $d = [];

        foreach ($parameters->dices as $dice) {
            for ($i = 0; $i < $dice->number; ++$i) {
                $d[] = [
                    'type' => 'd'.$dice->sides,
                    'value' => random_int(1, $dice->sides),
                    // All dice are kept as of now
                    'status' => 'kept',
                ];
            }
        }

        return $d;
    }
}