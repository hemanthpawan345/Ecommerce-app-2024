import React from "react";
import { useSearch } from "../context/Search";
import Layout from "../components/layout/Layout";

const Search = () => {
  const [values, setValues] = useSearch();
  return (
    <Layout title={"search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results < 1
              ? "No products found"
              : `Found ${values?.results.length} results`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values.results.map((p) => (
              <>
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 25)}...
                    </p>
                    <p className="card-text">$ {p.price}</p>
                    <button className="btn btn-primary ms-1">
                      More Details
                    </button>
                    <button className="btn btn-secondary ms-1">
                      Add to cart
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
