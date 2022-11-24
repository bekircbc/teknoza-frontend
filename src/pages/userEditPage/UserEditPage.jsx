import React, { useContext, useEffect, useReducer, useState } from "react";
import "./userEditPage.scss";
import { Form, Button, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from "../../Store";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getError } from "../../utils.jsx";
import { toast } from "react-toastify";
import LoadingBox from "../../components/loadingBox/LoadingBox";
import MessageBox from "../../components/messageBox/MessageBox";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

const UserEditPage = () => {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${BASE_API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${BASE_API_URL}/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch("UPDATE_SUCCESS");
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User </title>
      </Helmet>
      <h1>Edit User</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => {
              setIsAdmin(e.target.checked);
            }}
          />

          <div className="mb-3">
            <Button type="submit" disabled={loadingUpdate}>
              Update
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default UserEditPage;
