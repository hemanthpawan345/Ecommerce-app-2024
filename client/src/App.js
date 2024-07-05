import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import About from "./pages/About";
import Search from "./pages/Search";
import Policy from "./pages/Policy";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import Users from "./pages/Admin/Users";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Categories from "./pages/Categories";
import Register from "./pages/Auth/Register";
import Products from "./pages/Admin/Products";
import Dashboard from "./pages/user/Dashboard";
import CategoryPage from "./pages/CategoryPage";
import Pagenotfound from "./pages/Pagenotfound";
import ProductDetails from "./pages/ProductDetails";
import PrivateRoute from "./components/Routes/Private";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import CreateProduct from "./pages/Admin/CreateProduct";
import AdminRoute from "./components/Routes/AdminRoute";
import ForgotPassword from "./pages/Auth/Forgotpassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/*" element={<Pagenotfound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/orders" element={<Orders />} />
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/orders" element={<AdminOrders />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
