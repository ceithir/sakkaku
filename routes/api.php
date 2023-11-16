<?php

use App\Http\Controllers\Api\AEG\L5R\D10RollAndKeepController;
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

    return array_merge(
        [
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
        ],
        $user->isSuperAdmin() ? ['superadmin' => true] : []
    );
});

// All rolls

Route::get('/rolls', [RollController::class, 'index']);
Route::middleware(['auth:sanctum', 'superadmin'])->delete('/admin/rolls/{id}', [RollController::class, 'delete'])->where(['id' => '[0-9]+']);
Route::get('/rolls/{id}', [RollController::class, 'show'])->where(['id' => '[0-9]+']);

// L5R FFG rolls
Route::get('public/ffg/l5r/rolls/{id}', [CheckRollController::class, 'show'])->where('id', '[0-9]+');

Route::post('public/ffg/l5r/rolls/{action}', [CheckRollController::class, 'stateless'])->where('action', '[a-z]+');

Route::middleware('auth:sanctum')->post('/ffg/l5r/rolls/create', [CheckRollController::class, 'create']);
Route::middleware('auth:sanctum')
    ->post('/ffg/l5r/rolls/{id}/{action}', [CheckRollController::class, 'stateful'])
    ->where(['id' => '[0-9]+', 'action' => '[a-z]+'])
;

// L5R FFG Heritage rolls

Route::post('/public/ffg/l5r/heritage-rolls/{action}', [InheritanceRollController::class, 'stateless'])->where('action', '[a-z]+');

Route::middleware('auth:sanctum')->post('/ffg/l5r/heritage-rolls/create', [InheritanceRollController::class, 'create']);
Route::middleware('auth:sanctum')->post('/ffg/l5r/heritage-rolls/{id}/keep', [InheritanceRollController::class, 'keep'])->where('id', '[0-9]+');

// L5R AEG rolls

Route::post('/public/aeg/l5r/rolls/create', [D10RollAndKeepController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/aeg/l5r/rolls/create', [D10RollAndKeepController::class, 'statefulCreate']);

// DnD rolls

Route::post('/public/dnd/rolls/create', [DnDRollController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/dnd/rolls/create', [DnDRollController::class, 'statefulCreate']);

// FFG-SW rolls

Route::post('/public/ffg/sw/rolls/create', [FFGSWRollController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/ffg/sw/rolls/create', [FFGSWRollController::class, 'statefulCreate']);

// Cyberpunk

Route::post('/public/cyberpunk/rolls/create', [CyberpunkRollController::class, 'statelessCreate']);
Route::middleware('auth:sanctum')->post('/cyberpunk/rolls/create', [CyberpunkRollController::class, 'statefulCreate']);
