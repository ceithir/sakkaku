<?php

namespace App\Http\Controllers\Api;

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

            if ($request->input('text')) {
                $query->whereFullText('description', $request->input('text'));
            }
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

    public function show(int $id)
    {
        // TODO Progressively extend to other types of rolls (as soon as the front will support them)
        $roll = ContextualizedRoll::whereIn('type', ['DnD', 'AEG-L5R', 'Cyberpunk-RED', 'FFG-SW'])->findOrFail($id);

        return $this->rollToPublicArray($roll);
    }

    public function delete(int $id)
    {
        $roll = ContextualizedRoll::findOrFail($id);
        $roll->delete();

        return response()->noContent();
    }

    protected function dbCreate(Request $request, string $type, string $classname)
    {
        $request->validate([
            'campaign' => 'required|string',
            'character' => 'required|string',
            'description' => 'required|string',
            'parameters' => 'required|array',
            'metadata' => 'nullable|array',
            'tag' => 'nullable|string',
        ]);

        try {
            $roll = new ContextualizedRoll();

            $roll->user_id = $request->user()->id;
            $roll->campaign = $request->input('campaign');
            $roll->character = $request->input('character');
            $roll->description = $request->input('description');
            $roll->tag = $request->input('tag');

            $roll->type = $type;
            $roll->setRoll($classname::init($request->input('parameters'), metadata: $request->input('metadata', [])));
            $roll->result = $roll->getRoll()->result();

            $roll->save();

            return response()->json($this->rollToPublicArray($roll));
        } catch (InvalidArgumentException $e) {
            report($e);

            return response(null, 400);
        }
    }

    // TODO Legacy alias only used in legacy functions, to remove eventually
    protected function toJson(ContextualizedRoll $roll): array
    {
        return $this->rollToPublicArray($roll);
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
