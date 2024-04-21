<?php

use App\Http\Controllers\CategoryController;
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
// (管理者)全てのプランを取得する
Route::middleware('auth:sanctum')->get('/admin/products', [ProductController::class, 'getProducts']);
// (管理者)プランを作成する
Route::middleware('auth:sanctum')->post('/admin/products', [ProductController::class, 'store']);
// (管理者)プランの更新
Route::middleware('auth:sanctum')->put('/admin/products/{product}', [ProductController::class, 'updateProduct']);
// (管理者)プランの削除
Route::middleware('auth:sanctum')->delete('/admin/products/{product}', [ProductController::class, 'destroy']);


// ログアウト
Route::middleware('auth:sanctum')->post('/users/logout', [LoginController::class, 'logout']);

// ユーザー登録
Route::post('/users/register', [UserController::class, 'register']);
// ユーザープロフィールの更新
Route::middleware('auth:sanctum')->put('/users/profile', [UserController::class, 'updateUserProfile']);
// (管理者)全てのユーザーを取得する
Route::middleware('auth:sanctum')->get('/admin/users', [UserController::class, 'getUsers']);
// (管理者)特定のユーザーを取得する
Route::middleware('auth:sanctum')->get('/admin/users/{user}', [UserController::class, 'getUser']);
// (管理者)ユーザーを削除する
Route::middleware('auth:sanctum')->delete('/admin/users/{user}', [UserController::class, 'destroy']);
// (管理者)ユーザーの更新
Route::middleware('auth:sanctum')->put('/admin/users/{user}', [UserController::class, 'updateUser']);

//新しい注文を作成する
Route::middleware('auth:sanctum')->post('/orders', [OrderController::class, 'store']);
//注文IDで注文を取得する
Route::middleware('auth:sanctum')->get('/orders/{order}', [OrderController::class, 'show']);
// 注文を支払済みに更新する
Route::middleware('auth:sanctum')->put('/orders/{order}/pay', [OrderController::class, 'updateOrderToPaid']);
// 自分(ログインユーザー)の注文を取得する。（「/orders/mine」や「/orders/my」のようなエンドポイントにすると、「No query results for model [App\Models\Order] 」というエラーが出た。一先ず「/my/orders」とすることで成功した。）
Route::middleware('auth:sanctum')->get('/my/orders', [OrderController::class, 'getMyOrders']);
// (管理者)全ての注文を取得する
Route::middleware('auth:sanctum')->get('/admin/orders', [OrderController::class, 'getOrders']);
// (管理者) 注文プランを遂行済みに更新する
Route::middleware('auth:sanctum')->put('/admin/orders/{order}/completion', [OrderController::class, 'updateOrderToCompletion']);

// PayPalのクライアントIDを、フロント側に返す。
Route::middleware('auth:sanctum')->get('/config/paypal', [OrderController::class, 'getPaypalClientId']);

// カテゴリ一覧取得
Route::get('/categories', [CategoryController::class, 'index']);