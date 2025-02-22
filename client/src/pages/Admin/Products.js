import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  //get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-products`
      );
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //use effect
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <>
      <Layout>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="text-center">all products list</h1>
              <div className="d-flex flex-wrap">
                {products.map((p) => (
                  <>
                    <Link
                      key={p._id}
                      to={`/dashboard/admin/product/${p.slug}`}
                      className="product-link"
                    >
                      <div className="card m-2" style={{ width: "18rem" }}>
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{p.name}</h5>
                          <p className="card-text">{p.description}</p>
                        </div>
                      </div>
                    </Link>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Products;
