import axios from "axios";
import { BASE_URL } from "../constants";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const fetchOrderData = () => {
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
        setError(error?.response?.data?.message);
      });
  };

  const fetchPaypalClientId = async () => {
    axios
      .get(`${BASE_URL}/api/config/paypal`, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
        setPaypalClientId(response.data.paypalClientId);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  const loadPaypalScript = async () => {
    paypalDispatch({
      type: "resetOptions",
      value: {
        "client-id": paypalClientId,
        currency: "JPY",
      },
    });
    paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  };

  useEffect(() => {
    fetchOrderData();
    fetchPaypalClientId();
  }, [orderId]);

  useEffect(() => {
    if (paypalClientId && order && !order.isPaid && !window.paypal) {
      loadPaypalScript();
    }
  }, [paypalClientId, order]);

  console.log(order);

  // PayPal注文承認成功時の処理
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await axios
          .put(
            `${BASE_URL}/api/orders/${orderId}/pay`,
            {},
            {
              withCredentials: true,
              withXSRFToken: true,
            }
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error.message);
          });

        fetchOrderData();

        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // PayPalエラー発生時の処理
  function onError(err) {
    toast.error(err.message);
  }

  // PayPal注文作成時の処理
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.total_price },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const completionOrderHandler = async () => {
    axios
      .put(
        `${BASE_URL}/api/admin/orders/${orderId}/completion`,
        {},
        {
          withCredentials: true,
          withXSRFToken: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        fetchOrderData();
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errorMessage || error.message);
      });
  };

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
              {order.is_done ? (
                <Message variant="success">
                  プラン施行日： {order.done_at.substring(0, 10)}
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
              {order.is_paid ? (
                <Message variant="success">
                  お支払い日： {order.paid_at.substring(0, 10)}
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

              {!order.is_paid && (
                <ListGroup.Item>
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {userInfo &&
              userInfo.isAdmin &&
              order.is_paid &&
              !order.is_done ? (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={completionOrderHandler}
                  >
                    プラン施行完了
                  </Button>
                </ListGroup.Item>
              ) : (
                ""
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Loader />
  );
};

export default OrderScreen;
