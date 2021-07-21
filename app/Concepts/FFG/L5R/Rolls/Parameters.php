<?php

namespace App\Concepts\FFG\L5R\Rolls;

use App\Concepts\FFG\L5R\Dices\Dice;
use Assert\Assertion;

class Parameters
{
    public ?int $tn;

    public int $ring;

    public int $skill;

    public array $modifiers;

    public array $channeled;

    public array $addkept;

    public function __construct(array $parameters)
    {
        Assertion::keyExists($parameters, 'ring');
        Assertion::keyExists($parameters, 'skill');

        $tn = $parameters['tn'] ?? null;
        Assertion::nullOrInteger($tn);
        Assertion::nullOrGreaterOrEqualThan($tn, 1);
        $this->tn = $tn;

        $ring = $parameters['ring'];
        Assertion::integer($ring);
        Assertion::between($ring, 0, 10);
        $this->ring = $ring;

        $skill = $parameters['skill'];
        Assertion::integer($skill);
        Assertion::between($skill, 0, 10);
        $this->skill = $skill;

        $modifiers = $parameters['modifiers'] ?? [];
        Assertion::isArray($modifiers);
        $this->setModifiers($modifiers);

        $channeled = $parameters['channeled'] ?? [];
        Assertion::isArray($channeled);
        $this->setChanneled($channeled);

        $addkept = $parameters['addkept'] ?? [];
        Assertion::isArray($addkept);
        $this->setAddKept($addkept);
    }

    public function setModifiers(array $modifiers)
    {
        Assertion::allString($modifiers);
        array_walk(
            $modifiers,
            function (string $modifier) {
          Assertion::true(Modifier::isValidModifier($modifier));
      },
        );
        Assertion::eq(count(array_unique($modifiers)), count($modifiers));
        Assertion::false(
            in_array(Modifier::ADVERSITY, $modifiers) && in_array(Modifier::DISTINCTION, $modifiers),
            'Adversity and distinction are mutually exclusive.'
        );
        Assertion::lessOrEqualThan(
            count(array_intersect($modifiers, Modifier::SCHOOLS)),
            1
        );
        Assertion::between(count(array_filter(
            $modifiers,
            function (string $modifier) {
          return Modifier::isUnskilledAssistModifier($modifier);
      }
        )), 0, 1);
        Assertion::between(count(array_filter(
            $modifiers,
            function (string $modifier) {
          return Modifier::isSkilledAssistModifier($modifier);
      }
        )), 0, 1);

        $this->modifiers = $modifiers;
    }

    public function setAddKept(array $addkept)
    {
        Assertion::allIsArray($addkept);
        foreach ($addkept as $data) {
            Assertion::keyExists($data, 'type');
            Assertion::keyExists($data, 'value');
            Assertion::string($data['type']);
            Assertion::isArray($data['value']);

            $dice = Dice::initWithValue($data['type'], $data['value']);
            if (in_array(Modifier::COMPROMISED, $this->modifiers)) {
                Assertion::false($dice->hasStrife());
            }
        }
        $this->addkept = $addkept;
    }

    public function ringDiceRolled(): int
    {
        $total = $this->ring;

        if (in_array(Modifier::VOID, $this->modifiers)) {
            ++$total;
        }

        $total += $this->unskilledAssistCount();

        return $total;
    }

    public function skillDiceRolled(): int
    {
        $total = $this->skill;

        if (in_array(Modifier::WANDERING, $this->modifiers)) {
            ++$total;
        }

        $total += $this->skilledAssistCount();

        return $total;
    }

    public function defaultKeepable(): int
    {
        $total = $this->ring;

        if (in_array(Modifier::VOID, $this->modifiers)) {
            ++$total;
        }

        $total += $this->unskilledAssistCount();
        $total += $this->skilledAssistCount();

        return $total;
    }

    public function skilledAssistCount(): int
    {
        foreach ($this->modifiers as $modifier) {
            if (Modifier::isSkilledAssistModifier($modifier)) {
                return (int) substr($modifier, -2);
            }
        }

        return 0;
    }

    public function unskilledAssistCount(): int
    {
        foreach ($this->modifiers as $modifier) {
            if (Modifier::isUnskilledAssistModifier($modifier)) {
                return (int) substr($modifier, -2);
            }
        }

        return 0;
    }

    private function setChanneled(array $channeled)
    {
        Assertion::allIsArray($channeled);
        $channeledDices = array_map(
            function (array $data) {
          Assertion::keyExists($data, 'type');
          Assertion::keyExists($data, 'value');
          Assertion::string($data['type']);
          Assertion::isArray($data['value']);

          return Dice::initWithValue($data['type'], $data['value']);
      },
            $channeled
        );
        Assertion::lessOrEqualThan(
            count(array_filter(
          $channeledDices,
          function (Dice $dice) {
            return 'ring' === $dice->type;
        }
      )),
            $this->ringDiceRolled()
        );
        Assertion::lessOrEqualThan(
            count(array_filter(
          $channeledDices,
          function (Dice $dice) {
            return 'skill' === $dice->type;
        }
      )),
            $this->skillDiceRolled()
        );
        $this->channeled = $channeled;
    }
}
