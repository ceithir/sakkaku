<?php

namespace App\Http\Controllers\Api\Cards;

use App\Concepts\Cards\Deck as DeckConcept;
use App\Concepts\Cards\Draw;
use App\Http\Controllers\Controller;
use App\Models\ContextualizedRoll;
use App\Models\Deck;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DrawController extends Controller
{
    public const ROLL_TYPE = 'card';

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
            $roll->setRoll(Draw::init(
                $request->input('parameters'),
                metadata: $request->input('metadata', [])
            ));
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

    public function createDeck(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'deck' => 'required|array',
        ]);

        try {
            $cards = (new DeckConcept($request->input('deck')))->toArray();

            $deck = new Deck();
            $deck->state = [
                'initial' => $cards,
                'current' => $cards,
                'draws' => [],
            ];
            $deck->user_id = $request->user()->id;
            $deck->description = $request->input('description');
            $deck->uuid = Str::uuid();
            $deck->save();

            return response()->json($deck);
        } catch (InvalidArgumentException $e) {
            report($e);

            return response(null, 400);
        }
    }

    public function showDeck(string $uuid)
    {
        return response()->json(Deck::where('uuid', $uuid)->firstOrFail());
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
