import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    cartSum: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems")).reduce(
          (sumOfCart, item) => {
            return (sumOfCart += item.price * item.quantity);
          },
          0
        )
      : 0,
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    paymentName: localStorage.getItem("paymentName")
      ? localStorage.getItem("paymentName")
      : "",
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
  },
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      //add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => {
        return item._id === newItem._id;
      });

      const cartItems = existItem
        ? state.cart.cartItems.map((item) => {
            return item._id === existItem._id ? newItem : item;
          })
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartSum: state.cart.cartSum + newItem.price,
          cartItems,
        },
      };
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter((product) => {
        return product._id !== action.payload._id;
      });
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":{
      return {...state, cart:{...state.cart,cartItems:[]}};
    }
    case "SAVE_PAYMENT_METHOD": {
      return { ...state, cart: { ...state.cart, paymentName: action.payload } };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }

    case "USER_LOGIN":
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      return { ...state, userInfo: null, cart: { cartItems: [] } };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
