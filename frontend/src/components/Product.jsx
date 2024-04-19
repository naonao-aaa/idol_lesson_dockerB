import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { BASE_URL } from "../constants";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`}>
        <Card.Img src={`${BASE_URL}/storage/${product.image}`} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.num_reviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">{product.price}円</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
