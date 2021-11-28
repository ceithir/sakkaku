<?php

namespace Tests\Unit\Concepts\AEG\L5R;

use App\Concepts\AEG\L5R\Parameters;
use Assert\InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 * @coversNothing
 */
class ParametersTest extends TestCase
{
    public function testStandardCase()
    {
        $this->assertEquals(
            ['roll' => 3, 'keep' => 2, 'tn' => null, 'explosions' => [], 'rerolls' => [], 'modifier' => 0],
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
            ['roll' => 3, 'keep' => 3, 'tn' => null, 'explosions' => [], 'rerolls' => [], 'modifier' => 5],
            (array) new Parameters(['roll' => 3, 'keep' => 3, 'modifier' => 5])
        );
    }
}
