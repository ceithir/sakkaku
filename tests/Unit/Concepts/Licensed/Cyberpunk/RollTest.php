<?php

namespace Tests\Unit\Concepts\Licensed\Cyberpunk;

use App\Concepts\Licensed\Cyberpunk\Roll;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
class RollTest extends TestCase
{
    use \phpmock\phpunit\PHPMock;

    public function testJustRoll1d10AsADefault()
    {
        $this->stubRandInt(7, 2, 6);

        $this->assertEquals(12, Roll::init(['modifier' => 5])->result()['total']);
        $this->assertEquals(-1, Roll::init(['modifier' => -3])->result()['total']);
        $this->assertEquals(6, Roll::init([])->result()['total']);
    }

    public function testExplodeOnceOn10()
    {
        $this->stubRandInt(10, 10);

        $roll = Roll::init(['modifier' => 2]);
        $this->assertEquals(22, $roll->result()['total']);
        $this->assertEquals([10, 10], $roll->dice);
    }

    public function testExploceOnceDownwardOn1()
    {
        $this->stubRandInt(1, 1);

        $roll = Roll::init(['modifier' => 3]);
        $this->assertEquals(3, $roll->result()['total']);
        $this->assertEquals([1, -1], $roll->dice);
    }

    public function testDoesNotMixExplosion()
    {
        $this->stubRandInt(1, 10, 10, 1);

        $roll = Roll::init(['modifier' => 7]);
        $this->assertEquals(-2, $roll->result()['total']);
        $this->assertEquals([1, -10], $roll->dice);

        $roll = Roll::init(['modifier' => 2]);
        $this->assertEquals(13, $roll->result()['total']);
        $this->assertEquals([10, 1], $roll->dice);
    }

    public function testParametersCanBeConvertedBackToCanonFormula()
    {
        $roll = Roll::init([]);
        $this->assertEquals('"1d10"', $roll->parameters->formula());

        $roll = Roll::init(['modifier' => 2]);
        $this->assertEquals('"1d10"+2', $roll->parameters->formula());

        $roll = Roll::init(['modifier' => -3]);
        $this->assertEquals('"1d10"-3', $roll->parameters->formula());
    }

    private function stubRandInt(...$params)
    {
        $rand = $this->getFunctionMock('App\Concepts\Licensed\Cyberpunk', 'random_int');
        $rand
            ->expects($this->exactly(count($params)))
            ->will($this->onConsecutiveCalls(...$params))
        ;
    }
}
