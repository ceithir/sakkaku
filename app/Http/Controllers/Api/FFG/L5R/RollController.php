<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Concepts\FFG\L5R\Roll;

class RollController extends Controller
{
    public function create(Request $request)
    {
      return response()->json(Roll::init($request->all()), 201);
    }

    public function keep(Request $request)
    {
      $roll = Roll::fromArray($request->input('roll'));
      $roll->keep($request->input('positions'));

      return response()->json($roll);
    }

    public function reroll(Request $request)
    {
      $roll = Roll::fromArray($request->input('roll'));
      $roll->reroll($request->input('positions'), $request->input('modifier'));

      return response()->json($roll);
    }
}
