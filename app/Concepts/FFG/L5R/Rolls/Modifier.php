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
  const MANIPULATOR = 'manipulator';
  const TWO_HEAVENS = "2heavens";

  const LIST = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::COMPROMISED,
    self::VOID,
    self::STIRRING,
    self::SHADOW,
    self::DEATHDEALER,
    self::ISHIKEN,
    self::MANIPULATOR,
    self::TWO_HEAVENS,
  ];

  const REROLL_ENABLERS = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::SHADOW,
    self::DEATHDEALER,
    self::MANIPULATOR,
    self::TWO_HEAVENS,
  ];

  const SCHOOLS = [
    self::SHADOW,
    self::DEATHDEALER,
    self::ISHIKEN,
    self::MANIPULATOR,
  ];
}
