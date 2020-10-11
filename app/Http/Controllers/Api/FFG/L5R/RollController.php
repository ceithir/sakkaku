<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Concepts\FFG\L5R\Roll;
use Assert\Assertion;
use Assert\InvalidArgumentException;

class RollController extends Controller
{
    public function create(Request $request)
    {
      return $this->handleRequest('create', $request);
    }

    public function keep(Request $request)
    {
      return $this->handleRequest('keep', $request);
    }

    public function reroll(Request $request)
    {
      return $this->handleRequest('reroll', $request);
    }

    private function handleRequest($action, Request $request)
    {
      Assertion::inArray($action, ['create', 'keep', 'reroll']);
      try {
        if ($action === 'create') {
          return response()->json(Roll::init($request->all()), 201);
        }

        $roll = Roll::fromArray($request->input('roll'));
        if ($action === 'reroll') {
          $roll->reroll($request->input('positions'), $request->input('modifier'));
        }
        if ($action === 'keep') {
          $roll->keep($request->input('positions'));
        }
        return response()->json($roll);
      } catch (InvalidArgumentException $e) {
        report($e);
        return response(null, 400);
      }
    }
}
