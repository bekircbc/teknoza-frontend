import axios from "axios";
import { useContext } from "react";
import { Button, Col, ListGroup, NavItem, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Store } from "../../Store";
import "./productInCart.scss";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const ProductInCart = (props) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { product, uneditable } = props;
  const { cartSum } = state.cart;

  const updateCartHandler = async (product, difference) => {
    const newQuantity = product.quantity + difference;

    const { data } = await axios.get(`${BASE_API_URL}/products/${product._id}`);
    if (data.stock < newQuantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: newQuantity },
    });
  };
  const removeItemHandler = (product) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: product });
  };

  return (
    <ListGroup.Item key={product._id} className="productInCart">
      <Row className="align-items-center text-center p-3 row-container">
        <Col md={2} className="image-box ">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="img-fluid rounded img-thumbnail"
          />
        </Col>
        <Col md={2} className="row-md">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </Col>
        <Col md={3}  className="d-flex flex-row justify-content-center align-items-center ">
          {!uneditable && (
            <Button
              onClick={() => {
                updateCartHandler(product, -1);
              }}
              variant="light"
              disabled={product.quantity === 1}
            >
              <i className="fa-solid fa-square-minus"></i>
            </Button>
          )}
          <span>
            {uneditable && "X "}
            {product.quantity}
          </span>
          {!uneditable && (
            <Button
              onClick={() => {
                updateCartHandler(product, 1);
              }}
              variant="light"
              disabled={product.quantity === product.stock}
            >
              <i className="fa-solid fa-square-plus"></i>
            </Button>
          )}
        </Col>
        <Col md={3} >$ {product.price} </Col>
        <Col md={2} >
          {!uneditable && (
            <Button
              onClick={() => {
                removeItemHandler(product);
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </Button>
          )}
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default ProductInCart;
