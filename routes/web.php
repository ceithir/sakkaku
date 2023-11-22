<?php

use App\Http\Controllers\RollRenderController;
use App\Models\ContextualizedRoll;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/cyberpunk/roll', function () {
    return File::get(public_path().'/react/index.html');
});

Route::permanentRedirect('/cyberpunk/rolls/{id}', '/r/{id}');

Route::get('/probabilities', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/heritage/{uuid}', function ($uuid) {
    $roll = ContextualizedRoll::where('type', 'FFG-L5R-Heritage')->where('uuid', $uuid)->firstOrFail();

    return redirect("/r/{$roll->id}", 301);
})->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')->name('heritage.show');

Route::get('/heritage', function () {
    return File::get(public_path().'/react/index.html');
});

Route::permanentRedirect('/rolls/{id}', '/r/{id}');

Route::get('/rolls', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/roll-advanced', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/roll-d10', function () {
    return File::get(public_path().'/react/index.html');
});

Route::redirect('/roll-d10-4th-ed', '/roll-d10', 301);

Route::get('/roll-dnd', function () {
    return File::get(public_path().'/react/index.html');
});

Route::permanentRedirect('/dnd-rolls/{id}', '/r/{id}');

Route::get('/roll-ffg-sw', function () {
    return File::get(public_path().'/react/index.html');
});

Route::permanentRedirect('/ffg-sw-rolls/{id}', '/r/{id}');

Route::permanentRedirect('/d10-rolls/{id}', '/r/{id}');

Route::get('/roll', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/r/{id}', [RollRenderController::class, 'show'])->where('id', '[0-9]+');

Route::get('/', function () {
    return File::get(public_path().'/react/index.html');
});
