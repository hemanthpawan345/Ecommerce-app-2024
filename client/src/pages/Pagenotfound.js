import React from "react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";
const Pagenotfound = () => {
  return (
    <Layout>
      <h1>Pagenotfound</h1>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">0ops | Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          Go Back{" "}
        </Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
