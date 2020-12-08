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
    if (in_array(Modifier::VOID, $parameters->modifiers)) {
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
    $this->assertKeepable($positions);

    $explosions = [];
    for ($i=0; $i < count($this->dices); $i++) {
      $dice = $this->dices[$i];
      if ($dice->isPending()) {
        if (in_array($i, $positions)) {
          $dice->keep();
          for ($j = 0; $j < $dice->value->explosion; $j++) {
            $explosions[] = Dice::init($dice->type, ['source' => 'explosion']);
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

  public function reroll(array $positions, string $modifier): void
  {
    $this->assertRerollable($positions, $modifier);

    $rerolls = [];
    foreach($positions as $position) {
      $dice = $this->dices[$position];
      $dice->reroll($modifier);
      $rerolls[] = Dice::init(
        $dice->type,
        [
          'source' => $modifier,
        ]
      );
    }

    $this->dices = array_values(array_merge(
      $this->dices,
      $rerolls,
    ));
    $this->appendToRerollMetadata($modifier);

    if ($modifier === Modifier::DISTINCTION) {
      if (in_array(Modifier::DEATHDEALER, $this->parameters->modifiers)) {
        $this->appendToRerollMetadata(Modifier::DEATHDEALER);
      }
      if (in_array(Modifier::MANIPULATOR, $this->parameters->modifiers)) {
        $this->appendToRerollMetadata(Modifier::MANIPULATOR);
      }
    }
  }

  public function alter(array $alterations, string $modifier): void
  {
    Assertion::false($this->requiresReroll());
    Assertion::true($this->requiresAlteration());
    Assertion::inArray($modifier, $this->parameters->modifiers);
    Assertion::notInArray($modifier, $this->getRerolls());

    $positions = array_map(
      function (array $alteration) {
        return $alteration['position'];
      },
      $alterations
    );
    $this->assertPositions($positions);

    Assertion::eq($modifier, Modifier::ISHIKEN);
    $this->assertIshiken($alterations);

    $rerolls = [];
    foreach($alterations as $alteration) {
      $position = $alteration['position'];
      $value = $alteration['value'];
      $originalDice = $this->dices[$position];
      $alteredDice = Dice::fromArray([
        'status' => 'pending',
        'type' => $originalDice->type,
        'value' => $value,
        'metadata' => ['source' => $modifier],
      ]);

      $originalDice->reroll($modifier);
      $rerolls[] = $alteredDice;
    }

    $this->dices = array_values(array_merge(
      $this->dices,
      $rerolls,
    ));
    $this->appendToRerollMetadata($modifier);
  }

  public function isCompromised(): bool
  {
    return in_array(Modifier::COMPROMISED, $this->parameters->modifiers);
  }

  public function requiresReroll(): bool
  {
    foreach(Modifier::REROLL_ENABLERS as $modifier) {
      if (in_array($modifier, $this->parameters->modifiers)) {
        if (!in_array($modifier, $this->getRerolls())) {
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

  public function toArray(): array
  {
    return json_decode(json_encode($this), true);
  }

  public function isComplete(): bool
  {
    return count(array_filter(
      $this->dices,
      function(Dice $dice) {
        return $dice->isPending();
      }
    )) === 0;
  }

  private function assertPositions(array $positions): void
  {
    Assertion::allInteger($positions);
    Assertion::allBetween($positions, 0, count($this->dices)-1);
    Assertion::eq(count(array_unique($positions)), count($positions));
    foreach($positions as $position) {
      Assertion::true($this->dices[$position]->isPending());
    }
  }

  private function assertKeepable(array $positions): void
  {
    Assertion::false($this->requiresReroll());
    Assertion::false($this->requiresAlteration());
    $this->assertPositions($positions);

    if ($this->isCompromised()) {
      foreach($positions as $position) {
        Assertion::false($this->dices[$position]->hasStrife());
      }
      $noNonStrifeDiceAvailable = count(
        array_filter(
          $this->dices,
          function(Dice $dice) {
            return $dice->isPending() && !$dice->hasStrife();
          }
        )
      ) === 0;
      if ($noNonStrifeDiceAvailable) {
        return;
      }
    }

    $existingKeptDicesCount = count(array_filter(
      $this->dices,
      function(Dice $dice) {
        return $dice->isKept();
      }
    ));
    Assertion::between($existingKeptDicesCount + count($positions), 1, $this->maxKeepable());
  }

  private function maxKeepable(): int
  {
    $total = $this->parameters->ring;

    if (in_array(Modifier::VOID, $this->parameters->modifiers)) {
      $total += 1;
    }

    $total += array_reduce(
      $this->dices,
      function(int $carry, Dice $dice) {
        if (!$dice->isKept()) {
          return $carry;
        }
        return $carry + $dice->value->explosion;
      },
      0
    );

    return $total;
  }

  private function getRerolls(): array
  {
    return $this->metadata['rerolls'] ?? array();
  }

  private function assertRerollable(array $positions, string $modifier)
  {
    Assertion::true($this->requiresReroll());
    Assertion::inArray($modifier, Modifier::REROLL_ENABLERS);
    Assertion::inArray($modifier, $this->parameters->modifiers);
    Assertion::notInArray($modifier, $this->getRerolls());
    $this->assertPositions($positions);

    if (in_array($modifier, [Modifier::ADVERSITY, Modifier::TWO_HEAVENS])) {
      foreach($positions as $position) {
        Assertion::true($this->dices[$position]->isSuccess());
      }

      $min = $modifier === Modifier::ADVERSITY ? 2: 1;
      $successDices = array_filter(
        $this->dices,
        function(Dice $dice) {
          return $dice->isPending() && $dice->isSuccess();
        }
      );
      Assertion::eq(min($min, count($successDices)), count($positions));
    }

    if ($modifier === Modifier::DISTINCTION) {
      if (in_array(Modifier::DEATHDEALER, $this->parameters->modifiers) || in_array(Modifier::MANIPULATOR, $this->parameters->modifiers)) {
        return;
      }

      if (in_array(Modifier::STIRRING, $this->parameters->modifiers)) {
        Assertion::between(count($positions), 0, 3);
      } else {
        Assertion::between(count($positions), 0, 2);
      }
    }

    if ($modifier === Modifier::TWO_HEAVENS) {
      foreach([Modifier::ADVERSITY, Modifier::DISTINCTION, Modifier::DEATHDEALER, Modifier::MANIPULATOR] as $mod) {
        if (in_array($mod, $this->parameters->modifiers)) {
          Assertion::inArray($mod, $this->getRerolls());
        }
      }
    }

    if (in_array($modifier, Modifier::SCHOOLS)) {
      foreach([Modifier::ADVERSITY, Modifier::DISTINCTION] as $mod) {
        if (in_array($mod, $this->parameters->modifiers)) {
          Assertion::inArray($mod, $this->getRerolls());
        }
      }
      if (in_array(Modifier::TWO_HEAVENS, $this->parameters->modifiers) && !in_array($modifier, [Modifier::DEATHDEALER, Modifier::MANIPULATOR])) {
        Assertion::inArray(Modifier::TWO_HEAVENS, $this->getRerolls());
      }
    }
  }

  private function assertIshiken(array $alterations)
  {
    $positions = array_map(
      function (array $alteration) {
        return $alteration['position'];
      },
      $alterations
    );
    $chosenDices = array_intersect_key($this->dices, array_flip($positions));
    $blankDices = array_filter(
      $chosenDices,
      function(Dice $dice) {
        return $dice->isBlank();
      }
    );
    Assertion::true(count($blankDices) === 0 || count($blankDices) === count($chosenDices));
    foreach ($alterations as $alteration) {
      $position = $alteration['position'];
      $value = $alteration['value'];
      $chosenDice = $this->dices[$position];
      $alteredDice = Dice::fromArray([
        'status' => 'pending',
        'type' => $chosenDice->type,
        'value' => $value,
      ]);
      Assertion::true(
        ($chosenDice->isBlank() && !$alteredDice->isBlank()) || (!$chosenDice->isBlank() && $alteredDice->isBlank())
      );
    }
  }

  private function requiresAlteration(): bool
  {
    return in_array(Modifier::ISHIKEN, $this->parameters->modifiers) && !in_array(Modifier::ISHIKEN, $this->getRerolls());
  }

  private function appendToRerollMetadata(string $modifier): void
  {
    $this->metadata['rerolls'] = array_values(array_merge(
      $this->getRerolls(),
      [$modifier],
    ));
  }
}
