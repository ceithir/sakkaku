<?php

namespace Tests\Unit\Concepts\AEG\L5R;

use App\Concepts\AEG\L5R\Parameters;
use Assert\InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
class ParametersTest extends TestCase
{
    public function testStandardCase()
    {
        $this->assertEquals(
            ['roll' => 3, 'keep' => 2, 'tn' => null, 'explosions' => [], 'rerolls' => [], 'modifier' => 0, 'select' => 'high'],
            (array) new Parameters(['roll' => 3, 'keep' => 2])
        );
    }

    public function testTooManyDice()
    {
        $this->expectException(InvalidArgumentException::class);
        new Parameters(['roll' => 12, 'keep' => 2]);
    }

    public function testKeepingMoreThanRolling()
    {
        $this->expectException(InvalidArgumentException::class);
        new Parameters(['roll' => 3, 'keep' => 4]);
    }

    public function testAcceptModifier()
    {
        $this->assertEquals(
            ['roll' => 3, 'keep' => 3, 'tn' => null, 'explosions' => [], 'rerolls' => [], 'modifier' => 5, 'select' => 'high'],
            (array) new Parameters(['roll' => 3, 'keep' => 3, 'modifier' => 5])
        );
    }

    public function testParametersCanBeConvertedBackToCanonFormula()
    {
        $parameters = new Parameters(['roll' => 3, 'keep' => 2]);
        $this->assertEquals('3k2', $parameters->formula());

        $parameters = new Parameters(['roll' => 6, 'keep' => 3, 'modifier' => -7]);
        $this->assertEquals('6k3-7', $parameters->formula());

        $parameters = new Parameters(['roll' => 7, 'keep' => 4, 'modifier' => 1]);
        $this->assertEquals('7k4+1', $parameters->formula());
    }
}
