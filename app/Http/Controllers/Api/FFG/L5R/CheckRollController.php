<?php

namespace App\Http\Controllers\Api\FFG\L5R;

use App\Concepts\FFG\L5R\Roll;
use App\Http\Controllers\Controller;
use App\Models\ContextualizedRoll;
use Assert\Assertion;
use Assert\InvalidArgumentException;
use Illuminate\Http\Request;

class CheckRollController extends Controller
{
    public const ROLL_TYPE = 'FFG-L5R';

    public function stateless($action, Request $request)
    {
        if (!in_array($action, ['create', 'keep', 'reroll', 'alter', 'channel'])) {
            return response(null, 404);
        }

        try {
            if ('create' === $action) {
                return response()->json(Roll::init($request->all()), 201);
            }

            $roll = Roll::fromArray($request->input('roll'));

            if ('reroll' === $action) {
                $roll->reroll($request->input('positions'), $request->input('modifier'), $request->input('label'));
            }

            if ('keep' === $action) {
                $roll->keep($request->input('positions'));
            }

            if ('alter' === $action) {
                $roll->alter($request->input('alterations'), $request->input('modifier'), $request->input('label'));
            }

            if ('channel' === $action) {
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
        if (!in_array($action, ['keep', 'reroll', 'alter', 'parameters', 'channel'])) {
            return response(null, 404);
        }

        if (!$rollWithContext->user_id || $rollWithContext->user_id !== $request->user()->id) {
            return response(null, 403);
        }

        try {
            Assertion::null($rollWithContext->result);
            $roll = $rollWithContext->getRoll();

            if ('reroll' === $action) {
                $roll->reroll($request->input('positions'), $request->input('modifier'), $request->input('label'));
            }
            if ('keep' === $action) {
                $roll->keep($request->input('positions'));
            }
            if ('alter' === $action) {
                $roll->alter($request->input('alterations'), $request->input('modifier'), $request->input('label'));
            }
            if ('parameters' === $action) {
                $roll->updateParameters($request->all());
            }
            if ('channel' === $action) {
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

    private function loadRoll(int $id): ContextualizedRoll
    {
        return ContextualizedRoll::where('type', self::ROLL_TYPE)->findOrFail($id);
    }
}
