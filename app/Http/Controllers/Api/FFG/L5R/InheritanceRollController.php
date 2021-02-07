<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Concepts\FFG\L5R\InheritanceRoll;
use Assert\Assertion;
use Assert\InvalidArgumentException;
use Illuminate\Support\Str;
use App\Models\ContextualizedRoll;

class InheritanceRollController extends Controller
{
  const ROLL_TYPE = 'FFG-L5R-Heritage';

  public function stateless($action, Request $request)
  {
    if(!in_array($action, ['create', 'keep'])) {
      return response(null, 404);
    }

    try {
      if ($action === 'create') {
        return response()->json(
          InheritanceRoll::init($request->input('metadata', [])),
          201
        );
      }

      $roll = InheritanceRoll::fromArray($request->input('roll'));

      if ($action === 'keep') {
        $roll->keep($request->input('position'));
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

        $roll->uuid = Str::uuid();
        $roll->campaign = $campaign;
        $roll->character = $character;
        $roll->description = $description;

        $roll->setRoll(InheritanceRoll::init($request->input('metadata', [])));

        $roll->save();

        return response()->json(
          $this->toJson($roll),
          201
        );
      } catch (InvalidArgumentException $e) {
        report($e);
        return response(null, 400);
      }
    }

    public function show(string $uuid)
    {
      return response()->json($this->toJson($this->load($uuid)));
    }

    private function load(string $uuid): ContextualizedRoll
    {
      return ContextualizedRoll::where('type', self::ROLL_TYPE)->where('uuid', $uuid)->firstOrFail();
    }

    private function toJson(ContextualizedRoll $roll): array
    {
      return [
        'uuid' => $roll->uuid,
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
