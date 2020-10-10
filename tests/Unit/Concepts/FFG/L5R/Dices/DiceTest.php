<?php

namespace Tests\Unit\Concepts\FFG\L5R\Dices;

use PHPUnit\Framework\TestCase;
use App\Concepts\FFG\L5R\Dices\RingDiceValue;
use App\Concepts\FFG\L5R\Dices\SkillDiceValue;
use Assert\InvalidArgumentException;
use App\Concepts\FFG\L5R\Dices\Dice;

class DiceTest extends TestCase
{
    public function testCanCreateDiceSeveralWays()
    {
        $dice = new Dice('ring', 'kept', new RingDiceValue(array('success' => 1)));
        $this->assertEquals('kept', $dice->status);
        $this->assertEquals('ring', $dice->type);
        $this->assertEquals(1, $dice->value->success);

        $dice = Dice::fromArray(array(
            'type' => 'skill',
            'status' => 'dropped',
            'value' => array('explosion' => 1),
        ));
        $this->assertEquals('dropped', $dice->status);
        $this->assertEquals('skill', $dice->type);
        $this->assertEquals(1, $dice->value->explosion);
    }

    public function testCanRollDice()
    {
        $dice = Dice::init('ring');
        $this->assertEquals('pending', $dice->status);
        $this->assertEquals('ring', $dice->type);
    }

    public function testRejectFakeDice()
    {
        $this->expectException(InvalidArgumentException::class);
        new Dice('ring', 'super', new RingDiceValue(array()));
    }
}
