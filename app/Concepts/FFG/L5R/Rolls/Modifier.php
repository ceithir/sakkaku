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
  const RULELESS = "ruleless";
  const RUTHLESS = "ruthless";
  const SAILOR = 'sailor';
  const REASONLESS = 'reasonless';

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
    self::RULELESS,
    self::RUTHLESS,
    self::SAILOR,
    self::REASONLESS,
  ];

  const REROLL_ENABLERS = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::SHADOW,
    self::DEATHDEALER,
    self::MANIPULATOR,
    self::TWO_HEAVENS,
    self::RULELESS,
    self::RUTHLESS,
    self::SAILOR,
  ];

  const SCHOOLS = [
    self::SHADOW,
    self::DEATHDEALER,
    self::ISHIKEN,
    self::MANIPULATOR,
    self::SAILOR,
  ];

  const ALTERATION_ENABLERS = [
    self::ISHIKEN,
    self::REASONLESS,
  ];
}
