<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use App\Models\ContextualizedRoll;
use Assert\Assertion;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class RollController extends Controller
{
    public function index(Request $request)
    {
        $query = ContextualizedRoll::orderBy('created_at', 'desc');

        if ($request->input('campaign')) {
            $query->where('campaign', $request->input('campaign'));
        }

        if ($request->input('character')) {
            $query->where('character', $request->input('character'));
        }

        if ($request->input('player')) {
            try {
                Assertion::integerish($request->input('player'));
            } catch (InvalidArgumentException $e) {
                report($e);

                return response(null, 400);
            }
            $query->where('user_id', (int) $request->input('player'));
        }

        if ($request->input('type')) {
            $query->where('type', $request->input('type'));
        }

        $paginator = $query
            ->with('user')
            ->paginate()
        ;

        return response()->json([
            'items' => $paginator->map(
                function (ContextualizedRoll $roll) {
                    return $this->rollToPublicArray($roll);
                }
            ),
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'first' => $paginator->firstItem(),
            'last' => $paginator->lastItem(),
        ]);
    }

    //TODO Clean two following methods once removed from routes
    public function indexOnlyFFGL5R(Request $request)
    {
        $request->merge(['type' => 'FFG-L5R']);

        return $this->index($request);
    }

    public function indexOnlyFFGL5RHeritage(Request $request)
    {
        $request->merge(['type' => 'FFG-L5R-Heritage']);

        return $this->index($request);
    }

    private function rollToPublicArray(ContextualizedRoll $roll): array
    {
        return [
            'id' => $roll->id,
            'uuid' => $roll->uuid,
            'type' => $roll->type,
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
