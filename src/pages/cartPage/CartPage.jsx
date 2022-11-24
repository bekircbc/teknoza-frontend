import { useContext } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MessageBox from "../../components/messageBox/MessageBox";
import ProductInCart from "../../components/productInCart/ProductInCart";
import { Store } from "../../Store";
import "./cartPage.scss";

const CartPage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  const { cartItems } = state.cart;
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Container className="cart-screen">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={9} className="products-in-cart">
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((cartItem, index) => {
                return <ProductInCart product={cartItem} key={index} />;
              })}
            </ListGroup>
          )}
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush" className="d-flex flex-column justify-content-center align-items-center">
                <ListGroup.Item>
                  <h4 className="text-center d-flex flex-column justify-content-center align-items-center">
                    <p>Subtotal</p>
                    <p className="fs-5">
                      ({" "}
                      {cartItems.reduce(
                        (countOfItems, item) => countOfItems + item.quantity,
                        0
                      )}{" "}
                      items )
                    </p>
                    <p>
                      $
                      {cartItems.reduce(
                        (sumOfPrices, item) =>
                          sumOfPrices + item.price * item.quantity,
                        0
                      )}
                    </p>
                  </h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <div className="cart-body">
        <div className="products-in-cart"></div>
        <div className="cart-details-box">
          <div className="subtotal">
            <span>Subtotal (0 items) : $0 </span>
          </div>
          <div className="checkout-button">
            <Button>Proceed to Checkout</Button>
          </div>
        </div>
      </div> */}
    </Container>
  );
};

export default CartPage;
