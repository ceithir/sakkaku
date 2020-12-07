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
  const DEATHDEALER = 'deathdealer';
  const ISHIKEN = 'ishiken';

  const LIST = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::COMPROMISED,
    self::VOID,
    self::STIRRING,
    self::SHADOW,
    self::DEATHDEALER,
    self::ISHIKEN,
  ];

  const REROLL_ENABLERS = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::SHADOW,
    self::DEATHDEALER,
  ];

  const SCHOOLS = [
    self::SHADOW,
    self::DEATHDEALER,
    self::ISHIKEN,
  ];
}
