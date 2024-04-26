import axios from "axios";
import { BASE_URL } from "../../constants";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useQueryAdminProducts } from "../../hooks/admin/useQueryAdminProducts";

const ProductListScreen = () => {
  const {
    status,
    data: products,
    isLoading,
    error,
    refetch,
  } = useQueryAdminProducts();

  const deleteHandler = async (id) => {
    if (window.confirm("本当に削除しますか？")) {
      axios
        .delete(`${BASE_URL}/api/admin/products/${id}`, {
          withCredentials: true,
          withXSRFToken: true,
        })
        .then((response) => {
          console.log(response.data);
          toast.success("Product deleted");
          refetch();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error.message);
        });
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>受付中のプラン一覧</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to={`/admin/product/create`}>
            <Button className="btn-sm m-3">
              <FaPlus /> Create Plan
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {!products ? (
        <Loader />
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}円</td>
                  <td>{product.category.name}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product.id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product.id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
