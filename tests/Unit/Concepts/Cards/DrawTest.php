<?php

namespace Tests\Unit\Concepts\Cards;

use App\Concepts\Cards\Draw;
use Assert\InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
class RollTest extends TestCase
{
    use \phpmock\phpunit\PHPMock;

    public function testDrawingOneCard()
    {
        $this->stubRandInt(2);

        $draw = Draw::init(['deck' => [1, 2, 3, 4, 5], 'hand' => 1]);

        $this->assertEquals(
            [
                3,
            ],
            (array) $draw->hand,
        );
    }

    public function testDrawingWholeDeck()
    {
        $this->stubRandInt(0, 0);

        $draw = Draw::init(['deck' => [1, 5], 'hand' => 2]);

        $this->assertEquals(
            [
                1, 5,
            ],
            (array) $draw->hand,
        );
    }

    public function testDrawOneTooManyCards()
    {
        $this->expectException(InvalidArgumentException::class);
        $draw = Draw::init(['deck' => [1, 5], 'hand' => 3]);
    }

    public function testCanPackAndUnpackItself()
    {
        $draw = Draw::init(['deck' => [1, 2, 3, 4, 5], 'hand' => 2]);
        $this->assertEquals(
            $draw->toArray(),
            Draw::fromArray($draw->toArray())->toArray()
        );
    }

    private function stubRandInt(...$params)
    {
        $rand = $this->getFunctionMock('App\Concepts\Cards', 'random_int');
        $rand
            ->expects($this->exactly(count($params)))
            ->will($this->onConsecutiveCalls(...$params))
        ;
    }
}
