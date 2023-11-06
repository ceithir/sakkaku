<?php

namespace App\Concepts\FFG\SW;

use App\Concepts\FFG\SW\Dice\AbilityDie;
use App\Concepts\FFG\SW\Dice\BoostDie;
use App\Concepts\FFG\SW\Dice\ChallengeDie;
use App\Concepts\FFG\SW\Dice\DieGenerator;
use App\Concepts\FFG\SW\Dice\DifficultyDie;
use App\Concepts\FFG\SW\Dice\ForceDie;
use App\Concepts\FFG\SW\Dice\ProficiencyDie;
use App\Concepts\FFG\SW\Dice\SetbackDie;
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
        $success = 0;
        $advantage = 0;
        $triumph = 0;
        $failure = 0;
        $threat = 0;
        $despair = 0;
        $light = 0;
        $dark = 0;

        foreach ($this->dice as $die) {
            $value = $die->value;
            $success += $value->success;
            $advantage += $value->advantage;
            $triumph += $value->triumph;
            $failure += $value->failure;
            $threat += $value->threat;
            $despair += $value->despair;
            $light += $value->light;
            $dark += $value->dark;
        }

        return [
            'success' => $success,
            'advantage' => $advantage,
            'triumph' => $triumph,
            'failure' => $failure,
            'threat' => $threat,
            'despair' => $despair,
            'light' => $light,
            'dark' => $dark,
        ];
    }

    public static function fromArray(array $data): Roll
    {
        return new self(
            new Parameters($data['parameters']),
            array_map(
                function (array $dieData) {
                    return DieGenerator::load($dieData);
                },
                $data['dice']
            ),
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

        foreach ([
            AbilityDie::TYPE, BoostDie::TYPE, ChallengeDie::TYPE,
            DifficultyDie::TYPE, ProficiencyDie::TYPE, SetbackDie::TYPE,
            ForceDie::TYPE,
        ] as $type) {
            for ($i = 0; $i < $parameters->{$type}; ++$i) {
                $d[] = DieGenerator::roll($type);
            }
        }

        return $d;
    }
}
