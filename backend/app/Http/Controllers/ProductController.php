<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
        $products = Product::with('reviews')->get();

        return response()->json($products);
    }

    /**
     * (管理者)全てのプランを取得する
     */
    public function getProducts()
    {
        $products = Product::with('category')->get();

        return response()->json([
            'products' => $products
        ]);
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
            $product->load('reviews.user');
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
     * (管理者)プランの更新
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function updateProduct(Request $request, Product $product)
    {
        // ログイン中のユーザー情報を取得し、管理者かどうかをチェック
        if (!Auth::check() || !Auth::user()->isAdmin) {
            return response()->json(['message' => 'You do not have admin privileges to update products.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
            'contract_type' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 送信された画像がある場合のみ画像を更新
        if ($request->hasFile('image')) {
            Storage::delete('public/' . $product->image);  // 古い画像ファイルを削除する。
            $path = $request->file('image')->store('images/products', 'public');
            $product->image = $path;
        }

        // 他のフィールドを更新
        $product->name = $request->name;
        $product->price = $request->price;
        $product->contract_type = $request->contract_type;
        $product->category_id = $request->category_id;
        $product->description = $request->description;

        $product->save();

        return response()->json([
            'message' => 'Product successfully updated',
            'product' => $product
        ], 200);
    }

    /**
     * (管理者)プランの削除
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        // ログイン中のユーザー情報を取得し、管理者かどうかをチェック
        if (!Auth::check() || !Auth::user()->isAdmin) {
            return response()->json(['message' => 'You do not have admin privileges to update products.'], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product successfully deleted',
        ], 200);
    }
}
