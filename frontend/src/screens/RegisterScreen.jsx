import axios from "axios";
import { BASE_URL } from "../constants";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (password !== confirmPassword) {
      toast.error("Passwordと確認用Passwordが一致していません。");
    } else {
      const registerParams = { name, email, password };
      const loginParams = { email, password };
      axios
        // CSRF保護の初期化。（ログイン処理を行う前に行うもの！）
        .get(`${BASE_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        })
        .then((response) => {
          return axios.post(`${BASE_URL}/api/users/register`, registerParams, {
            withCredentials: true,
            withXSRFToken: true,
          });
        })
        .then((response) => {
          return axios
            .post(`${BASE_URL}/login`, loginParams, {
              withCredentials: true,
              withXSRFToken: true,
            })
            .then((response) => {
              console.log(response.data);
              dispatch(setCredentials({ ...response.data.user }));
              navigate(redirect);
            })
            .catch((error) => {
              toast.error(error?.response?.data?.message || error.message);
            });
        });
    }
  };

  return (
    <FormContainer>
      <h1>ユーザー登録</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>確認用Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          登録
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            アカウントをお持ちの方はこちら
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
