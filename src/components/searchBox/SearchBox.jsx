import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./searchBox.scss";

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState();
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search?query=${query}` : "/search");
  };
  
  
  return (
    <Form className="d-flex me-auto ms-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button type="submit" id="button-search">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
