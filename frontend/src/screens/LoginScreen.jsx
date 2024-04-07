import axios from "axios";
import { ChangeEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleClick = () => {
    const loginParams = { email, password };
    axios
      // CSRF保護の初期化。（ログイン処理を行う前に行うもの！）
      .get("http://localhost:8080/sanctum/csrf-cookie", {
        withCredentials: true,
      })
      .then((response) => {
        // ログイン処理
        axios
          .post("http://localhost:8080/login", loginParams, {
            withCredentials: true,
            withXSRFToken: true,
          })
          .then((response) => {
            console.log(response.data);
          });
      });
  };

  // SPA認証済みではないとアクセスできないAPI
  const handleUserClick = () => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
      });
  };

  return (
    <>
      <div>
        メールアドレス
        <input onChange={changeEmail} />
      </div>
      <div>
        パスワード
        <input onChange={changePassword} />
      </div>
      <div>
        <button onClick={handleClick}>ログイン</button>
      </div>
      <div>
        <button onClick={handleUserClick}>ユーザー情報を取得</button>
      </div>
    </>
  );
}
