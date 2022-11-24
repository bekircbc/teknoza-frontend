import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getError } from "../../utils.jsx";
import { Store } from "../../Store";
import "./ordersPage.scss";
import { toast } from "react-toastify";
import LoadingBox from "../../components/loadingBox/LoadingBox.jsx";
import MessageBox from "../../components/messageBox/MessageBox.jsx";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, orders, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, { loading: true, error: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${BASE_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deletehandler = async (order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`${BASE_API_URL}/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };
  return (
    <Container>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders </h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Table striped bordered hover size="sm" className="text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.name : "DELETED USER"}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : "NO"}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "NO"}
                  </td>
                  <td>
                    <Button
                      type="button"
                      onClick={() => {
                        navigate(`/order-details/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      type="button"
                      className="btn-danger ms-1"
                      onClick={() => {
                        deletehandler(order);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrdersPage;
