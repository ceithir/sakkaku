<?php

namespace App\Http\Controllers\Api\AEG\L5R;

use App\Concepts\AEG\L5R\Roll;
use App\Http\Controllers\Controller;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class D10RollAndKeepController extends Controller
{
    public const ROLL_TYPE = 'AEG-L5R';

    public function statelessCreate(Request $request)
    {
        try {
            $roll = new Roll($request->input('parameters'), $request->input('metadata', []));

            return response()->json($roll);
        } catch (InvalidArgumentException $e) {
            report($e);

            return response(null, 400);
        }
    }
}
