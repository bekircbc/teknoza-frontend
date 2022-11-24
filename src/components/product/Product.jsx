import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, Button, Container, Stack } from "react-bootstrap";
import Rating from "../rating/Rating";
import "./product.scss";
import AddToCartButton from "../addToCartButton/AddToCartButton";


const Product = (props) => {
  const params = useParams();
  const { slug } = params;
  const { product } = props;
  return (
    <div className="Product">
      <Card className="product-card">
        <Link to={`/product/${product._id}`} className="card-link">
          <Card.Img
            className="card-img"
            variant="top"
            src={product.thumbnail}
          />
        </Link>

        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title>{product.name}</Card.Title>
          </Link>

          <Rating reviews={product.reviews} />

          <Card.Text>
            <strong>{`${product.price} €`}</strong>
          </Card.Text>

          <AddToCartButton product={product} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Product;
