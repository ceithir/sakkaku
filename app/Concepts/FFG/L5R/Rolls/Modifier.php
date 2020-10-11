<?php

namespace App\Concepts\FFG\L5R\Rolls;

class Modifier
{
  const DISTINCTION = 'distinction';
  const ADVERSITY = 'adversity';
  const COMPROMISED = 'compromised';

  const LIST = [self::DISTINCTION, self::ADVERSITY, self::COMPROMISED];
}
