<?php

namespace App\Http\Controllers\Api\Cards;

use App\Concepts\Cards\Deck as DeckConcept;
use App\Concepts\Cards\Draw;
use App\Http\Controllers\Controller;
use App\Models\ContextualizedRoll;
use App\Models\Deck;
use Assert\Assertion;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

            return response()->json($roll->toArray());
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
            'code' => 'nullable|string',
        ]);

        try {
            $roll = $this->prepareRoll($request);

            if ((bool) $request->input('code')) {
                $deck = Deck::where('uuid', $request->input('code'))->first();
                Assertion::notNull($deck);

                $currentDeckState = $deck->state['current'];
                $draw = $roll->getRoll();
                $supposedDeckState = $draw->parameters->deck->toArray();
                sort($currentDeckState);
                sort($supposedDeckState);
                Assertion::eq(
                    array_values($currentDeckState),
                    array_values($supposedDeckState),
                    'Inconsistent deck state, aborting to avoid bad surprise.'
                );

                DB::transaction(function () use ($roll, $deck) {
                    $roll->save();

                    $deckState = $deck->state;
                    $hand = $roll->getRoll()->hand;
                    $deckState['current'] = array_values(array_filter(
                        $deckState['current'],
                        function ($n) use ($hand) {
                            return !in_array($n, $hand);
                        }
                    ));
                    $deckState['draws'] = array_merge($deckState['draws'], [$roll->id]);
                    $deck->state = $deckState;
                    $deck->save();
                });

                return response()->json($this->toJson($roll));
            }

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

    private function prepareRoll(Request $request): ContextualizedRoll
    {
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

        return $roll;
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
