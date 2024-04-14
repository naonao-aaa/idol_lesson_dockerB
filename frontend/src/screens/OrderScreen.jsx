import axios from "axios";
import { BASE_URL } from "../constants";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState("");

  const fetchOrderDetail = () => {
    axios
      .get(`${BASE_URL}/api/orders/${orderId}`, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
        setOrder(response.data.order);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  console.log(order);

  return order ? (
    <>
      <h1>お申し込みID: {order.id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>お客様情報</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              {order.isDone ? (
                <Message variant="success">
                  プラン施行日： {order.done_at}
                </Message>
              ) : (
                <Message variant="danger">
                  お申し込みプランは施行されていません。
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>お支払い方法</h2>
              <p>PayPal</p>
              {order.isPaid ? (
                <Message variant="success">
                  お支払い日： {order.paid_at}
                </Message>
              ) : (
                <Message variant="danger">
                  お支払いは完了しておりません。
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>お申し込みプラン一覧</h2>
              {!order ? (
                <Message>お申し込みプランはありません。</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.products.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.pivot.quantity} x {item.price}円 ={" "}
                          {item.pivot.quantity * item.price}円
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
                  <Col>{order.items_price}円</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>サービス利用手数料</Col>
                  <Col>{order.tax_price}円</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>合計金額</Col>
                  <Col>{order.total_price}円</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <Loader />
  );
};

export default OrderScreen;
