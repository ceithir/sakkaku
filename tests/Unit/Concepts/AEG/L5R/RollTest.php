<?php

namespace Tests\Unit\Concepts\AEG\L5R;

use App\Concepts\AEG\L5R\Roll;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 * @coversNothing
 */
class RollTest extends TestCase
{
    use \phpmock\phpunit\PHPMock;

    public function testRollAndKeepAsManyDiceAsAsked()
    {
        $this->stubRandInt(8, 2, 5);

        $roll = new Roll(['roll' => 3, 'keep' => 2]);
        $dice = $roll->dice;

        $this->assertCount(3, $dice);
        $this->assertCount(2, array_filter($dice, function ($die) {
            return 'kept' === $die['status'];
        }));
        $this->assertEquals(['total' => 13], $roll->result());
    }

    public function testDiceCanExplodeSeveralTimes()
    {
        $this->stubRandInt(10, 10, 3, 7);

        $roll = new Roll(['roll' => 2, 'keep' => 1, 'explosions' => [10]]);
        $this->assertEquals(23, $roll->dice[0]['value']);
        $this->assertEquals(['total' => 23], $roll->result());
    }

    public function testDiceCanBeRerolledOnce()
    {
        $this->stubRandInt(1, 1, 1, 5);

        $roll = new Roll(['roll' => 2, 'keep' => 2, 'rerolls' => [1]]);
        $this->assertEquals(
            [
                ['value' => 1, 'status' => 'rerolled'],
                ['value' => 1, 'status' => 'kept'],
                ['value' => 1, 'status' => 'rerolled'],
                ['value' => 5, 'status' => 'kept'],
            ],
            $roll->dice
        );
        $this->assertEquals(['total' => 6], $roll->result());
    }

    public function testResultIncludesModifier()
    {
        $this->stubRandInt(9, 7, 2);

        $roll = new Roll(['roll' => 3, 'keep' => 2, 'modifier' => -3]);
        $this->assertEquals(['total' => 13], $roll->result());
    }

    public function testFromArray()
    {
        $roll = Roll::fromArray([
            'parameters' => ['roll' => 3, 'keep' => 2],
            'dice' => [['value' => 6, 'status' => 'kept'], ['value' => 3, 'status' => 'dropped'], ['value' => 8, 'status' => 'kept']],
        ]);
        $this->assertEquals(['total' => 14], $roll->result());
    }

    private function stubRandInt(...$params)
    {
        $rand = $this->getFunctionMock('App\Concepts\AEG\L5R', 'random_int');
        $rand
            ->expects($this->exactly(count($params)))
            ->will($this->onConsecutiveCalls(...$params))
        ;
    }
}
