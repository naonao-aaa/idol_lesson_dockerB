<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
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
    return $request->user();
});

// プラン全件取得
Route::get('/products', [ProductController::class, 'index']);
// 特定のプラン取得
Route::get('/products/{product}', [ProductController::class, 'show']);

// ログアウト
Route::middleware('auth:sanctum')->post('/users/logout', [LoginController::class, 'logout']);

// ユーザー登録
Route::post('/users/register', [UserController::class, 'register']);