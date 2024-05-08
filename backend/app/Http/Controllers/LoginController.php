<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(['user' => Auth::user()], 200);
        }

        // 認証エラー
        // throw new Exception('IDまたはパスワードが間違っています。');
        return response()->json(['message' => 'IDまたはパスワードが間違っています。'], 401);
    }

    public function logout(Request $request): JsonResponse
    {
        // ユーザーの永続的なトークンを取得し、削除する。
        // $request->user()->tokens()->where('name', 'token-name')->delete();

        // ユーザーの現在のトークンを無効化
        // $request->user()->currentAccessToken()->delete();       

        // ログアウトに成功した旨をレスポンスで返す
        // return response()->json(['message' => 'ログアウトしました。'], 200);


        // ユーザーのセッションを無効化
        $request->session()->invalidate();

        // セッションの再生成を行う（セキュリティ上の理由から）
        $request->session()->regenerateToken();

        // CSRFトークンとセッションCookieを無効化する
        $cookie = \Illuminate\Support\Facades\Cookie::forget('laravel_session');
        $csrfCookie = \Illuminate\Support\Facades\Cookie::forget('XSRF-TOKEN');

        // ログアウトに成功した旨をレスポンスで返す
        $response = response()->json(['message' => 'ログアウトしました。'], 200);

        // レスポンスにCookieを無効化するためのヘッダーを付加
        return $response->withCookie($cookie)->withCookie($csrfCookie);


        // ユーザーをログアウトする
        // Auth::guard('web')->logout();

        // セッションを無効にする
        // $request->session()->invalidate();

        // CSRFトークンを再生成する
        // $request->session()->regenerateToken();

        // レスポンスを返す
        // return response()->json(['message' => 'ログアウトしました。']);

    }
}