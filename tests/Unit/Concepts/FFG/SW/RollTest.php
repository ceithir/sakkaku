<?php

namespace Tests\Unit\Concepts\FFG\SW;

use App\Concepts\FFG\SW\Roll;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 * @coversNothing
 */
class RollTest extends TestCase
{
    public function testCanLoadFromArray()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ability' => 2, 'setback' => 1],
            'dice' => [
                ['type' => 'ability', 'value' => ['success' => 1, 'advantage' => 1]],
                ['type' => 'ability', 'value' => ['success' => 1]],
                ['type' => 'setback', 'value' => ['threat' => 1]],
            ],
        ]);

        $this->assertEquals(
            [
                'success' => 2, 'advantage' => 1, 'triumph' => 0,
                'failure' => 0, 'threat' => 1, 'despair' => 0,
                'light' => 0, 'dark' => 0,
            ],
            $roll->result()
        );
    }

    public function testCanRollOneDieOfEach()
    {
        $roll = Roll::init(
            [
                'boost' => 1, 'setback' => 1,
                'ability' => 1, 'difficulty' => 1,
                'proficiency' => 1, 'challenge' => 1,
            ]
        );
        $this->assertCount(6, $roll->dice);
    }
}
