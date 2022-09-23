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
            $dd = [];
            for ($i = 0; $i < $dice->number; ++$i) {
                $value = random_int(1, $dice->sides);
                if ($dice->explode) {
                    $v = $value;
                    while ($v === $dice->sides) {
                        $v = random_int(1, $dice->sides);
                        $value += $v;
                    }
                }
                $dd[] = [
                    'type' => 'd'.$dice->sides,
                    'value' => $value,
                ];
            }
            $best = self::best($dd, $dice->keepNumber, $dice->keepCriteria);
            for ($i = 0; $i < $dice->number; ++$i) {
                $dd[$i]['status'] = in_array($i, $best) ? 'kept' : 'dropped';
            }
            $d = array_merge($d, $dd);
        }

        return $d;
    }

    private static function best(array $dice, int $keepNumber, string $keepCriteria)
    {
        $selectSwitch = ('lowest' === $keepCriteria) ? -1 : 1;

        $toSortArray = [];
        for ($i = 0; $i < count($dice); ++$i) {
            $toSortArray[] = ['index' => $i, 'value' => $dice[$i]['value']];
        }

        usort($toSortArray, function ($a, $b) use ($selectSwitch) {
            if ($a['value'] == $b['value']) {
                return 0;
            }

            return (($a['value'] > $b['value']) ? -1 : 1) * $selectSwitch;
        });

        return array_map(function ($a) {
            return $a['index'];
        }, array_slice($toSortArray, 0, $keepNumber));
    }
}
