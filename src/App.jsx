import HomePage from "./pages/homePage/HomePage";
import ProductPage from "./pages/productPage/ProductPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./App.scss";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import CartPage from "./pages/cartPage/CartPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import ShippingPage from "./pages/shippingPage/ShippingPage";
import LoginPage from "./pages/loginPage/LoginPage";
import PaymentPage from "./pages/paymentPage/PaymentPage";
import PlaceOrderPage from "./pages/placeOrderPage/PlaceOrderPage";
import OrderHistoryPage from "./pages/orderHistoryPage/OrderHistoryPage";
import DashboardPage from "./pages/dashboardPage/DashboardPage";
import ProductsPage from "./pages/productsPage/ProductsPage";
import UsersPage from "./pages/usersPage/UsersPage";
import ProductEditPage from "./pages/productEditPage/ProductEditPage";
import OrdersPage from "./pages/ordersPage/OrdersPage";
import ProfilePage from "./pages/profilePage/ProfilePage";
import SearchPage from "./pages/searchPage/SearchPage";
import OrderDetailsPage from "./pages/orderDetailsPage/OrderDetailsPage";
import { useContext } from "react";
import { Store } from "./Store";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminRoute from "./components/adminRoute/AdminRoute";
import UserEditPage from "./pages/userEditPage/UserEditPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="d-flex flex-column site-container">
          <ToastContainer position="bottom-center" limit={1} />
          <header>
            <Header />
          </header>

          <main className="mt-3">
            <Container>
              <Routes>
                <Route path="/home" element={<HomePage />} />

                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/placeOrder"
                  element={
                    <ProtectedRoute>
                      <PlaceOrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orderHistory"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <DashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ProductsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/shipping"
                  element={
                    <ProtectedRoute>
                      <ShippingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-details/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <UsersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/user/:userId"
                  element={
                    <AdminRoute>
                      <UserEditPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/productEdit/:productId"
                  element={
                    <AdminRoute>
                      <ProductEditPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <OrdersPage />
                    </AdminRoute>
                  }
                />

                <Route path="/product/:_id" element={<ProductPage />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
              </Routes>
            </Container>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
