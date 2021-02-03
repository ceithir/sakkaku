<?php

namespace App\Concepts\FFG\L5R;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Dices\InheritanceDice;

class InheritanceRoll
{
  public array $dices;

  public array $metadata;

  public function __construct(array $dices, array $metadata = array())
  {
    Assertion::allIsInstanceOf($dices, InheritanceDice::class);

    $this->dices = $dices;
    $this->metadata = $metadata;
  }

  public static function init(): InheritanceRoll
  {
    return new InheritanceRoll(
      [
        InheritanceDice::init(),
        InheritanceDice::init(),
      ]
    );
  }

  public static function fromArray(array $data): InheritanceRoll
  {
    Assertion::keyExists($data, 'dices');
    $dices = $data['dices'];
    Assertion::allKeyExists($dices, 'value');
    Assertion::allKeyExists($dices, 'status');
    $metadata = $data['metadata'] ?? array();

    return new InheritanceRoll(
      array_map(
        function (array $dice) {
          return new InheritanceDice($dice['value'], $dice['status']);
        },
        $dices
      ),
      $metadata,
    );
  }

  public function keep(int $position): void
  {
    Assertion::between($position, 0, count($this->dices)-1);
    foreach ($this->dices as $dice) {
      Assertion::true($dice->isPending());
    }
    for ($i=0; $i < count($this->dices); $i++) {
      if ($i === $position) {
        $this->dices[$i]->keep();
      } else {
        $this->dices[$i]->drop();
      }
    }
    $finalDice = InheritanceDice::init();
    $finalDice->keep();
    $this->dices[] = $finalDice;
  }
}
