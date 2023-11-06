<?php

namespace App\Concepts\AEG\L5R;

use App\Concepts\Roll as RollInterface;

class Roll implements RollInterface
{
    public Parameters $parameters;

    public array $dice;

    public array $metadata;

    public function __construct(array $parameters, array $metadata = [], array $dice = null)
    {
        $this->parameters = new Parameters($parameters);
        $this->dice = $dice ?? $this->rollDice();
        $this->metadata = $metadata;
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
        return new self($data['parameters'], dice: $data['dice'], metadata: $data['metadata'] ?? []);
    }

    public function toArray(): array
    {
        return json_decode(json_encode($this), true);
    }

    private function rollDice(): array
    {
        $dice = [];

        for ($i = 0; $i < $this->parameters->roll; ++$i) {
            $value = $this->rollOneDie();
            if (in_array($value, $this->parameters->rerolls)) {
                $dice[] = ['value' => $value, 'status' => 'rerolled'];
                $dice[] = ['value' => $this->rollOneDie(), 'status' => 'pending'];
            } else {
                $dice[] = ['value' => $value, 'status' => 'pending'];
            }
        }

        $best = $this->best($dice);
        for ($i = 0; $i < count($dice); ++$i) {
            if ('pending' === $dice[$i]['status']) {
                if (in_array($i, $best)) {
                    $dice[$i]['status'] = 'kept';
                } else {
                    $dice[$i]['status'] = 'dropped';
                }
            }
        }

        return $dice;
    }

    private function rollOneDie()
    {
        $die = 0;
        $value = random_int(1, 10);
        while (in_array($value, $this->parameters->explosions)) {
            $die += $value;
            $value = random_int(1, 10);
        }
        $die += $value;

        return $die;
    }

    private function best(array $dice)
    {
        $selectSwitch = ('low' === $this->parameters->select) ? -1 : 1;

        $toSortArray = [];
        for ($i = 0; $i < count($dice); ++$i) {
            if ('pending' === $dice[$i]['status']) {
                $toSortArray[] = ['index' => $i, 'value' => $dice[$i]['value']];
            }
        }
        usort($toSortArray, function ($a, $b) use ($selectSwitch) {
            if ($a['value'] == $b['value']) {
                return 0;
            }

            return (($a['value'] > $b['value']) ? -1 : 1) * $selectSwitch;
        });

        return array_map(function ($a) {
            return $a['index'];
        }, array_slice($toSortArray, 0, $this->parameters->keep));
    }
}
