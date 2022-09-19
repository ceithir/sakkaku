<?php

namespace Tests\Unit\Concepts\DnD;

use App\Concepts\DnD\Roll;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
class RollTest extends TestCase
{
    use \phpmock\phpunit\PHPMock;

    public function testRoll2d20()
    {
        $this->stubRandInt(8, 15);

        $roll = Roll::init(['dices' => [['number' => 2, 'sides' => 20]]]);

        $this->assertEquals(
            [
                [
                    'status' => 'kept',
                    'type' => 'd20',
                    'value' => 8,
                ],
                [
                    'status' => 'kept',
                    'type' => 'd20',
                    'value' => 15,
                ],
            ],
            (array) $roll->dice,
        );
        $this->assertEquals(['total' => 23], $roll->result());
    }

    public function testRoll5d2WithRealRandom()
    {
        $roll = Roll::init(['dices' => [['number' => 5, 'sides' => 2]]]);

        $dice = (array) $roll->dice;
        $this->assertCount(5, $dice);
        foreach ($dice as $die) {
            $value = $die['value'];
            $this->assertGreaterThanOrEqual(1, $value);
            $this->assertLessThanOrEqual(2, $value);
        }

        $result = $roll->result()['total'];
        $this->assertGreaterThanOrEqual(5, $result);
        $this->assertLessThanOrEqual(10, $result);
    }

    public function testModifier()
    {
        $this->stubRandInt(3);

        $roll = Roll::init(['dices' => [['number' => 1, 'sides' => 10]], 'modifier' => 2]);
        $this->assertEquals(5, $roll->result()['total']);
    }

    public function testCanMixDice()
    {
        $this->stubRandInt(7, 12, 3);
        $roll = Roll::init([
            'dices' => [
                ['number' => 2, 'sides' => 20],
                ['number' => 1, 'sides' => 10],
            ],
        ]);
        $this->assertEquals(22, $roll->result()['total']);
    }

    public function testRoll2D20KeepLowest()
    {
        $this->stubRandInt(15, 8);

        $roll = Roll::init([
            'dices' => [
                [
                    'number' => 2,
                    'sides' => 20,
                    'keepNumber' => 1,
                    'keepCriteria' => 'lowest',
                ],
            ],
        ]);

        $this->assertEquals(
            [
                [
                    'status' => 'dropped',
                    'type' => 'd20',
                    'value' => 15,
                ],
                [
                    'status' => 'kept',
                    'type' => 'd20',
                    'value' => 8,
                ],
            ],
            (array) $roll->dice,
        );
        $this->assertEquals(['total' => 8], $roll->result());
    }

    public function testRoll3D6Plus1KeepTwoBest()
    {
        $this->stubRandInt(4, 5, 3);

        $roll = Roll::init([
            'dices' => [
                [
                    'number' => 3,
                    'sides' => 6,
                    'keepNumber' => 2,
                ],
            ],
            'modifier' => 1,
        ]);

        $this->assertEquals(
            [
                [
                    'status' => 'kept',
                    'type' => 'd6',
                    'value' => 4,
                ],
                [
                    'status' => 'kept',
                    'type' => 'd6',
                    'value' => 5,
                ],
                [
                    'status' => 'dropped',
                    'type' => 'd6',
                    'value' => 3,
                ],
            ],
            (array) $roll->dice,
        );
        $this->assertEquals(['total' => 10], $roll->result());
    }

    private function stubRandInt(...$params)
    {
        $rand = $this->getFunctionMock('App\Concepts\DnD', 'random_int');
        $rand
            ->expects($this->exactly(count($params)))
            ->will($this->onConsecutiveCalls(...$params))
        ;
    }
}
