<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::get();

        return response()->json($products);
    }

    /**
     * (管理者)全てのプランを取得する
     */
    public function getProducts()
    {
        // ログイン中のユーザー情報を取得
        $user = Auth::user();

        // ログイン中のユーザーが管理者かどうかをチェック
        if ($user->isAdmin) {
            // 管理者の場合は全てのプラン情報をする
            $products = Product::get();

            return response()->json([
                'products' => $products
            ]);
        } else {
            // 一般ユーザーの場合は管理者権限がない旨のメッセージを返す
            return response()->json([
                'message' => 'You do not have admin privileges to access all products.'
            ], 403); 
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        if ($product) {
            return response()->json($product);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        //
    }
}
