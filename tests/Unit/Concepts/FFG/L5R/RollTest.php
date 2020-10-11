<?php

namespace Tests\Unit\Concepts\FFG\L5R;

use PHPUnit\Framework\TestCase;
use Assert\InvalidArgumentException;
use App\Concepts\FFG\L5R\Roll;

class RollTest extends TestCase
{
  public function testCanCreateFromArray()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 2, 'ring' => 2, 'skill' => 1],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'kept',
          'value' => ['success' => 1],
        ],
        [
          'type' => 'ring',
          'status' => 'dropped',
          'value' => [],
        ],
        [
          'type' => 'skill',
          'status' => 'kept',
          'value' => ['oppportunity' => 1],
        ],
      ],
    ]);
    $this->assertEquals(2, $roll->parameters->tn);
    $this->assertCount(3, $roll->dices);
    $this->assertEquals('skill', $roll->dices[2]->type);
  }

  public function testCanInitFromJustParameters()
  {
    $roll = Roll::init(['tn' => 3, 'ring' => 3, 'skill' => 3]);
    $this->assertCount(6, $roll->dices);
  }

  public function testCanSetMetadata()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 0],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => [],
        ],
      ],
      'metadata' => ['about' => 'Test roll'],
    ]);
    $this->assertEquals('Test roll', $roll->metadata['about']);
  }
}
