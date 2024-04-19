<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
            $products = Product::with('category')->get();

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
     * (管理者)プランを作成する
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // ログイン中のユーザー情報を取得し、管理者かどうかをチェック
        if (!Auth::check() || !Auth::user()->isAdmin) {
            return response()->json(['message' => 'You do not have admin privileges to create products.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
            'contract_type' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //画像名をランダムに設定して、storage/app/public/images/productsフォルダに保存される。
        $path = $request->file('image')->store('images/products', 'public');

        $product = new Product([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'price' => $request->price,
            'image' => $path,
            'contract_type' => $request->contract_type,
            'category_id' => $request->category_id,
            'description' => $request->description
        ]);

        $product->save();

        return response()->json([
            'message' => 'Product successfully created',
            'product' => $product
        ], 201);

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
