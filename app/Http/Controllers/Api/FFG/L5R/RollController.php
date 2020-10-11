<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Concepts\FFG\L5R\Roll;
use Assert\Assertion;
use Assert\InvalidArgumentException;

class RollController extends Controller
{
    public function stateless($action, Request $request)
    {
      if(!in_array($action, ['create', 'keep', 'reroll'])) {
        return response(null, 404);
      }

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
