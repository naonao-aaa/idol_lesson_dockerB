import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { BASE_URL } from "../constants";
import { calculateAverageRating } from "../utils/ratingUtils";

const Product = ({ product }) => {
  // 平均評価を計算
  const averageRating = product?.reviews
    ? calculateAverageRating(product.reviews)
    : 0;

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          src={`${BASE_URL}/storage/${product.image}`}
          variant="top"
          style={{ aspectRatio: "1/1", objectFit: "cover" }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={averageRating}
            text={`${product.reviews.length} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">{product.price}円</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
