<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Concepts\FFG\L5R\Roll;
use Assert\Assertion;
use Assert\InvalidArgumentException;
use App\Models\ContextualizedRoll;

class RollController extends Controller
{
    const ROLL_TYPE = 'FFG-L5R';

    public function stateless($action, Request $request)
    {
      if(!in_array($action, ['create', 'keep', 'reroll', 'alter', 'channel'])) {
        return response(null, 404);
      }

      try {
        if ($action === 'create') {
          return response()->json(Roll::init($request->all()), 201);
        }

        $roll = Roll::fromArray($request->input('roll'));

        if ($action === 'reroll') {
          $roll->reroll($request->input('positions'), $request->input('modifier'));
        }

        if ($action === 'keep') {
          $roll->keep($request->input('positions'));
        }

        if ($action === 'alter') {
          $roll->alter($request->input('alterations'), $request->input('modifier'));
        }

        if ($action === 'channel') {
          $roll->channel($request->input('positions'));
        }

        return response()->json($roll);
      } catch (InvalidArgumentException $e) {
        report($e);
        return response(null, 400);
      }
    }

    public function create(Request $request)
    {
      try {
        $roll = new ContextualizedRoll();
        $roll->type = self::ROLL_TYPE;
        $roll->user_id = $request->user()->id;

        $campaign = $request->input('campaign');
        $character = $request->input('character');
        $description = $request->input('description');
        Assertion::allNotEmpty([$campaign, $character, $description]);

        $roll->campaign = $campaign;
        $roll->character = $character;
        $roll->description = $description;

        $roll->setRoll(Roll::init($request->all()));

        $roll->save();

        return response()->json(
          array_merge(
            ['id' => $roll->id],
            $roll->roll
          ),
          201
        );
      } catch (InvalidArgumentException $e) {
        report($e);
        return response(null, 400);
      }
    }

    public function stateful(int $id, string $action, Request $request)
    {
      $rollWithContext = $this->loadRoll($id);
      if(!in_array($action, ['keep', 'reroll', 'alter', 'parameters', 'channel'])) {
        return response(null, 404);
      }

      if (!$rollWithContext->user_id || $rollWithContext->user_id !== $request->user()->id) {
        return response(null, 403);
      }

      try {
        Assertion::null($rollWithContext->result);
        $roll = $rollWithContext->getRoll();

        if ($action === 'reroll') {
          $roll->reroll($request->input('positions'), $request->input('modifier'));
        }
        if ($action === 'keep') {
          $roll->keep($request->input('positions'));
        }
        if ($action === 'alter') {
          $roll->alter($request->input('alterations'), $request->input('modifier'));
        }
        if ($action === 'parameters') {
          $roll->updateParameters($request->all());
        }
        if ($action === 'channel') {
          $roll->channel($request->input('positions'));
        }

        $rollWithContext->setRoll($roll);
        if ($roll->isComplete()) {
          $rollWithContext->result = $roll->result();
        }
        $rollWithContext->save();

        return response()->json($roll);
      } catch (InvalidArgumentException $e) {
        report($e);
        return response(null, 400);
      }
    }

    public function show(int $id)
    {
      return response()->json($this->rollToPublicArray($this->loadRoll($id)));
    }

    public function index(Request $request)
    {
      $query = ContextualizedRoll::where('type', self::ROLL_TYPE)->orderBy('created_at', 'desc');

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

      $paginator = $query
        ->with('user')
        ->paginate();

      return response()->json([
        'items' => $paginator->map(
          function(ContextualizedRoll $roll) {
            return $this->rollToPublicArray($roll);
          }
        ),
        'total' => $paginator->total(),
        'per_page' => $paginator->perPage(),
        'first' => $paginator->firstItem(),
        'last' => $paginator->lastItem(),
      ]);
    }

    private function loadRoll(int $id): ContextualizedRoll
    {
      return ContextualizedRoll::where('type', self::ROLL_TYPE)->findOrFail($id);
    }

    private function rollToPublicArray(ContextualizedRoll $roll): array
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
