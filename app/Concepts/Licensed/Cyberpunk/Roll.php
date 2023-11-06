<?php

namespace App\Concepts\Licensed\Cyberpunk;

use App\Concepts\Roll as RollInterface;

class Roll implements RollInterface
{
    public Parameters $parameters;

    public array $dice;

    public array $metadata;

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
            function (int $carry, int $die) {
                return $carry + $die;
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
        $originalD10 = $value = random_int(1, 10);

        if (10 === $originalD10) {
            return [
                $originalD10,
                random_int(1, 10),
            ];
        }

        if (1 === $originalD10) {
            return [
                $originalD10,
                -random_int(1, 10),
            ];
        }

        return [$originalD10];
    }
}
