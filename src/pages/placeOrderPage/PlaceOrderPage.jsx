import axios from "axios";
import { useContext, useReducer } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "../../components/checkoutSteps/CheckoutSteps";
import ProductInCart from "../../components/productInCart/ProductInCart";
import { Store } from "../../Store";
import { getError } from "../../utils.jsx";

import "./placeOrderPage.scss";
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  };

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        `${BASE_API_URL}/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentName,
          itemsPrice: cart.sumOfItems,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.tax,
          totalPrice: cart.orderTotal,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order-details/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(error));
    }
  };
  cart.sumOfItems = round2(cart.cartSum);
  cart.tax = round2(cart.sumOfItems * 0.19);

  cart.shippingPrice = round2(cart.sumOfItems > 1000 ? 0 : 5);

  cart.orderTotal = cart.sumOfItems + cart.tax + cart.shippingPrice;

  return (
    <Container className="placeOrderPage">
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8} className="order-details">
          <Card className="shipping-details mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <b>Name: </b> {cart.shippingAddress.name} <br />
                <b>Address: </b> {cart.shippingAddress.address},<br />
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.city}{" "}
                <br />
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="payment-details mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <b>Method: </b> {cart.paymentName} <br />
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="productsInOrder mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <Card.Text>
                {cart.cartItems.map((product, index) => {
                  return <ProductInCart product={product} uneditable />;
                })}
              </Card.Text>
              <Link to="/shopping-cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="order-summary">
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>$ {cart.sumOfItems}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>$ {cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>$ {cart.tax}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <b>Order Total</b>
                    </Col>
                    <Col>
                      <b>$ {cart.orderTotal}</b>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              <ListGroup.Item>
                <div className="d-grid">
                  <Button onClick={placeOrderHandler}>Place Order</Button>
                </div>
              </ListGroup.Item>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderPage;
