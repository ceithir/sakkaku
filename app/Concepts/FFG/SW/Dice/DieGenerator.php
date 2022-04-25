<?php

namespace App\Concepts\FFG\SW\Dice;

use Assert\Assertion;

class DieGenerator
{
    public static function roll(string $type): BaseDie
    {
        $className = self::getClassName($type);

        return new $className(
            new DieValue(
                $className::VALUES[
                    random_int(0, count($className::VALUES) - 1)
                ]
            )
        );
    }

    public static function load(array $data): BaseDie
    {
        Assertion::keyExists($data, 'type');
        Assertion::keyExists($data, 'value');

        $className = self::getClassName($data['type']);

        return new $className(new DieValue($data['value']));
    }

    private static function getClassName(string $type): string
    {
        switch ($type) {
            case BoostDie::TYPE:
                return BoostDie::class;

            default:
                throw new \Exception('Unrecognized type');
            }
    }
}
