<?php

namespace Tests\Unit\Concepts\FFG\L5R;

use PHPUnit\Framework\TestCase;
use Assert\InvalidArgumentException;
use App\Concepts\FFG\L5R\InheritanceRoll;

class InheritanceRollTest extends TestCase
{
  public function testCanCreateFromArray()
  {
    $roll = InheritanceRoll::fromArray([
      'dices' => [
        [
          'status' => 'pending',
          'value' => 3,
        ],
        [
          'status' => 'pending',
          'value' => 5,
        ],
      ],
    ]);
    $this->assertCount(2, $roll->dices);
    $this->assertEquals(3, $roll->dices[0]->value);
    $this->assertEquals(5, $roll->dices[1]->value);
  }

  public function testCanCreateFromNothing()
  {
    $roll = InheritanceRoll::init();
    $this->assertCount(2, $roll->dices);
    $this->assertEquals('pending', $roll->dices[0]->status);
  }

  public function testAddOneDieOnKeeping()
  {
    $roll = InheritanceRoll::init();
    $roll->keep(1);
    $this->assertCount(3, $roll->dices);
    $this->assertEquals('dropped', $roll->dices[0]->status);
    $this->assertEquals('kept', $roll->dices[1]->status);
    $this->assertEquals('kept', $roll->dices[2]->status);
  }

  public function testCannotAlterAKeptRoll()
  {
    $roll = InheritanceRoll::fromArray([
      'dices' => [
        [
          'status' => 'kept',
          'value' => 3,
        ],
        [
          'status' => 'dropped',
          'value' => 5,
        ],
        [
          'status' => 'kept',
          'value' => 1,
        ],
      ],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->keep(1);
  }

  public function testResult()
  {
    $roll = InheritanceRoll::fromArray([
      'dices' => [
        [
          'status' => 'dropped',
          'value' => 5,
        ],
        [
          'status' => 'kept',
          'value' => 3,
        ],
        [
          'status' => 'kept',
          'value' => 7,
        ],
      ],
    ]);
    $this->assertEquals([3, 7], $roll->result());
  }
}
