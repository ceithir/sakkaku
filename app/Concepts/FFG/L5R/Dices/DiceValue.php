<?php

namespace App\Concepts\FFG\L5R\Dices;

use App\Concepts\FFG\L5R\Dices\RingDiceValue;
use App\Concepts\FFG\L5R\Dices\SkillDiceValue;
use App\Concepts\FFG\L5R\Dices\Dice;

abstract class DiceValue
{
  public int $opportunity;

  public int $strife;

  public int $success;

  public int $explosion;

  public abstract static function random(): DiceValue;

  public abstract function getType(): string;

  public static function build(string $type, array $value): DiceValue
  {
    $class = $type === Dice::SKILL ? SkillDiceValue::class : RingDiceValue::class;
    return new $class($value);
  }
}