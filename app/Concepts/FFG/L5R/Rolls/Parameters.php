<?php

namespace App\Concepts\FFG\L5R\Rolls;

use Assert\Assertion;
use App\Concepts\FFG\L5R\Rolls\Modifier;
use App\Concepts\FFG\L5R\Dices\Dice;

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

    $ring = $parameters['ring'];
    Assertion::integer($ring);
    Assertion::between($ring, 1, 5);

    $skill = $parameters['skill'];
    Assertion::integer($skill);
    Assertion::between($skill, 0, 5);

    $modifiers = $parameters['modifiers'] ?? array();
    Assertion::isArray($modifiers);
    Assertion::allInArray($modifiers, Modifier::LIST);
    Assertion::eq(count(array_unique($modifiers)), count($modifiers));
    Assertion::false(
      in_array(Modifier::ADVERSITY, $modifiers) && in_array(Modifier::DISTINCTION, $modifiers),
      'Adversity and distinction are mutually exclusive.'
    );
    Assertion::lessOrEqualThan(
      count(array_intersect($modifiers, Modifier::SCHOOLS)),
      1
    );

    $channeled = $parameters['channeled'] ?? [];
    Assertion::isArray($channeled);
    Assertion::allIsArray($channeled);
    $channeledDices = array_map(
      function(array $data) {
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
        function(Dice $dice) {
          return $dice->type ==='ring';
        }
      )) ,
      $ring + (in_array(Modifier::VOID, $modifiers) ? 1 : 0)
    );
    Assertion::lessOrEqualThan(
      count(array_filter(
        $channeledDices,
        function(Dice $dice) {
          return $dice->type ==='skill';
        }
      )) ,
      $skill
    );

    $addkept = $parameters['addkept'] ?? [];
    Assertion::isArray($addkept);
    Assertion::allIsArray($addkept);
    foreach($addkept as $data) {
      Assertion::keyExists($data, 'type');
      Assertion::keyExists($data, 'value');
      Assertion::string($data['type']);
      Assertion::isArray($data['value']);

      $dice = Dice::initWithValue($data['type'], $data['value']);
      if (in_array(Modifier::COMPROMISED, $modifiers)) {
        Assertion::false($dice->hasStrife());
      }
    }

    $this->tn = $tn;
    $this->ring = $ring;
    $this->skill = $skill;
    $this->modifiers = $modifiers;
    $this->channeled = $channeled;
    $this->addkept = $addkept;
  }
}