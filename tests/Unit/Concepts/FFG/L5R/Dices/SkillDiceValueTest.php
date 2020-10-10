<?php

namespace Tests\Unit\Concepts\FFG\L5R\Dices;

use PHPUnit\Framework\TestCase;
use App\Concepts\FFG\L5R\Dices\SkillDiceValue;
use Assert\InvalidArgumentException;

class SkillDiceValueTest extends TestCase
{
    public function testConsistent()
    {
        $dice = new SkillDiceValue(array('explosion' => 1, 'strife' => 1));
        $this->assertEquals(0, $dice->opportunity);
        $this->assertEquals(0, $dice->success);
        $this->assertEquals(1, $dice->strife);
        $this->assertEquals(1, $dice->explosion);
    }

    public function testCanRollDice()
    {
        $this->assertInstanceOf(SkillDiceValue::class, SkillDiceValue::random());
    }

    public function testRejectFakeDice()
    {
        $this->expectException(InvalidArgumentException::class);
        new SkillDiceValue(array('explosion' => 2));
    }
}
