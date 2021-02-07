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

Route::get('/heritage/{uuid?}', function () {
    return File::get(public_path() . '/react/index.html');
})->where('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::get('/rolls/{id?}', function () {
    return File::get(public_path() . '/react/index.html');
})->where('id', '[0-9]+');

Route::get('/', function () {
    return File::get(public_path() . '/react/index.html');
});
