import React, { useState, useEffect } from "react";
import Layout from "./../components/layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import "../styles/CartStyles.css"
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      localStorage.removeItem('cart');
      setCart([]);
      navigate("/dashboard/user/orders");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //get total
  const getTotal = () => {
    try {
      let total = 0;
      cart.map((c) => {
        total = total + c.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //remove item
  const removeCartItem = (pid) => {
    try {
      let mycart = [...cart];
      let index = mycart.findIndex((item) => item._id === pid);
      mycart.splice(index, 1);
      setCart(mycart);
      localStorage.setItem("cart", JSON.stringify(mycart));
    } catch (error) {
      console.log(error);
    }
  };

  //payment token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  return (
    <Layout>
        <div className="cart-page">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center bg-light p-2 mb-4">
                {`Hello ${auth?.token && auth?.user?.name}`}
              </h1>
              <h4 className="text-center">
                {cart?.length >= 1
                  ? `You have ${cart?.length} items in your cart ${
                      auth.token ? "" : "Please Login to check out"
                    }`
                  : "Your cart is empty"}
              </h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row m-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width={"100px"}
                    height={"150px"}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.name}</p>
                  <p>{p.description.substring(0, 50)}</p>
                  <p>Price: $ {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h4>Cart summary</h4>
            <p>Total | checkout | payment</p>
            <hr />
            <h4>Total : {getTotal()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Addess</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Please Login to Checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default CartPage;
