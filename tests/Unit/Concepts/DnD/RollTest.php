<?php

namespace Tests\Unit\Concepts\DnD\L5R;

use App\Concepts\DnD\Roll;
use PHPUnit\Framework\TestCase;

/**
 * @internal
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

    private function stubRandInt(...$params)
    {
        $rand = $this->getFunctionMock('App\Concepts\DnD', 'random_int');
        $rand
            ->expects($this->exactly(count($params)))
            ->will($this->onConsecutiveCalls(...$params))
        ;
    }
}
