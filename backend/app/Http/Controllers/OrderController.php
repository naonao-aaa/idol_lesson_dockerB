<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
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
    public function store(Request $request)
    {
        $order = Order::create([
            'user_id' => Auth::id(), //「user_id」は、フロントから送信されてきてないので、Laravel側で設定。
            'payment_method' => $request->input('paymentMethod'),
            'items_price' => $request->input('itemsPrice'),
            'tax_price' => $request->input('taxPrice'),
            'total_price' => $request->input('totalPrice'),
            // 'is_paid' => $request->input('is_paid'),
            // 'paid_at' => $request->input('paid_at') ? Carbon::parse($request->input('paid_at')) : null,
            // 'is_done' => $request->input('is_done'),
            // 'done_at' => $request->input('done_at') ? Carbon::parse($request->input('done_at')) : null,
        ]);

        foreach ($request->orderItems as $item) {
            OrderProduct::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'quantity' => $item['qty'],
            ]);
        }

        return response()->json([
            'order' => $order,
            'message' => 'Order created successfully.',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        // 注文が現在のユーザーに属しているかをチェック
        if ($order->user_id !== Auth::id()) {
            // エラーレスポンスを返す
            return response()->json([
                'message' => 'Order not found.'
            ], 403); 
        }

        // 関連データを事前にロード
        $order->load('products', 'user');

        // 注文情報を含むレスポンスを返す
        return response()->json([
            'order' => $order
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }


    /**
     * 注文を支払済みにする
     */
    public function updateOrderToPaid(Request $request, Order $order)
    {
        if (!$order) {
            // オーダーが見つからない場合は、404エラーとメッセージを返す
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }
    
        // オーダーが見つかった場合は、支払情報を更新
        $order->is_paid = true;
        $order->paid_at = Carbon::now();  // 現在時刻を設定
        $order->save();

        return response()->json([
            'message' => 'Order updated to paid successfully.',
        ]);
    }

    
    /**
     * PayPalのクライアントIDを、フロント側に返す。
     */
    public function getPaypalClientId()
    {
        $paypalClientId = config('app.PAYPAL_CLIENT_ID');

        return response()->json([
            'paypalClientId' => $paypalClientId
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        //
    }
}
