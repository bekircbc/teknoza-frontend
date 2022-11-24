import { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { NavLink } from "react-router-dom";

import Badge from "react-bootstrap/Badge";

import CartPage from "../../pages/cartPage/CartPage";
import { Store } from "../../Store";

import "./header.scss";
import SearchBox from "../searchBox/SearchBox";

const Header = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const getItemCountInCart = () => {
    return cart.cartItems.reduce(
      (countItemsInCart, item) => countItemsInCart + item.quantity,
      0
    );
  };

  const logoutHandler = () => {
    ctxDispatch({ type: "USER_LOGOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <header >
      <Navbar expand="lg" className="header-navbar ">
        <Container className="flex-md-row flex-column">
          <Navbar.Brand href="/home" >
            <div className="navbar-brand me-auto">
              <img
                src="/images/logo-teknoza.png"
                alt="Logo"
                height="50"
                className="logoImage"
              />
              <b>Electronics and more</b>
            </div>
          </Navbar.Brand>
          <SearchBox />
          <Navbar.Toggle aria-controls="main-navbar-nav"/>
          <Navbar.Collapse id="main-navbar-nav" className="text-md-end text-sm-center ">            
            <Nav className=" ms-auto nav-links d-flex flex-lg-row flex-md-column flex-row gap-4 gap-md-0">
              <Nav.Link as={NavLink} to="/cart" >
                Cart
                
                <i className="fa-solid fa-cart-shopping ms-1"></i>
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {getItemCountInCart()}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <>
                  <NavDropdown  
                    title={
                      <>
                        {userInfo.name + " "}
                        <i className="fa-solid fa-user"></i>
                      </>
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item></NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/profile">
                      User Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/orderHistory">
                      Order History
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      as={NavLink}
                      to="/"
                      onClick={logoutHandler}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  {userInfo.isAdmin && (
                    <NavDropdown 
                    title={
                      <>
                        Admin
                        <i className="fa-solid fa-user-lock me-1"></i>
                      </>
                    } id="basic-nav-dropdown">
                      <NavDropdown.Item as={NavLink} to="/admin/dashboard">
                        Dashboard
                      </NavDropdown.Item>

                      <NavDropdown.Divider />
                      <NavDropdown.Item as={NavLink} to="/admin/products">
                        Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to="/admin/orders">
                        Orders
                      </NavDropdown.Item>

                      <NavDropdown.Item as={NavLink} to="/admin/users">
                        Users
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="sub-nav-frame">
        <Container>
          <Nav className="justify-content-lg-between justify-content-center sub-nav">
            <Nav.Link href="/search?category=all">All Products</Nav.Link>
{/*
           <Nav.Link href="/home/:sales">
              <i className="fa-solid fa-bullhorn"></i> Sales
            </Nav.Link>
*/}
        

            <Nav.Link href="/search?category=smartphones">
              <i className="fa-solid fa-mobile-screen-button"></i> Mobile Phone
            </Nav.Link>
            <Nav.Link href="/search?category=laptops">
              <i className="fa-solid fa-computer"></i> Computer
            </Nav.Link>
            <Nav.Link href="/search?category=automotive">
              <i className="fa-solid fa-car"></i> Automotive
            </Nav.Link>
            <Nav.Link href="/search?category=furniture">
              <i className="fa-solid fa-couch"></i> Furniture
            </Nav.Link>
          </Nav>
        </Container>
      </div>
    </header>
  );
};

export default Header;
