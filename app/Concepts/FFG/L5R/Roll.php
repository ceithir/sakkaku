<?php

namespace App\Concepts\FFG\L5R;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Rolls\Parameters;
use App\Concepts\FFG\L5R\Dices\Dice;
use App\Concepts\FFG\L5R\Rolls\Modifier;

class Roll
{
  public Parameters $parameters;

  public array $dices;

  public array $metadata;

  public function __construct(
    Parameters $parameters,
    array $dices,
    array $metadata = array()
  ) {
    Assertion::allIsInstanceOf($dices, Dice::class);

    $this->parameters = $parameters;
    $this->dices = $dices;
    $this->metadata = $metadata;
  }

  public static function init(array $data): Roll
  {
    $parameters = new Parameters($data);
    $dices = [];
    for ($i = 0; $i < $parameters->ring; $i++) {
      $dices[] = Dice::init(Dice::RING);
    }
    for ($i = 0; $i < $parameters->skill; $i++) {
      $dices[] = Dice::init(Dice::SKILL);
    }
    return new self(
      $parameters,
      $dices
    );
  }

  public static function fromArray(array $data): Roll
  {
    Assertion::keyExists($data, 'parameters');
    Assertion::keyExists($data, 'dices');
    Assertion::isArray($data['dices']);

    return new self(
      new Parameters($data['parameters']),
      array_map(function(array $dice) {
        return Dice::fromArray($dice);
      }, $data['dices']),
      $data['metadata'] ?? array()
    );
  }

  public function keep(array $positions): void
  {
    Assertion::false($this->requiresReroll());

    $this->assertPositions($positions);

    if ($this->isCompromised()) {
      $this->assertKeepWhenCompromised($positions);
    } else {
      Assertion::greaterOrEqualThan(count($positions), 1);
    }

    $explosions = [];
    for ($i=0; $i < count($this->dices); $i++) {
      $dice = $this->dices[$i];
      if ($dice->isPending()) {
        if (in_array($i, $positions)) {
          $dice->keep();
          for ($j = 0; $j < $dice->value->explosion; $j++) {
            $explosions[] = Dice::init($dice->type);
          }
        } else {
          $dice->drop();
        }
      }
    }

    $this->dices = array_values(array_merge(
      $this->dices,
      $explosions,
    ));
  }

  public function isCompromised(): bool
  {
    return in_array(Modifier::COMPROMISED, $this->parameters->modifiers);
  }

  public function requiresReroll(): bool
  {
    foreach([Modifier::ADVERSITY, Modifier::DISTINCTION] as $modifier) {
      if (in_array($modifier, $this->parameters->modifiers)) {
        if (!isset($this->metadata['rerolls']) || !in_array($modifier, $this->metadata['rerolls'])) {
          return true;
        }
      }
    }

    return false;
  }

  public function result(): array
  {
    return array_reduce(
      array_filter(
        $this->dices,
        function(Dice $dice) {
          return $dice->isKept();
        }
      ),
      function(array $carry, Dice $dice) {
        return [
          'opportunity' => $carry['opportunity'] + $dice->value->opportunity,
          'strife' => $carry['strife'] + $dice->value->strife,
          'success' => $carry['success'] + $dice->value->success + $dice->value->explosion,
        ];
      },
      ['opportunity' => 0, 'success' => 0, 'strife' => 0]
    );
  }

  public function isSuccess(): bool
  {
    return $this->result()['success'] >= $this->parameters->tn;
  }

  private function assertPositions(array $positions)
  {
    Assertion::allInteger($positions);
    Assertion::allBetween($positions, 0, count($this->dices)-1);
    Assertion::eq(count(array_unique($positions)), count($positions));
    foreach($positions as $position) {
      Assertion::true($this->dices[$position]->isPending());
    }
  }

  // Compromised: Cannot keep dice with strife
  private function assertKeepWhenCompromised(array $positions)
  {
    foreach($positions as $position) {
      Assertion::false($this->dices[$position]->hasStrife());
    }

    $atLeastOneNonStrifeDice = count(
      array_filter(
        $this->dices,
        function(Dice $dice) {
          return $dice->isPending() && !$dice->hasStrife();
        }
      )
    ) > 0;

    if ($atLeastOneNonStrifeDice) {
      Assertion::greaterOrEqualThan(count($positions), 1);
    }
  }
}
