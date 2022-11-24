import "./registerPage.scss";
import axios from "axios";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const validations = Yup.object().shape({
  name: Yup.string().required("! Enter your name"),
  email: Yup.string()
    .email("! Wrong or Invalid email address")
    .required("! Enter your email"),
  password: Yup.string()
    .min(6, "! Minimum 6 characters required")
    .required("! Minimum 6 characters required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "! Passwords must match")
    .required("! Type your password again"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      submitForm(values);
    },
    validationSchema: validations,
  });

  const submitForm = async (values) => {
    try {
      const { data } = await axios.post(`${BASE_API_URL}/users/signup`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      ctxDispatch({ type: "USER_LOGIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="register-page">
      <Helmet>
        <title>Register</title>
      </Helmet>

      <Form className="register-form" onSubmit={formik.handleSubmit}>
        <h1 className="my-3">Register</h1>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            id="name"
            name="name"
            type="text"
            placeholder="Enter name"
            onChange={formik.handleChange}
            value={formik.values.name}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name && (
            <div className="formik-error">{formik.errors.name}</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <div className="formik-error">{formik.errors.email}</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && formik.touched.password && (
            <div className="formik-error">{formik.errors.password}</div>
          )}
        </Form.Group>{" "}
        <Form.Group className="mb-3">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="formik-error">{formik.errors.confirmPassword}</div>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
        <p>
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
      </Form>
    </Container>
  );
};

export default RegisterPage;
