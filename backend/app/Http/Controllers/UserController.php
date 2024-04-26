<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    /**
     * （自分）ユーザープロフィールの更新
     * 
     *  @param  \Illuminate\Http\Request  $request 更新リクエスト    
     *  @return \Illuminate\Http\Response 更新されたuser情報と成功メッセージを含むJSONレスポンス
     */
    public function updateUserProfile(Request $request)
    {
        // ログイン中のユーザーのIDを取得
        $userId = Auth::id();

        // ログイン中のユーザーのIDと一致するUserモデルのデータを取得
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'ログイン中のユーザーが見つかりませんでした'
            ], 404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:8'
        ]);
    
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // パスワードが提供されていない場合、配列から削除
        }

        // ユーザーデータを更新
        $user->update($data);

        return response()->json([
            'message' => 'ユーザープロフィールが更新されました',
            'user' => $user
        ]);

    }

    /**
     * (管理者)ユーザーの更新
     * 
     */
    public function updateUser(Request $request, User $user)
    {
        // Log::info($request->all());

        // ログイン中のユーザー情報を取得し、管理者かどうかをチェック
        if (!Auth::check() || !Auth::user()->isAdmin) {
            return response()->json(['message' => 'You do not have admin privileges.'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'isAdmin' => 'required|boolean'
        ]);

        // ユーザーデータを更新
        $user->update($data);

        return response()->json([
            'message' => 'ユーザープロフィールが更新されました',
            'user' => $user
        ]);

    }

    /**
     * (管理者)全てのユーザーを取得する
     */
    public function getUsers()
    {
        $users = User::get();

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * (管理者)特定のユーザーを取得する
     */
    public function getUser(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * (管理者)ユーザーの削除
     *
     */
    public function destroy(User $user)
    {
        // ログイン中のユーザー情報を取得し、管理者かどうかをチェック
        if (!Auth::check() || !Auth::user()->isAdmin) {
            return response()->json(['message' => 'You do not have admin privileges.'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User successfully deleted',
        ], 200);
    }
}
