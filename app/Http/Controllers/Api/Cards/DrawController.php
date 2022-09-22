<?php

namespace App\Http\Controllers\Api\Cards;

use App\Concepts\Cards\Draw;
use App\Http\Controllers\Controller;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class DrawController extends Controller
{
    public function statelessCreate(Request $request)
    {
        try {
            $roll = Draw::init(
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
