<?php

namespace App\Http\Controllers\Api\FFG\SW;

use App\Concepts\FFG\SW\Roll;
use App\Http\Controllers\Controller;
use App\Models\ContextualizedRoll;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class RollController extends Controller
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
        $request->validate([
            'campaign' => 'required|string',
            'character' => 'required|string',
            'description' => 'required|string',
            'parameters' => 'required|array',
            'metadata' => 'nullable|array',
        ]);

        try {
            $roll = new ContextualizedRoll();
            $roll->type = self::ROLL_TYPE;
            $roll->user_id = $request->user()->id;
            $roll->campaign = $request->input('campaign');
            $roll->character = $request->input('character');
            $roll->description = $request->input('description');
            $roll->setRoll(
                Roll::init(
                    $request->input('parameters'),
                    metadata: $request->input('metadata', [])
                )
            );
            $roll->result = $roll->getRoll()->result();
            $roll->save();

            return response()->json($this->toJson($roll));
        } catch (InvalidArgumentException $e) {
            report($e);

            return response(null, 400);
        }
    }

    public function show(int $id)
    {
        $roll = ContextualizedRoll::where('type', self::ROLL_TYPE)->findOrFail($id);

        return response()->json($this->toJson($roll));
    }

    private function toJson(ContextualizedRoll $roll): array
    {
        return [
            'id' => $roll->id,
            'user' => $roll->user_id ? [
                'id' => $roll->user->id,
                'name' => $roll->user->name,
            ] : null,
            'created_at' => $roll->created_at,
            'updated_at' => $roll->updated_at,
            'campaign' => $roll->campaign,
            'character' => $roll->character,
            'description' => $roll->description,
            'roll' => $roll->roll,
            'result' => $roll->result,
        ];
    }
}
