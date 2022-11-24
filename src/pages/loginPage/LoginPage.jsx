import "./loginPage.scss";
import axios from "axios";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import { Form, Button, Container } from 'react-bootstrap'
import * as Yup from 'yup'

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const validations = Yup.object().shape({
  
  email: Yup.string()
      .email('! Wrong or Invalid email address')
      .required('! Enter your email'),
  password: Yup.string()
      .min(6,'! Minimum 6 characters required')
      .required('! Minimum 6 characters required')

});

const LoginPage = () => {

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      submitForm(values)
    },
    validationSchema: validations
  });

  const submitForm = async(values) => {
    try {
      const { data } = await axios.post(`${BASE_API_URL}/users/signin`, {
        email: values.email,
        password: values.password,
      });
      ctxDispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="login-page">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h1>Login</h1>
      <Form className="login-form" onSubmit={formik.handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={formik.handleChange}
            value={formik.values.email} 
            onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && <div className="formik-error">{formik.errors.email}</div>}
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control id="password"
            name="password"
            placeholder="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && formik.touched.password && <div className="formik-error">{formik.errors.password}</div>}
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default LoginPage