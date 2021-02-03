<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Concepts\FFG\L5R\InheritanceRoll;
use Assert\Assertion;
use Assert\InvalidArgumentException;

class InheritanceRollController extends Controller
{
  public function stateless($action, Request $request)
  {
    if(!in_array($action, ['create', 'keep'])) {
      return response(null, 404);
    }

    try {
      if ($action === 'create') {
        return response()->json(
          InheritanceRoll::init($request->input('metadata', [])),
          201
        );
      }

      $roll = InheritanceRoll::fromArray($request->input('roll'));

      if ($action === 'keep') {
        $roll->keep($request->input('position'));
      }

      return response()->json($roll);
    } catch (InvalidArgumentException $e) {
      report($e);
      return response(null, 400);
    }
  }
}
