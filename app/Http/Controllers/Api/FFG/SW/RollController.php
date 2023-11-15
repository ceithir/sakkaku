<?php

namespace App\Http\Controllers\Api\FFG\SW;

use App\Concepts\FFG\SW\Roll;
use App\Http\Controllers\Api\RollController as BaseController;
use App\Models\ContextualizedRoll;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class RollController extends BaseController
{
    public const ROLL_TYPE = 'FFG-SW';

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

    public function statefulCreate(Request $request)
    {
        return $this->dbCreate($request, self::ROLL_TYPE, Roll::class);
    }

    public function show(int $id)
    {
        $roll = ContextualizedRoll::where('type', self::ROLL_TYPE)->findOrFail($id);

        return response()->json($this->toJson($roll));
    }
}
