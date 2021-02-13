<?php

namespace App\Concepts\FFG\L5R;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Rolls\Parameters;
use App\Concepts\FFG\L5R\Dices\Dice;
use App\Concepts\FFG\L5R\Rolls\Modifier;
use App\Concepts\Roll as RollInterface;

class Roll implements RollInterface
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

    $channeledDices = array_map(
      function(array $data) {
        return Dice::initWithValue(
          $data['type'],
          $data['value'],
          ['source' => 'channeled']
        );
      },
      $parameters->channeled
    );

    $channeledRingDices = array_filter(
      $channeledDices,
      function(Dice $dice) {
        return $dice->type ==='ring';
      }
    );
    foreach($channeledRingDices as $dice) {
      $dices[] = $dice;
    }
    for ($i = 0; $i < $parameters->ringDiceRolled() - count($channeledRingDices); $i++) {
      $dices[] = Dice::init(Dice::RING);
    }
    $channeledSkillDices = array_filter(
      $channeledDices,
      function(Dice $dice) {
        return $dice->type ==='skill';
      }
    );
    foreach($channeledSkillDices as $dice) {
      $dices[] = $dice;
    }
    for ($i = 0; $i < $parameters->skillDiceRolled() - count($channeledSkillDices); $i++) {
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
    $noKeptDiceYet = $this->hasNoKeptDice();

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

    $extraKeptDices = [];
    if ($noKeptDiceYet) {
      foreach($this->parameters->addkept as $data) {
        $dice = Dice::fromArray([
          'status' => Dice::KEPT,
          'type' => $data['type'],
          'value' => $data['value'],
          'metadata' => ['source' => 'addkept'],
        ]);
        $extraKeptDices[] = $dice;
        for ($j = 0; $j < $dice->value->explosion; $j++) {
          $explosions[] = Dice::init($dice->type, ['source' => 'explosion']);
        }
      }
    }

    $this->dices = array_values(array_merge(
      $this->dices,
      $extraKeptDices,
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
    $this->assertAlterable($alterations, $modifier);

    $rerolls = [];
    foreach($alterations as $alteration) {
      $position = $alteration['position'];
      $value = $alteration['value'];
      $originalDice = $this->dices[$position];
      $alteredDice = Dice::initWithValue(
        $originalDice->type,
        $value,
        ['source' => $modifier],
      );

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
    foreach ($this->parameters->modifiers as $modifier) {
      if (Modifier::isRerollModifier($modifier)) {
        if (!in_array($modifier, $this->getRerolls())) {
          return true;
        }
      }
    }

    return false;
  }

  public function updateParameters(array $parameters)
  {
    Assertion::false($this->isComplete());

    if (isset($parameters['modifiers'])) {
      $modifiers = $parameters['modifiers'];
      Assertion::allString($modifiers);
      Assertion::count(
        array_diff($this->parameters->modifiers, $modifiers),
        0,
        'Can only add modifiers, not remove/change some.'
      );

      Assertion::true($this->hasNoKeptDice());
      $newModifiers = array_diff($modifiers, $this->parameters->modifiers);
      array_walk(
        $newModifiers,
        function (string $modifier) {
          Assertion::true(
            Modifier::isSpecialReroll($modifier) || Modifier::isSpecialAlteration($modifier),
            'Can only add specific reroll modifiers for now.'
          );
        }
      );

      $this->parameters->setModifiers($modifiers);
    }

    if (isset($parameters['addkept'])) {
      Assertion::true($this->hasNoKeptDice());

      $addkept = $parameters['addkept'];
      Assertion::isArray($addkept);
      $this->parameters->setAddKept($addkept);
    }
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

  public function hasNoKeptDice(): bool
  {
    return count(array_filter(
      $this->dices,
      function (Dice $dice) {
        return $dice->status ===  Dice::KEPT;
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
    if ($existingKeptDicesCount > 0) {
      $existingKeptDicesCount -= count($this->parameters->addkept);
    }
    Assertion::between($existingKeptDicesCount + count($positions), 1, $this->maxKeepable());
  }

  private function maxKeepable(): int
  {
    $total = $this->parameters->ringDiceRolled();

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
    Assertion::true(Modifier::isRerollModifier($modifier));
    Assertion::inArray($modifier, $this->parameters->modifiers);
    Assertion::notInArray($modifier, $this->getRerolls());
    $this->assertPositions($positions);

    if (in_array($modifier, [Modifier::ADVERSITY, Modifier::TWO_HEAVENS])) {
      foreach($positions as $position) {
        Assertion::true($this->dices[$position]->isSuccess());
      }

      $successDices = array_filter(
        $this->dices,
        function(Dice $dice) {
          return $dice->isPending() && $dice->isSuccess();
        }
      );
      if ($modifier === Modifier::ADVERSITY) {
        Assertion::eq(count($positions), min(2, count($successDices)));
      }
      if ($modifier === Modifier::TWO_HEAVENS) {
        Assertion::greaterOrEqualThan(count($positions), min(1, count($successDices)));
      }
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

    if ($modifier === Modifier::SAILOR && $this->isCompromised()) {
      Assertion::count($positions, 0);
    }

    // Cannot use Scorpion technique if there is an unrerolled distinction
    if (in_array($modifier, [Modifier::DEATHDEALER, Modifier::MANIPULATOR])) {
      if (in_array(Modifier::DISTINCTION, $this->parameters->modifiers)) {
        Assertion::inArray(Modifier::DISTINCTION, $this->getRerolls());
      }
    }

    if (!in_array($modifier, Modifier::ADVANTAGE_REROLLS)) {
      $this->assertAdvantageRerollsDone();
      if (!in_array($modifier, Modifier::GM_REROLLS)) {
        $this->assertGmRerollsDone();
      }
    }
  }

  private function assertAdvantageRerollsDone()
  {
    foreach(Modifier::ADVANTAGE_REROLLS as $mod) {
      if (in_array($mod, $this->parameters->modifiers)) {
        Assertion::inArray($mod, $this->getRerolls());
      }
    }
  }

  private function assertGmRerollsDone()
  {
    foreach(Modifier::GM_REROLLS as $mod) {
      if (in_array($mod, $this->parameters->modifiers)) {
        Assertion::inArray($mod, $this->getRerolls());
      }
    }
  }

  private function assertAlterable(array $alterations, string $modifier)
  {
    Assertion::true(Modifier::isAlterationModifier($modifier));
    $this->assertAdvantageRerollsDone();
    $this->assertGmRerollsDone();
    Assertion::true($this->requiresAlteration());
    Assertion::inArray($modifier, $this->parameters->modifiers);
    Assertion::notInArray($modifier, $this->getRerolls());

    Assertion::allKeyExists($alterations, 'position');
    $positions = array_map(
      function (array $alteration) {
        return $alteration['position'];
      },
      $alterations
    );
    $this->assertPositions($positions);

    foreach ($alterations as $alteration) {
      Assertion::keyExists($alteration, 'value');
      Assertion::isArray($alteration['value']);

      Dice::initWithValue(
        $this->dices[$alteration['position']]->type,
        $alteration['value'],
      );
    }

    if ($modifier === Modifier::ISHIKEN) {
      $this->assertIshiken($alterations);
    }
    if ($modifier === Modifier::WANDERING) {
      $this->assertWandering($alterations);
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
      $chosenDice = $this->dices[$alteration['position']];
      $alteredDice = Dice::initWithValue(
        $chosenDice->type,
        $alteration['value'],
      );
      Assertion::true(
        ($chosenDice->isBlank() && !$alteredDice->isBlank()) || (!$chosenDice->isBlank() && $alteredDice->isBlank())
      );
    }
  }

  private function assertWandering(array $alterations)
  {
    foreach ($alterations as $alteration) {
      $chosenDice = $this->dices[$alteration['position']];
      $alteredDice = Dice::initWithValue(
        $chosenDice->type,
        $alteration['value'],
      );
      Assertion::eq($alteredDice->value->opportunity, 1);
      Assertion::eq($alteredDice->value->success, 0);
      Assertion::eq($alteredDice->value->explosion, 0);
      Assertion::eq($alteredDice->value->strife, 0);
    }
  }

  private function requiresAlteration(): bool
  {
    foreach ($this->parameters->modifiers as $modifier) {
      if (Modifier::isAlterationModifier($modifier)) {
        if (!in_array($modifier, $this->getRerolls())) {
          return true;
        }
      }
    }

    return false;
  }

  private function appendToRerollMetadata(string $modifier): void
  {
    $this->metadata['rerolls'] = array_values(array_merge(
      $this->getRerolls(),
      [$modifier],
    ));
  }
}
