<?php

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

Route::get('/probabilities', function () {
    return File::get(public_path() . '/react/index.html');
});

Route::get('/heritage/{uuid}', function () {
    return File::get(public_path() . '/react/index.html');
})->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')->name('heritage.show');

Route::get('/heritage', function () {
    return File::get(public_path() . '/react/index.html');
});

Route::middleware('auth:sanctum')->get('/heritage/list', function () {
    return File::get(public_path() . '/react/index.html');
});

Route::get('/rolls/{id}', function () {
    return File::get(public_path() . '/react/index.html');
})->where('id', '[0-9]+');

Route::get('/rolls', function () {
    return File::get(public_path() . '/react/index.html');
});

Route::get('/', function () {
    return File::get(public_path() . '/react/index.html');
});
