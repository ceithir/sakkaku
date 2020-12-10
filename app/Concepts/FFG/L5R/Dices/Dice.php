<?php

namespace App\Concepts\FFG\L5R\Dices;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Dices\DiceValue;
use App\Concepts\FFG\L5R\Dices\RingDiceValue;
use App\Concepts\FFG\L5R\Dices\SkillDiceValue;
use App\Concepts\FFG\L5R\Rolls\Modifier;

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

  public array $metadata;

  public function __construct(string $type, string $status, DiceValue $value, array $metadata = array())
  {
    Assertion::inArray($type, array(self::RING, self::SKILL));
    Assertion::inArray($status, array(
      self::PENDING,
      self::DROPPED,
      self::KEPT,
      self::REROLLED,
    ));
    Assertion::eq($type, $value->getType());

    $this->type = $type;
    $this->status = $status;
    $this->value = $value;
    $this->metadata = $metadata;
  }

  public static function init(string $type, array $metadata = array()): Dice
  {
    $dice = $type === self::SKILL ? SkillDiceValue::class : RingDiceValue::class;

    return new Dice(
      $type,
      self::PENDING,
      $dice::random(),
      $metadata
    );
  }

  public static function fromArray(array $data): Dice
  {
    Assertion::keyExists($data, 'type');
    Assertion::keyExists($data, 'status');
    Assertion::keyExists($data, 'value');

    return new Dice(
      $data['type'],
      $data['status'],
      DiceValue::build($data['type'], $data['value']),
      $data['metadata'] ?? array(),
    );
  }

  public static function initWithValue(string $type, $value, array $metadata = array()): Dice
  {
    Assertion::true($value instanceof DiceValue || is_array($value));

    return new Dice(
      $type,
      self::PENDING,
      $value instanceof DiceValue ? $value : DiceValue::build($type, $value),
      $metadata
    );
  }

  public function isPending(): bool
  {
    return $this->status === Dice::PENDING;
  }

  public function isKept(): bool
  {
    return $this->status === Dice::KEPT;
  }

  public function isDropped(): bool
  {
    return $this->status === Dice::DROPPED;
  }

  public function keep(): void
  {
    Assertion::true($this->isPending());
    $this->status = Dice::KEPT;
  }

  public function drop(): void
  {
    Assertion::true($this->isPending());
    $this->status = Dice::DROPPED;
  }

  public function reroll(string $modifier): void
  {
    Assertion::true($this->isPending());
    $this->status = Dice::REROLLED;
    $this->metadata['end'] = $modifier;
  }

  public function isSuccess(): bool
  {
    return $this->value->success > 0 || $this->value->explosion > 0;
  }

  public function hasStrife(): bool
  {
    return $this->value->strife > 0;
  }

  public function isBlank(): bool
  {
    return $this->value->strife === 0 && $this->value->opportunity === 0 && $this->value->success === 0 && $this->value->explosion === 0;
  }
}
