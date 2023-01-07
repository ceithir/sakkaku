<?php

use App\Http\Controllers\Api\AEG\L5R\D10RollAndKeepController;
use App\Http\Controllers\Api\Cards\DrawController;
use App\Http\Controllers\Api\DnD\RollController as DnDRollController;
use App\Http\Controllers\Api\FFG\L5R\CheckRollController;
use App\Http\Controllers\Api\FFG\L5R\InheritanceRollController;
use App\Http\Controllers\Api\FFG\SW\RollController as FFGSWRollController;
use App\Http\Controllers\Api\Licensed\Cyberpunk\RollController as CyberpunkRollController;
use App\Http\Controllers\Api\RollController;
use App\Models\ContextualizedRoll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();

    return [
        'id' => $user->id,
        'name' => $user->name,
        'campaigns' => ContextualizedRoll::select('campaign')
            ->where('user_id', $user->id)
            ->distinct()
            ->pluck('campaign'),
        'characters' => ContextualizedRoll::select('character')
            ->where('user_id', $user->id)
            ->distinct()
            ->pluck('character'),
    ];
});

// All rolls

Route::get('/rolls', [RollController::class, 'index']);

// Normal rolls
Route::get('public/ffg/l5r/rolls/{id}', [CheckRollController::class, 'show'])->where('id', '[0-9]+');

Route::post('public/ffg/l5r/rolls/{action}', [CheckRollController::class, 'stateless'])->where('action', '[a-z]+');

Route::middleware('auth:sanctum')->post('/ffg/l5r/rolls/create', [CheckRollController::class, 'create']);
Route::middleware('auth:sanctum')
    ->post('/ffg/l5r/rolls/{id}/{action}', [CheckRollController::class, 'stateful'])
    ->where(['id' => '[0-9]+', 'action' => '[a-z]+'])
;

// Heritage rolls

Route::get('/public/ffg/l5r/heritage-rolls/{uuid}', [InheritanceRollController::class, 'show'])->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
Route::post('/public/ffg/l5r/heritage-rolls/{action}', [InheritanceRollController::class, 'stateless'])->where('action', '[a-z]+');

Route::middleware('auth:sanctum')->post('/ffg/l5r/heritage-rolls/create', [InheritanceRollController::class, 'create']);
Route::middleware('auth:sanctum')->post('/ffg/l5r/heritage-rolls/{uuid}/keep', [InheritanceRollController::class, 'keep'])->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

// D10 rolls

Route::get('/public/aeg/l5r/rolls/{id}', [D10RollAndKeepController::class, 'show'])->where('id', '[0-9]+');
Route::post('/public/aeg/l5r/rolls/create', [D10RollAndKeepController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/aeg/l5r/rolls/create', [D10RollAndKeepController::class, 'statefulCreate']);

// DnD rolls

Route::post('/public/dnd/rolls/create', [DnDRollController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/dnd/rolls/create', [DnDRollController::class, 'statefulCreate']);
Route::get('/public/dnd/rolls/{id}', [DnDRollController::class, 'show'])->where('id', '[0-9]+');

// FFG-SW rolls

Route::post('/public/ffg/sw/rolls/create', [FFGSWRollController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/ffg/sw/rolls/create', [FFGSWRollController::class, 'statefulCreate']);
Route::get('/public/ffg/sw/rolls/{id}', [FFGSWRollController::class, 'show'])->where('id', '[0-9]+');

// Cards
Route::post('/public/cards/draw', [DrawController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/cards/draw', [DrawController::class, 'statefulCreate']);
Route::get('/public/cards/draws/{id}', [DrawController::class, 'show'])->where('id', '[0-9]+');
Route::middleware('auth:sanctum')->post('/cards/decks/create', [DrawController::class, 'createDeck']);
Route::get('/public/cards/decks/{uuid}', [DrawController::class, 'showDeck'])->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

// Cyberpunk

Route::post('/public/cyberpunk/rolls/create', [CyberpunkRollController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/cyberpunk/rolls/create', [CyberpunkRollController::class, 'statefulCreate']);
Route::get('/public/cyberpunk/rolls/{id}', [CyberpunkRollController::class, 'show'])->where('id', '[0-9]+');
