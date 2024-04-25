import axios from "axios";
import { BASE_URL } from "../../constants";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useQueryAdminOrders } from "../../hooks/admin/useQueryAdminOrders";

const OrderListScreen = () => {
  const { status, data: orders, isLoading, error } = useQueryAdminOrders();

  return (
    <>
      <h1>ご契約履歴</h1>
      {error && <Message variant="danger">{error.message}</Message>}
      {!orders ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>ユーザー</th>
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
                <td>{order.user && order.user.name}</td>
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
                    <Button variant="light" className="btn-sm">
                      詳細
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
