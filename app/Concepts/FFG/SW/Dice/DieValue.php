<?php

namespace App\Concepts\FFG\SW\Dice;

class DieValue
{
    public int $success;

    public int $advantage;

    public int $triumph;

    public int $failure;

    public int $threat;

    public int $despair;

    public function __construct(array $data)
    {
        $this->success = $data['success'] ?? 0;
        $this->advantage = $data['advantage'] ?? 0;
        $this->triumph = $data['triumph'] ?? 0;
        $this->failure = $data['failure'] ?? 0;
        $this->threat = $data['threat'] ?? 0;
        $this->despair = $data['despair'] ?? 0;
    }
}
