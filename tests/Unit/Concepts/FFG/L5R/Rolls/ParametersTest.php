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

  public function testErrorProperlyOnNonStringModifiers()
  {
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 3,
      'modifiers' => ['one', ['two']],
    ]);
  }

  public function testErrorProperlyOnNonExistingModifiers()
  {
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 3,
      'modifiers' => ['toto'],
    ]);
  }

  public function testCanOnlyHaveOneSchoolModifier()
  {
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 3,
      'modifiers' => ['shadow', 'deathdealer'],
    ]);
  }

  public function testAcceptChanneledDices()
  {
    $parameters = new Parameters([
      'tn' => 3,
      'ring' => 3,
      'skill' => 2,
      'channeled' => [
        ['type' => 'ring', 'value' => ['opportunity' => 1]],
        ['type' => 'skill', 'value' => ['success' => 1]],
      ],
    ]);
    $this->assertEquals(
      [
        ['type' => 'ring', 'value' => ['opportunity' => 1]],
        ['type' => 'skill', 'value' => ['success' => 1]],
      ],
      $parameters->channeled
    );
  }

  public function testRefuseChanneledDicesAboveMaxium()
  {
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'tn' => 2,
      'ring' => 1,
      'skill' => 1,
      'channeled' => [
        ['type' => 'ring', 'value' => ['explosion' => 1, 'strife' => 1]],
        ['type' => 'ring', 'value' => ['success' => 1]],
      ],
    ]);
  }

  public function testChanneledDicesCountVoidProperly()
  {
    $parameters = new Parameters([
      'tn' => 2,
      'ring' => 1,
      'skill' => 1,
      'modifiers' => ['void'],
      'channeled' => [
        ['type' => 'ring', 'value' => ['explosion' => 1, 'strife' => 1]],
        ['type' => 'ring', 'value' => ['success' => 1]],
      ],
    ]);
    $this->assertEquals(
      [
        ['type' => 'ring', 'value' => ['explosion' => 1, 'strife' => 1]],
        ['type' => 'ring', 'value' => ['success' => 1]],
      ],
      $parameters->channeled
    );
  }

  public function testRefuseInvalidChanneledDices()
  {
    $this->expectException(InvalidArgumentException::class);
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'tn' => 2,
      'ring' => 2,
      'skill' => 2,
      'channeled' => [
        ['type' => 'ring', 'value' => ['explosion' => 1]],
      ],
    ]);
  }

  public function testCanAddKeptDices()
  {
    $parameters = new Parameters([
      'ring' => 1,
      'skill' => 1,
      'addkept' => [
        ['type' => 'ring', 'value' => ['explosion' => 1, 'strife' => 1]],
      ],
    ]);
    $this->assertEquals(
      [
        ['type' => 'ring', 'value' => ['explosion' => 1, 'strife' => 1]],
      ],
      $parameters->addkept
    );
  }

  public function testRefuseKeptDicesWithStrifeIfCompromised()
  {
    $this->expectException(InvalidArgumentException::class);
    $parameters = new Parameters([
      'ring' => 1,
      'skill' => 1,
      'addkept' => [
        ['type' => 'ring', 'value' => ['explosion' => 1, 'strife' => 1]],
      ],
      'modifiers' => ['compromised'],
    ]);
  }
}
