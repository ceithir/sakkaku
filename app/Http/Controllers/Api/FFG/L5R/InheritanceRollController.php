<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Concepts\FFG\L5R\InheritanceRoll;
use App\Http\Controllers\Api\RollController;
use App\Models\ContextualizedRoll;
use Assert\Assertion;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class InheritanceRollController extends RollController
{
    public const ROLL_TYPE = 'FFG-L5R-Heritage';

    public function stateless($action, Request $request)
    {
        if (!in_array($action, ['create', 'keep'])) {
            return response(null, 404);
        }

        try {
            if ('create' === $action) {
                return response()->json(
                    InheritanceRoll::init($request->input('metadata', [])),
                    201
                );
            }

            $roll = InheritanceRoll::fromArray($request->input('roll'));

            if ('keep' === $action) {
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
            Assertion::allNotEmpty([$campaign, $character]);

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

    public function keep(int $id, Request $request)
    {
        $rollWithContext = ContextualizedRoll::where('type', self::ROLL_TYPE)->where('id', $id)->firstOrFail();
        if (!$rollWithContext->user_id || $rollWithContext->user_id !== $request->user()->id) {
            return response(null, 403);
        }

        try {
            Assertion::null($rollWithContext->result);

            $roll = $rollWithContext->getRoll();
            $roll->keep($request->input('position'));

            $rollWithContext->setRoll($roll);
            $rollWithContext->result = $roll->result();

            $rollWithContext->save();

            return response()->json($this->toJson($rollWithContext));
        } catch (InvalidArgumentException $e) {
            report($e);

            return response(null, 400);
        }
    }
}
