import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    const { name, email, phone, address } = auth.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  }, [auth?.user]);

  //form handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/update-profile`,
        {
          name,
          email,
          password,
          phone,
          address,
        }
      );
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profle updated successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Layout title={"Dashboard - Profile"}>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <div className="form-container">
                <form onSubmit={handleSubmit}>
                  <h4 className="title">USER PROFILE</h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      className="form-control"
                      id="exampleInputName"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
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
                      disabled
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
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      className="form-control"
                      id="exampleInputPhone"
                      placeholder="Enter your phone"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      className="form-control"
                      id="exampleInputAddress"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
