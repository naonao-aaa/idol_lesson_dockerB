import axios from "axios";
import { BASE_URL } from "../constants";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const orderParams = {
    orderItems: cart.cartItems,
    paymentMethod: "PayPal",
    itemsPrice: cart.itemsPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
  };

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    axios
      .post(`${BASE_URL}/api/orders`, orderParams, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
        dispatch(clearCartItems());
        navigate(`/order/${response.data.order.id}`);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>お支払い方法</h2>
              PayPal
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>注文プラン</h2>
              {cart.cartItems.length === 0 ? (
                <Message>カートは空です。</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={`${BASE_URL}/storage/${item.image}`}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price}円 = {item.qty * item.price}
                          円
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>ご請求金額</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>プラン料金</Col>
                  <Col>{cart.itemsPrice}円</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>サービス利用手数料</Col>
                  <Col>{cart.taxPrice}円</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>合計金額</Col>
                  <Col>{cart.totalPrice}円</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  契約する
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
