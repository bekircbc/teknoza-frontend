import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/loadingBox/LoadingBox";
import MessageBox from "../../components/messageBox/MessageBox";
import { Store } from "../../Store";
import { getError } from "../../utils";
import "./productsPage.scss";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: payload.products,
        page: payload.page,
        pages: payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

const ProductsPage = () => {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, { loading: true, error: "" });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_API_URL}/products/admin?page=${page}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {}
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm("Are you sure to create?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          `${BASE_API_URL}/products`,
          {},
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        toast.success("product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`${BASE_API_URL}/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  return (
    <Container className="products-page">
      <Helmet>
        <title>Products</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button className="create-product-button" onClick={createHandler}>
              <i className="fa-solid fa-plus "></i> Create Product
            </Button>
          </div>
        </Col>
      </Row>

      {(loadingCreate || loadingDelete) && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table className="text-center my-3 ">
            <thead>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th colSpan={2}>ACTIONS</th>
            </thead>
            <tbody>
              {products.map((product, index) => {
                return (
                  <tr key={index}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>

                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => {
                          navigate(`/admin/productEdit/${product._id}`);
                        }}
                      >
                        <i className="fa-solid fa-pen text-primary"></i>
                      </Button>
                    </td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => {
                          deleteHandler(product);
                        }}
                      >
                        <i className="fa-solid fa-trash text-danger"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div>
            {[...Array(pages).keys()].map((m) => {
              return (
                <Link
                  to={`/admin/products?page=${m + 1}`}
                  key={m + 1}
                  className={m + 1 === Number(page) ? "btn text-bold" : "btn"}
                >
                  {m + 1}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </Container>
  );
};

export default ProductsPage;
