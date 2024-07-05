import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        toast.success(res && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <div>
      <Layout title="Register-Ecommerce app">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h4 className="title">LOGIN FORM</h4>
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form-control"
                id="exampleInputEmail"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="form-control"
                id="exampleInputPassword"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              FORGOT PASSWORD?
            </button>
            <button type="submit" className="btn btn-primary m-2">
              LOGIN
            </button>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default Login;
