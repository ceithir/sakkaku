<?php

namespace App\Http\Controllers\Api\Licensed\Cyberpunk;

use App\Concepts\Licensed\Cyberpunk\Roll;
use App\Http\Controllers\Controller;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class RollController extends Controller
{
    public const ROLL_TYPE = 'Cyberpunk-RED';

    public function statelessCreate(Request $request)
    {
        try {
            $roll = Roll::init(
                $request->input('parameters'),
                metadata: $request->input('metadata', [])
            );

            return response()->json($roll);
        } catch (InvalidArgumentException $e) {
            report($e);

            return response(null, 400);
        }
    }
}
