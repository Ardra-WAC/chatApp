import React, { useState } from "react";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useLogin from "../customHooks/useLogin";

function Login() {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const {
    loading,
    handleLogin,
    handleAvatar,
    handleRegister,
    showPasswordLogin,
    showPasswordRegister,
    toggleShowPasswordLogin,
    toggleShowPasswordRegister,
  } = useLogin();

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome User</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <div className="passwordContainer">
            <input
              type={showPasswordLogin ? "text" : "password"}
              placeholder="Password"
              name="password"
            />
            <div className="eye" onClick={toggleShowPasswordLogin}>
              {showPasswordLogin ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img
              src={
                avatar.url ||
                "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
              }
              alt=""
            />
            Upload Profile Picture
          </label>
          <input
            type="file"
            name="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="User Name" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <div className="passwordContainer">
            <input
              type={showPasswordRegister ? "text" : "password"}
              placeholder="Password"
              name="password"
            />
            <div className="eye" onClick={toggleShowPasswordRegister}>
              {showPasswordRegister ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <button disabled={loading}>
            {loading ? "Loading ..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
