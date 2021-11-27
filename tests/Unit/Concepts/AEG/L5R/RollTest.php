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
    }

    public function testDiceCanExplodeSeveralTimes()
    {
        $this->stubRandInt(10, 10, 3, 7);

        $roll = new Roll(['roll' => 2, 'keep' => 1, 'explosions' => [10]]);
        $this->assertEquals(23, $roll->dice[0]['value']);
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
