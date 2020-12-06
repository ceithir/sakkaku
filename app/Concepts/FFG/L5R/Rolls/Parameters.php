<?php

namespace App\Concepts\FFG\L5R\Rolls;

use Assert\Assertion;
use App\Concepts\Rolls\Modifiers;

class Parameters
{
  public ?int $tn;

  public int $ring;

  public int $skill;

  public array $modifiers;

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

    $this->tn = $tn;
    $this->ring = $ring;
    $this->skill = $skill;
    $this->modifiers = $modifiers;
  }
}