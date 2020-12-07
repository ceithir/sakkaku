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

    public function testCanPassModifier()
    {
        $dice = Dice::fromArray(array(
            'type' => 'ring',
            'status' => 'dropped',
            'value' => array('success' => 1),
            'metadata' => array('modifier' => 'adversity'),
        ));
        $this->assertEquals('adversity', $dice->metadata['modifier']);
    }

    public function testDicesAreBalanced()
    {
        $this->assertDiceBalance(
            'ring',
            [
                'strife' => 1/2,
                'opportunity' => 1/3,
                'success' => 1/3,
                'explosion' => 1/6,
            ],
        );

        $this->assertDiceBalance(
            'skill',
            [
                'opportunity' => 1/3,
                'strife' => 1/4,
                'success' => 5/12,
                'explosion' => 1/6,
            ],
        );
    }

    private function assertDiceBalance($type, $expected)
    {
        $total = 100000;
        $delta = $total / 100;

        $strife = 0;
        $opportunity = 0;
        $success = 0;
        $explosion = 0;

        for ($i = 0; $i < $total; $i++) {
            $dice = Dice::init($type);
            $opportunity += $dice->value->opportunity;
            $strife += $dice->value->strife;
            $success += $dice->value->success;
            $explosion += $dice->value->explosion;
        }

        $this->assertEqualsWithDelta($expected['strife']*$total, $strife, $delta);
        $this->assertEqualsWithDelta($expected['opportunity']*$total, $opportunity, $delta);
        $this->assertEqualsWithDelta($expected['success']*$total, $success, $delta);
        $this->assertEqualsWithDelta($expected['explosion']*$total, $explosion, $delta);
    }
}
