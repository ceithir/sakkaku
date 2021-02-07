<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FFG\L5R\RollController;
use App\Models\ContextualizedRoll;
use App\Http\Controllers\Api\FFG\L5R\InheritanceRollController;

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

/* Normal rolls */

Route::get('public/ffg/l5r/rolls', [RollController::class, 'index']);
Route::get('public/ffg/l5r/rolls/{id}', [RollController::class, 'show'])->where('id', '[0-9]+');

Route::post('public/ffg/l5r/rolls/{action}', [RollController::class, 'stateless'])->where('action', '[a-z]+');

Route::middleware('auth:sanctum')->post('/ffg/l5r/rolls/create', [RollController::class, 'create']);
Route::middleware('auth:sanctum')
    ->post('/ffg/l5r/rolls/{id}/{action}', [RollController::class, 'stateful'])
    ->where(['id' => '[0-9]+', 'action' => '[a-z]+']);

/* Heritage rolls */

Route::get('/public/ffg/l5r/heritage-rolls/{uuid}', [InheritanceRollController::class, 'show'])->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
Route::post('/public/ffg/l5r/heritage-rolls/{action}', [InheritanceRollController::class, 'stateless'])->where('action', '[a-z]+');

Route::middleware('auth:sanctum')->post('/ffg/l5r/heritage-rolls/create', [InheritanceRollController::class, 'create']);
