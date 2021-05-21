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
  const RUTHLESS = "ruthless"; // Custom reroll with a GM-timing. More or less legacy as no actual human will ever use that.
  const SAILOR = 'sailor';
  const WANDERING = 'wandering';

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
    self::RUTHLESS,
    self::SAILOR,
    self::WANDERING,
  ];

  const REROLL_ENABLERS = [
    self::DISTINCTION,
    self::ADVERSITY,
    self::SHADOW,
    self::DEATHDEALER,
    self::MANIPULATOR,
    self::TWO_HEAVENS,
    self::RUTHLESS,
    self::SAILOR,
  ];

  const ADVANTAGE_REROLLS = [
    self::ADVERSITY,
    self::DISTINCTION,
    self::DEATHDEALER,
    self::MANIPULATOR
  ];

  const GM_REROLLS = [
    self::TWO_HEAVENS,
    self::RUTHLESS,
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
    self::WANDERING,
  ];

  public static function isValidModifier(string $modifier): bool
  {
    if (self::isSpecialReroll($modifier) || self::isSpecialAlteration($modifier)) {
      return true;
    }

    if (self::isAssistModifier($modifier)) {
      return true;
    }

    return in_array($modifier, Modifier::LIST);
  }

  public static function isSpecialReroll(string $modifier): bool
  {
    return (bool) preg_match('/^ruleless([0-9]{2})?$/', $modifier);
  }

  public static function isRerollModifier(string $modifier): bool
  {
    if (self::isSpecialReroll($modifier)) {
      return true;
    }

    return in_array($modifier, self::REROLL_ENABLERS);
  }

  public static function isSpecialAlteration(string $modifier): bool
  {
    return (bool) preg_match('/^reasonless([0-9]{2})?$/', $modifier);
  }

  public static function isAlterationModifier(string $modifier): bool
  {
    if (self::isSpecialAlteration($modifier)) {
      return true;
    }

    return in_array($modifier, self::ALTERATION_ENABLERS);
  }

  public static function isAssistModifier(string $modifier): bool
  {
    return self::isSkilledAssistModifier($modifier) || self::isUnskilledAssistModifier($modifier);
  }

  public static function isSkilledAssistModifier(string $modifier): bool
  {
    return (bool) preg_match('/^skilledassist([0-9]{2})$/', $modifier);
  }

  public static function isUnskilledAssistModifier(string $modifier): bool
  {
    return (bool) preg_match('/^unskilledassist([0-9]{2})$/', $modifier);
  }
}
