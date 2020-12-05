<?php

namespace App\Concepts\FFG\L5R\Rolls;

class Modifier
{
  const DISTINCTION = 'distinction';
  const ADVERSITY = 'adversity';
  const COMPROMISED = 'compromised';
  const VOID = 'void';
  const STIRRING = 'stirring';
  const SHADOW = 'shadow';

  const LIST = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::COMPROMISED,
    self::VOID,
    self::STIRRING,
    self::SHADOW,
  ];

  const REROLL_ENABLERS = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::SHADOW,
  ];
}
