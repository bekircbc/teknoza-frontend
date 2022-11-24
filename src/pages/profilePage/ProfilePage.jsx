import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import axios from "axios";
import "./profilePage.scss";
import { useContext, useReducer, useState } from "react";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  switch (action.type) {
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

export default function ProfilePage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const { data } = await axios.put(
        `${BASE_API_URL}/users/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: "USER_LOGIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(err.message);
    }
  };

  return (
    <Container className="profile-page">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Form className="profil-form" onSubmit={submitHandler}>
        <h1 className="my-3">User Profile</h1>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>{" "}
        <Form.Group className="mb-3" controlId="formPasswordConfirmation">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Container>
  );
}
