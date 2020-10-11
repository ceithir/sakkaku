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

  public function testCanKeepDices()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => [],
        ],
      ],
    ]);
    $roll->keep([0]);
    $this->assertCount(1, $roll->dices);
    $this->assertEquals('kept', $roll->dices[0]->status);
    $this->assertFalse($roll->isSuccess());
    $this->assertEquals(
      ['opportunity' => 0, 'strife' => 0, 'success' => 0],
      $roll->result()
    );
  }

  public function testCannotKeepZeroDice()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->keep([]);
  }

  public function testCannotKeepZeroDiceEvenIfCompromised()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['compromised']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->keep([]);
  }

  public function testCanKeepZeroDiceIfCompromisedAndNoOption()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['compromised']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => ['strife' => 1, 'success' => 1]]],
    ]);
    $roll->keep([]);
    $this->assertEquals('dropped', $roll->dices[0]->status);
    $this->assertEquals(
      ['opportunity' => 0, 'strife' => 0, 'success' => 0],
      $roll->result()
    );
  }

  public function testCannotKeepDicesWithStrifeIfCompromised()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['compromised']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => ['strife' => 1, 'success' => 1]]],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->keep([0]);
  }

  public function testCannotKeepIfRerollsArePending()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->keep([0]);
  }

  public function testCanKeepIfRerollsAreDone()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
      'metadata' => ['rerolls' => ['adversity']],
    ]);
    $roll->keep([0]);
    $this->assertEquals(
      ['opportunity' => 0, 'strife' => 0, 'success' => 0],
      $roll->result()
    );
  }

  public function testCanExplode()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 2, 'ring' => 2, 'skill' => 1],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => ['opportunity' => 1],
        ],
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => ['strife' => 1, 'explosion' => 1],
        ],
        [
          'type' => 'skill',
          'status' => 'pending',
          'value' => ['opportunity' => 1, 'success' => 1],
        ],
      ],
    ]);
    $roll->keep([1, 2]);
    $this->assertCount(4, $roll->dices);
    $this->assertTrue($roll->dices[0]->isDropped());
    $this->assertTrue($roll->dices[3]->isPending());
    $this->assertEquals('ring', $roll->dices[3]->type);
    $this->assertTrue($roll->isSuccess());
    $this->assertEquals(
      ['opportunity' => 1, 'strife' => 1, 'success' => 2],
      $roll->result()
    );
  }

  public function testCanKeepZeroDiceIfSomeDicesAreAlreadyKept()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 0],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'kept',
          'value' => ['explosion' => 1, 'strife' => 1],
        ],
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => ['opportunity' => 1, 'strife' => 1],
        ]
      ],
    ]);
    $roll->keep([]);
    $this->assertFalse($roll->isSuccess());
    $this->assertEquals(
      ['opportunity' => 0, 'strife' => 1, 'success' => 1],
      $roll->result()
    );
  }

  public function testCanReroll()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => ['distinction']],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => ['strife' => 1, 'success' => 1],
        ],
        [
          'type' => 'skill',
          'status' => 'pending',
          'value' => [],
        ],
      ],
    ]);
    $roll->reroll([1], 'distinction');
    $this->assertCount(3, $roll->dices);
    $this->assertEquals('rerolled', $roll->dices[1]->status);
    $this->assertEquals(['modifier' => 'distinction'], $roll->dices[1]->metadata);
    $this->assertEquals('skill', $roll->dices[2]->type);
    $this->assertEquals(['modifier' => 'distinction'], $roll->dices[2]->metadata);
    $this->assertEquals(['rerolls' => ['distinction']], $roll->metadata);
  }

  public function testCannotReReroll()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['distinction']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
      'metadata' => ['rerolls' => ['distinction']],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->reroll([0], 'distinction');
  }

  public function testCannotRerollIfNotAllowedInParameters()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0,],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->reroll([0], 'distinction');
  }

  public function testMustRerollBestDicesIfAdversity()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => [],
        ],
        [
          'type' => 'skill',
          'status' => 'pending',
          'value' => ['explosion' => 1],
        ],
      ],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->reroll([0], 'adversity');
  }

  public function testMustRerollUpToTwoDicesIfAdversity()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => [],
        ],
        [
          'type' => 'skill',
          'status' => 'pending',
          'value' => ['explosion' => 1],
        ],
      ],
    ]);
    $this->expectException(InvalidArgumentException::class);
    $roll->reroll([], 'adversity');
  }

  public function testCanRerollLessThanTwoDicesIfAdversityAndNotEnoughTargets()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
      'dices' => [
        [
          'type' => 'ring',
          'status' => 'pending',
          'value' => [],
        ],
        [
          'type' => 'skill',
          'status' => 'pending',
          'value' => ['explosion' => 1],
        ],
      ],
    ]);
    $roll->reroll([1], 'adversity');
    $this->assertCount(3, $roll->dices);
    $this->assertEquals('rerolled', $roll->dices[1]->status);
    $this->assertEquals(['rerolls' => ['adversity']], $roll->metadata);
  }

  public function testCanRerollNoDiceWithDistinction()
  {
    $roll = Roll::fromArray([
      'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['distinction']],
      'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => ['success' => 1]]],
    ]);
    $roll->reroll([], 'distinction');
    $this->assertCount(1, $roll->dices);
    $this->assertEquals('pending', $roll->dices[0]->status);
    $this->assertEquals(['rerolls' => ['distinction']], $roll->metadata);
  }
}
