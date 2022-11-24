import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MessageBox from "../../components/messageBox/MessageBox";
import ProductInCart from "../../components/productInCart/ProductInCart";
import { Store } from "../../Store";
import { getError } from "../../utils";

import "./orderDetailsPage.scss";
import { toast } from "react-toastify";
import LoadingBox from "../../components/loadingBox/LoadingBox";
// const productsInOrder = [
//   {
//     name: "HP Curved Monitor",
//     slug: "hp-curved-monitor",
//     price: 150,
//     countInStock: 10,
//     countInCart: 2,
//   },
//   {
//     name: "Microsoft Wireless Keyboard",
//     slug: "microsoft-wireless-keyboard",
//     price: 30,
//     countInStock: 1,
//     countInCart: 1,
//   },
// ];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };

    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return { ...state, loadingDeliver: false, successDeliver: false };
    default:
      return state;
  }
};

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const OrderDetailsPage = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { orderId } = useParams();
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `${BASE_API_URL}/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: getError(error) });
        toast.error(getError(error));
      }
    });
  };
  const onError = (error) => {
    toast.error(getError(error));
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${BASE_API_URL}/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ ype: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(
          `${BASE_API_URL}/keys/paypal`,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  const deliverOrderHandler = async () => {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `${BASE_API_URL}/orders/${order._id}/deliver`,
        {},
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "DELIVER_FAIL" });
    }
  };
  return (
    <Container>
      <Helmet>
        <title>Order Details : {orderId}</title>
      </Helmet>
      <h1>Order Details : {orderId}</h1>
      {loading ? (
        <h4>LOADING...</h4>
      ) : error ? (
        <h4>Error</h4>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <b>Name: </b> {order.shippingAddress.fullName}
                  <br />
                  <b>Adress: </b>
                  {`${order.shippingAddress.address} ${order.shippingAddress.postalCode},${order.shippingAddress.city} ${order.shippingAddress.country}`}{" "}
                  <br />
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt} .
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <b>Method: </b> {order.paymentMethod}
                  <br />
                </Card.Text>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt} .
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="productsInOrder mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((product, index) => {
                    return (
                      <ProductInCart product={product} uneditable key={index} />
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>$ {order.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>$ {order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>$ {order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <b>Order Total</b>
                      </Col>
                      <Col>
                        <b>$ {order.totalPrice}</b>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />{" "}
                      </div>
                    )}
                    {loadingPay && <LoadingBox />}
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox />}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrderDetailsPage;
