<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    public function store(Request $request, Product $product)
    {
        // レビューデータのバリデーション
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string'
        ]);

        // 購入履歴の確認
        $hasPurchased = Order::whereHas('products', function ($query) use ($product) {
            $query->where('products.id', $product->id);
        })
        ->where('user_id', Auth::id())
        ->where('is_paid', true)
        ->exists();

        if (!$hasPurchased) {
        return response()->json([
        'message' => 'レビューは、契約して料金をお支払いした人のみが投稿できます。'
        ], 403); // Forbidden ステータスコードを返す
        }

        // 同一ユーザーが同一商品に対してレビューを既に投稿しているか確認
        $existingReview = Review::where('user_id', Auth::id())
                                ->where('product_id', $product->id)
                                ->first();
        
        if ($existingReview) {
            return response()->json([
                'message' => 'すでにこの商品に対するレビューを投稿しています。'
            ], 409); // Conflict ステータスコードを返す
        }

        // レビューの作成
        $review = new Review([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // データベースに保存
        $review->save();

        return response()->json([
            'message' => 'レビューが正常に登録されました。',
            'review' => $review
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function destroy(Review $review)
    {
        //
    }
}
