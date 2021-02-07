<?php

namespace App\Concepts;

interface Roll
{
  public static function fromArray(array $data): Roll;

  public function toArray(): array;
}
