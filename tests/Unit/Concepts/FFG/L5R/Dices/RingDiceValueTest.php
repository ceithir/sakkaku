<?php

namespace Tests\Unit\Concepts\FFG\L5R\Dices;

use PHPUnit\Framework\TestCase;
use App\Concepts\FFG\L5R\Dices\RingDiceValue;
use Assert\InvalidArgumentException;

class RingDiceValueTest extends TestCase
{
    public function testConsistent()
    {
        $dice = new RingDiceValue(array('opportunity' => 1, 'strife' => 1));
        $this->assertEquals(1, $dice->opportunity);
        $this->assertEquals(0, $dice->success);
        $this->assertEquals(1, $dice->strife);
        $this->assertEquals(0, $dice->explosion);
    }

    public function testCanRollDice()
    {
        $this->assertInstanceOf(RingDiceValue::class, RingDiceValue::random());
    }

    public function testRejectFakeDice()
    {
        $this->expectException(InvalidArgumentException::class);
        new RingDiceValue(array('explosion' => 1));
    }
}
