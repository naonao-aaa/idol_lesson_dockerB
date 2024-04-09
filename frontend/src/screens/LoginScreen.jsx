import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
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
            dispatch(setCredentials({ ...response.data.user }));
            navigate(redirect);
          })
          .catch((error) => {
            console.log(error.response.data.message);
          });
      });
  };

  return (
    <>
      <FormContainer>
        <h1>ログイン</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="email">
            <Form.Label>メールアドレス</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>パスワード</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-2">
            ログイン
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              アカウントをお持ちではない方はこちら
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
}
