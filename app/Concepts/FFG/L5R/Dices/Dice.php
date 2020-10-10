<?php

namespace App\Concepts\FFG\L5R\Dices;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Dices\DiceValue;
use App\Concepts\FFG\L5R\Dices\RingDiceValue;
use App\Concepts\FFG\L5R\Dices\SkillDiceValue;

class Dice
{
  const PENDING = 'pending';
  const DROPPED = 'dropped';
  const KEPT = 'kept';
  const REROLLED = 'rerolled';

  const RING = 'ring';
  const SKILL = 'skill';

  public string $type;

  public string $status;

  public DiceValue $value;

  public function __construct(string $type, string $status, DiceValue $value)
  {
    Assertion::inArray($type, array(self::RING, self::SKILL));
    Assertion::inArray($status, array(
      self::PENDING,
      self::DROPPED,
      self::KEPT,
      self::REROLLED,
    ));

    $this->type = $type;
    $this->status = $status;
    $this->value = $value;
  }

  public static function init(string $type): Dice
  {
    $dice = $type === self::SKILL ? SkillDiceValue::class : RingDiceValue::class;

    return new Dice(
      $type,
      self::PENDING,
      $dice::random()
    );
  }

  public static function fromArray(array $data): Dice
  {
    Assertion::keyExists($data, 'type');
    Assertion::keyExists($data, 'status');
    Assertion::keyExists($data, 'value');

    $type = $data['type'];
    $dice = $type === self::SKILL ? SkillDiceValue::class : RingDiceValue::class;

    return new Dice(
      $type,
      $data['status'],
      new $dice($data['value'])
    );
  }
}