import axios from "axios";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes } from "react-icons/fa";
import Loader from "../components/Loader";

const ProfileScreen = () => {
  const [orders, setOrders] = useState(null);

  const fetchMyOrder = () => {
    axios
      .get(`${BASE_URL}/api/my/orders`, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
        setOrders(response.data.orders);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <Row>
      <Col md={9}>
        <h2>ご契約履歴</h2>
        {!orders ? (
          <Loader />
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>ご契約日時</th>
                <th>合計金額</th>
                <th>お支払い状況</th>
                <th>プラン実施状況</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.created_at.substring(0, 10)}</td>
                  <td>{order.total_price}円</td>
                  <td>
                    {order.is_paid ? (
                      order.paid_at.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.is_done ? (
                      order.done_at.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order.id}`}>
                      <Button className="btn-sm" variant="light">
                        詳細
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
