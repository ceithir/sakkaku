<?php

namespace Tests\Unit\Concepts\FFG\SW;

use App\Concepts\FFG\SW\Dice\DieGenerator;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 * @coversNothing
 */
class DiceTest extends TestCase
{
    public function testCanLoadBoostDiceFromArray()
    {
        $boostDie = DieGenerator::load(['type' => 'boost', 'value' => ['success' => 1]]);
        $this->assertEquals('boost', $boostDie->type);
        $this->assertEquals(
            ['success' => 1, 'advantage' => 0, 'triumph' => 0, 'failure' => 0, 'threat' => 0, 'despair' => 0, 'light' => 0, 'dark' => 0],
            (array) $boostDie->value
        );
    }

    public function testCanInitBoostDiceFromType()
    {
        $boostDie = DieGenerator::roll('boost');
        $this->assertEquals('boost', $boostDie->type);
        $this->assertEquals(0, $boostDie->value->triumph);
    }
}
