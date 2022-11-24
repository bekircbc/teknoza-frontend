import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/loadingBox/LoadingBox";
import MessageBox from "../../components/messageBox/MessageBox";
import { Store } from "../../Store";
import { getError } from "../../utils.jsx";
import "./usersPage.scss";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
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

const UsersPage = () => {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, { loading: true, error: "" });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${BASE_API_URL}/users`, {
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

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`${BASE_API_URL}/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  return (
    <Container className="users-page">
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <h6>Totally {users.length} users.</h6>
          <Table className="text-center">
            <thead>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th colSpan={2}>ACTIONS</th>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "YES" : "NO"}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/user/${user._id}`);
                      }}
                    >
                      {" "}
                      <i className="fa-solid fa-pen text-primary"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        deleteHandler(user);
                      }}
                    >
                      {" "}
                      <i className="fa-solid fa-trash text-danger"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default UsersPage;
