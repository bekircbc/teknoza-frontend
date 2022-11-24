import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/checkoutSteps/CheckoutSteps";
import { Store } from "../../Store";
import "./paymentPage.scss";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentName: paymentNameFromContext },
  } = state;
  const [paymentName, setPaymentName] = useState(
    paymentNameFromContext || "PayPal"
  );
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentName,
    });
    localStorage.setItem("paymentName", paymentName);
    navigate("/placeorder");
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  return (
    <Container className="payment-page">
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <div className="payment-form">
        <Form onSubmit={submitHandler}>
          <h1>Payment Method</h1>
          <Form.Check
            type="radio"
            id="PayPal"
            label="PayPal"
            value="PayPal"
            name="paymentMethod"
            checked={paymentName === "PayPal"}
            onChange={(e) => {
              setPaymentName(e.target.value);
            }}
          />
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe"
            name="paymentMethod"
            value="Stripe"
            checked={paymentName === "Stripe"}
            onChange={(e) => {
              setPaymentName(e.target.value);
            }}
          />
          <Button variant="primary" type="submit" className="continue-button">
            Continue
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default PaymentPage;
