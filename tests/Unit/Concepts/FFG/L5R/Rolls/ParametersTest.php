<?php

namespace Tests\Unit\Concepts\FFG\L5R\Rolls;

use PHPUnit\Framework\TestCase;
use Assert\InvalidArgumentException;
use App\Concepts\FFG\L5R\Rolls\Parameters;

class ParametersTest extends TestCase
{
  public function testCanInitFromArray()
  {
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 2,
    ]);
    $this->assertEquals(2, $parameters->skill);
  }

  public function testAcceptWithoutTn()
  {
    $parameters = new Parameters(['ring' => 1, 'skill' => 1]);
    $this->assertEquals(null, $parameters->tn);
  }

  public function testRefuseWithoutSkill()
  {
    $this->expectException(InvalidArgumentException::class);
    new Parameters(['tn' => 1, 'ring' => 1]);
  }

  public function testAcceptModifiers()
  {
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 2,
      'modifiers' => ['adversity', 'compromised'],
    ]);
    $this->assertEquals(['adversity', 'compromised'], $parameters->modifiers);
  }

  public function testRefuseConflictingModifiers()
  {
    $this->expectException(InvalidArgumentException::class);
    new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 2,
      'modifiers' => ['adversity', 'distinction'],
    ]);
  }

  public function testRefuseDuplicatedModifiers()
  {
    $this->expectException(InvalidArgumentException::class);
    new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 2,
      'modifiers' => ['distinction', 'distinction'],
    ]);
  }

  public function testRefuseMoreThanFiveDicesInAGivenCategory()
  {
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 6,
    ]);
  }
}
