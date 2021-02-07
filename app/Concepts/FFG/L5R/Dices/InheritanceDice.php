<?php

namespace App\Concepts\FFG\L5R\Dices;

use Assert\Assertion;

class InheritanceDice
{
  const PENDING = 'pending';
  const DROPPED = 'dropped';
  const KEPT = 'kept';

  public string $status;

  public int $value;

  public function __construct(int $value, string $status)
  {
    Assertion::inArray($status, array(
      self::PENDING,
      self::DROPPED,
      self::KEPT,
    ));
    Assertion::between($value, 1, 10);

    $this->status = $status;
    $this->value = $value;
  }

  public static function init(): InheritanceDice
  {
    return new InheritanceDice(
      random_int(1, 10),
      self::PENDING
    );
  }

  public function isPending(): bool
  {
    return $this->status === self::PENDING;
  }

  public function isKept(): bool
  {
    return $this->status === self::KEPT;
  }

  public function drop(): void
  {
    $this->status = self::DROPPED;
  }

  public function keep(): void
  {
    $this->status = self::KEPT;
  }
}
