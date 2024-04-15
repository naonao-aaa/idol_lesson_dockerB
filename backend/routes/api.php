<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\OrderController;
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

//新しい注文を作成する
Route::middleware('auth:sanctum')->post('/orders', [OrderController::class, 'store']);
//注文IDで注文を取得する
Route::middleware('auth:sanctum')->get('/orders/{order}', [OrderController::class, 'show']);
// 注文を支払済みに更新する
Route::middleware('auth:sanctum')->put('/orders/{order}/pay', [OrderController::class, 'updateOrderToPaid']);

// PayPalのクライアントIDを、フロント側に返す。
Route::middleware('auth:sanctum')->get('/config/paypal', [OrderController::class, 'getPaypalClientId']);