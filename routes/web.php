<?php

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

Route::get('/resources/rokugan-map', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/probabilities', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/heritage/{uuid}', function ($uuid) {
    ContextualizedRoll::where('type', 'FFG-L5R-Heritage')->where('uuid', $uuid)->firstOrFail();

    return File::get(public_path().'/react/index.html');
})->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')->name('heritage.show');

Route::get('/heritage', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/rolls/{id}', function ($id) {
    ContextualizedRoll::where('type', 'FFG-L5R')->findOrFail($id);

    return File::get(public_path().'/react/index.html');
})->where('id', '[0-9]+');

Route::get('/rolls', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/roll-advanced', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/roll-d10', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/roll-d10-4th-ed', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/roll-dnd', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/dnd-rolls/{id}', function ($id) {
    ContextualizedRoll::where('type', 'DnD')->findOrFail($id);

    return File::get(public_path().'/react/index.html');
})->where('id', '[0-9]+');

Route::get('/roll-ffg-sw', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/ffg-sw-rolls/{id}', function ($id) {
    ContextualizedRoll::where('type', 'FFG-SW')->findOrFail($id);

    return File::get(public_path().'/react/index.html');
})->where('id', '[0-9]+');

Route::get('/d10-rolls/{id}', function ($id) {
    ContextualizedRoll::where('type', 'AEG-L5R')->findOrFail($id);

    return File::get(public_path().'/react/index.html');
})->where('id', '[0-9]+');

Route::get('/roll', function () {
    return File::get(public_path().'/react/index.html');
});

Route::get('/', function () {
    return File::get(public_path().'/react/index.html');
});
