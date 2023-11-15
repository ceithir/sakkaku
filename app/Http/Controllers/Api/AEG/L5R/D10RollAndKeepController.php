<?php

namespace App\Http\Controllers\Api\AEG\L5R;

use App\Concepts\AEG\L5R\Roll;
use App\Http\Controllers\Api\RollController;
use App\Models\ContextualizedRoll;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class D10RollAndKeepController extends RollController
{
    public const ROLL_TYPE = 'AEG-L5R';

    public function statelessCreate(Request $request)
    {
        try {
            $roll = new Roll($request->input('parameters'), metadata: $request->input('metadata', []));

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
