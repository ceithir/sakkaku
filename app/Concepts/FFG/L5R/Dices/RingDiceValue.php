<?php

namespace App\Concepts\FFG\L5R\Dices;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Dices\DiceValue;

class RingDiceValue extends DiceValue
{
  const FACETS = array(
    array(),
    array('opportunity' => 1, 'strife' => 1),
    array('opportunity' => 1),
    array('strife' => 1, 'success' => 1),
    array('success' => 1),
    array('explosion' => 1, 'strife' => 1),
  );

  public function __construct(array $data)
  {
    Assertion::allInteger($data);
    $opportunity = isset($data['opportunity']) ? $data['opportunity'] : 0;
    $strife = isset($data['strife']) ? $data['strife'] : 0;
    $success = isset($data['success']) ? $data['success'] : 0;
    $explosion = isset($data['explosion']) ? $data['explosion'] : 0;
    Assertion::allGreaterOrEqualThan(array($opportunity, $strife, $success, $explosion), 0);

    Assertion::true(
      ($opportunity === 0 && $strife === 0 && $success === 0 && $explosion === 0) ||
      ($opportunity === 1 && $strife === 1 && $success === 0 && $explosion === 0) ||
      ($opportunity === 1 && $strife === 0 && $success === 0 && $explosion === 0) ||
      ($opportunity === 0 && $strife === 1 && $success === 1 && $explosion === 0) ||
      ($opportunity === 0 && $strife === 0 && $success === 1 && $explosion === 0) ||
      ($opportunity === 0 && $strife === 1 && $success === 0 && $explosion === 1)
    );

    $this->opportunity = $opportunity;
    $this->strife = $strife;
    $this->success = $success;
    $this->explosion = $explosion;
  }

  public static function random(): DiceValue
  {
    return new self(self::FACETS[array_rand(self::FACETS)]);
  }
}
