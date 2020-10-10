<?php

namespace App\Concepts\FFG\L5R\Dices;

abstract class DiceValue
{
  public int $opportunity;

  public int $strife;

  public int $success;

  public int $explosion;

  public abstract static function random(): DiceValue;
}