import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Form,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import { BASE_URL } from "../constants";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const addToCartHandler = () => {
    if (product.contract_type === "単発契約") {
      dispatch(addToCart({ ...product, qty }));
    } else if (product.contract_type === "月契約") {
      dispatch(addToCart({ ...product, qty: 1 }));
    }
    navigate("/cart");
  };

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        戻る
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image
                src={`${BASE_URL}/storage/${product.image}`}
                alt={product.name}
                fluid
              />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.num_reviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>価格: {product.price}円</ListGroup.Item>
                <ListGroup.Item>説明: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>価格:</Col>
                      <Col>
                        <strong>{product.price}円</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>契約タイプ:</Col>
                      <Col>{product.contract_type}</Col>
                    </Row>
                  </ListGroup.Item>

                  {product.contract_type === "単発契約" && (
                    <ListGroup.Item>
                      <Row>
                        <Col>回数</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {Array.from({ length: 5 }).map((_, index) => (
                              <option key={index + 1} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      カートに入れる
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
