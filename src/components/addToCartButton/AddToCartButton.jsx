import axios from "axios";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import "./addToCartButton.scss";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const AddToCartButton = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const navigate = useNavigate();

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find(
      (cartItem) => cartItem._id === product._id
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${BASE_API_URL}/products/${product._id}`);
    if (data.stock < quantity) {
      window.alert("Sorry, product is out of stock.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    navigate("/cart");
  };
  return (
    <Button
      onClick={addToCartHandler}
      variant="primary"
      className="add-to-cart-button"
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
