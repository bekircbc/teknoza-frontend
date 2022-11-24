import { Col, Row } from 'react-bootstrap'
import './checkoutSteps.scss'

const CheckoutSteps = (props) => {
  const {step1, step2, step3,step4}=props;
    return (
    <Row className='checkout-steps'>
        <Col className={step1?'active':''}>Login</Col>
        <Col className={step2?'active':''}>Shipping</Col>
        <Col className={step3?'active':''}>Payment</Col>
        <Col className={step4?'active':''}>Place Order</Col>
    </Row>
  )
}

export default CheckoutSteps