import "./homePage.scss";

import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../../components/product/Product";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const HomePage = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  const params = useParams();
  const { productFilter } = params;
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const dataFromApi = await axios.get(`${BASE_API_URL}/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: dataFromApi.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="homePage">
      <Helmet>
        <title>Teknoza</title>
      </Helmet>
      <h1>Featured Products</h1>
      {productFilter && <h2>{productFilter}</h2>}
      {loading ? (
        <p>LOADING...</p>
      ) : error ? (
        <p>ERROR!</p>
      ) : (
        <div className="products">
          <Row>
            {products.map((product) => {
              return (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product}></Product>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default HomePage;
